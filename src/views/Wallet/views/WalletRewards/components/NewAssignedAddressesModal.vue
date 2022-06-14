<template>
  <div class="new-assigned-addresses-modal">
    <div class="new-assigned-addresses-modal__bcs-address">
      <span class="new-assigned-addresses-modal__bcs-address-title">
        {{ $t('bscAddress') }}:
      </span>
      <span class="new-assigned-addresses-modal__bcs-address-address">
        {{ currentWallet.address }}
      </span>
    </div>
    <span class="new-assigned-addresses-modal__assigned-addresses">
      {{ $t("xct.assignedAddresses") }}
    </span>
    <div class="new-assigned-addresses-modal__list">
      <AssignAddressItem
        v-for="(item,index) in list"
        :key="`${item.address}${item.net}${index}`"
        :address="item"
        type="newAssigned"
      />
    </div>
  </div>
</template>

<script>
import AssignAddressItem from './AssignAddressItem.vue';
export default {
  name: 'NewAssignedAddressesModal',
  components: { AssignAddressItem },
  props: {
    currentWallet: {
      type: Object,
      default: () => ({}),
    },
    list: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {

  },
};
</script>

<style lang="scss" scoped>
.new-assigned-addresses-modal{
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 16px 0 0 0;
    &__bcs-address{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
    }
    &__bcs-address-title,
    &__bcs-address-address{
        font-size: 14px;
        line-height: 30px;
        color: $gray;
    }
    &__bcs-address-address{
        color: $black;
    }
    &__assigned-addresses{
        font-size: 16px;
        line-height: 19px;
        color: $gray;
        margin-bottom: 17px;
    }
    &__list{
        max-height: 300px;
        padding-right: 10px;
        overflow-y: auto;
        overflow-x: hidden;
    }

}
</style>