<template>
  <div class="import-hardware-wallet">
    <Header
      :title="$t('selectHardwareWallet')"
      :info="$t('addAddress.card2Desc')"
    />
    <div class="import-hardware-wallet__section">
      <ChooseImportingHardware />
    </div>
  </div>
</template>

<script>
import Header from '../AddAddress/components/Header';
import ChooseImportingHardware from './components/ChooseImportingHardware';

export default {
  name: 'ImportHardwareWallet',
  components: {
    Header,
    ChooseImportingHardware,
  },
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.import-hardware-wallet {
  display: flex;
  flex-direction: column;
  background: $white;
  box-shadow: -10px 4px 27px rgba(0, 0, 0, 0.1);
  border-radius: 25px;
  padding: 0 44px 40px;
  flex-grow: 1;
  margin-bottom: 8px;

  @include md {
    box-shadow: -10px 4px 24px rgba(0, 0, 0, 0.1);
  }
  &__section {
    display: flex;
    flex-grow: 1;
  }
}
</style>