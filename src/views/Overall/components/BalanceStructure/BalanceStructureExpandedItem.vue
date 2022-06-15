<template>
  <div class="item">
    <div class="item__dot-wrapper">
      <div class="item__dot" :style="{ 'background-color': item.color }" />
    </div>
    <div class="item__title-wrapper">
      <div class="item__title">
        {{ shortNameCrypto(item.name) }}
      </div>
    </div>
    <div class="item__percent-wrapper">
      <span v-pretty-number="item.percent.toFixed(2)" class="item__percent" />
      <span class="item__percent-sign">%</span>
    </div>
    <div class="item__bar-wrapper">
      <div
        class="item__bar"
        :style="{ 'background-color': item.color, 'flex-basis': `${percent}%` }"
      />
    </div>
    <div v-if="item.balance" class="item__balance-wrapper">
      <span
        v-pretty-number="{ value: item.balance, currency: item.code }"
        class="item__balance"
      />
      &nbsp;
      <span class="item__code">{{ item.code }}</span>
    </div>
    <span v-if="item.balance" class="item__balance-divider">/</span>
    <div class="item__balance-wrapper item__common-balance-wrapper">
      <span
        v-pretty-number="{ value: commonBalance, currency: currentTab }"
        class="item__balance"
      />
      &nbsp;
      <span class="item__code">{{ currentTab }}</span>
    </div>
  </div>
</template>
<script>
import { computed } from 'vue';
import BigNumber from 'bignumber.js';
import { shortNameCrypto } from '@/helpers';

export default {
  name: 'BalanceStructureExpandedItem',
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    currentTab: {
      type: String,
      default: 'USD',
    },
    maxPercent: {
      type: [String, Number],
      default: 100,
    },
  },
  setup(props) {
    const commonBalance = computed(() =>
      props.currentTab === 'BTC' ? props.item.btc : props.item.usd
    );
    const percent = computed(() => {
      const res = BigNumber(props.item.percent)
        .dividedBy(props.maxPercent)
        .multipliedBy(100)
        .toNumber();

      return res < 1 ? 1 : res;
    });

    return {
      shortNameCrypto,
      commonBalance,
      percent,
    };
  },
};
</script>
<style lang="scss" scoped>
.item {
  border-bottom: 1px dashed #bcc2d8;
  display: flex;
  align-items: center;
  margin-bottom: 34px;
  padding-bottom: 11px;
  font-size: 14px;

  &:last-child {
    margin-bottom: 0;
  }
  &__dot-wrapper {
    flex-basis: 17px;
    min-width: 17px;
  }
  &__dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
  &__title-wrapper {
    flex-basis: 90px;
  }
  &__title {
    font-weight: bold;
    color: $black;
  }
  &__percent-wrapper {
    flex-basis: 65px;
  }
  &__percent {
    color: $dark-blue;
    font-weight: 700;
  }
  &__percent-sign {
    font-weight: 400;
    color: $mid-gray;
  }
  &__bar-wrapper {
    flex-basis: 750px;
    display: flex;
    align-items: center;
    flex-shrink: 1;
    overflow: hidden;
    @include lg {
      flex-basis: 550px;
    }
    @include md {
      flex-basis: 420px;
    }
  }
  &__bar {
    //max-width: 670px;
    height: 8px;
    margin-right: 8%;
    //width: 100%;
    //@include lg {
    //  max-width: 535px;
    //}
    //@include md {
    //  max-width: 395px;
    //}
  }
  &__balance-wrapper {
    min-width: 90px;
    display: flex;
  }
  &__balance {
    color: $dark-blue;
    font-weight: bold;
  }
  &__code {
    //float: right;
    font-weight: 400;
    color: $mid-gray;
  }
  &__balance-divider {
    color: $mid-gray;
  }
  &__common-balance-wrapper {
    //justify-content: flex-end;
    margin-left: 36px;
    @include md {
      margin-left: 12px;
    }
  }
}
</style>
