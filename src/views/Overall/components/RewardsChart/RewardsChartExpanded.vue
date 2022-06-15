<template>
  <Modal @click.self="$emit('close')">
    <div class="rewards-chart-expanded">
      <div class="rewards-chart-expanded__top">
        <div class="rewards-chart-expanded__tittle">
          {{ $t('overallPage.rewardsChart.title') }}
        </div>
        <div class="rewards-chart-expanded__buttons">
          <div class="rewards-chart-expanded__network-tabs">
            <NetworkTab
              v-model:currentTab="currentTab"
              value="USD"
              icon="USD"
              data-qa="rewards-chart-modal__currency--usd"
            />
            <NetworkTab
              v-model:currentTab="currentTab"
              class="btc-tab"
              value="BTC"
              icon="btc"
              data-qa="rewards-chart-modal__currency--btc"
            />
          </div>
          <div
            class="rewards-chart-expanded__toggle-wrapper"
            data-qa="rewards-chart-modal__expand-button--hide"
            @click="$emit('close')"
            @mouseenter="isToggleHovered = true"
            @mouseleave="isToggleHovered = false"
          >
            <toggleInfoClose :fill="isToggleHovered ? '#fff' : '#8B9BC7'" />
          </div>
        </div>
      </div>
      <div class="rewards-chart-expanded__filter">
        <TabsGroup
          v-model:currentValue="currentFilterTab"
          :tabs="tabs"
          data-qa="rewards-chart-modal__period"
          @update:currentValue="currentFilterTabChangeRewardsChartHandler"
        />
        <div
          v-if="currentFilterTab === 'custom'"
          class="rewards-chart-expanded__date-picker"
        >
          <DatePicker @update:date="dateChangeHandler" />
        </div>
      </div>
      <div class="rewards-chart-expanded__main">
        <div class="rewards-chart-expanded__percent">
          <RewardsChartItem
            v-for="(net, index) in netsPercent"
            :key="index"
            :item="net"
          />
        </div>
        <div class="rewards-chart-expanded__chart">
          <canvas
            id="rewardsChartExpanded"
            class="rewards-chart-expanded__canvas"
          />
        </div>
      </div>
    </div>
  </Modal>
</template>
<script>
import { onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import useChart from '@/compositions/useChart';
import Modal from '@/components/Modal';
import NetworkTab from '@/components/UI/NetworkTab';
import TabsGroup from '@/components/UI/TabsGroup';
import DatePicker from '@/components/UI/DatePicker';
import {
  renderRewardsChart,
  createDatasetForRewardsChart,
} from '@/components/Charts/rewardsChart';
import RewardsChartItem from '@/views/Overall/components/RewardsChart/RewardsChartItem';
import toggleInfoClose from '@/assets/icons/toggle-info-close.svg';

export default {
  name: 'RewardsChartExpanded',
  components: {
    DatePicker,
    RewardsChartItem,
    TabsGroup,
    Modal,
    NetworkTab,
    toggleInfoClose,
  },
  setup() {
    const store = useStore();
    const canvasElement = 'rewardsChartExpanded';
    const storeAction = 'charts/getRewardsChart';
    const storeGetter = 'charts/rewardsChart';
    const {
      currentTab,
      currentFilterTab,
      info,
      tabs,
      rewardsChart,
      datasetsArray,
      netsPercent,
      customList,
      dateChangeHandler,
      currentFilterTabChangeRewardsChartHandler,
      isToggleHovered,
    } = useChart({
      canvasElement,
      storeAction,
      storeGetter,
      render: renderRewardsChart,
    });

    onMounted(async () => {
      const { rewardsChart } = await store.dispatch(storeAction, {
        list: customList.value,
      });
      renderRewardsChart(
        rewardsChart,
        createDatasetForRewardsChart(rewardsChart, currentTab.value),
        currentTab.value,
        canvasElement,
        info.value
      );
    });
    watch(
      () => currentTab.value,
      () => {
        renderRewardsChart(
          rewardsChart.value,
          datasetsArray.value,
          currentTab.value,
          canvasElement,
          info.value
        );
      }
    );
    watch(
      () => rewardsChart.value,
      () => {
        renderRewardsChart(
          rewardsChart.value,
          datasetsArray.value,
          currentTab.value,
          canvasElement,
          info.value
        );
      }
    );

    return {
      currentFilterTab,
      tabs,
      netsPercent,
      currentTab,
      currentFilterTabChangeRewardsChartHandler,
      dateChangeHandler,
      isToggleHovered,
    };
  },
};
</script>
<style lang="scss">
.rewards-chart-expanded {
  background: #fff;
  width: 1270px;
  padding: 43px 45px;
  box-shadow: 15px 15px 15px rgba(63, 54, 137, 0.2);
  border-radius: 16px;
  @include lg {
    width: 1000px;
  }
  @include md {
    width: 820px;
  }
  &__top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 26px;
  }
  &__filter {
    margin-bottom: 30px;
    display: flex;
  }
  &__date-picker {
    width: 220px;
    height: 68px;
    margin-left: 22px;
    @include lg {
      margin-left: 8px;
    }
    @include md {
      margin-left: 8px;
    }
  }
  &__tittle {
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
  &__main {
    display: flex;
  }
  &__percent {
    flex-basis: 181px;
    flex-shrink: 0;
    overflow: scroll;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    height: 335px;
    @include lg {
      flex-basis: 124px;
    }
    @include md {
      flex-basis: 101px;
    }
  }
  &__chart {
    height: 335px;
    flex-grow: 1;
    width: 100%;
    position: relative;
  }
  &__canvas {
    width: 100%;
  }
}
</style>
