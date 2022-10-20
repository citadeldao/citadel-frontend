<template>
  <div class="container">
    <div
      v-show="!rewardsChart || !Object.keys(rewardsChart.list).length"
      class="rewards-chart-placeholder"
    >
      <rewardsChartPlaceholder />
      <span class="rewards-chart-placeholder__text">
        {{ $t('overallPage.noRewards') }}
      </span>
    </div>
    <div
      v-show="rewardsChart && Object.keys(rewardsChart.list).length"
      class="rewards-chart-wrapper"
    >
      <div class="top">
        <div class="top__title">
          {{ $t('overallPage.rewardsChart.title') }}
        </div>
        <div class="top__buttons">
          <div class="top__network-tabs">
            <NetworkTab
              v-model:currentTab="currentTab"
              value="USD"
              icon="USD"
              data-qa="rewards-chart__currency--usd"
            />
            <NetworkTab
              v-model:currentTab="currentTab"
              class="btc-tab"
              value="BTC"
              icon="btc"
              data-qa="rewards-chart__currency--btc"
            />
          </div>
          <div
            class="top__toggle-wrapper"
            data-qa="rewards-chart__expand-button"
            @click="isExpanded = true"
            @mouseenter="isToggleHovered = true"
            @mouseleave="isToggleHovered = false"
          >
            <toggleInfo :fill="isToggleHovered ? '#fff' : '#8B9BC7'" />
          </div>
        </div>
      </div>
      <div class="rewards-chart-inner-wrapper">
        <div class="rewards-chart-inner-wrapper__left">
          <RewardsChartItem
            v-for="(net, index) in netsPercents"
            :key="index"
            :item="net"
          />
        </div>
        <div class="rewards-chart-inner-wrapper__right">
          <div style="height: 100%">
            <canvas id="rewardsChart" :style="{ width: `${wrapperWidth}px` }" />
          </div>
          <resize-observer :show-trigger="true" @notify="handleResize" />
        </div>
      </div>
    </div>
  </div>
  <teleport to="body">
    <RewardsChartExpanded v-if="isExpanded" @close="isExpanded = false" />
  </teleport>
</template>
<script>
import { onMounted, watch, computed, nextTick, ref } from 'vue';
import { useStore } from 'vuex';
import BigNumber from 'bignumber.js';
import {
  renderRewardsChart,
  createDatasetForRewardsChart,
} from '@/components/Charts/rewardsChart';
import NetworkTab from '@/components/UI/NetworkTab';
import RewardsChartItem from '@/views/Overall/components/RewardsChart/RewardsChartItem';
import RewardsChartExpanded from '@/views/Overall/components/RewardsChart/RewardsChartExpanded';
import rewardsChartPlaceholder from '@/assets/icons/overall/rewards-chart-placeholder.svg';
import toggleInfo from '@/assets/icons/toggle-info.svg';
import useChart from '@/compositions/useChart';
import { useWindowSize } from 'vue-window-size';

const MAX_ITEMS_IN_PREVIEW = 5;

export default {
  name: 'RewardsChart',
  components: {
    RewardsChartExpanded,
    RewardsChartItem,
    rewardsChartPlaceholder,
    NetworkTab,
    toggleInfo,
  },
  setup() {
    const { width } = useWindowSize();
    const store = useStore();
    const wrapperWidth = ref();
    const handleResize = ({ width }) => {
      wrapperWidth.value = width;
    };
    const canvasElement = 'rewardsChart';
    const storeAction = 'charts/getRewardsChart';
    const storeGetter = 'charts/rewardsChart';
    const {
      info,
      currentTab,
      rewardsChart,
      datasetsArray,
      netsPercent,
      isExpanded,
      customList,
      isToggleHovered,
    } = useChart({
      canvasElement,
      storeAction,
      storeGetter,
      render: renderRewardsChart,
      showCount: MAX_ITEMS_IN_PREVIEW,
    });

    const netsPercents = computed(() => {
      const visible = netsPercent.value.slice(0, MAX_ITEMS_IN_PREVIEW);
      const others = netsPercent.value.slice(MAX_ITEMS_IN_PREVIEW);

      const othersItem = {
        name: 'Others',
        color: others[0]?.color,
        percent: others.reduce(
          (acc, net) => BigNumber(acc).plus(net.percent).toNumber(),
          0
        ),
      };

      if (othersItem.percent > 0) {
        visible.push(othersItem);
      }

      return visible;
    });

    onMounted(async () => {
      const { rewardsChart } = await store.dispatch(storeAction, {
        list: customList.value,
      });
      await renderRewardsChart(
        rewardsChart,
        createDatasetForRewardsChart(
          rewardsChart,
          currentTab.value,
          MAX_ITEMS_IN_PREVIEW
        ),
        currentTab.value,
        canvasElement,
        info.value
      );
    });
    watch(
      () => currentTab.value,
      async () => {
        await renderRewardsChart(
          rewardsChart.value,
          datasetsArray.value,
          currentTab.value,
          canvasElement,
          info.value
        );
      }
    );
    watch(
      () => customList.value,
      async () => {
        const { rewardsChart } = await store.dispatch(storeAction, {
          list: customList.value,
        });
        await renderRewardsChart(
          rewardsChart,
          createDatasetForRewardsChart(
            rewardsChart,
            currentTab.value,
            MAX_ITEMS_IN_PREVIEW
          ),
          currentTab.value,
          canvasElement,
          info.value
        );
      }
    );
    watch(
      () => width.value,
      async () => {
        nextTick(async () => {
          // const { rewardsChart } = await store.dispatch(storeAction, {
          //   list: customList.value,
          // });
          await renderRewardsChart(
            rewardsChart.value,
            createDatasetForRewardsChart(
              rewardsChart.value,
              currentTab.value,
              MAX_ITEMS_IN_PREVIEW
            ),
            currentTab.value,
            canvasElement,
            info.value
          );
        });
      }
    );

    return {
      currentTab,
      rewardsChart,
      isExpanded,
      isToggleHovered,
      netsPercents,
      handleResize,
      wrapperWidth,
    };
  },
};
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  //min-height: 700px;
  display: flex;
}

.rewards-chart-placeholder {
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
    margin-top: 33px;
  }
}

.rewards-chart-wrapper {
  //height: 390px;
  width: 100%;
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

.rewards-chart-inner-wrapper {
  display: flex;
  height: 390px;
  //overflow-y: scroll;
  //overflow-x: hidden;
  &__left {
    width: 181px;
    flex-shrink: 0;
    height: 100%;
    position: relative;
    overflow: scroll;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    @include lg {
      width: 124px;
    }
    @include md {
      width: 106px;
    }
  }

  &__right {
    flex-grow: 1;
    position: relative;
    height: 390px;
    padding-bottom: 20px;
    width: 100%;
  }
}
</style>
