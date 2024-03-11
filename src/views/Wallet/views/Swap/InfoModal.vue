<template>
  <ModalContent
    show-success-icon
    v-click-away="onClose"
    width="768px"
    :title="$t('swapView.modalInfoTitle')"
    :desc="$t('swapView.modalInfoDesc')"
    type="action"
    :submit-button="false"
    @close="onClose"
  >
    <div class="swap-tx">
      <div class="swap-tx__info">
        <div class="tx" />
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
        {{ $t('swap') }}
      </PrimaryButton>
    </div>
  </ModalContent>
</template>
<script>
import ModalContent from '@/components/ModalContent';
import Input from '@/components/UI/Input';
import jsonview from '@pgrabovets/json-view';
import { onMounted } from 'vue';
import PrimaryButton from '@/components/UI/PrimaryButton';
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { PRIVATE_PASSWORD_TYPES, WALLET_TYPES } from '@/config/walletType';
import { sha3_256 } from 'js-sha3';
import notify from '@/plugins/notify';

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
    txRoute: {
      required: true,
    },
    nonce: {
      required: true,
    },
    chainIdFrom: {
      required: true,
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    const isLoading = ref(false);
    const password = ref('');
    const confirmPassword = ref(false);

    const metamaskConnector = computed(
      () => store.getters['metamask/metamaskConnector']
    );

    const onChange = (val) => {
      password.value = val;
    };

    const swap = async () => {
      confirmPassword.value = true;
      isLoading.value = true;

      const txParse = {
        ...props.txRoute.transactionRequest,
        gas: +props.txRoute.transactionRequest.gasLimit,
        from: props.signerWallet.address,
        to: props.txRoute.transactionRequest.target,
        routeType: props.txRoute.transactionRequest.routeType,
        chainId: props.chainIdFrom,
        nonce: props.nonce,
      };

      delete txParse.gasLimit;
      delete txParse.maxFeePerGas;
      delete txParse.maxPriorityFeePerGas;
      delete txParse.target;

      // metamask, ...
      if (props.signerWallet.type === WALLET_TYPES.PUBLIC_KEY) {
        const metamaskResult =
          await metamaskConnector.value.sendMetamaskTransaction(
            txParse,
            '',
            props.signerWallet.address
          );

        if (metamaskResult.error) {
          notify({
            type: 'warning',
            text: metamaskResult.error,
          });
          confirmPassword.value = false;
          isLoading.value = false;
        } else {
          confirmPassword.value = false;
          isLoading.value = false;

          emit('onSuccess', [metamaskResult.txHash]);
          props.onClose();
        }

        return;
      }

      txParse.value = `0x${parseInt(txParse.value).toString(16)}`;

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

      let result;

      try {
        result = await props.signerWallet.signAndSendTransfer({
          walletId: props.signerWallet.id,
          rawTransaction: txParse,
          privateKey:
            password.value &&
            (await props.signerWallet.getPrivateKeyDecoded(password.value)),
          derivationPath: props.signerWallet.derivationPath,
          proxy: false,
        });
      } catch (err) {
        emit('onCancel');
        props.onClose();
        return;
      }

      if (
        typeof result.data[0] === 'string' &&
        [64, 66].includes(result.data[0].length)
      ) {
        emit('onSuccess', [result.data]);
        props.onClose();
      }
    };

    const incorrectPassword = computed(() => {
      return sha3_256(password.value) !== store.getters['crypto/passwordHash'];
    });

    onMounted(() => {
      const tree = jsonview.create(props.txRoute);
      jsonview.render(tree, document.querySelector('.swap-tx__info .tx'));
      jsonview.expand(tree);
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
</style>
