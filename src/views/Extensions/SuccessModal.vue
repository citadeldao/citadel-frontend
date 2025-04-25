<template>
  <ModalContent
    v-click-away="closeSuccessModal"
    :title="$t('success')"
    :desc="$t('txWaitTitle')"
    button-text="ok"
    type="success"
    icon="success"
    @close="closeSuccessModal"
    @buttonClick="successClickHandler"
  >
    <SuccessModalContent
      v-model:txComment="txComment"
      :is-stacks-delayed="isStacksDelayed"
      :show-from="false"
      :wallet="wallet"
      :amount="amount"
      :custom-code="customCode"
      :tx-hash="successTx"
      :fee="extensionTransactionForSign?.fee"
      :type="extensionTransactionForSign?.type"
    />
  </ModalContent>
</template>
<script>
import SuccessModalContent from '@/views/Wallet/views/Send/components/SuccessModalContent.vue';
import ModalContent from '@/components/ModalContent';
import { ref, watch } from 'vue';

export default {
  name: 'SuccessModalExtension',
  components: {
    SuccessModalContent,
    ModalContent,
  },
  props: {
    closeSuccessModal: {
      required: true,
    },
    isStacksDelayed: {
      type: Boolean,
      default: false,
    },
    customCode: {
      type: String,
      default: '',
    },
    successClickHandler: {
      required: true,
    },
    wallet: {
      required: true,
    },
    amount: {
      required: true,
    },
    successTx: {
      required: true,
    },
    extensionTransactionForSign: {
      required: true,
    },
  },
  setup(_, { emit }) {
    const txComment = ref('');

    watch(
      () => txComment.value,
      () => {
        emit('changeComment', txComment.value);
      }
    );

    return {
      txComment,
    };
  },
};
</script>
<style lang="scss" scoped></style>
