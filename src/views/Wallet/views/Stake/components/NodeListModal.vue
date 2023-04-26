<template>
  <ModalContent
    v-click-away="modalCloseHandler"
    :title="nodesListModalData.title"
    :desc="nodesListModalData.desc"
    type="action"
    width="600px"
    :submit-button="false"
    @close="nodesListModalCloseHandler"
  >
    <NodesList
      :staked-nodes="list"
      max-height="400px"
      :nodes-list="nodesListModalData.list"
      :current-wallet="currentWallet"
      :is-multiple-mode="isMultiple"
    />
  </ModalContent>
</template>
<script>
import ModalContent from '@/components/ModalContent';
import NodesList from './NodesList';

export default {
  name: 'NodeListModal',
  components: {
    ModalContent,
    NodesList,
  },
  props: {
    modalCloseHandler: {
      required: true,
    },
    nodesListModalData: {
      required: true,
    },
    nodesListModalCloseHandler: {
      required: true,
    },
    list: {
      required: true,
    },
    currentWallet: {
      required: true,
    },
    isMultiple: {
      required: true,
    },
  },
};
</script>
