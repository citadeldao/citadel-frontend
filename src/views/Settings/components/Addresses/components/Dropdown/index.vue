<template>
  <div class="dropdown">
    <div
      class="dropdown__title"
      data-qa="dropdown-address"
      @click="clickHandler"
    >
      <div class="title__icon">
        <component :is="currentIcon" />
      </div>
      <div class="title__text">
        {{ data.net }}
      </div>
      <div class="title__line" />
      <div class="title__arrow">
        <arrowUp v-if="isOpen" />
        <arrowDown v-else />
      </div>
    </div>
    <div
      v-show="isOpen"
      class="dropdown__items"
    >
      <div
        v-for="wallet in data.wallets"
        :key="`${wallet.net}${wallet.address}`"
        class="dropdown__item"
      >
        <DropdownItem
          :wallet="wallet"
          :hidden="isWalletHidden(wallet)"
          :has-visible-button="hasVisibleButton"
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
import { ref, markRaw } from 'vue';

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
    hasVisibleButton: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['exportWallet', 'toggle-hidden', 'deleteSeedModal'],
  setup(props, { emit }) {
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

    const isWalletHidden = ({ address, net }) => props.hiddenWallets.includes(`${net}_${address}`);

    return {
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
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
    height: 68px;
    width: 100%;
    margin-bottom: 15px;
    background: $light-gray-1;
    border-radius: 8px;
    padding-left: 9px;
    padding-right: 25px;
  }

  &__items {
    margin-bottom: 15px;
  }

  .title {
    &__icon {
      width: 50px;
      height: 50px;
      border-radius: 8px;
      text-align: center;
      padding: 13px 0;

      & svg {
        fill: white;
        height: 24px;
      }

      background: $mid-blue;
    }

    &__text {
      margin-left: 15px;
      margin-right: 22px;
      font-size: 22px;
      font-weight: 700;
      line-height: 26px;
    }

    &__line {
      height: 1px;
      background: $white;
      flex: 1 1 auto;
    }

    &__arrow {
      margin-left: 27px;

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
</style>
