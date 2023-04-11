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
      :show-from="false"
      :wallet="wallet"
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
    successClickHandler: {
      required: true,
    },
    wallet: {
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
