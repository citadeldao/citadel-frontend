<template>
  <ModalContent
    v-click-away="successClickHandler"
    :title="$t('xct.newAssignedAddressesModalTitle')"
    :desc="$t('xct.unassignedAddressesModalDesc')"
    type="action"
    button-text="ok"
    @close="successClickHandler"
    @buttonClick="successClickHandler"
  >
    <NewAssignedAddressesList
      :list="newAssignedAddresses"
      :current-wallet="currentWallet"
    />
  </ModalContent>
</template>
<script>
import ModalContent from '@/components/ModalContent';
import NewAssignedAddressesList from './components/NewAssignedAddressesList';

export default {
  name: 'NewAssignedAddressesModal',
  components: {
    ModalContent,
    NewAssignedAddressesList,
  },
  props: {
    successClickHandler: {
      required: true,
    },
    currentWallet: {
      required: true,
    },
    newAssignedAddresses: {
      required: true,
    },
  },
};
</script>
<style scoped lang="scss"></style>
