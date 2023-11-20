<template>
  <div class="tabs-group" :class="{ expand }">
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
  border-radius: 16px;
  padding: 8px;

  width: fit-content;

  @include laptop {
    border-radius: 8px;
  }

  &__item {
    width: 100px;
    height: 52px;

    display: flex;
    align-items: center;
    justify-content: center;

    background: $white;

    border-radius: 8px;
    cursor: pointer;

    &:not(:last-child) {
      margin-right: 8px;

      @include md {
        margin-right: 4px;
      }
    }

    @include laptop-standard {
      width: 60px;
    }

    @include laptop {
      width: 43px;
      height: 42px;
      border-radius: 4px;
    }

    &:hover {
      background: $blue;
      .tabs-group__item-label {
        color: $white;
      }
    }
  }
  &__item-label {
    font-size: $default-size;
    line-height: 19px;
    color: $mid-blue;
    font-family: 'Panton_SemiBold';

    @include laptop-standard {
      font-size: $small-x;
      line-height: 14px;
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
  // width: 100%;
  .tabs-group {
    // border-radius: 16px;
    &__item {
      width: 60px;
      // height: 52px;
      // width: 100%;
      // border-radius: 8px;

      // &:not(:last-child) {
      //   margin-right: 8px;
      //   @include md {
      //     margin-right: 8px;
      //   }
      // }

      // @include md {
      //   height: 52px;
      //   width: 100%;
      // }
    }
    &__item-label {
      font-size: $small-x;
      line-height: 14px;
      // @include md {
      //   font-size: $default-size;
      //   line-height: 19px;
      // }
    }
  }
}

body.dark {
  .tabs-group {
    background: #000;

    &__item {
      background: #2d2e42;
      color: #6b93c0;

      &.active {
        background: #54478f;
        color: $white;
      }
    }
  }
}
</style>
