<template>
  <div
    class="tabs-group"
    :class="{ expand }"
  >
    <div
      v-for="item in tabs"
      :key="item.value"
      class="tabs-group__item"
      :class="{ active: currentValue === item.value }"
      :data-qa="dataQa && `${dataQa}--${item.value}`"
      @click="$emit('update:currentValue', item.value)"
    >
      <span class="tabs-group__item-label">{{ item.label }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabsGroup',
  props: {
    tabs: {
      type: Array,
      default: () => [],
    },
    currentValue: {
      type: [String, Number],
    },
    expand: {
      type: Boolean,
      default: false,
    },
    dataQa: {
      type: [String, null],
      default: null,
    },
  },
  emits: ['update:currentValue'],
  setup() {},
};
</script>

<style lang="scss" scoped>
.tabs-group {
  display: flex;
  background: $too-ligth-gray;
  border-radius: 8px;
  padding: 8px;
  width: fit-content;
  &__item {
    width: 100px;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $white;
    border-radius: 8px;
    margin-right: 8px;
    cursor: pointer;
    @include lg {
      width: 60px;
      margin-right: 4px;
    }
     @include md {
      width: 43px;
      height: 42px;
      margin-right: 4px;
      border-radius: 4px;
    }

    &:last-child {
      margin-right: 0px;
    }
    &:hover {
      background: $blue;
      .tabs-group__item-label {
        color: $white;
      }
    }
  }
  &__item-label {
    font-size: 16px;
    line-height: 19px;
    color: $mid-blue;
    font-family: 'Panton_SemiBold';
    @include lg {
      font-size: 12px;
      line-height: 14px;
    }
    @include md {
      font-size: 11px;
      line-height: 13px;
    }
  }
}
.active {
  background: $ligth-blue;
  .tabs-group__item-label {
    color: $white;
  }
  &:hover {
    background: $ligth-blue;
    .tabs-group__item-label {
      color: $white;
    }
  }
}

.expand {
  width: 100%;
  .tabs-group {
    &__item {
      height: 52px;
      width: 100%;
      @include lg {
        height: 52px;
        width: 100%;
        margin-right: 8px;
      }
      @include md {
        height: 52px;
        width: 100%;
        margin-right: 8px;
      }
    }
    &__item-label {
      @include lg {
        font-size: 16px;
        line-height: 19px;
      }
      @include md {
        font-size: 16px;
        line-height: 19px;
      }
    }
  }
}
</style>
