<template>
  <Modal @click.self="$emit('close')">
    <div class="chart-expanded">
      <div class="chart-expanded__top">
        <div class="chart-expanded__title">
          {{ $t(`overallPage.${canvasId}.title`) }}
        </div>

        <div class="chart-expanded__buttons">
          <div class="chart-expanded__network-tabs">
            <NetworkTab
              v-model:currentTab="currentTab"
              value="USD"
              icon="USD"
              :data-qa="`${nameExpanded}-modal__currency--usd`"
            />
            <NetworkTab
              v-model:currentTab="currentTab"
              class="btc-tab"
              value="BTC"
              icon="btc"
              :data-qa="`${nameExpanded}-modal__currency--btc`"
            />
          </div>
          <div
            class="chart-expanded__toggle-wrapper"
            :data-qa="`${nameExpanded}-modal__expand-button--hide`"
            @click="$emit('close')"
            @mouseenter="isToggleHovered = true"
            @mouseleave="isToggleHovered = false"
          >
            <toggleInfoClose :fill="isToggleHovered ? '#fff' : '#8B9BC7'" />
          </div>
        </div>
      </div>

      <div class="chart-expanded__filter">
        <TabsGroup
          v-model:currentValue="currentFilterTab"
          :tabs="tabs"
          :data-qa="`${nameExpanded}-modal__period`"
          @update:currentValue="filterTabChangeHandler"
        />
        <div
          v-if="currentFilterTab === 'custom'"
          class="chart-expanded__date-picker"
        >
          <DatePicker @update:date="dateChangeHandler" />
        </div>
      </div>

      <ChartPlaceholder v-if="placeholder.show" :text="placeholder.text" />

      <div class="chart-expanded-rendered" v-show="!placeholder.show">
        <div class="chart-expanded__chart">
          <canvas :id="canvasIdExpanded" class="chart-expanded__canvas" />
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import { useStore } from 'vuex';
import { onMounted, watch, computed } from 'vue';

import DatePicker from '@/components/UI/DatePicker';
import TabsGroup from '@/components/UI/TabsGroup';
import NetworkTab from '@/components/UI/NetworkTab';

import Modal from '@/components/Modal';

import useChart from '@/compositions/useChart';

import toggleInfoClose from '@/assets/icons/toggle-info-close.svg';

import ChartPlaceholder from '@/views/Overall/components/Placeholder';

import { getPlaceholderStatus } from '@/helpers/placeholder';

export default {
  name: 'ChartExpanded',

  props: {
    name: {
      type: String,
      default: 'rewards',
    },
    nameExpanded: {
      type: String,
      default: 'rewards-expanded',
    },
    action: {
      type: String,
      default: 'charts/fetchChartData',
    },
    getter: {
      type: String,
      default: 'charts/getCharts',
    },
    canvasId: {
      type: String,
      default: 'rewardsChart',
    },
    canvasIdExpanded: {
      type: String,
      default: 'rewardsChartExpanded',
    },
    loading: {
      type: String,
      default: 'charts/isLoading',
    },
    icon: {
      type: String,
      default: 'rewards-chart-placeholder',
    },
    renderer: {
      type: Function,
    },
  },

  components: {
    DatePicker,
    TabsGroup,
    Modal,
    NetworkTab,
    toggleInfoClose,
    ChartPlaceholder,
  },
  setup(props) {
    const store = useStore();

    const {
      currentTab,
      currentFilterTab,
      info,
      tabs,
      chartData,
      customList,
      dateChangeHandler,
      filterTabChangeHandler,
      isToggleHovered,
    } = useChart({
      canvasElement: props.canvasIdExpanded,
      storeAction: props.action,
      storeGetter: props.getter,
      render: props.renderer,
    });

    const callChartRender = async (data) => {
      await props.renderer(data, currentTab.value, props.canvasIdExpanded, {
        currency: info.value,
      });
    };

    const sendStoreAction = async () => {
      const { data } = await store.dispatch(props.action, {
        list: customList.value,
        target: props.canvasIdExpanded,
      });

      await callChartRender(data);
    };

    onMounted(async () => {
      await sendStoreAction();
    });

    watch(
      () => currentTab.value,
      async (selectedTab) => {
        await props.renderer(
          chartData.value,
          selectedTab,
          props.canvasIdExpanded,
          {
            currency: info.value,
            showCount: undefined,
          }
        );
      }
    );

    watch(
      () => customList.value,
      async () => sendStoreAction()
    );

    const isLoading = computed(() =>
      store.getters[props.loading](props.canvasIdExpanded)
    );

    const placeholder = computed(() =>
      getPlaceholderStatus(
        props.canvasIdExpanded,
        isLoading.value,
        currentFilterTab.value,
        chartData.value
      )
    );

    return {
      currentTab,
      currentFilterTab,
      filterTabChangeHandler,
      tabs,
      dateChangeHandler,
      isToggleHovered,
      placeholder,
    };
  },
};
</script>
<style lang="scss">
.chart-expanded {
  background: $white;
  width: 1270px;
  padding: 43px 45px;
  box-shadow: 15px 15px 15px rgba(63, 54, 137, 0.2);
  border-radius: 16px;

  @include lg {
    width: 1000px;
  }

  @include laptop {
    width: 750px;
  }

  &__top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 26px;
  }

  &__filter {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
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

  &__title {
    font-family: 'Panton_Bold';
    font-style: normal;
    font-weight: 700;
    font-size: $h5-size;
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
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    canvas {
      height: 100%;
    }
  }

  &__canvas {
    width: 100%;
    height: 100%;
  }

  &-rendered {
    position: relative;

    width: 100%;

    min-height: 200px;
    height: 410px !important;

    &__text {
      margin-top: 33px;
    }

    @include md {
      height: 350px !important;
    }

    @include laptop {
      height: 300px !important;
    }
  }
  .chart-placeholder {
    height: 350px;
  }
}

body.dark {
  .chart-expanded {
    background: $dark-panel-bg;

    &__title {
      color: $white;
    }
  }
}
</style>
