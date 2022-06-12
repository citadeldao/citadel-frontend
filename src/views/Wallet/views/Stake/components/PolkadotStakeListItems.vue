<template>
  <div class="stake-list-items">
    <div class="stake-list-items__wrapper">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="stake-list-items__item"
      >
        <div class="stake-list-items__item-title">
          {{ item.name }} {{ item.address }}
        </div>
        <div class="stake-list-items__item-info">
          {{ $t('fee') }}: <span class="stake-list-items__red">{{ item.fee }}</span>
        </div>
      </div>
    </div>

    <div class="staking-amount">
      {{ $t('stakingAmount') }}
      <div class="staking-amount__section-wrapper">
        <span
          v-pretty-number="currentWallet?.balance?.stake"
          class="staking-amount__value"
        />
        <span class="staking-amount__code">
          {{ currentWallet?.code }}
        </span>
        <div class="staking-amount__button">
          <EditButton @click="$emit('showNodesList')">
            {{ $t('settings.changeEmail.button') }}
          </EditButton>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import EditButton from '@/components/UI/EditButton';
export default {
  components: { EditButton },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    currentWallet: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['showNodesList'],
};
</script>
<style lang="scss" scoped>
.stake-list-items {
  width: 100%;
  border: 1px solid $too-ligth-blue;
  padding: 13px 17px;
  border-radius: 8px;
  &__wrapper{
     max-height: 148px;
     overflow-y: auto;
  }

  &__item {
    display: flex;
    flex-direction: column;
    background: $ultralightblue;
    border-left: 3px solid $blue;
    padding: 7px 10px;
    margin-bottom: 8px;
    &:last-child {
      margin-bottom: 0px;
    }
    // height: 50px;
  }
  &__item-title {
    font-size: 14px;
    font-weight: 400;
    color: $blue;
  }
  &__item-info {
    font-weight: 400;
    font-size: 12px;
    color: $mid-gray;
    margin-top: 4px;
  }
  &__red {
    font-weight: 700;
    color: $red;
  }
}
.staking-amount {
  &__section-wrapper{
    display: flex;
    align-items: center;
  }
  border-top: 1px dashed $lightsteelblue;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 17px;
  font-weight: 700;
  padding-top: 17px;
  &__value {
    color: $dark-blue;
    margin-right: 3px;
  }
  &__code {
    font-weight: 400;
  }
  &__button{
    margin-left: 16px;
  }
}
</style>
