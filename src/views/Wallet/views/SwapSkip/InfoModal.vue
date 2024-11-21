<template>
  <ModalContent
    show-success-icon
    width="650px"
    :title="$t('swapView.modalInfoTitle')"
    :desc="$t('swapView.modalInfoDesc')"
    type="action"
    :submit-button="false"
    @close="onClose"
  >
    <div class="swap-tx">
      <div class="swap-tx__info">
        <div class="tx-info">
          <div class="tx-info-item">
            <div class="label">To address</div>
            <div class="value">{{ toAddress }}</div>
          </div>
          <div class="tx-info-item">
            <div class="label">From address</div>
            <div class="value">{{ signerWallet.address }}</div>
          </div>
          <div class="tx-info-item">
            <div class="label">From chain</div>
            <div class="value chain">{{ signerWallet.config?.chainId }}</div>
          </div>
          <div v-if="toToken?.chain_id" class="tx-info-item">
            <div class="label">To chain</div>
            <div class="value chain">{{ toToken?.chain_id }}</div>
          </div>

          <div v-if="fromIbc?.denom" class="tx-info-item">
            <div class="label">From token</div>
            <div class="value chain">
              {{ fromIbc.name }}
              {{
                `${fromIbc?.denom?.slice(0, 5)}...${fromIbc?.denom?.slice(-5)}`
              }}
            </div>
          </div>
          <div v-if="toIbc?.denom" class="tx-info-item">
            <div class="label">To token</div>
            <div class="value chain">
              {{ toIbc.name }}
              {{ `${toIbc?.denom?.slice(0, 5)}...${toIbc?.denom?.slice(-5)}` }}
            </div>
          </div>

          <div class="tx-info-item">
            <div class="label">Amount to swap, USD</div>
            <div class="value usd">{{ route.usd_amount_in }}</div>
          </div>
          <div class="tx-info-item">
            <div class="label">Minimum received, USD</div>
            <div class="value usd">{{ route.usd_amount_out }}</div>
          </div>
        </div>
      </div>
      <div
        v-if="
          signerWallet && PRIVATE_PASSWORD_TYPES.includes(signerWallet.type)
        "
        class="password-wrap"
      >
        <Input
          id="password"
          v-model="password"
          :show-error-text="!!incorrectPassword && confirmPassword"
          :error="
            incorrectPassword && confirmPassword ? 'Incorrect password' : ''
          "
          :label="$t('enterPassword')"
          :placeholder="$t('password')"
          type="password"
          icon="key"
          @input="onChange"
          @keyup.enter="$emit('confirmInput')"
        />
      </div>
      <PrimaryButton class="swap-tx__submit" :loading="isLoading" @click="swap">
        {{ $t('SWAP') }}
      </PrimaryButton>
    </div>
  </ModalContent>
</template>
<script>
import ModalContent from '@/components/ModalContent';
import Input from '@/components/UI/Input';
import PrimaryButton from '@/components/UI/PrimaryButton';
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { PRIVATE_PASSWORD_TYPES, WALLET_TYPES } from '@/config/walletType';
import { sha3_256 } from 'js-sha3';
import notify from '@/plugins/notify';
import citadel from '@citadeldao/lib-citadel';

export default {
  name: 'InfoModal',
  components: {
    ModalContent,
    PrimaryButton,
    Input,
  },
  props: {
    onClose: {
      required: true,
    },
    signerWallet: {
      required: true,
    },
    toAddress: {
      required: true,
    },
    toToken: {
      required: true,
    },
    fromIbc: {
      required: true,
    },
    toIbc: {
      required: true,
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    const isLoading = ref(false);
    const password = ref('');
    const confirmPassword = ref(false);

    const keplrConnector = computed(
      () => store.getters['keplr/keplrConnector']
    );
    const leapConnector = computed(() => store.getters['leap/leapConnector']);

    const cosmosTx = computed(() => {
      return store.getters['skip/cosmosTx'];
    });

    const route = computed(() => store.getters['skip/route']);

    const onChange = (val) => {
      password.value = val;
    };

    const swap = async () => {
      confirmPassword.value = true;
      isLoading.value = true;

      if (props.signerWallet.type === WALLET_TYPES.KEPLR) {
        const keplrResult = await keplrConnector.value.sendKeplrTransaction(
          cosmosTx.value,
          props.signerWallet.address,
          {
            preferNoSetFee: true,
            preferNoSetMemo: true,
          }
        );

        if (keplrResult.error) {
          notify({
            type: 'warning',
            text: keplrResult.error,
          });

          isLoading.value = false;
          return;
        }

        if (keplrResult.signature) {
          const hash = await keplrConnector.value.getOutputHash(
            props.signerWallet,
            cosmosTx.value,
            keplrResult
          );

          const data = await citadel.sendSignedTransaction(
            props.signerWallet.id,
            {
              signedTransaction: hash,
              proxy: false,
            }
          );

          if (!data.error) {
            emit('onSuccess', [data.data.txhash]);
            props.onClose();
            return;
          } else {
            isLoading.value = false;
            notify({
              type: 'warning',
              text: data.error,
            });
            return;
          }
        }
        return;
      }

      if (props.signerWallet.type === WALLET_TYPES.LEAP) {
        const leapResult = await leapConnector.value.sendLeapTransaction(
          cosmosTx.value,
          props.signerWallet.address,
          {
            preferNoSetFee: true,
            preferNoSetMemo: true,
          }
        );

        if (leapResult.error) {
          notify({
            type: 'warning',
            text: leapResult.error,
          });

          isLoading.value = false;
          return;
        }

        if (leapResult.signature) {
          const hash = await leapConnector.value.getOutputHash(
            props.signerWallet,
            cosmosTx.value,
            leapResult
          );

          const data = await citadel.sendSignedTransaction(
            props.signerWallet.id,
            {
              signedTransaction: hash,
              proxy: false,
            }
          );

          if (!data.error) {
            emit('onSuccess', [data.data.txhash]);
            props.onClose();
            return;
          } else {
            isLoading.value = false;
            notify({
              type: 'warning',
              text: data.error,
            });
            return;
          }
        }
        return;
      }

      if (props.signerWallet.type === WALLET_TYPES.LEDGER) {
        emit('showLedger');
      }

      if (
        PRIVATE_PASSWORD_TYPES.includes(props.signerWallet.type) &&
        incorrectPassword.value
      ) {
        isLoading.value = false;
        return;
      }

      try {
        const result = await props.signerWallet.signAndSendTransfer({
          walletId: props.signerWallet.id,
          rawTransaction: cosmosTx.value,
          privateKey:
            password.value &&
            (await props.signerWallet.getPrivateKeyDecoded(password.value)),
          derivationPath: props.signerWallet.derivationPath,
          proxy: false,
        });

        if (result.data[0]) {
          emit('onSuccess', [result.data[0]]);
          props.onClose();
        }
      } catch (err) {
        emit('onCancel');
        props.onClose();
      }
    };

    const incorrectPassword = computed(() => {
      return sha3_256(password.value) !== store.getters['crypto/passwordHash'];
    });

    return {
      isLoading,
      confirmPassword,
      incorrectPassword,
      password,
      PRIVATE_PASSWORD_TYPES,
      WALLET_TYPES,
      route,
      swap,
      onChange,
    };
  },
};
</script>
<style lang="scss" scoped>
.swap-tx {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .tx-info {
    display: flex;
    flex-direction: column;

    .tx-info-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;

      &:last-child {
        margin-bottom: 0;
      }

      .label {
        color: #9e9e9e;
      }

      .value {
        color: #000;
        font-size: 14px;

        &.isAddress,
        &.usd {
          color: #6b93c0;
          font-size: 13px;
        }

        &.longNum,
        &.chain {
          color: $green;
          font-weight: bold;
        }

        &.shortNum {
          color: #000;
          font-weight: bold;
          color: $blue;
        }
      }
    }
  }

  &__info {
    width: 100%;
    margin-top: 20px;
    margin-bottom: 20px;
    overflow: hidden;
    max-height: 300px;
    overflow: auto;
  }

  &__submit {
    width: 120px;
    margin: 0 auto;
  }

  .password-wrap {
    border-top: 1px solid #bcc2d8;
    width: 100%;
    height: 90px;
    margin: 20px 0;
    padding-top: 20px;
  }
}

body.dark {
  .swap-tx {
    .tx-info {
      .tx-info-item {
        .label {
          color: #6b758e;
        }

        .value {
          color: #fff;

          &.longNum,
          &.chain {
            color: $green;
          }

          &.shortNum,
          &.usd {
            color: #6b93c0;
          }
        }
      }
    }
  }
}
</style>
