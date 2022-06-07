<template>
  <div class="items">
    <div class="staking-amount">
      {{ $t('stakingAmount') }}
      <span>
        <span
          v-pretty-number="currentWallet?.balance?.stake"
          class="staking-amount__value"
        />
        <span class="staking-amount__code">
          {{ currentWallet?.code }}
        </span>
      </span>
    </div>
    <div class="items__wrapper">
      <div
        v-for="(item, index) in list"
        :key="index"
        class="item"
      >
        <div class="item__upper">
          {{ item.name }}
        </div>
        <div class="item__lower">
          {{ $t('fee') }}:
          <span class="item__red">
            {{ item.fee }}
          </span>
          <span class="item__percent">
            %
          </span>
        </div>
      </div>
    </div>
    <div
      v-if="showEditButton"
      class="items__edit-button"
    >
      <EditButton @click="$emit('showNodesList')">
        {{ $t('changeValidators') }}
      </EditButton>
    </div>
  </div>
</template>
<script>
import EditButton from '@/components/UI/EditButton';
export default {
  name: 'PolkadotUnstakeListItems',
  components:{ EditButton },
  props: {
    list: {
      type: Array,
      default: () => ([]),
    },
    currentWallet: {
      type: Object,
      default: () => ({}),
    },
    showEditButton: {
      type: Boolean,
      default: false,
    },
  },
  emits:['showNodesList'],
  setup() {

  },
};
</script>
<style lang="scss" scoped>
.items {
  width: 100%;
  border: 1px solid $too-ligth-blue;
  border-radius: 8px;
  padding: 16px 16px 0px 16px;
  margin-bottom: 21px;

  &__wrapper{
    display: flex;
    flex-wrap: wrap;
    max-height: 113px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  &__edit-button{
    margin-bottom: 14px;
    display: flex;
    justify-content: center;
  }
}

.item {
  margin-bottom: 13px;
  width: 25%;
  &__upper {
    color: $blue;
    margin-bottom: 4px;
    font-size: 14px;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  &__lower {
    font-size: 12px;
    color: $mid-gray;
  }
  &__red {
    color: $red;
  }
  &__percent {
    color: $black;
    font-weight: 300;
  }
}
.staking-amount {
  border-bottom: 1px dashed $lightsteelblue;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 17px;
  font-weight: 700;
  padding-bottom: 17px;
  &__value {
    color: $dark-blue;
  }
  &__code {
    font-weight: 400;
  }
}
</style>
