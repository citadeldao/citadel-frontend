<template>
  <ModalContent
    v-click-away="successClickHandler"
    title="Success"
    :desc="$t('txWaitTitle')"
    button-text="ok"
    type="success"
    icon="success"
    data-qa="staking-success"
    @close="finalClose"
    @buttonClick="successClickHandler"
  >
    <SuccessModalContent
      v-model:tx-comment="txComment"
      :to="to"
      :wallet="currentWallet"
      :amount="amount"
      :fee="fee"
      :type="mode"
      :tx-hash="txHash"
      :mode="mode"
      :active-tab="activeTab"
      :is-multiple="isMultiple"
      :redelegation-node-address="selectedNode?.address"
      :selected-node="selected"
      data-qa="staking-success"
    />
  </ModalContent>
</template>
<script>
import ModalContent from '@/components/ModalContent';
import SuccessModalContent from '../../Send/components/SuccessModalContent';

import { ref, watch } from 'vue';

export default {
  name: 'SuccessStakeModal',
  components: {
    ModalContent,
    SuccessModalContent,
  },
  props: {
    successClickHandler: {
      required: true,
    },
    finalClose: {
      required: true,
    },
    to: {
      required: true,
    },
    currentWallet: {
      required: true,
    },
    amount: {
      required: true,
    },
    fee: {
      required: true,
    },
    txHash: {
      required: true,
    },
    mode: {
      required: true,
    },
    activeTab: {
      required: true,
    },
    isMultiple: {
      required: true,
    },
    selectedNode: {
      required: true,
    },
    selected: {
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
