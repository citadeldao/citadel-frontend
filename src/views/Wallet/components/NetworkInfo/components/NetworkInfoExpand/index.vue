<template>
  <div class="expand__wrap">
    <!-- <div v-if="isLoading" class="loader">
      <Loading />
    </div> -->

    <div class="expand__header">
      <div class="header__title">
        {{ currentWallet.name }} {{ $t('Network') }}
      </div>

      <!-- Ссылки на соцсети сеток для 1280 px -->
      <Socials :socials="socials" class="socials-lg" />

      <div
        class="header__icon"
        data-qa="wallet__network-info-modal__expand-button"
        @click="$emit('close', $event)"
      >
        <constrictIcon class="constrict__icon" />
      </div>
    </div>

    <div id="expand-rate-chart-wrap" class="content__wrap">
      <div class="expand__content">
        <div class="left-section">
          <!-- Ссылки на соцсети сеток для 1920 px -->
          <Socials :socials="socials" class="socials" />
          <div class="marketcaps">
            <div v-if="marketcap.marketCap" class="marketcaps__item">
              <div class="item__text">
                {{ $t('netInfoGeneral.marketcap') }}
              </div>
              <div class="item__info">
                <Tooltip>
                  <template #content>
                    <span :style="{ maxWidth: '200px', display: 'flex' }">
                      {{ $t('netInfoGeneral.marketcapTooltip') }}
                    </span>
                  </template>
                  <template #default>
                    <info />
                  </template>
                </Tooltip>
              </div>
              <div class="item__line" />
              <div class="item__number">
                $
                <span
                  v-pretty-number="{
                    value: marketcap.marketCap,
                    currency: 'USD',
                  }"
                />
              </div>
            </div>
            <div v-if="marketcap.circulatingSupply" class="marketcaps__item">
              <div class="item__text">
                {{ $t('netInfoGeneral.supply') }}
              </div>
              <div class="item__info">
                <Tooltip>
                  <template #content>
                    <span :style="{ maxWidth: '200px', display: 'flex' }">
                      {{ $t('netInfoGeneral.supplyTooltip') }}
                    </span>
                  </template>
                  <template #default>
                    <info />
                  </template>
                </Tooltip>
              </div>
              <div class="item__line" />
              <div class="item__number">
                <span
                  v-pretty-number="{
                    value: marketcap.circulatingSupply,
                    currency: currentWallet.code,
                  }"
                />
                {{ currentWallet.code }}
              </div>
            </div>
            <div
              v-if="marketcap.hasOwnProperty('volumeDelta24Usd')"
              class="marketcaps__item"
            >
              <div class="item__text">
                {{ $t('netInfoGeneral.dayTradingVol') }}
              </div>
              <div class="item__info">
                <Tooltip>
                  <template #content>
                    <span :style="{ maxWidth: '200px', display: 'flex' }">
                      {{ $t('netInfoGeneral.dayTradingVolTooltip') }}
                    </span>
                  </template>
                  <template #default>
                    <info />
                  </template>
                </Tooltip>
              </div>
              <div class="item__line" />
              <div class="item__number">
                $
                <span
                  v-pretty-number="{
                    value: marketcap.volumeDelta24Usd,
                    currency: 'USD',
                  }"
                />
              </div>
            </div>
            <div v-if="marketcap.stakingRate" class="marketcaps__item">
              <div class="item__text">
                {{ $t('netInfoGeneral.staked') }}
              </div>
              <div class="item__info">
                <Tooltip>
                  <template #content>
                    <span :style="{ maxWidth: '200px', display: 'flex' }">
                      {{ $t('netInfoGeneral.stakedTooltip') }}
                    </span>
                  </template>
                  <template #default>
                    <info />
                  </template>
                </Tooltip>
              </div>
              <div class="item__line" />
              <div class="item__number">
                <span
                  v-pretty-number="{
                    value: marketcap.stakingRate,
                    currency: '%',
                  }"
                />
                %
              </div>
            </div>
            <div v-if="marketcap.inflation" class="marketcaps__item">
              <div class="item__text">
                {{ $t('netInfoGeneral.inflation') }}
              </div>
              <div class="item__info">
                <Tooltip>
                  <template #content>
                    <span :style="{ maxWidth: '200px', display: 'flex' }">
                      {{ $t('netInfoGeneral.inflationTooltip') }}
                    </span>
                  </template>
                  <template #default>
                    <info />
                  </template>
                </Tooltip>
              </div>
              <div class="item__line" />
              <div class="item__number">
                <span
                  v-pretty-number="{
                    value: marketcap.inflation,
                    currency: '%',
                  }"
                />
                %
              </div>
            </div>
          </div>
          <div class="description">
            {{ description }}
          </div>
        </div>
        <div class="chart">
          <div class="chart__title">
            {{ currentWallet.code }} {{ $t('netInfoGeneral.priceChart') }}
          </div>
          <div class="chart__controls">
            <TabsGroup
              v-model:currentValue="currentFilterTab"
              class="chart__tabs"
              :tabs="tabs"
              expand
              data-qa="wallet__network-info-modal__period"
              @update:currentValue="filterTabChangeHandler"
            />
            <div
              v-if="currentFilterTab === 'custom'"
              class="chart__date-picker"
            >
              <DatePicker @update:date="dateChangeHandler" />
            </div>
          </div>
          <ChartPlaceholder v-if="placeholder.show" :text="placeholder.text" />

          <div class="chart-rendered" v-show="!placeholder.show">
            <div class="chart__chart">
              <canvas :id="canvasId" class="chart__canvas" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChartPlaceholder from '@/views/Overall/components/Placeholder';
import { getPlaceholderStatus } from '@/helpers/placeholder';
import useChart from '@/compositions/useChart';
import { renderBalanceHistoryChart as renderRateHistoryChart } from '@/components/Charts/balanceHistoryChart';

import info from '@/assets/icons/info.svg';
import DatePicker from '@/components/UI/DatePicker.vue';
import TabsGroup from '@/components/UI/TabsGroup';
import Socials from './components/Socials';
import { computed, onMounted, ref } from 'vue';
import constrictIcon from '@/assets/icons/network-info/constrict.svg';
import Tooltip from '@/components/UI/Tooltip';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
// import ExpandInfoPlaceholder from './components/ExpandPlaceholder.vue';

export default {
  name: 'NetworkInfoExpand',
  components: {
    ChartPlaceholder,
    info,
    DatePicker,
    TabsGroup,
    constrictIcon,
    Socials,
    Tooltip,
    // ExpandInfoPlaceholder,
  },
  props: {
    currentWallet: {
      type: Object,
      default: () => ({}),
    },
    isCurrentToken: {
      type: Boolean,
      default: false,
    },
    socials: {
      type: Object,
      default: () => ({}),
    },
    marketcap: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['close'],
  setup(props) {
    const store = useStore();
    const { t, te } = useI18n();
    const date = ref([]);

    const description = computed(() => {
      const description = te(`netInfo.${props.currentWallet.net}.description`)
        ? t(`netInfo.${props.currentWallet.net}.description`)
        : props.isCurrentToken
        ? ''
        : t(`netInfo.${props.currentWallet.net}.shortDescription`);

      return description.includes('netInfo') ? '' : description;
    });

    const canvasId = ref('rateHistory');
    const action = ref('charts/fetchChartData');
    const getter = ref('charts/getCharts');
    const loading = ref('charts/isLoading');

    const {
      currentFilterTab,
      info,
      tabs,
      chartData,
      dateChangeHandler,
      filterTabChangeHandler,
    } = useChart({
      canvasElement: canvasId.value,
      storeAction: action.value,
      storeGetter: getter.value,
      render: renderRateHistoryChart,
      noCurrency: true,
    });

    const callChartRender = async (data) => {
      await renderRateHistoryChart(data, null, canvasId.value, {
        currency: info.value,
      });
    };

    const sendStoreAction = async () => {
      const { data } = await store.dispatch(action.value, {
        net: props.currentWallet.net,
        target: canvasId.value,
      });

      await callChartRender(data);
    };

    onMounted(async () => {
      await sendStoreAction();
    });

    const isLoading = computed(() =>
      store.getters[loading.value](canvasId.value)
    );

    const placeholder = computed(() =>
      getPlaceholderStatus(
        canvasId.value,
        isLoading.value,
        currentFilterTab.value,
        chartData.value
      )
    );

    return {
      canvasId,
      currentFilterTab,
      tabs,
      date,
      dateChangeHandler,
      filterTabChangeHandler,
      description,
      isLoading,
      placeholder,
    };
  },
};
</script>

<style lang="scss" scoped>
.socials {
  &-lg {
    display: none;
  }

  @include lg {
    display: none;
    &-lg {
      display: flex;
    }
  }
  @include md {
    display: none;
    &-lg {
      display: flex;
    }
  }
}

.header {
  &__title {
    margin-right: 15px;
    font-weight: 700;
    font-size: $h2-size;
    line-height: 30px;
    flex: 1 1 auto;

    @include laptop-standard {
      font-size: $h4-size;
    }
  }

  &__icon {
    margin-left: auto;
    height: auto;
    cursor: pointer;
  }
}

.expand {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28px;
    padding-left: 45px;
    padding-right: 45px;
    @include lg {
      padding-left: 37px;
      padding-right: 37px;
    }
    @include md {
      padding-left: 37px;
      padding-right: 37px;
    }
  }

  &__wrap {
    position: relative;
    min-width: 600px;
    max-width: 1440px;

    background: $white;
    padding: 45px 0;
    border-radius: 16px;

    min-height: 200px;
    max-height: 80vh;

    @include lg {
      padding: 37px 0;
    }
    @include md {
      padding: 37px 0;
    }

    .content__wrap {
      padding-left: 45px;
      padding-right: 45px;

      @include lg {
        padding-left: 37px;
        padding-right: 37px;
        height: calc(80vh - 80px - 81px);
        overflow-y: scroll;
      }
      @include md {
        padding-left: 37px;
        padding-right: 37px;
        height: calc(80vh - 80px - 81px);
        overflow-y: scroll;
      }
    }
  }

  &__button {
    display: none;
  }

  &__content {
    display: flex;
    @include lg {
      display: block;
      max-width: 728px;
      // padding-right: 5px;
    }
    @include md {
      display: block;
      max-width: 728px;
      // padding-right: 5px;
      // margin-bottom: 24px;
    }
  }

  &__border::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 15px;
    background: $dark-blue;
    border-radius: 16px 16px 0px 0px;
  }
}

.chart {
  &__title {
    font-weight: 700;
    font-size: 20px;
    line-height: 30px;
    margin-bottom: 19px;
  }

  &__controls {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 39px;
  }

  // &__tabs {
  //   width: 646px;
  //   @include lg {
  //     width: 480px;
  //   }
  //   @include md {
  //     width: 480px;
  //   }
  // }

  // &__date-picker {
  //   width: 220px;
  //   height: 68px;
  //   margin-left: 22px;
  // }

  &__date-picker {
    width: 220px;
    // height: 68px;
    margin-left: 22px;

    @include lg {
      margin-left: 8px;
    }

    @include md {
      margin-left: 8px;
    }
  }

  &__content {
    position: relative;
  }
  &-rendered {
    position: relative;

    width: 100%;

    height: 300px;
    // height: 410px !important;

    &__text {
      margin-top: 33px;
    }

    // @include md {
    //   height: 350px !important;
    // }

    // @include laptop {
    //   height: 300px !important;
    // }
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
}

.marketcaps {
  margin-bottom: 27px;

  &__item {
    display: flex;
    align-items: center;
    margin-bottom: 11px;

    & svg {
      &:hover {
        fill: $too-dark-blue;
      }
    }
  }
}

.description {
  margin-bottom: 34px;
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
  color: $mid-gray;
}

.item {
  &__text {
    margin-right: 5px;
  }

  &__info {
    height: 14px;
    margin-right: 5px;
  }

  &__line {
    border-bottom: 1px dashed $gainsboro;
    flex: 1 1 auto;
    height: 10px;
    margin-right: 5px;
  }

  &__number {
    font-weight: 600;

    & span {
      color: $ligth-blue;
    }
  }
}

.left-section {
  width: 484px;
  margin-right: 45px;
  @include lg {
    width: 100%;
    margin: 0 auto 24px;
  }
  @include md {
    width: 100%;
    margin: 0 auto 24px;
  }
}

.loader {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba($black, 0.2);
  border-radius: 16px;
}
.chart-placeholder {
  min-height: 300px;
  margin-bottom: 1px;
  height: 300px;
}
</style>
