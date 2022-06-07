<template>
  <div class="add-address">
    <AddToOneSeed />
    <div class="add-address__card-wrapper">
      <AddressAddingTypeCard
        v-for="type in addingTypes"
        :key="type.title"
        :type="type"
      />
    </div>
  </div>
</template>

<script>
import AddToOneSeed from './components/AddToOneSeed';
import AddressAddingTypeCard from './components/AddressAddingTypeCard';
import { i18n } from '@/plugins/i18n';

const { t } = i18n.global;
const addingTypes = [
  {
    name: 'existing',
    title: t('addAddress.card1Title'),
    desc: t('chooseSuitableMethod'),
    note: t('addAddress.card1Note'),
    icon: 'import-existing-address',
    hoveredIcon: 'import-existing-address-hovered',
    noteColor: '#1A53F0',
    pathName: 'ImportExistingAddress',
  },
  {
    name: 'hardware',
    title: t('addAddress.card2Title'),
    desc: t('addAddress.card2Desc'),
    note: t('addAddress.card2Note'),
    icon: 'hardware',
    hoveredIcon: 'hardware-hovered',
    noteColor: '#FF5722',
    pathName: 'ImportHardwareWallet',
    inactive: false,
  },
  {
    name: 'public-key',
    title: t('addAddress.card3Title'),
    desc: t('addAddress.card3Desc'),
    important: t('addAddress.card3Important'),
    note: t('addAddress.card3Note'),
    icon: 'vision',
    hoveredIcon: 'vision-hovered',
    noteColor: '#0FB774',
    pathName: 'AddToPublicKey',
    inactive: false,
  },
];
export default {
  name: 'AddAddress',
  components: {
    AddToOneSeed,
    AddressAddingTypeCard,
  },
  setup() {
    return { addingTypes };
  },
};
</script>

<style lang="scss" scoped>
.add-address {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-bottom: 8px;

  &__card-wrapper {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 31px;
    @include lg {
      margin-top: 30px;
    }
    @include md {
      margin-top: 16px;
    }
  }
}
</style>
