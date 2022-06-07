<template>
  <div
    class="dropdown"
    :class="{ opened: isOpen }"
  >
    <div
      class="dropdown__title"
      @click="clickHandler"
    >
      <div class="title__icon">
        <component :is="currentIcon" />
      </div>
      <div class="title__text">
        {{ data.name }}
      </div>
      <div class="title__line" />
      <div class="title__rigth-section">
        <div class="title__value">
          <span
            v-pretty-number="{ value: total, currency: data.code }"
            class="title__value-amount"
          />
          <span class="title__value-currency">{{ data.code }}</span>
        </div>
        <div
          v-if="!opened"
          class="title__vertical-line"
        />
        <div
          v-if="!opened"
          class="title__arrow"
        >
          <arrowUp v-if="isOpen" />
          <arrowDown v-else />
        </div>
      </div>
    </div>
    <transition name="fade">
      <div
        v-show="isOpen"
        class="dropdown__items"
      >
        <div
          v-for="(item, index) in data.rewards"
          :key="`${index}${item.value}${item.address}`"
          class="dropdown__item"
        >
          <DropdownItem
            :reward="item"
            :currency="data.code"
            opened
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import arrowUp from '@/assets/icons/arrow-up.svg';
import arrowDown from '@/assets/icons/arrow-down.svg';
import DropdownItem from './DropdownItem';
import BigNumber from 'bignumber.js';
import { ref, markRaw, computed } from 'vue';
export default {
  name: 'Dropdown',
  components: { DropdownItem, arrowUp, arrowDown },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    opened: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const isOpen = ref(props.opened);
    const currentIcon = ref();
    if (props.data) {
      import(`@/assets/icons/networks/${props.data.net}.svg`).then((val) => {
        currentIcon.value = markRaw(val.default);
      });
    }
    const clickHandler = () => {
      if (props.opened){
        return;
      }
      isOpen.value = !isOpen.value;
    };
    const total = computed(() =>
      props.data.rewards.reduce(
        (total, currentValue) =>
          BigNumber(total).plus(currentValue.value).toNumber(),
        0,
      ),
    );

    return { currentIcon, isOpen, clickHandler, total };
  },
};
</script>

<style lang="scss" scoped>
.dropdown {
  @include lg {
    margin-top: 3px;
    &:first-child {
      margin-top: 0px;
    }
  }
  @include md {
    margin-top: 3px;
    &:first-child {
      margin-top: 0px;
    }
  }
  &__title {
    display: flex;
    align-items: center;
    cursor: pointer;
    height: 68px;
    width: 100%;
    margin-bottom: 16px;
    background: $white;
    box-shadow: 0px 0px 15px rgba(80, 100, 124, 0.45);
    border-radius: 8px;
    padding-left: 9px;
    padding-right: 24px;
    @include lg {
      margin-bottom: 13px;
      border-radius: 4px;
      height: 50px;
      padding-left: 8px;
      padding-right: 12px;
    }
    @include md {
      border-radius: 4px;
      height: 40px;
      padding-left: 8px;
      padding-right: 12px;
      margin-bottom: 8px;
    }
  }

  &__items {
    margin-top: 4px;
    margin-bottom: 28px;
    @include lg {
      margin-top: 0px;
      margin-bottom: 13px;
    }
    @include md {
      margin-top: 0;
      margin-bottom: 13px;
    }
  }
  &__item {
    margin-bottom: 20px;
    @include lg {
      margin-bottom: 13px;
    }
    @include md {
      margin-bottom: 13px;
    }
    &:last-child {
      margin-bottom: 0px;
    }
  }
  .title {
    &__icon {
      width: 50px;
      height: 50px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: $blue;
      @include lg {
        border-radius: 4px;
        width: 34px;
        height: 34px;
      }
      @include md {
        border-radius: 4px;
        width: 24px;
        height: 24px;
      }
      & svg {
        fill: white;
        height: 24px;
        @include lg {
          height: 18px;
        }
        @include md {
          height: 12px;
        }
      }
    }
    &__text {
      margin-left: 15px;
      margin-right: 22px;
      font-size: 22px;
      font-family: "Panton_Bold";
      line-height: 26px;
      @include lg {
        margin-left: 7px;
        margin-right: 7px;
        font-size: 18px;
        line-height: 22px;
      }
      @include md {
        margin-left: 7px;
        margin-right: 7px;
        font-size: 14px;
        line-height: 17px;
      }
    }
    &__line {
      height: 1px;
      background: $too-ligth-gray;
      flex: 1 1 auto;
    }
    &__rigth-section {
      display: flex;
      align-items: center;
      margin-left: 8px;
      @include lg {
        margin-left: 9px;
      }
      @include md {
        margin-left: 9px;
      }
    }
    &__value {
      display: flex;
    }
    &__value-amount,
    &__value-currency {
      font-size: 22px;
      line-height: 26px;
      letter-spacing: -0.02em;
      color: $blue;
      font-family: "Panton_Bold" !important;
      margin-right: 3px;
      @include lg {
        font-size: 18px;
        line-height: 22px;
      }
      @include md {
        font-size: 14px;
        line-height: 17px;
      }
    }
    &__value-currency {
      font-family: "Panton_Regular" !important;
      color: $black;
      margin-right: 0;
    }
    &__vertical-line {
      height: 35px;
      border-left: 1px solid $too-ligth-blue;
      margin-left: 14px;
      margin-right: 20px;
      @include lg {
        height: 20px;
        margin-right: 16px;
      }
      @include md {
        height: 20px;
        margin-right: 16px;
      }
    }
    &__arrow {
      & svg {
        width: 17px;
        height: 11px;
        fill: $mid-gray;
      }
    }
  }
  &__title:hover .title__arrow {
    & svg {
      fill: $mid-blue;
    }
  }
}
.opened {
  .dropdown__title {
    background: $lightcyan;
    box-shadow: none;
  }
  .title__line {
    background: $ligth-blue;
    opacity: 0.3;
  }
  .title__arrow {
    & svg {
      fill: $ligth-blue;
    }
  }
  .title__vertical-line {
    border-color: $ligth-blue;
  }
}
</style>
