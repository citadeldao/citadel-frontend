<template>
  <div v-if="content" :style="{ backgroundColor }" class="badge">
    <span>{{ content }}</span>
  </div>
</template>

<script>
export default {
  name: 'Badge',
  props: {
    content: {
      type: [String, Number],
    },
    backgroundColor: {
      type: String,
    },
  },
};
</script>

<style lang="scss" scoped>
.badge {
  position: absolute;
  top: -1px;
  right: -2px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: $round;
  @include md {
    top: -6px;
    right: -6px;
  }
  & span {
    font-size: 10px;
    line-height: 12px;
    color: $white;
  }
}
</style>
