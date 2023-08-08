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
    <LedgerProtocol class="mt-10" />
    <HardwareAddressesModal
      :list="hardwareAddresses"
      @signHardwareAddress="signHardwareAddress"
    />
  </ModalContent>
</template>
<script>
import ModalContent from '@/components/ModalContent';
import HardwareAddressesModal from './components/HardwareAddressesModal';
import LedgerProtocol from '@/components/LedgerProtocol';

export default {
  name: 'HardwareAddressModal',
  components: {
    ModalContent,
    HardwareAddressesModal,
    LedgerProtocol,
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
<style scoped lang="scss">
.mt-10 {
  margin-top: 10px;
}
</style>
