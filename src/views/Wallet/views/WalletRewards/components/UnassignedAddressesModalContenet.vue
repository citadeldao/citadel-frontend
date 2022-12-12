<template>
  <div class="unassigned-addresses-modal-content">
    <span class="unassigned-addresses-modal-content__list-counter">
      <span>
        <span class="unassigned-addresses-modal-content__list-counter-value">
          {{ checkedAddresses.length }}
        </span>
        {{ $t('customLists.walletsCountTitle') }}
      </span>
      <span class="select-all" @click="checkAll">{{
        $t('settings.addresses.selectAll')
      }}</span>
    </span>
    <div class="unassigned-addresses-modal-content__list">
      <AssignAddressItem
        v-for="(item, index) in list"
        :key="`${item.address}${item.net}${index}`"
        :address="item"
        :checked="checked(item)"
        @check="addItem"
        @uncheck="removeItem"
      />
    </div>
  </div>
</template>

<script>
import AssignAddressItem from './AssignAddressItem.vue';
import { inject } from '@vue/runtime-core';
import { findAddressWithNet } from '@/helpers';
export default {
  name: 'UnassignedAddressesModalContenet',
  components: { AssignAddressItem },
  props: {
    list: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const checkedAddresses = inject('checkedAddresses');
    const updateCheckedAddresses = inject('updateCheckedAddresses');

    const checked = (item) =>
      !!findAddressWithNet(checkedAddresses.value, item);

    const addItem = (item) => {
      checkedAddresses.value.push(item);
      updateCheckedAddresses(checkedAddresses.value);
    };

    const removeItem = (item) => {
      (checkedAddresses.value = checkedAddresses.value.filter(
        ({ address, net }) =>
          !(
            address.toLowerCase() === item.address.toLowerCase() &&
            net === item.net
          )
      )),
        updateCheckedAddresses(checkedAddresses.value);
    };
    const checkAll = () => {
      let list = props.list;
      for (const key in list.filter(
        (listItem) =>
          checkedAddresses.value.findIndex(
            (chkdAdrs) => chkdAdrs.id === listItem.id
          ) === -1
      )) {
        if (Object.hasOwnProperty.call(list, key)) {
          addItem(list[key]);
        }
      }
    };
    return { checked, checkAll, addItem, removeItem, checkedAddresses };
  },
};
</script>

<style lang="scss" scoped>
.unassigned-addresses-modal-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 22px 0 0 0;
  &__list-counter {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    line-height: 19px;
    color: $blue;
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
.select-all {
  cursor: pointer;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  color: #00a3ff;
  border-bottom: 1px dashed #00a3ff;
}
</style>
