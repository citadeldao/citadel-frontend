<template>
  <div class="stake-chart">
    <div
      v-for="(item, index) in chartData"
      :key="item.name"
      class="stake-chart__part-wrapper"
      :style="{
        width: `${item.share}%`,
        background: nextColor(index),
        minWidth: minWidth(item),
      }"
    >
      <div
        class="stake-chart__part"
        :style="{ background: item.color }"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'StakeChart',
  props: {
    chartData: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const nextColor = (index) => {
      if (index + 1 <= props.chartData.length - 1) {
        if (props.chartData[index + 1].share > 0) {
          return props.chartData[index + 1].color;
        }

        return '';
      }

      return '';
    };
    const minWidth = (item) => {
      if (item.share > 0) {
        return '7px';
      }

      return '';
    };

    return { nextColor, minWidth };
  },
};
</script>

<style lang="scss" scoped>
.stake-chart {
  background: #f0f3fd;
  border-radius: 4px;
  height: 20px;
  display: flex;
  &__part-wrapper {
    display: flex;
    &:first-child {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
      & div {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }
    }
    &:last-child{
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
       & div {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }
    }
  }
  &__part {
    width: 100%;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
}
</style>