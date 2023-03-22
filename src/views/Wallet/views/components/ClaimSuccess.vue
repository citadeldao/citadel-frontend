<template>
  <ModalContent
    v-click-away="claimModalCloseHandler"
    title="Success"
    :desc="$t('txWaitTitle')"
    button-text="ok"
    type="success"
    icon="success"
    @close="claimModalCloseHandler"
    @buttonClick="$emit('success')"
  >
    <SuccessModalContent
      v-model:txComment="comment"
      :to="currentToken ? '' : currentWallet.address"
      :wallet="currentToken || currentWallet"
      :amount="
        currentToken ? totalAmount : currentWallet.balance.claimableRewards
      "
      :tx-hash="txHash"
      :show-from="false"
      type="reward"
      :fee="mode === 'claim' ? claimFee : fee"
    />
  </ModalContent>
</template>
<script>
import ModalContent from '@/components/ModalContent';
import SuccessModalContent from '../../views/Send/components/SuccessModalContent';
import { ref, watch } from 'vue';

export default {
  components: {
    ModalContent,
    SuccessModalContent,
  },
  props: {
    claimModalCloseHandler: {
      required: true,
    },
    txHash: {
      type: Boolean,
      default: false,
    },
    currentToken: {
      required: true,
    },
    currentWallet: {
      required: true,
    },
    fee: {
      type: [String, Number],
      required: true,
    },
    claimFee: {
      required: true,
    },
    mode: {
      required: true,
    },
    totalAmount: {
      required: true,
    },
  },
  setup(_, { emit }) {
    const comment = ref('');

    watch(
      () => comment.value,
      () => {
        emit('changeComment', comment.value);
      }
    );

    return {
      comment,
    };
  },
};
</script>
<style lang="scss" scoped></style>
