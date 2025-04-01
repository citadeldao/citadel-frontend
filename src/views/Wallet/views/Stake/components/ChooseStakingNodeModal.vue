<template>
  <ModalContent
    v-click-away="modalCloseHandler"
    :title="$t(chooseNodeModalData.title)"
    :desc="statusDescription || chooseNodeModalData.desc"
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
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

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
    selectedNode: {
      required: true,
    },
  },
  setup(props) {
    const statusDescription = ref('');
    const { t } = useI18n();

    if (
      props.selectedNode?.isInactive === 'Active' &&
      !props.selectedNode?.activationDate &&
      !props.selectedNode?.deactivationDate
    ) {
      statusDescription.value = t('solana.statusActive');
    }
    if (
      props.selectedNode?.isInactive === 'Inactive' &&
      !props.selectedNode?.activationDate &&
      !props.selectedNode?.deactivationDate
    ) {
      statusDescription.value = t('solana.statusInactive');
    }
    if (props.selectedNode?.activationDate) {
      statusDescription.value = t('solana.statusActivate');
    }
    if (props.selectedNode?.deactivationDate) {
      statusDescription.value = t('solana.statusDeactivate');
    }

    return {
      statusDescription,
    };
  },
};
</script>
