<template>
  <div class="total-for-range">
    <span class="total-for-range__title">
      {{ $t("rewardsPage.periodRewards") }}
    </span>
    <div class="total-for-range__line" />
    <div class="total-for-range__value">
      <span
        v-pretty-number="{ value: total, currency }"
        class="total-for-range__value-value"
      />
      <span class="total-for-range__value-currency">{{ currency }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TotalForRange',
  props: {
    total: {
      type: [String, Number],
      default: 0,
    },
    currency: {
      type: String,
      default: '$',
    },
  },
  setup() {},
};
</script>

<style lang="scss" scoped>
.total-for-range {
  width: 100%;
  background-image: $blue-gradient;
  height: 68px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 0px 19px 0px 20px;
  // margin-bottom: 24px;
  @include lg {
    border-radius: 4px;
    // margin-bottom: 16px;
    height: 50px;
    padding: 0px 16px 0px 16px;
  }
  @include md {
    // margin-bottom: 16px;
    height: 50px;
    padding: 0px 16px 0px 16px;
    border-radius: 4px;
  }
  &__title {
    font-size: 22px;
    line-height: 26px;
    letter-spacing: -0.02em;
    color: $white;
    font-family: "Panton_Bold";
    @include lg {
      font-size: 18px;
      line-height: 22px;
    }
    @include md {
      font-size: 18px;
      line-height: 22px;
    }
  }
  &__line {
    flex: 1;
    border-bottom: 1px solid $dark-blue;
    margin-left: 17px;
    margin-right: 10px;
  }
  &__value {
    display: flex;
    align-items: center;
  }
  &__value-value,
  &__value-currency {
    font-size: 22px;
    line-height: 26px;
    letter-spacing: -0.02em;
    color: $white;
    font-family: "Panton_Bold" !important;
    margin-right: 3px;
    @include lg {
      font-size: 18px;
      line-height: 22px;
    }
    @include md {
      font-size: 18px;
      line-height: 22px;
    }
  }
  &__value-currency {
    font-family: "Panton_Regular" !important;
    margin-right: 0px;
  }
}
</style>