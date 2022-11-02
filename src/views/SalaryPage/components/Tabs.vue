<template>
  <div class="salary-tabs">
    <div
      v-for="(item, ndx) in items"
      :key="ndx"
      :class="{ active: activeIndex === ndx }"
      class="salary-tabs__item"
      @click="$emit('changeTab', ndx)"
    >
      {{ item.title }}
    </div>
  </div>
</template>
<script>
export default {
  name: 'SalaryTabs',
  props: {
    items: {
      type: Array,
      required: true,
    },
    activeIndex: {
      required: true,
      type: Number,
    },
  },
};
</script>
<style lang="scss" scoped>
.salary-tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;

  &__item {
    box-sizing: border-box;
    border-radius: 8px;
    padding: 5px 8px;
    color: $mid-blue;
    border: 1px solid $mid-blue;
    min-width: 80px;
    height: 35px;
    display: flex;
    margin-left: 10px;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;

    &.active {
      background: $mid-blue;
      color: $white;
    }

    &:hover {
      cursor: pointer;
      opacity: 0.3;
    }
  }
}
</style>
