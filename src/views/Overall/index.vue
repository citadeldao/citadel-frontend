<template>
  <div class="overall">
    <div class="overall__central-section-wrapper">
      <div class="overall__central-section">
        <template v-if="isFavoriteList && !hasFavorites">
          <FavoritesPlaceholder @create-list="$emit('create-list')" />
        </template>
        <template v-else>
          <div class="overall__chart-block">
            <ChartSection
              name="balance-history"
              canvas-id="balanceHistory"
              icon="balance-history-placeholder"
              :renderer="renderBalanceHistoryChart"
            />
          </div>
          <div class="overall__chart-block">
            <ChartSection name="rewards" :renderer="renderRewardsChart" />
          </div>
        </template>
      </div>
    </div>
    <div class="overall__right-section">
      <BalanceStructureChart :is-list-empty="isListEmpty" />
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';

import { renderRewardsChart } from '@/components/Charts/rewardsChart';
import { renderBalanceHistoryChart } from '@/components/Charts/balanceHistoryChart';

import ChartSection from './components/ChartSection';
import BalanceStructureChart from './components/BalanceStructure/BalanceStructureChart';
import FavoritesPlaceholder from './components/FavouritesPlaceholder';

export default {
  name: 'Overall',
  components: {
    BalanceStructureChart,
    FavoritesPlaceholder,
    ChartSection,
  },
  emits: ['create-list'],
  setup() {
    const store = useStore();
    const activeList = computed(() => store.getters['wallets/activeList']);
    const customWalletsList = computed(() =>
      store.getters['wallets/customWalletsListByName'](activeList.value)
    );
    const isFavoriteList = computed(
      () => store.getters['wallets/activeList'] === 'Favourites'
    );
    const hasFavorites = computed(
      () =>
        store.getters['wallets/customWalletsListByName']('Favourites').wallets
          .length
    );
    const isListEmpty = computed(
      () =>
        activeList.value !== 'all' && !customWalletsList.value.wallets.length
    );
    return {
      isFavoriteList,
      hasFavorites,
      customWalletsList,
      activeList,
      isListEmpty,
      renderRewardsChart,
      renderBalanceHistoryChart,
    };
  },
};
</script>

<style lang="scss" scoped>
.overall {
  display: flex;
  position: relative;

  &__central-section-wrapper {
    display: flex;
    flex-grow: 1;
    flex-shrink: 2;
  }

  &__central-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: $white;
    border-radius: 50px;
    padding: 40px 45px;
    flex: 1 1 50%;

    box-shadow: 0 4px 40px rgba(0, 0, 0, 0.1);

    @include lg {
      box-shadow: 0 4px 35px rgba(0, 0, 0, 0.1);
    }

    @include md {
      box-shadow: 0 4px 28px rgba(0, 0, 0, 0.1);
      border-radius: 25px;
    }

    @include laptop {
      box-shadow: $card-shadow;
      padding: 20px 15px;
      border-radius: 8px;
    }
  }

  &__chart-block {
    width: 100%;
    min-height: 390px;
    position: relative;

    &:first-child {
      margin-bottom: 30px;
    }

    &:last-child {
      margin-top: 30px;
    }

    &:first-child::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      width: 100%;
      height: 4px;
      background: #eff2fc;
      margin: auto;
      border-radius: 4px;
      bottom: -30px;
    }
  }

  &__right-section {
    margin-left: 30px;
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

body.dark {
  .overall {
    &__chart-block {
      &:first-child::after {
        background: #1b1c31;
      }
    }
    &__central-section {
      background: $dark-panel-bg;
    }
  }
}
</style>
