<template>
  <Modal @click.self="$emit('close')">
    <div class="balance-history-expanded">
      <div class="balance-history-expanded__top">
        <div class="balance-history-expanded__tittle">
          {{ $t('overallPage.balanceHistory.title') }}
        </div>
        <div class="balance-history-expanded__buttons">
          <div class="balance-history-expanded__network-tabs">
            <NetworkTab
              v-model:currentTab="currentTab"
              value="USD"
              icon="USD"
              data-qa="balance-history-modal__currency--usd"
            />
            <NetworkTab
              v-model:currentTab="currentTab"
              class="btc-tab"
              value="BTC"
              icon="btc"
              data-qa="balance-history-modal__currency--btc"
            />
          </div>
          <div
            class="balance-history-expanded__toggle-wrapper"
            data-qa="balance-history-modal__expand-button--hide"
            @click="$emit('close')"
            @mouseenter="isToggleHovered = true"
            @mouseleave="isToggleHovered = false"
          >
            <toggleInfoClose :fill="isToggleHovered ? '#fff' : '#8B9BC7'" />
          </div>
        </div>
      </div>
      <div class="balance-history-expanded__filter">
        <TabsGroup
          v-model:currentValue="currentFilterTab"
          :tabs="tabs"
          data-qa="balance-history-modal__period"
          @update:currentValue="currentFilterTabChangeBalanceHistoryHandler"
        />
        <div
          v-if="currentFilterTab === 'custom'"
          class="balance-history-expanded__date-picker"
        >
          <DatePicker @update:date="dateChangeHandler" />
        </div>
      </div>
      <div class="balance-history-expanded__chart">
        <canvas
          id="balanceHistoryChartExpanded"
          class="balance-history-expanded__canvas"
        />
      </div>
    </div>
  </Modal>
</template>
<script>
import Modal from '@/components/Modal';
import NetworkTab from '@/components/UI/NetworkTab';
import toggleInfoClose from '@/assets/icons/toggle-info-close.svg';
import { onMounted, watch } from 'vue';
import { renderBalanceHistoryChart } from '@/components/Charts/balanceHistoryChart';
import DatePicker from '@/components/UI/DatePicker';
import useChart from '@/compositions/useChart';
import TabsGroup from '@/components/UI/TabsGroup';
export default {
  name: 'BalanceHistoryExpanded',
  components: {
    DatePicker,
    TabsGroup,
    Modal,
    NetworkTab,
    toggleInfoClose,
  },
  setup() {
    const canvasElement = 'balanceHistoryChartExpanded';
    const storeAction = 'charts/getBalanceHistory';
    const storeGetter = 'charts/balanceHistory';
    const {
      currentFilterTab,
      tabs,
      currentTab,
      balanceHistory,
      dateChangeHandler,
      currentFilterTabChangeBalanceHistoryHandler,
      isToggleHovered,
    } = useChart({
      canvasElement,
      storeAction,
      storeGetter,
      render: renderBalanceHistoryChart,
    });

    onMounted(() => {
      renderBalanceHistoryChart(
        balanceHistory.value,
        currentTab.value,
        canvasElement
      );
    });
    watch(
      () => currentTab.value,
      (crntTab) => {
        renderBalanceHistoryChart(balanceHistory.value, crntTab, canvasElement);
      }
    );
    watch(
      () => balanceHistory.value,
      () =>
        renderBalanceHistoryChart(
          balanceHistory.value,
          currentTab.value,
          canvasElement
        )
    );

    return {
      currentTab,
      currentFilterTab,
      currentFilterTabChangeBalanceHistoryHandler,
      tabs,
      dateChangeHandler,
      isToggleHovered,
    };
  },
};
</script>
<style lang="scss">
.balance-history-expanded {
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
    background: rgba(0, 0, 0, 0.05);
    border-radius: 50%;
    margin-left: 17px;
    cursor: pointer;
    &:hover {
      background: $royalblue1;
    }
  }
  &__chart {
    height: 335px;
    width: 100%;
    position: relative;
  }
  &__canvas {
    width: 100%;
    cursor: pointer;
  }
}
</style>
