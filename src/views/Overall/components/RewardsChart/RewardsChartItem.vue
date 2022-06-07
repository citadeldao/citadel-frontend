<template>
  <div class="rewards-chart-item">
    <div class="rewards-chart-item__left">
      <div
        class="rewards-chart-item__circle"
        :style="{'background-color': item.color}"
      />
    </div>
    <div class="rewards-chart-item__right">
      <div class="rewards-chart-item__name">
        {{ item.name }}
      </div>
      <div class="rewards-chart-item__percent">
        {{ prettyNumber(item.percent) }}
        <span>%</span>
      </div>
    </div>
  </div>
</template>
<script>
import { prettyNumber } from '@/helpers/prettyNumber';
export default {
  name: 'RewardsChartItem',
  props: {
    item: Object,
  },
  setup() {
    return { prettyNumber };
  },
};
</script>
<style lang="scss" scoped>
.rewards-chart-item {
  margin-bottom: 20px;
  display: flex;
  &__left {
    margin-right: 13px;
  }
  &__circle {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-top: 5px;
  }
  &__name {
    font-weight: 600;
    font-size: 14px;
    color: $black;
    margin-bottom: 5px;
  }
  &__percent {
    font-weight: 700;
    font-size: 14px;
    color: $dark-blue;
  }
}
</style>