<template>
  <ModalContent
    :title="selectedApp.name"
    :desc="selectedApp.short_description"
    button-text="confirm"
    type="action"
    :internal-icon="selectedApp.logo"
    :disabled="confirmModalDisabled"
    :loading="signLoading"
    class="modal-content"
    @close="confirmModalCloseHandlerWithRequest"
    @buttonClick="confirmClickHandler"
  >
    <div v-if="showConfirmModalLoading" class="loader">
      <Loading />
    </div>
    <TransactionInfo
      v-else
      :extension-transaction-for-sign="extensionTransactionForSign"
      :metamask-signer="metamaskSigner"
      :signer-wallet="signerWallet"
      :incorrect-password="incorrectPassword"
      :confirm-password="confirmPassword"
      @confirmInput="confirmClickHandler"
      @changePassword="
        (pass) => {
          $emit('changePassword', pass);
        }
      "
    />
  </ModalContent>
</template>
<script>
import TransactionInfo from './components/TransactionInfo';
import ModalContent from '@/components/ModalContent';
import Loading from '@/components/Loading';

export default {
  name: 'TransactionModal',
  components: {
    TransactionInfo,
    ModalContent,
    Loading,
  },
  props: {
    selectedApp: {
      required: true,
    },
    confirmModalDisabled: {
      required: true,
    },
    signLoading: {
      required: true,
    },
    showConfirmModalLoading: {
      required: true,
    },
    confirmModalCloseHandlerWithRequest: {
      required: true,
    },
    confirmClickHandler: {
      required: true,
    },
    extensionTransactionForSign: {
      required: true,
    },
    metamaskSigner: {
      required: true,
    },
    signerWallet: {
      required: true,
    },
    incorrectPassword: {
      required: true,
    },
    confirmPassword: {
      required: true,
    },
  },
};
</script>
<style scoped></style>
