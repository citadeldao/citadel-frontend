<template>
  <div class="overall">
    <div class="overall__central-section-wrapper">
      <div class="overall__central-section">
        <template v-if="isFavouriteList && !hasFavourites">
          <FavouritesPlaceholder @create-list="$emit('create-list')" />
        </template>
        <template v-else>
          <div class="balance-history-chart">
            <BalanceHistoryChart />
          </div>
          <div class="overall__line" />
          <div
            class="overall__rewards-chart"
          >
            <RewardsChart />
          </div>
        </template>
      </div>
    </div>
    <div
      class="overall__right-section"
    >
      <BalanceStructureChart :is-list-empty="isListEmpty" />
    </div>
  </div>
</template>

<script>
import BalanceHistoryChart from './components/BalanceHistory/BalanceHistoryChart';
import RewardsChart from './components/RewardsChart/RewardsChart';
import BalanceStructureChart from './components/BalanceStructure/BalanceStructureChart';
import FavouritesPlaceholder from './components/FavouritesPlaceholder';
import { useStore } from 'vuex';
import { computed } from 'vue';
export default {
  name: 'Overall',
  components: {
    BalanceHistoryChart,
    RewardsChart,
    BalanceStructureChart,
    FavouritesPlaceholder,
  },
  emits: ['create-list'],
  setup() {
    const store = useStore();
    const activeList = computed(() => store.getters['wallets/activeList']);
    const customWalletsList = computed(() => store.getters['wallets/customWalletsListByName'](activeList.value));
    const isFavouriteList = computed(() => store.getters['wallets/activeList'] === 'Favourites');
    const hasFavourites = computed(() => (
      store.getters['wallets/customWalletsListByName']('Favourites').wallets.length
    ));
    const isListEmpty = computed(()=> activeList.value !== 'all' && !customWalletsList.value.wallets.length);

    return {
      isFavouriteList,
      hasFavourites,
      customWalletsList,
      activeList,
      isListEmpty,
    };
  },
};
</script>

<style lang="scss" scoped>
.overall {
  display: flex;
  position: relative;
  //z-index: 10;
  &__central-section-wrapper {
    flex-grow: 1;
    flex-shrink: 2;
    display: flex;
    flex-direction: column;
  }
  &__central-section {
    display: flex;
    flex-direction: column;
    background: $white;
    flex-grow: 1;
    flex-basis: calc(100vh - 114px);
    border-radius: 50px 50px 0 0;
    padding: 38px 36px 31px 45px;
    box-shadow: 0 4px 40px rgba(0, 0, 0, 0.1);
    @include lg {
      box-shadow: 0 4px 35px rgba(0, 0, 0, 0.1);
    }
    @include md {
      box-shadow: 0 4px 28px rgba(0, 0, 0, 0.1);
    }
  }
  &__balance-history-chart {
    margin-bottom: 28px;
    //width: 100%;
  }
  &__line {
    width: 100%;
    height: 4px;
    background: #EFF2FC;
  }
  &__rewards-chart {
    margin-top: 32px;
  }
  &__right-section {
    margin-left: 27px;
    flex-basis: 400px;
    flex-shrink: 0;
    //overflow: hidden;

    @include lg {
      flex-basis: 240px;
    }
    @include md {
      flex-basis: 184px;
    }
  }
}
</style>