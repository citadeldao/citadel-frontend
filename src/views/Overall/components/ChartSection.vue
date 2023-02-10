<template>
  <div class="chart-container">
    <ChartPlaceholder
      v-if="placeholder.show"
      :text="placeholder.text"
      :icon="icon"
    />

    <div v-show="!placeholder.show" class="chart-wrapper">
      <TopPanel :title="canvasId">
        <template v-slot:tabs>
          <NetworkTab
            v-model:currentTab="currentTab"
            value="USD"
            icon="USD"
            :data-qa="`${name}__currency--usd`"
          />
          <NetworkTab
            v-model:currentTab="currentTab"
            class="btc-tab"
            value="BTC"
            icon="btc"
            :data-qa="`${name}__currency--btn`"
          />
        </template>

        <template v-slot:expand>
          <div
            class="top__toggle-wrapper"
            :data-qa="`${name}-chart__expand-button`"
            @click="isExpanded = true"
            @mouseenter="isToggleHovered = true"
            @mouseleave="isToggleHovered = false"
          >
            <ToggleIcon :fill="isToggleHovered ? '#fff' : '#8B9BC7'" />
          </div>
        </template>
      </TopPanel>

      <div class="chart-rendered">
        <div class="chart__container">
          <canvas :id="canvasId" class="chart-rendered__canvas" />
        </div>
      </div>
    </div>
  </div>
  <teleport to="body">
    <ChartExpanded
      v-if="isExpanded"
      @close="isExpanded = false"
      v-bind="expandedData"
    />
  </teleport>
</template>

<script>
import { useStore } from 'vuex';
import { onMounted, watch, computed } from 'vue';

import useChart from '@/compositions/useChart';

import NetworkTab from '@/components/UI/NetworkTab';

import TopPanel from '@/views/Overall/components/TopPanel';
import ChartPlaceholder from '@/views/Overall/components/Placeholder';
import ChartExpanded from '@/views/Overall/components/ChartExpanded';

import ToggleIcon from '@/assets/icons/toggle-info.svg';

import { getPlaceholderStatus } from '@/helpers/placeholder';

export default {
  name: 'ChartSection',

  props: {
    name: {
      type: String,
      default: 'rewards',
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
    ChartExpanded,
    ChartPlaceholder,
    NetworkTab,
    ToggleIcon,
    TopPanel,
  },
  setup(props) {
    const MAX_ITEMS_IN_PREVIEW = 5;

    const store = useStore();

    const expandedData = {
      ...props,
      canvasIdExpanded: `${props.canvasId}Expanded`,
      nameExpanded: `${props.canvasId}-expanded`,
    };

    const {
      info,
      currentTab,
      chartData,
      isExpanded,
      customList,
      isToggleHovered,
    } = useChart({
      canvasElement: props.canvasId,
      storeAction: props.action,
      storeGetter: props.getter,
      render: props.renderer,
      showCount: MAX_ITEMS_IN_PREVIEW,
    });

    const isLoading = computed(() =>
      store.getters[props.loading](props.canvasId)
    );

    const placeholder = computed(() =>
      getPlaceholderStatus(props.canvasId, isLoading.value, 1, chartData.value)
    );

    const callChartRender = (data) => {
      props.renderer(data, currentTab.value, props.canvasId, {
        currency: info.value,
        showCount: MAX_ITEMS_IN_PREVIEW,
      });
    };

    const sendStoreAction = async () => {
      const { data } = await store.dispatch(props.action, {
        list: customList.value,
        target: props.canvasId,
      });
      callChartRender(data);
    };

    onMounted(async () => await sendStoreAction());

    watch(
      () => currentTab.value,
      () => {
        props.renderer(chartData.value, currentTab.value, props.canvasId, {
          currency: info.value,
          showCount: MAX_ITEMS_IN_PREVIEW,
        });
      }
    );

    watch(
      () => customList.value,
      async () => await sendStoreAction()
    );

    return {
      currentTab,
      chartData,
      isExpanded,
      isToggleHovered,
      // netsPercents,
      isLoading,
      placeholder,
      expandedData,
    };
  },
};
</script>
<style lang="scss" scoped>
.chart {
  &-container {
    display: flex;
    min-height: 400px;
    height: 480px;
    width: 100%;

    @include md {
      height: 300px;
      min-height: 300px;
    }

    @include laptop {
      height: 250px;
      min-height: 250px;
    }
  }

  &-wrapper {
    width: 100%;
    height: 390px;
  }

  &__container {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
  }

  &-rendered {
    position: relative;
    width: 100%;
    min-height: 200px;

    &__canvas {
      width: 100% !important;
      cursor: pointer;
      height: 400px !important;

      @include md {
        height: 350px !important;
      }

      @include laptop {
        height: 300px !important;
      }
    }
  }
}
</style>
