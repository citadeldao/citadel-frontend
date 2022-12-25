<template>
  <div class="min-balance-warning">
    <keep-alive>
      <component :is="currentIcon" class="min-balance-warning__icon" />
    </keep-alive>
    <span class="min-balance-warning__content" v-html="content"> </span>
  </div>
</template>

<script>
import { markRaw, ref } from '@vue/reactivity';
export default {
  name: 'MinBalanceWarning',
  props: {
    icon: {
      type: String,
    },
    content: {
      type: String,
    },
  },
  setup(props) {
    const currentIcon = ref();

    import(`@/assets/icons/${props.icon}.svg`).then((val) => {
      currentIcon.value = markRaw(val.default);
    });
    return { currentIcon };
  },
};
</script>

<style lang="scss" scoped>
.min-balance-warning {
  background: $ligth-red;
  border-radius: 10px;
  padding: 16px;
  display: flex;
  align-items: center;
  &__icon {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    margin: 9px;
  }
  &__content {
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
    color: $red;
  }
}
</style>
