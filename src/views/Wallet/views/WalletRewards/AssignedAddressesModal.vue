<template>
  <ModalContent
    v-click-away="modalCloseHandler"
    :submit-button="false"
    :title="$t('xct.assignedAddressesModalTitle')"
    :desc="$t('xct.assignedAddressesModalDesc')"
    type="action"
    @close="modalCloseHandler"
  >
    <AssignedAddressesModalContent
      :list="assignedAddresses"
      @removeDao="onRemoveDao"
    />
  </ModalContent>
</template>
<script>
import ModalContent from '@/components/ModalContent';
import AssignedAddressesModalContent from './components/AssignedAddressesModalContent';

export default {
  name: 'AssignedAddressesModal',
  components: {
    ModalContent,
    AssignedAddressesModalContent,
  },
  props: {
    assignedAddresses: {
      required: true,
    },
    modalCloseHandler: {
      required: true,
    },
  },
  setup(_, { emit }) {
    const onRemoveDao = (item) => {
      emit('removeDao', item);
    };

    return {
      onRemoveDao,
    };
  },
};
</script>
<style scoped lang="scss"></style>
