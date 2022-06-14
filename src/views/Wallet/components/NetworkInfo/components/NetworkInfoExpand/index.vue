<template>
  <div class="expand__wrap">
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
        <closeIcon />
        <closeIconHover id="hover" />
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
              v-model:currentValue="currentTab"
              class="chart__tabs"
              :tabs="tabs"
              expand
              data-qa="wallet__network-info-modal__period"
              @update:currentValue="currentTabChangeHandler"
            />
            <div v-if="currentTab === 'custom'" class="chart__date-picker">
              <DatePicker
                v-model:date="date"
                @update:date="dateChangeHandler"
              />
            </div>
          </div>
          <RateHistoryChart :data="currencyHistory" />
        </div>
      </div>
    </div>
    <!-- div class="expand__button">
      <PrimaryButton>
        Learn more
      </PrimaryButton>
    </div> -->
  </div>
</template>

<script>
import info from '@/assets/icons/info.svg';
// import PrimaryButton from '@/components/UI/PrimaryButton';
import DatePicker from '@/components/UI/DatePicker.vue';
import TabsGroup from '@/components/UI/TabsGroup';
import Socials from './components/Socials';
import { tabsList } from '@/static/dateTabs';
import { computed, ref } from 'vue';
import closeIcon from '@/assets/icons/network-info/constrict.svg';
import closeIconHover from '@/assets/icons/network-info/constrict-hover.svg';
import Tooltip from '@/components/UI/Tooltip';
import RateHistoryChart from './components/RateHistoryChart';
import { useStore } from 'vuex';
import moment from 'moment';
import { useI18n } from 'vue-i18n';
import notify from '@/plugins/notify';

export default {
  name: 'NetworkInfoExpand',
  components: {
    info,
    // PrimaryButton,
    DatePicker,
    TabsGroup,
    closeIcon,
    closeIconHover,
    Socials,
    Tooltip,
    RateHistoryChart,
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
    const currentTab = ref(1);
    const tabs = tabsList;
    const date = ref([]);
    const dateChangeHandler = ([from, to]) => {
      const timeZoneOffset = moment(from).utcOffset();
      const dateFrom = +moment(from).add(timeZoneOffset, 'minutes');
      const dateTo = +moment(to).add(timeZoneOffset, 'minutes');

      if (from || to) {
        if (dateFrom > dateTo) {
          notify({
            type: 'warning',
            text: 'Incorrect Date',
          });
        } else {
          loadData(dateFrom, dateTo);
        }
      }
    };
    const currentTabChangeHandler = (val) => {
      let newVal = val;

      if (val === 'all') {
        newVal = 36;
      }

      if (val !== 'custom') {
        date.value = [];
        loadData(Date.now() - 86400000 * 31 * newVal, Date.now());
      }
    };
    const currencyHistory = ref(null);
    const isLoading = ref(false);
    const loadData = async (from, to) => {
      isLoading.value = true;
      const data = await store.dispatch('networks/getCurrencyHistoryByRange', {
        from,
        to,
        net: props.currentWallet.net,
      });
      currencyHistory.value = data.data;
      isLoading.value = false;
    };
    loadData(Date.now() - 86400000 * 31 * currentTab.value, Date.now());

    const description = computed(() => {
      return te(`netInfo.${props.currentWallet.net}.description`)
        ? t(`netInfo.${props.currentWallet.net}.description`)
        : props.isCurrentToken
        ? ''
        : t(`netInfo.${props.currentWallet.net}.shortDescription`);
    });

    return {
      currentTab,
      tabs,
      date,
      dateChangeHandler,
      currentTabChangeHandler,
      currencyHistory,
      description,
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
    font-size: 30px;
    line-height: 30px;
    flex: 1 1 auto;
  }

  &__icon {
    height: auto;
    cursor: pointer;

    svg {
      display: block;
    }

    svg + #hover {
      display: none;
    }

    &:hover {
      svg:not(#hover) {
        display: none;
      }

      svg + #hover {
        display: block;
      }
    }
  }
}

.expand {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28px;
  }

  &__wrap {
    background: $white;
    padding: 45px;
    border-radius: 16px;
    max-height: 80vh;
    @include lg {
      padding: 37px;
    }
    @include md {
      padding: 37px;
    }

    .content__wrap {
      @include lg {
        height: calc(80vh - 90px - 81px);
        overflow-y: scroll;
      }
      @include md {
        height: calc(80vh - 90px - 81px);
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
      padding-right: 5px;
    }
    @include md {
      display: block;
      max-width: 728px;
      padding-right: 5px;
      margin-bottom: 24px;
    }
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

  &__tabs {
    width: 646px;
    @include lg {
      width: 480px;
    }
    @include md {
      width: 480px;
    }
  }

  &__date-picker {
    width: 220px;
    height: 68px;
    margin-left: 22px;
  }

  &__content {
    position: relative;
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
</style>
