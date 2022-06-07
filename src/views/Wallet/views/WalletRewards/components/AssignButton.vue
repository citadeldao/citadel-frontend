<template>
  <button
    class="assign-button"
    :class="type"
    @click="$emit('click')"
  >
    <div class="assign-button__addresses-amount">
      <span>{{ amount }}</span>
    </div>
    <span
      class="assign-button__text"
      v-html="$t(type === 'assigned' ? 'xct.assignedAddressesBtn' : 'xct.unAssignedAddressesBtn')"
    />
  </button>
</template>

<script>
export default {
  name: 'AssignButton',
  props: {
    amount: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      default: '',
    },
  },
  emits: ['click'],
  setup() {},
};
</script>

<style lang="scss" scoped>
.assign-button {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px dashed transparent;
  padding: 8px 11px 8px 9px;
  min-width: 140px;
  &__addresses-amount {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 7px;
    & span {
      font-size: 20px;
      line-height: 20px;
      font-family: "Panton_Bold";
    }
  }
  &__text {
    font-size: 14px;
    line-height: 16px;
    text-align: left;
    font-family: "Panton_SemiBold";
  }
}
.assigned {
  background: $white;
  border-color: $ligth-blue;
  .assign-button__addresses-amount {
    background: $ligth-blue;
    & span {
      color: $white;
    }
  }
  .assign-button__text {
    color: $ligth-blue;
  }
  &:hover {
    background: $ligth-blue;
    border-color: $ligth-blue;
    .assign-button__addresses-amount {
      background: $white;
      & span {
        color: $ligth-blue;
      }
    }
    .assign-button__text {
      color: $white;
    }
  }
}
.unassigned {
  background: $white;
  border-color: $red;
  .assign-button__addresses-amount {
    background: $red;
    & span {
      color: $white;
    }
  }
  .assign-button__text {
    color: $red;
  }
  &:hover {
    background: $red;
    border-color: $red;
    .assign-button__addresses-amount {
      background: $white;
      & span {
        color: $red;
      }
    }
    .assign-button__text {
      color: $white;
    }
  }
}
</style>