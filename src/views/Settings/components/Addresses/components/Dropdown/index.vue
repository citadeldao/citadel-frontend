<template>
  <div class="dropdown">
    <div
      class="dropdown__title"
      data-qa="dropdown-address"
      @click="clickHandler"
      :class="`${isOpen}`"
    >
      <div class="title__icon">
        <component :is="currentIcon" />
      </div>
      <div class="title__text">
        {{ data.net }}
      </div>
      <div class="title__arrow" :class="`${isOpen}`">
        <arrowDown />
      </div>
    </div>
    <div v-show="isOpen" class="dropdown__items" :class="`${isOpen}`">
      <div
        v-for="wallet in data.wallets"
        :key="`${wallet.net}${wallet.address}`"
        class="dropdown__item"
      >
        <DropdownItem
          ref="dropdownItem"
          :selectable="selectable"
          :wallet="wallet"
          :hidden="isWalletHidden(wallet)"
          @toggle-hidden="$emit('toggle-hidden', wallet)"
          @deleteSeedModal="$emit('deleteSeedModal')"
          @exportWallet="exportWallet"
        />
      </div>
    </div>
  </div>
</template>

<script>
import arrowUp from '@/assets/icons/arrow-up.svg';
import arrowDown from '@/assets/icons/arrow-down.svg';
import DropdownItem from './components/DropdownItem';
import { ref, markRaw, onMounted } from 'vue';

export default {
  name: 'Dropdown',
  components: { DropdownItem, arrowUp, arrowDown },
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    hiddenWallets: {
      type: Array,
      default: () => [],
    },
    selectable: {
      type: Boolean,
      default: false,
    },
    preopened: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['exportWallet', 'toggle-hidden', 'deleteSeedModal', 'changeItem'],
  setup(props, { emit }) {
    const dropdownItem = ref(null);
    const isOpen = ref(false);
    const currentIcon = ref();
    if (props.data) {
      import(`@/assets/icons/networks/${props.data.icon}.svg`).then((val) => {
        currentIcon.value = markRaw(val.default);
      });
    }

    const clickHandler = () => {
      isOpen.value = !isOpen.value;
    };

    const exportWallet = (val) => {
      emit('exportWallet', val);
    };

    const isWalletHidden = ({ address, net }) =>
      props.hiddenWallets.includes(`${net}_${address}`);
    onMounted(() => {
      if (props.preopened) {
        clickHandler();
      }
    });
    return {
      dropdownItem,
      currentIcon,
      isOpen,
      isWalletHidden,
      clickHandler,
      exportWallet,
    };
  },
};
</script>

<style lang="scss" scoped>
.dropdown {
  &__title {
    position: relative;
    z-index: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    user-select: none;
    height: 56px;
    width: 100%;
    background: $light-gray-1;
    border-radius: 8px;
    padding: 0 15px 0 10px;
    transition: all 0.3s;
    opacity: 0.8;

    &:not(:last-child) {
      margin-bottom: 10px;
    }
    &.true {
      opacity: 1;
      background-color: $mid-blue;
      .title {
        &__icon {
          border-color: $white;
        }
        &__arrow {
          & svg {
            fill: $white !important;
            transform: rotate(-180deg);
          }
        }
        &__text {
          background-color: $mid-blue;
          color: $white;
        }
      }
    }
    &:hover {
      opacity: 1;

      background-color: $light-blue-1;

      .title {
        &__icon {
          border-color: $light-blue-1;
        }
        &__arrow {
          & svg {
            fill: $white !important;
          }
        }
        &__text {
          background-color: $light-blue-1;
          color: $black;
        }
      }
    }
  }

  &:not(:last-child) {
    &__items {
      margin-bottom: 15px;
    }
  }
  &__items {
    transform: translateY(-50%);
    opacity: 0;

    &.true {
      animation: dropdownSlideDown 0.3s alternate forwards;
    }
  }

  .title {
    &__icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      z-index: 1;
      border: 1px solid $mid-blue;
      background: $mid-blue;
      & svg {
        fill: white;
        height: 16px;
        margin: auto;
      }

      @include md {
        width: 32px;
        height: 32px;
      }
    }

    &__text {
      margin-right: auto;
      padding: 0 15px;
      background-color: $light-gray-1;
      @include title-default;
      font-family: 'Panton_SemiBold' !important;
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: -1;
        background-color: $white;
        height: 1px;
        width: 80%;
        margin: auto;
      }
    }

    &__arrow {
      width: 8%;
      text-align: right;
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
  @keyframes dropdownSlideDown {
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
}
</style>
