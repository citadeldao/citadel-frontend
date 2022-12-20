<template>
  <div class="tabs">
    <div
      v-for="(item, ndx) in items"
      :key="ndx"
      :class="{ active: ndx === activeIndex }"
      class="tabs__item"
      @click="$emit('select', ndx)"
    >
      <span>{{ item }}</span>
      <div class="line" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'UITabs',
  props: {
    activeIndex: {
      required: true,
      type: Number,
    },
    items: {
      required: true,
      type: Array,
    },
  },
};
</script>
<style lang="scss" scoped>
.tabs {
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 2px solid #f0f3fd;

  &__item {
    display: flex;
    flex-direction: column;
    font-family: 'Panton_SemiBold';
    color: #afbccb;
    font-size: 14px;
    line-height: 30px;
    text-transform: uppercase;
    margin-right: 25px;
    cursor: pointer;
    position: relative;

    .line {
      width: 100%;
      height: 4px;
      background: transparent;
      position: absolute;
      left: 0;
      bottom: -2px;
    }

    &.active {
      color: #0a2778;

      .line {
        background: #0a2778;
      }
    }
  }
}
</style>
