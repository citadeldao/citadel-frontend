<template>
  <div class="import-existing-address">
    <Header
      :title="$t('importExistingAddressExp')"
      :info="$t('chooseSuitableMethod')"
    />
    <div class="import-existing-address__section">
      <ChooseImportingMethod />
    </div>
  </div>
</template>

<script>
import Header from '../AddAddress/components/Header';
import ChooseImportingMethod from './components/ChooseImportingMethod';

export default {
  name: 'ImportExistingaddress',
  components: {
    Header,
    ChooseImportingMethod,
  },
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.import-existing-address {
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