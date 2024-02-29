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

      console.log('WALLET SIGNER', props.signerWallet);

      // metamask, ...
      if (props.signerWallet.type === WALLET_TYPES.PUBLIC_KEY) {
        const metamaskResult =
          await metamaskConnector.value.sendMetamaskTransaction(
            props.txRoute.transactionRequest,
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
