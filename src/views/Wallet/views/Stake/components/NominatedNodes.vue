<template>
  <div class="nominated-nodes">
    <div class="nominated-nodes__title">
      {{ $t('polkadot.nominatedNodesTitle') }}
    </div>
    <ol class="nominated-nodes__list">
      <li
        v-for="(item, index) in selectedNode"
        :key="index"
        class="nominated-nodes__item"
      >
        {{ item.name }}
      </li>
    </ol>
  </div>
</template>
<script>
export default {
  name: 'NominatedNodes',
  props: {
    selectedNode: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>
<style scoped lang="scss">
.nominated-nodes {
  &__title {
    color: $blue;
    font-weight: 700;
    font-size: 14px;
  }
  &__item {
    color: $dark-blue;
    font-size: 14px;
  }
}
</style>
