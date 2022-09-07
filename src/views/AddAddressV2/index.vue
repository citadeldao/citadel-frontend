<template>
  <div class="add-address">
    <div class="add-address__title">
      {{ $t('walletsAdding.mainMenuTitle') }}
    </div>
    <div class="add-address__description">
      {{ $t('walletsAdding.mainMenuDescription') }}
    </div>
    <div class="add-address__card-wrapper">
      <AddressMenuItem
        v-for="(item, ndx) in types"
        :key="ndx"
        :item="item"
        class="item"
        @click="$router.push({ name: item.route })"
      />
    </div>
  </div>
</template>

<script>
import { i18n } from '@/plugins/i18n';
import AddressMenuItem from './components/AddressMenuItem';
import useCreateWallets from '@/compositions/useCreateWallets';
import { computed } from 'vue';

const { t } = i18n.global;
const addingTypes = [
  {
    title: t('walletsAdding.menu.create'),
    description: t('walletsAdding.menu.createDescription'),
    icon: 'create',
    dataQa: 'Create',
    route: 'AddToOneSeed',
  },
  {
    title: t('walletsAdding.menu.addNetworks'),
    description: t('walletsAdding.menu.addNetworksDescription'),
    icon: 'create',
    dataQa: 'Add-networks',
    route: 'AddToOneSeed',
  },
  {
    title: t('walletsAdding.menu.import'),
    description: t('walletsAdding.menu.importDescription'),
    icon: 'import',
    dataQa: 'Import',
    route: 'AddWalletTypes',
  },
];

export default {
  name: 'AddAddress',
  components: {
    AddressMenuItem,
  },
  setup() {
    const { isUserMnemonic } = useCreateWallets();
    const types = computed(() => {
      if (isUserMnemonic.value) {
        return [addingTypes[1], addingTypes[2]];
      }

      return [addingTypes[0], addingTypes[2]];
    });

    return { types };
  },
};
</script>

<style lang="scss" scoped>
.add-address {
  display: flex;
  flex-direction: column;
  //justify-content: center;
  align-items: center;
  // height: 100vh;
  width: 1140px;

  @include md {
    width: 100%;
  }

  &__title {
    margin-top: 70px;
    font-size: 34px;
    font-family: Panton_SemiBold;
    color: $black;
  }

  &__description {
    font-size: 14px;
    font-family: Panton_SemiBold;
    color: #6b93c0;
    margin-bottom: 40px;
  }

  &__card-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 11px;
    @include lg {
      margin-top: 30px;
    }
    @include md {
      margin-top: 16px;
      justify-content: center;

      .item {
        width: 44%;
        margin: 0 10px;
      }
    }

    @media (max-width: 1178px) {
      align-items: flex-start;
    }
  }
}

// @media (max-width: 1400px) {
//   .add-address {
//     height: auto;

//     .add-address__card-wrapper {
//       flex-direction: column;
//     }

//     .item {
//       width: 80%;
//       height: 400px;
//       margin: 20px;
//     }
//   }
// }
</style>
