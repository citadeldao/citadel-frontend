<template>
  <ModalContent
    v-click-away="modalCloseHandler"
    :title="$t(chooseNodeModalData.title)"
    :desc="chooseNodeModalData.desc"
    type="action"
    width="600px"
    :button-text="chooseNodeModalData.button"
    :disabled="disabled"
    :loading="isLoading"
    data-qa="staking"
    @close="modalCloseHandler"
    @buttonClick="prepareDelegation"
  >
    <slot />
  </ModalContent>
</template>
<script>
import ModalContent from '@/components/ModalContent';

export default {
  name: 'ChooseStakingNodeModal',
  components: {
    ModalContent,
  },
  props: {
    modalCloseHandler: {
      required: true,
    },
    chooseNodeModalData: {
      required: true,
    },
    disabled: {
      required: true,
    },
    isLoading: {
      required: true,
    },
    prepareDelegation: {
      required: true,
    },
  },
};
</script>
