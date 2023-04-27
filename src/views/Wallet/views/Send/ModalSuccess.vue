<template>
  <ModalContent
    v-click-away="successCloseHandler"
    title="Success"
    desc="The transaction is in progress"
    button-text="ok"
    type="success"
    icon="success"
    @close="successCloseHandler"
    @buttonClick="successClickHandler"
  >
    <SuccessModalContent
      v-model:txComment="txComment"
      :to="toAddress"
      :wallet="currentWallet"
      :amount="amount"
      :fee="fee.fee"
      type="transfer"
      :tx-hash="txHash"
    />
  </ModalContent>
</template>
<script>
import ModalContent from '@/components/ModalContent';
import SuccessModalContent from './components/SuccessModalContent';

import { watch, ref } from 'vue';

export default {
  name: 'ModalSuccessSend',
  components: {
    ModalContent,
    SuccessModalContent,
  },
  props: {
    successCloseHandler: {
      required: true,
    },
    successClickHandler: {
      required: true,
    },
    toAddress: {
      required: true,
    },
    amount: {
      required: true,
    },
    currentWallet: {
      required: true,
    },
    fee: {
      required: true,
    },
    txHash: {
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
