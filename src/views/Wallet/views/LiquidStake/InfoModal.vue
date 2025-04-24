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
            <div class="label">Stake from:</div>
            <div class="value chain">{{ signerWallet.address }}</div>
          </div>
          <div class="tx-info-item">
            <div class="label">Amount:</div>
            <div class="value usd">{{ amount }} {{ symbol }}</div>
          </div>
          <div class="tx-info-item">
            <div class="label">Fee:</div>
            <div class="value usd fee">
              {{ txInfo.fee }} <span class="fee">STX</span>
            </div>
          </div>
          <div class="tx-info-item">
            <div class="label">Contract address:</div>
            <div class="value type right">{{ contractAddress }}</div>
          </div>
          <div class="tx-info-item">
            <div class="label">Operation type:</div>
            <div class="value type">{{ txInfo?.txs[0]?.type }}</div>
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
        Submit
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

export default {
  name: 'InfoModal',
  components: {
    ModalContent,
    PrimaryButton,
    Input,
  },
  props: {
    isStx: {
      required: true,
    },
    onClose: {
      required: true,
    },
    signerWallet: {
      required: true,
    },
    txInfo: {
      required: true,
    },
    amount: {
      required: true,
    },
    contractAddress: {
      required: true,
    },
    symbol: {
      required: true,
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    const isLoading = ref(false);
    const password = ref('');
    const confirmPassword = ref(false);

    const onChange = (val) => {
      password.value = val;
    };

    const swap = async () => {
      confirmPassword.value = true;
      isLoading.value = true;

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

      // const buffer = Buffer.from(tx.value, 'base64');
      // const txHex = buffer.toString('hex');
      const tx = props.txInfo?.txs[0]?.tx;

      try {
        const result = await props.signerWallet.signAndSendTransfer({
          walletId: props.signerWallet.id,
          rawTransaction: { txs: [{ tx }] },
          privateKey:
            password.value &&
            (await props.signerWallet.getPrivateKeyDecoded(password.value)),
          derivationPath: props.signerWallet.derivationPath,
          proxy: false,
        });
        isLoading.value = false;

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

  .fee {
    color: $red;
    font-family: Panton_Bold;
  }

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

        &.right {
          text-align: right;
          font-size: 12px;
        }

        &.type {
          color: $dark-blue;
        }

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
