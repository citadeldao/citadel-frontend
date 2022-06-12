<template>
  <div class="hardware-addresses-modal">
    <div class="hardware-addresses-modal__list">
      <AssignAddressItem
        v-for="(item,index) in list"
        :key="`${item.address}${item.net}${index}`"
        :address="item"
        type="hardware"
        @signHardwareAddress="signHardwareAddress"
      />
    </div>
  </div>
</template>

<script>
import AssignAddressItem from './AssignAddressItem.vue';
export default {
  name: 'HardwareAddressesModal',
  components: { AssignAddressItem },
  props: {
    list: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['signHardwareAddress'],
  setup(props, { emit }) {
    const signHardwareAddress = (address)=> {
      emit('signHardwareAddress', address);
    };

    return { signHardwareAddress };
  },
};
</script>

<style lang="scss" scoped>
.hardware-addresses-modal{
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 8px 0 0 0;
    &__list{
         max-height: 300px;
        padding-right: 10px;
        overflow-y: auto;
        overflow-x: hidden;
    }
}
</style>