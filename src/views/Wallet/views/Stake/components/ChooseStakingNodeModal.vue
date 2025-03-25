<template>
  <ModalContent
    v-click-away="modalCloseHandler"
    :title="$t(chooseNodeModalData.title)"
    :desc="chooseNodeModalData.desc"
    type="action"
    width="700px"
    :button-text="
      (chooseNodeModalData.button === 'unstaking.unstake' && withdrawBtn) ||
      chooseNodeModalData.button
    "
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
    withdrawBtn: {
      type: String,
      default: '',
    },
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
