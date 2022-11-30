<template>
  <div class="empty-list">
    <emptyListSvg />
    <div class="empty-list__title">{{ title }}</div>
  </div>
</template>
<script>
import emptyListSvg from '@/assets/icons/smile.svg';

export default {
  name: 'EmptyList',
  components: {
    emptyListSvg,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.empty-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &__title {
    margin-top: 26px;
    font-weight: 600;
    font-size: 18px;
    font-family: Panton_Regular;
    color: $mid-blue;
  }
}
</style>
