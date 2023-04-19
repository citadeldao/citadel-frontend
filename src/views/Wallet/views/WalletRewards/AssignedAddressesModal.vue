<template>
  <ModalContent
    v-click-away="modalCloseHandler"
    :submit-button="false"
    :title="$t('xct.assignedAddressesModalTitle')"
    :desc="$t('xct.assignedAddressesModalDesc')"
    type="action"
    @close="modalCloseHandler"
  >
    <AssignedAddressesModalContent :list="assignedAddresses" />
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
};
</script>
<style scoped lang="scss"></style>
