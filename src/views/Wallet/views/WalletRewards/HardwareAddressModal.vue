<template>
  <ModalContent
    v-click-away="successClickHandler"
    :title="$t('hardwareWallet')"
    :desc="$t('xct.hardwareAddressesModalDesc')"
    type="action"
    button-text="finish"
    @close="successClickHandler"
    @buttonClick="hardwareAdressesModalClick"
  >
    <HardwareAddressesModal
      :list="hardwareAddresses"
      @signHardwareAddress="signHardwareAddress"
    />
  </ModalContent>
</template>
<script>
import ModalContent from '@/components/ModalContent';
import HardwareAddressesModal from './components/HardwareAddressesModal';

export default {
  name: 'HardwareAddressModal',
  components: {
    ModalContent,
    HardwareAddressesModal,
  },
  props: {
    successClickHandler: {
      required: true,
    },
    hardwareAdressesModalClick: {
      required: true,
    },
    hardwareAddresses: {
      required: true,
    },
    signHardwareAddress: {
      required: true,
    },
  },
};
</script>
<style scoped lang="scss"></style>
