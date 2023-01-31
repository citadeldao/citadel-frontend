<template>
  <div class="balance-history">
    <div v-show="showPlaceholder" class="balance-history-placeholder">
      <balanceHistoryPlaceholder />
      <span class="balance-history-placeholder__text">
        <div>{{ $t('overallPage.maintance') }}</div>
        {{ $t('overallPage.problemBalance') }}
      </span>
    </div>
    <div v-show="!showPlaceholder" class="balance-history-chart-wrapper">
      <div class="top">
        <div class="top__title">
          {{ $t('overallPage.balanceHistory.title') }}
        </div>
        <div class="top__buttons">
          <div class="top__network-tabs">
            <NetworkTab
              v-model:currentTab="currentTab"
              value="USD"
              icon="USD"
              data-qa="balance-history__currency--usd"
            />
            <NetworkTab
              v-model:currentTab="currentTab"
              class="btc-tab"
              value="BTC"
              icon="btc"
              data-qa="balance-history__currency--btc"
            />
          </div>
          <div
            class="top__toggle-wrapper"
            data-qa="balance-history__expand-button"
            @click="isExpanded = true"
            @mouseenter="isToggleHovered = true"
            @mouseleave="isToggleHovered = false"
          >
            <toggleInfo :fill="isToggleHovered ? '#fff' : '#8B9BC7'" />
          </div>
        </div>
      </div>
      <div
        v-show="balanceHistory && balanceHistory.list"
        class="balance-history-chart"
      >
        <div>
          <canvas
            id="balanceHistoryChart"
            :style="{ width: `${wrapperWidth}px` }"
            class="balance-history-chart__canvas"
          />
        </div>
        <resize-observer :show-trigger="true" @notify="handleResize" />
      </div>
    </div>
  </div>
  <teleport to="body">
    <BalanceHistoryExpanded v-if="isExpanded" @close="isExpanded = false" />
  </teleport>
</template>
<script>
import balanceHistoryPlaceholder from '@/assets/icons/overall/empty.svg';
import NetworkTab from '@/components/UI/NetworkTab';
import toggleInfo from '@/assets/icons/toggle-info.svg';
import { renderBalanceHistoryChart } from '@/components/Charts/balanceHistoryChart';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import BalanceHistoryExpanded from '@/views/Overall/components/BalanceHistory/BalanceHistoryExpanded';
import useChart from '@/compositions/useChart';
import { useWindowSize } from 'vue-window-size';

export default {
  name: 'BalanceHistoryChart',
  components: {
    BalanceHistoryExpanded,
    balanceHistoryPlaceholder,
    NetworkTab,
    toggleInfo,
  },
  setup() {
    const { width } = useWindowSize();
    const store = useStore();
    const canvasElement = 'balanceHistoryChart';
    const storeAction = 'charts/getBalanceHistory';
    const storeGetter = 'charts/balanceHistory';
    const wrapperWidth = ref();
    const handleResize = ({ width }) => {
      wrapperWidth.value = width;
    };
    const {
      currentTab,
      isExpanded,
      balanceHistory,
      customList,
      isToggleHovered,
    } = useChart({
      canvasElement,
      storeAction,
      storeGetter,
      render: renderBalanceHistoryChart,
    });

    const showPlaceholder = computed(() => {
      return (
        !balanceHistory.value ||
        Object.keys(balanceHistory.value.list).length <= 1
      );
    });

    onMounted(async () => {
      const { balanceHistory } = await store.dispatch(storeAction, {
        list: customList.value,
      });
      await renderBalanceHistoryChart(
        balanceHistory,
        currentTab.value,
        canvasElement
      );
    });
    watch(
      () => currentTab.value,
      async () => {
        await renderBalanceHistoryChart(
          balanceHistory.value,
          currentTab.value,
          canvasElement
        );
      }
    );
    watch(
      () => customList.value,
      async () => {
        const { balanceHistory } = await store.dispatch(storeAction, {
          list: customList.value,
        });
        await renderBalanceHistoryChart(
          balanceHistory,
          currentTab.value,
          canvasElement
        );
      }
    );
    watch(
      () => width.value,
      async () => {
        nextTick(async () => {
          // const { balanceHistory } = await store.dispatch(storeAction, {
          //   list: customList.value,
          // });
          await renderBalanceHistoryChart(
            balanceHistory.value,
            currentTab.value,
            canvasElement
          );
        });
      }
    );

    return {
      customList,
      balanceHistory,
      currentTab,
      isExpanded,
      isToggleHovered,
      showPlaceholder,
      wrapperWidth,
      handleResize,
    };
  },
};
</script>
<style lang="scss" scoped>
.balance-history {
  //max-width: 1109px;
  width: 100%;
}

.balance-history-placeholder {
  border: 1px solid #c3ceeb;
  border-radius: 25px;
  width: 100%;
  height: 366px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  color: $too-ligth-blue;
  flex-direction: column;

  &__text {
    margin-top: 45px;

    div {
      color: $black;
      text-align: center;
      font-size: 22px;
      margin-bottom: 8px;
      font-family: Panton_SemiBold;
    }
  }
}

.balance-history-chart {
  position: relative;
  width: 100%;
  margin-bottom: 30px;

  @include md {
    margin-bottom: 20px;
  }

  &__canvas {
    width: 100%;
    height: 500px !important;
    cursor: pointer;

    @include lg {
      height: 350px !important;
    }

    @include md {
      height: 300px !important;
    }
  }
}

.top {
  display: flex;
  height: 30px;
  justify-content: space-between;
  margin-bottom: 25px;

  &__title {
    font-weight: bold;
    font-size: 20px;
    color: $black;
  }

  &__buttons {
    display: flex;
  }

  &__network-tabs {
    display: flex;

    .btc-tab {
      margin-left: 8px;
    }
  }

  &__toggle-wrapper {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $lavander-dark;
    border-radius: 50%;
    margin-left: 17px;
    cursor: pointer;

    &:hover {
      background: $royalblue1;
    }
  }
}
</style>
