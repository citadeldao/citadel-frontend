<template>
  <div class="balance-structure">
    <div v-show="isListEmpty || isEmpty" class="balance-structure-placeholder">
      <balanceStructurePlaceholder />
      <span class="balance-structure-placeholder__text">
        {{ $t('overallPage.noBalance') }}
      </span>
    </div>
    <div v-show="!isListEmpty && !isEmpty">
      <div class="chart-top">
        <div class="chart-top__title">
          {{ $t('overallPage.balanceStructure.title') }}
        </div>
        <div class="chart-top__tabs-container">
          <div class="chart-top__network-tabs">
            <NetworkTab
              :id="1"
              v-model:currentTab="currentTab"
              class="chart-top__tab"
              value="USD"
              icon="USD"
              data-qa="balance-structure__currency--usd"
            />
            <NetworkTab
              :id="2"
              v-model:currentTab="currentTab"
              class="chart-top__tab"
              value="BTC"
              icon="btc"
              data-qa="balance-structure__currency--btc"
            />
          </div>
          <div
            class="chart-top__toggle-info"
            data-qa="balance-structure__expand-button"
            @click="isExpanded = true"
            @mouseenter="isToggleHovered = true"
            @mouseleave="isToggleHovered = false"
          >
            <toggleInfo :fill="isToggleHovered ? '#fff' : '#8B9BC7'" />
          </div>
        </div>
      </div>
      <div class="chart-container">
        <div class="chart-background">
          <div class="chart">
            <canvas id="balanceStructureChart" width="180" height="180" />
          </div>
        </div>
      </div>
      <div id="legend-container"></div>
      <!-- <div class="balance-structure-list-wrapper">
        <div class="balance-structure-list">
          <BalanceStructureItem
            v-for="(item, index) in balanceStructure"
            :key="index"
            class="balance-structure-list__item"
            :item="item"
            :color="item.color"
            :current-tab="currentTab"
          />
        </div>
      </div> -->
    </div>
  </div>
  <teleport to="body">
    <BalanceStructureExpanded
      v-if="isExpanded"
      :balance-structure="balanceStructure"
      @close="isExpanded = false"
    />
  </teleport>
</template>
<script>
import { ref, computed, watch, onMounted } from 'vue';
import { useWindowSize } from 'vue-window-size';
import useWallets from '@/compositions/useWallets';
import BalanceStructureExpanded from '@/views/Overall/components/BalanceStructure/BalanceStructureExpanded';
import NetworkTab from '@/components/UI/NetworkTab';
import { renderBalanceStructChart } from '@/components/Charts/balanceStructChart';
import { chartColors } from '@/components/Charts/config';
import toggleInfo from '@/assets/icons/toggle-info.svg';
import balanceStructurePlaceholder from '@/assets/icons/overall/balance-sctructure-placeholder.svg';
import { useStore } from 'vuex';

export default {
  name: 'BalanceStructure',
  components: {
    balanceStructurePlaceholder,
    NetworkTab,
    toggleInfo,
    BalanceStructureExpanded,
  },
  props: {
    isListEmpty: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const store = useStore();
    const { width } = useWindowSize();
    const { balanceStructure } = useWallets(null, 5);
    const currentTab = ref('USD');
    const isExpanded = ref(false);
    const isToggleHovered = ref(false);
    const isEmpty = computed(() => !Object.keys(balanceStructure.value).length);
    const showBalance = computed(() => store.getters['balance/showBalance']);
    const loadAfterGetBalanceStructure = ref(false);

    const refreshChart = async () => {
      if (!isEmpty.value) {
        await renderBalanceStructChart(balanceStructure, currentTab.value);
      }
    };

    onMounted(() => {
      if (balanceStructure.value && !isEmpty.value) {
        renderBalanceStructChart(balanceStructure, currentTab.value);
      }
    });

    watch(
      () => showBalance.value,
      async () => await refreshChart()
    );

    watch(
      () => balanceStructure.value,
      async (newV, oldV) => {
        console.log(111111111111);
        if (JSON.stringify(newV) !== JSON.stringify(oldV)) {
          console.log('NewV', newV);
          console.log('OldV', oldV);
          await refreshChart();
        }
        if (!loadAfterGetBalanceStructure.value) {
          loadAfterGetBalanceStructure.value = true;
        }
      }
    );

    watch(
      () => width.value,
      async () => await refreshChart()
    );

    watch(
      () => currentTab.value,
      async () => await refreshChart()
    );

    return {
      balanceStructure,
      chartColors,
      currentTab,
      isEmpty,
      isExpanded,
      isToggleHovered,
    };
  },
};
</script>
<style lang="scss" scoped>
.balance-structure {
  height: 560px;
}

.balance-structure-placeholder {
  border: 1px solid #c3ceeb;
  border-radius: 25px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  color: $too-ligth-blue;
  flex-direction: column;

  &__text {
    margin-top: 32px;
  }
}

.chart-top {
  display: flex;
  justify-content: space-between;
  @include lg {
    flex-direction: column;
  }
  @include md {
    flex-direction: column;
  }

  &__title {
    //margin-bottom: 13px;
    font-style: normal;
    font-weight: bold;
    font-size: 22px;
    line-height: 26px;
    font-family: 'Panton_Bold';
    color: $black;
    @include lg {
      margin-bottom: 17px;
    }
    @include md {
      margin-bottom: 13px;
      font-size: 18px;
    }
  }

  &__tabs-container {
    display: flex;
    justify-content: space-between;
    @include lg {
      margin-bottom: 13px;
    }
  }

  &__network-tabs {
    display: flex;
  }

  &__tab {
    margin-right: 8px;
    background-color: $lavander-dark;

    &:last-child {
      margin-right: 0;
    }

    &.network-tab-active {
      background-color: $dark-blue;
    }
  }

  &__toggle-info {
    margin-left: 16px;
    height: 30px;
    width: 30px;
    border-radius: 50%;
    background: $lavander-dark;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &:hover {
      background: $royalblue1;
    }
  }
}

.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 25px;
  margin-top: 15px;

  .chart-background {
    display: flex;
    justify-content: center;
    align-items: center;
    //background: linear-gradient(to right, white, grey);
    border-radius: 50%;
    position: relative;
    //overflow: hidden;
    .chart {
      position: relative;
      box-shadow: 0px 0px 35px rgba(88, 98, 149, 0.55);
      width: 220px;
      height: 220px;
      border-radius: 50%;
      margin: 15px;
      z-index: 2;

      &:after {
        content: '';
        position: absolute;
        top: -20px;
        left: 50%;
        transform: translate(-50%);
        width: 260px;
        height: 260px;
        background: #dfe3f0;
        background: radial-gradient(
          circle,
          $white 0%,
          $white 59%,
          #b0b4c6 59.1%,
          #dfe3f0 70%
        );
        z-index: -1;
        border-radius: 50%;
      }

      @include lg {
        height: 160px;
        width: 160px;
        margin: 10px;

        &:after {
          width: 180px;
          height: 180px;
          top: -10px;
          background: radial-gradient(
            circle,
            #ffffff 0%,
            #ffffff 62%,
            #b0b4c6 62.1%,
            #dfe3f0 72%
          );
        }
      }
      @include md {
        height: 140px;
        width: 140px;
        margin: 8px;

        &:after {
          width: 160px;
          height: 160px;
          top: -10px;
          background: radial-gradient(
            circle,
            #ffffff 0%,
            #ffffff 59%,
            #b0b4c6 59.1%,
            #dfe3f0 72%
          );
        }
      }
      //padding: 20px;
      //border: 20px solid rgba(240, 242, 252, 0.5);
      //border: 20px solid rgba(120,120,120,0.1);

      & > canvas {
        border-radius: 50%;
        cursor: pointer;
      }
    }
  }
}

.balance-structure-list-wrapper {
  height: 530px;
  //height: 1px;
  display: flex;
}

.balance-structure-list {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  width: 100%;
  height: 100%;
  //overflow-y: scroll;
  overflow-x: hidden;

  &__item:nth-child(odd) {
    margin-right: 24px;
    @include lg {
      margin-right: 5px;
    }
    @include md {
      margin-right: 5px;
    }
  }
}
</style>
