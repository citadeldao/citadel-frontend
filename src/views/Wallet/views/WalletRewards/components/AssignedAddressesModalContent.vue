<template>
  <div class="assigned-addresses-modal-content">
    <span class="assigned-addresses-modal-content__list-counter">
      <span class="assigned-addresses-modal-content__list-counter-value">
        {{ counterValue }}
      </span>
      {{ $t('xct.assignedAddresses') }}
    </span>
    <div class="assigned-addresses-modal-content__list">
      <AssignAddressItem
        v-for="(item, index) in list"
        :key="`${item.address}${item.net}${index}`"
        :address="item"
        type="assigned"
      />
    </div>
  </div>
</template>

<script>
import AssignAddressItem from './AssignAddressItem.vue';
import { computed } from '@vue/runtime-core';
export default {
  name: 'AssignedAddressesModalContent',
  components: { AssignAddressItem },
  props: {
    list: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const counterValue = computed(() => props.list.length);

    return { counterValue };
  },
};
</script>

<style lang="scss" scoped>
.assigned-addresses-modal-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 22px 0 0 0;
  &__list-counter {
    font-size: 16px;
    line-height: 19px;
    color: $ligth-blue;
    margin-bottom: 17px;
  }
  &__list-counter-value {
    font-family: 'Panton_Bold';
  }
  &__list {
    max-height: 300px;
    padding-right: 10px;
    overflow-y: auto;
    overflow-x: hidden;
  }
}
</style>
