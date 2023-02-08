<template>
  <div class="chart-placeholder">
    <keep-alive>
      <component :is="currentIcon" />
    </keep-alive>
    <span class="chart-placeholder__text">
      {{ $t(`overallPage.${isLoading ? 'loading' : text}`) }}
    </span>
  </div>
</template>
<script>
import { ref, markRaw } from 'vue';

export default {
  name: 'ChartPlaceholder',
  props: {
    icon: {
      type: String,
      default: 'rewards-chart-placeholder',
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: 'noRewards',
    },
  },
  setup(props) {
    const currentIcon = ref();
    import(`@/assets/icons/overall/${props.icon}.svg`).then((val) => {
      currentIcon.value = markRaw(val.default);
    });

    return {
      currentIcon,
    };
  },
};
</script>
<style lang="scss" scoped>
.chart-placeholder {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  width: 100%;

  min-height: 200px;
  border-radius: 25px;

  font-size: $h6-size;
  border: 1px solid $too-ligth-blue;

  color: $too-ligth-blue;

  min-height: 410px;
  height: 100%;
  &__text {
    margin-top: 33px;
  }

  @include laptop-standard {
    min-height: 380px;
  }
}
</style>
