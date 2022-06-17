<template>
  <div
    id="tooltip-history-chart"
    class="tooltip-history-chart"
    :style="{ top: `${top}px`, left: `${left}px`, opacity }"
  >
    <div class="tooltip-history-chart__wrap">
      <div class="tooltip-history-chart__title">Price</div>
      <div class="tooltip-history-chart__date">
        {{ date }}
      </div>
      <div class="tooltip-history-chart__value">
        <div
          v-pretty-number="{ value: data, currency: 'USD' }"
          class="tooltip-history-chart__number"
        />
        <div class="tooltip-history-chart__currency">USD</div>
      </div>
    </div>
    <!-- <div class="tooltip-history-chart__line-top line"></div> -->
    <div class="tooltip-history-chart__line-middle line" />
    <div
      class="tooltip-history-chart__line-bottom line"
      :style="{ height: lineHeight }"
    />
  </div>
</template>
<script>
// import { ref } from 'vue';

export default {
  name: 'ExChartTooltip',
  props: {
    data: {
      type: [Number, String],
      default: 0,
    },
    date: {
      type: String,
      default: '',
    },
    opacity: {
      type: [Number, String],
      default: 0,
    },
    top: {
      type: [Number, String],
      default: 0,
    },
    left: {
      type: [Number, String],
      default: 0,
    },
    lineHeight: {
      type: [Number, String],
      default: 0,
    },
  },
};
</script>

<style lang="scss" scoped>
.tooltip-history-chart {
  &__wrap {
    padding: 13px;
  }
  opacity: 0;
  display: inline-block;
  position: absolute;
  pointer-events: none;
  background: $white;
  min-width: 90px;
  transition: none;
  transition: opacity 0.3s;

  box-shadow: 0px 15px 50px rgba(80, 100, 124, 0.1),
    0px 10px 15px rgba(80, 100, 124, 0.15);
  border-radius: 6px;
  z-index: 1000;
  font-size: 12px;
  &::after {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 50%;
    bottom: -4px;
    transform: rotate(45deg);
    margin-left: -5px;
    border-radius: 2px;
    width: 10px;
    height: 10px;
    background: $white;
  }

  &__title {
    font-weight: 400;
    line-height: 12px;
    margin-bottom: 7px;
    color: $gray2;
  }

  &__date {
    color: #59779a;
    font-weight: 400;
    margin-bottom: 5px;
    font-size: 10px;
  }
  &__value {
    display: flex;
  }
  &__number {
    color: $dark-blue;
    font-weight: 700;
    margin-right: 5px;
  }
  &__currency {
  }
  &__line-top {
    height: 20px;
    top: -20px;
  }
  &__line-middle {
    height: 15px;
  }
  &__line-bottom {
    top: calc(100% + 35px);
  }
  .line {
    position: absolute;
    width: 2px;
    background: $dark-blue;
    transition: none;
    transition: opacity 0.3s;
    left: calc(50% - 1px);
  }
}
</style>
