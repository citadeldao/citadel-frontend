<template>
  <img v-if="isLoading" src="@/assets/gif/loader.gif" alt="" />
  <div v-else class="xct-calculator-expand">
    <div class="xct-calculator-expand__close-icon" @click="closeHandler">
      <constrictIcon class="constrict__icon" />
    </div>
    <div class="xct-calculator-expand__header">
      <span class="xct-calculator-expand__header-title">
        {{ $t('calculator.expandTitle') }}
      </span>
      <span class="xct-calculator-expand__header-subtitle">
        {{ $t('calculator.expandSubtitle') }}
      </span>
    </div>
    <div class="xct-calculator-expand__controls">
      <TabsGroup
        v-model:currentValue="currentTab"
        class="xct-calculator-expand__tabs"
        :tabs="tabs"
      />
    </div>
    <div class="xct-calculator-expand__list">
      <CalculatorListItem
        v-for="(item, index) in data"
        :key="`${item.name}-${index}-${item.activeTokens}-${item.totalTokens}`"
        :data="item"
        :current-tab="currentTab"
        @change="changeHandler"
      />
    </div>
    <div class="xct-calculator-expand__total">
      <span class="xct-calculator-expand__total-title">
        {{ $t('totalAmount') }}:
      </span>
      <div class="xct-calculator-expand__total-amount">
        <span
          v-pretty-number="{ value: total, currency: 'XCT' }"
          class="xct-calculator-expand__total-value"
        />
        <span class="xct-calculator-expand__total-currency"> XCT </span>
      </div>
    </div>
  </div>
</template>

<script>
import CalculatorListItem from './components/CalculatorListItem.vue';
import constrictIcon from '@/assets/icons/network-info/constrict.svg';
import TabsGroup from '@/components/UI/TabsGroup';
import { tabsListWithDays, tabsListWithDaysMd } from '@/static/dateTabs';
import { computed, reactive, ref } from '@vue/reactivity';
import { useWindowSize } from 'vue-window-size';
import { screenWidths } from '@/config/sreenWidthThresholds';
import { useStore } from 'vuex';
import BigNumber from 'bignumber.js';
import { onMounted } from '@vue/runtime-core';
import { OUR_TOKEN } from '@/config/walletType';
export default {
  name: 'XCTCalculatorExpand',
  components: { constrictIcon, TabsGroup, CalculatorListItem },
  props: {
    currentToken: {
      type: [Object, null],
      default: null,
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const isLoading = ref(false);
    const currentTab = ref(7);
    const store = useStore();
    const { width } = useWindowSize();
    const tabs = computed(() =>
      width.value < screenWidths.lg ? tabsListWithDaysMd : tabsListWithDays
    );
    onMounted(async () => {
      for (const key in totalData) {
        delete totalData[key];
      }

      await loadData();
    });
    const loadData = async () => {
      isLoading.value = true;
      await store.dispatch('dao/getCalculatorData', {
        walletId: props.currentToken.id,
      });
      isLoading.value = false;
    };

    const networks = computed(() => store.getters['networks/networksList']);
    const data = computed(() =>
      Object.keys(store.getters['dao/calculatorData']).map((i) => {
        const info =
          i === OUR_TOKEN
            ? { name: 'XCT', net: OUR_TOKEN, code: 'XCT', icon: 'citadel' }
            : {
                ...networks.value.find((network) => network.net === i),
                icon: i,
              };

        return {
          ...info,
          ...store.getters['dao/calculatorData'][i],
        };
      })
    );

    const totalData = reactive({});
    const changeHandler = ({ value, net }) => {
      totalData[net] = value;
    };
    const total = computed(() =>
      Object.values(totalData).reduce(
        (accum, item) => BigNumber(accum).plus(item).toNumber(),
        0
      )
    );
    const closeHandler = () => {
      emit('close');

      for (const key in totalData) {
        delete totalData[key];
      }
    };

    return {
      currentTab,
      tabs,
      isLoading,
      data,
      changeHandler,
      totalData,
      total,
      closeHandler,
    };
  },
};
</script>

<style lang="scss" scoped>
.xct-calculator-expand {
  width: 812px;
  max-height: 90%;
  display: flex;
  flex-direction: column;
  position: relative;
  background: $white;
  padding: 48px 0 35px 0;
  box-shadow: 15px 15px 15px rgba(63, 54, 137, 0.2);
  border-radius: 16px;
  @include md {
    width: 568px;
    padding: 21px 0 20px 0;
  }
  &__close-icon {
    height: auto;
    cursor: pointer;
    position: absolute;
    top: 45px;
    right: 43px;
    @include md {
      top: 20px;
      right: 24px;
    }
  }
  &__header {
    display: flex;
    flex-direction: column;
    margin: 0 45px 20px 45px;
    @include md {
      margin: 0 24px 15px 24px;
    }
  }
  &__header-title {
    font-size: 20px;
    line-height: 30px;
    font-family: 'Panton_Bold';
    @include md {
      margin-bottom: 4px;
      font-size: 16px;
      line-height: 19px;
    }
  }
  &__header-subtitle {
    font-size: 14px;
    line-height: 17px;
    color: $mid-blue;
  }
  &__controls {
    display: flex;
    justify-content: flex-start;
    margin: 0 45px 24px 45px;
    @include md {
      margin: 0 24px 16px 24px;
    }
  }
  &__tabs {
    margin-right: 16px;
    @include lg {
      margin-right: 8px;
    }
    @include md {
      margin-right: 13px;
    }
  }
  &__list {
    overflow-x: hidden;
    overflow-y: auto;
    padding: 0 31px 0 45px;
    margin: 0 10px 31px 0;
    @include md {
      padding: 0 10px 0 24px;
      margin-bottom: 16px;
    }
  }
  &__total {
    padding-top: 22px;
    border-top: 1px solid $lightsteelblue;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 45px 0 45px;
    @include md {
      padding-top: 13px;
      margin: 0 24px 0 24px;
    }
  }
  &__total-title {
    font-size: 18px;
    line-height: 22px;
    font-family: 'Panton_Bold';
    @include md {
      font-size: 16px;
      line-height: 19px;
    }
  }
  &__total-amount {
    display: flex;
    align-items: center;
  }
  &__total-value,
  &__total-currency {
    font-size: 18px;
    line-height: 22px;
    color: $mid-gray;
    @include md {
      font-size: 16px;
      line-height: 19px;
    }
  }
  &__total-value {
    margin-right: 3px;
    font-family: 'Panton_Bold' !important;
    color: $dark-blue;
  }
}
</style>
