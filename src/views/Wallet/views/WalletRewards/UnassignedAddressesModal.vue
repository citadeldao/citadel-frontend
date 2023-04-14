<template>
  <ModalContent
    v-click-away="modalCloseHandler"
    :title="$t('xct.unassignedAddressesModalTitle')"
    :desc="$t('xct.unassignedAddressesModalDesc')"
    type="action"
    button-text="next"
    :disabled="!checkedAddresses.length"
    @close="modalCloseHandler"
    @buttonClick="toApproveAssign"
  >
    <UnassignedAddressesModalContent :list="unassignedAddresses" />
  </ModalContent>
</template>
<script>
import ModalContent from '@/components/ModalContent';
import UnassignedAddressesModalContent from './components/UnassignedAddressesModalContenet';

export default {
  name: 'UnassignedAddressesModal',
  components: {
    ModalContent,
    UnassignedAddressesModalContent,
  },
  props: {
    checkedAddresses: {
      required: true,
    },
    modalCloseHandler: {
      required: true,
    },
    unassignedAddresses: {
      required: true,
    },
    toApproveAssign: {
      required: true,
    },
  },
};
</script>
<style scoped lang="scss"></style>
