<template>
  <div class="total-rewards">
    <div class="total-rewards__info">
      <span class="total-rewards__title">{{
        $t("rewardsPage.totalRewards")
      }}</span>
      <div class="total-rewards__usd-rewards">
        <span class="total-rewards__usd-rewards-currency">$</span>
        <span
          v-pretty-number="{ value: totalUsd,currency: '$'}"
          class="total-rewards__usd-rewards-amount"
        />
      </div>
    </div>
    <hotSale />
    <div class="total-rewards__btc-rewards">
      <span
        v-pretty-number="{ value: totalBtc,currency: 'BTC'}"
        class="total-rewards__btc-rewards-amount"
      />
      <span class="total-rewards__btc-rewards-currency">BTC</span>
    </div>
  </div>
</template>

<script>
import hotSale from '@/assets/icons/hot-sale.svg';
export default {
  name: 'TotalRewards',
  components: { hotSale },
  props: {
    totalBtc: {
      type: [Number, String],
      default: 0,
    },
    totalUsd: {
      type: [Number, String],
      default: 0,
    },
  },
  setup() {},
};
</script>

<style lang="scss" scoped>
.total-rewards {
  width: 100%;
  height: 100%;
  display: flex;
  background: $paleturquoise1;
  border-radius: 16px;
  padding: 8px 12px 8px 23px;
  justify-content: space-between;
  position: relative;
  @include lg {
    flex-direction: column;
    justify-content: initial;
  }
  @include md {
    flex-direction: column;
    justify-content: initial;
  }
  & svg {
    display: none;
    fill: $powderblue;
    @include xl {
      display: initial;
    }
  }
  &__info {
    display: flex;
    flex-direction: column;
    margin-top: 15px;
    margin-bottom: 4px;
  }
  &__title {
    font-size: 18px;
    line-height: 22px;
    color: $too-dark-blue;
    font-family: "Panton_Bold";
    margin-bottom: 11px;
  }
  &__usd-rewards {
    display: flex;
    align-items: center;
  }
  &__usd-rewards-currency,
  &__usd-rewards-amount {
    margin-right: 3px;
    font-size: 28px;
    line-height: 34px;
    font-family: "Panton_Bold" !important;
    @include lg {
      font-size: 20px;
      line-height: 24px;
    }
    @include md {
      font-size: 20px;
      line-height: 24px;
    }
  }
  &__usd-rewards-amount {
    color: $blue;
    margin-right: 0;
  }
  &__btc-rewards {
    display: flex;
    align-items: center;
    position: absolute;
    right: 31px;
    bottom: 28px;
    @include lg {
      position: initial;
    }
    @include md {
      position: initial;
    }
  }
  &__btc-rewards-amount,
  &__btc-rewards-currency {
    font-size: 16px;
    line-height: 19px;
    color: $blue;
    opacity: 0.8;
    margin-right: 3px;
    @include lg {
      font-size: 14px;
      line-height: 17px;
    }
    @include md {
      font-size: 14px;
      line-height: 17px;
    }
  }
  &__btc-rewards-currency {
    color: $black;
    margin-right: 0;
  }
}
</style>

