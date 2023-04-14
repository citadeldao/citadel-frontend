<template>
  <ModalContent
    v-click-away="modalCloseHandler"
    :title="$t('xct.addressAssigningInfoModalTitle')"
    :desc="$t('xct.addressAssigningInfoModalDesc')"
    type="action"
    button-text="next"
    @close="modalCloseHandler"
    @buttonClick="toUnassignedAddresses"
  >
    <AddressAssigningInfo />
  </ModalContent>
</template>
<script>
import ModalContent from '@/components/ModalContent';
import AddressAssigningInfo from './components/AddressAssigningInfo';

export default {
  name: 'AssignedAddressesModal',
  components: {
    ModalContent,
    AddressAssigningInfo,
  },
  props: {
    modalCloseHandler: {
      required: true,
    },
    toUnassignedAddresses: {
      required: true,
    },
  },
};
</script>
<style scoped lang="scss"></style>
