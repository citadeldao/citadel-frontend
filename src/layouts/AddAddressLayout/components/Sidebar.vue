<template>
  <div
    class="sidebar"
    :class="sidebarClass"
    @mouseover="onMouseOver"
    @mouseleave="onMouseLeave"
  >
    <div class="sidebar__logo">
      <div
        data-qa="main-logo"
        class="sidebar__logo-inner-wrapper"
        @click="setActiveTab('all')"
      >
        <citadelLogo class="sidebar__logo-citadel" />
        <onlyLogo class="sidebar__compact-logo-citadel" />
      </div>
    </div>

    <OverallCard
      :balance="totalBalanceWithSubTokensUSD"
      :cryptobalance="totalBTCBalance"
      :title="activeTab"
      @click="setActiveTab(activeTab)"
    />
    <div v-if="walletsList?.length > 0" class="sidebar__overall">
      <div class="sidebar__addresses-top">
        <div class="sidebar__addresses-header-compact">
          <h4 class="sidebar__addresses-header-title">
            {{ $t('layouts.addAddressLayout.wallets') }}
          </h4>
        </div>
        <div class="sidebar__addresses-header">
          <h4 class="sidebar__addresses-header-title">
            {{
              activeTab === 'all'
                ? $t('layouts.addAddressLayout.addresses')
                : activeTab
            }}
          </h4>
          <div class="sidebar__addresses-header-controls">
            <div
              class="sidebar__addresses-header-controls-search-icon"
              :class="{ 'sidebar__active-icon': showSearchInput }"
              data-qa="sidebar__search-button"
              @click="toggleShowSearchInput(!showSearchInput)"
            >
              <loop />
            </div>
            <WalletFilterDropdown
              v-model:value="filterValue"
              relative-component="body"
              :items="filterList"
              id="sidebarFilter"
            />
          </div>
        </div>
      </div>
      <transition name="fade">
        <div v-if="showSearchInput" class="sidebar__addresses-search-input">
          <Input
            id="walletSearch"
            v-model="keyword"
            :label="$t('searchToken')"
            type="text"
            icon="loop"
            autofocus
            :placeholder="$t('inputToken')"
            background="#edf2fc"
            clearable
            data-qa="sidebar__search-field"
            @blur="blurHandler(false)"
          />
        </div>
      </transition>

      <div
        v-if="!displayData.length"
        class="sidebar__addresses-addresses"
        :class="scrollClass"
        @change="isOverflown($event)"
      >
        <h4 class="sidebar__addresses-header-title">
          {{ $t('layouts.addAddressLayout.addresses') }}
        </h4>
        <SearchPlaceholder />
      </div>
      <div
        v-else
        class="sidebar__addresses-addresses"
        @scroll="onScrollContent"
      >
        <div class="sidebar__addresses-addresses-full-list">
          <transition-group name="drop">
            <AddressItem
              v-for="wallet in displayData"
              :key="`${wallet.net}${wallet.address}`"
              :wallet="wallet"
            />
          </transition-group>
        </div>
      </div>
    </div>
    <div v-if="walletsList?.length === 0" class="sidebar__address-placeholder">
      <AddressPlaceholder :active-tab="activeTab" />
    </div>
    <button
      class="sidebar__add-address-button"
      data-qa="sidebar__add-address-button"
      @click="toAddAddress"
    >
      <span class="sidebar__add-address-button-text">
        {{ $t('addAddressExp') }}
      </span>
      <div>+</div>
    </button>
    <button
      class="sidebar__compact-view-button"
      @click="sideBarView"
      :class="`${sidebarClass}`"
    >
      <ArrowRight />
    </button>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import { useWindowSize } from 'vue-window-size';
import useWallets from '@/compositions/useWallets';
import { sortByAlphabet } from '@/helpers';

import WalletFilterDropdown from '@/components/UI/WalletFilterDropdown';
import Input from '@/components/UI/Input';
import SearchPlaceholder from './SearchPlaceholder.vue';
import AddressItem from './AddressItem';
import OverallCard from './OverallCard';
import AddressPlaceholder from './AddressPlaceholder';
import citadelLogo from '@/assets/icons/citadelLogo.svg';
import onlyLogo from '@/assets/icons/only-logo.svg';
import ArrowRight from '@/assets/icons/arrow-rigth.svg';

import loop from '@/assets/icons/input/loop.svg';

export default {
  name: 'Sidebar',
  components: {
    citadelLogo,
    AddressPlaceholder,
    OverallCard,
    AddressItem,
    loop,
    Input,
    SearchPlaceholder,
    WalletFilterDropdown,
    onlyLogo,
    ArrowRight,
  },

  emits: ['editList', 'createList'],
  setup(props, { emit }) {
    const keyword = ref('');
    const showSearchInput = ref(false);
    const filterList = ref([
      { icon: 'byAlphabet', value: 'byAlphabet' },
      { icon: 'byAlphabetReverse', value: 'byAlphabetReverse' },
      { icon: 'byValue', value: 'byValue' },
      { icon: 'byValueReverse', value: 'byValueReverse' },
    ]);
    const filterValue = ref(filterList.value[0].value);
    const { width } = useWindowSize();
    const store = useStore();
    const router = useRouter();

    const toAddAddress = () => {
      router.push({ name: 'AddAddress' });
    };

    const { wallets } = useWallets();

    const currency = computed(() => store.getters['profile/info'].rates);

    const activeTab = computed(() => store.getters['wallets/activeList']);
    const customWalletsList = computed(
      () => store.getters['wallets/customWalletsList']
    );
    const setActiveTab = (list) => {
      store.commit('wallets/SET_ACTIVE_LIST', list);
      router.push({ name: 'Overall' });
    };

    const totalUSDBalance = computed(() => {
      const value = walletsList.value.reduce((total, currentValue) => {
        return BigNumber(total).plus(currentValue?.balanceUSD).toNumber();
      }, 0);

      store.dispatch('balance/setBalance', { type: 'usd', value });

      return value;
    });

    const subTokensBalanceUSD = computed(() => {
      return walletsList.value.reduce((total, currentValue) => {
        return BigNumber(total)
          .plus(currentValue.subtokenBalanceUSD || 0)
          .toNumber();
      }, 0);
    });

    const totalBalanceWithSubTokensUSD = computed(() => {
      const value = BigNumber(subTokensBalanceUSD.value)
        .plus(totalUSDBalance.value)
        .toNumber();

      store.dispatch('balance/setBalance', { type: 'usdWithTokens', value });

      return value;
    });
    const totalBTCBalance = computed(() => {
      const value = BigNumber(totalBalanceWithSubTokensUSD.value)
        .dividedBy(currency.value?.btc.USD)
        .toNumber();

      store.dispatch('balance/setBalance', { type: 'btc', value });

      return value;
    });

    const customList = computed(() => {
      if (customWalletsList.value.length > 0) {
        const customList = customWalletsList.value.find(
          (list) => list.name === activeTab.value
        );

        return (customList && customList.wallets) || [];
      }

      return [];
    });

    const walletsList = computed(() => {
      let customListWallets = [];

      if (activeTab.value === 'all') {
        return wallets.value;
      }

      for (const { net, address } of customList.value) {
        const walletsList = wallets.value.filter(
          (wallet) =>
            wallet.address.toLowerCase() === address.toLowerCase() &&
            wallet.net === net
        );
        customListWallets = customListWallets.concat(walletsList);
      }

      return customListWallets;
    });
    const filteredWallets = computed(() => {
      const data = walletsList.value;
      const byAlphabet = sortByAlphabet(data, 'code', 'address');
      const byValue = data.sort((a, b) => a.balanceUSD - b.balanceUSD);

      switch (filterValue.value) {
        case 'byAlphabet':
          return byAlphabet;
        case 'byAlphabetReverse':
          return byAlphabet.reverse();
        case 'byValue':
          return byValue;
        case 'byValueReverse':
          return byValue.reverse();
        default:
          return data;
      }
    });

    const displayData = computed(() => {
      if (!keyword.value) {
        return filteredWallets.value;
      }

      return filteredWallets.value.filter(
        (item) =>
          item.title.toLowerCase().includes(keyword.value.toLowerCase()) ||
          item.code.toLowerCase().includes(keyword.value.toLowerCase()) ||
          item.address.toLowerCase().includes(keyword.value.toLowerCase())
      );
    });

    const showCustomLists = ref(false);
    const closeCustomListModal = () => {
      showCustomLists.value = false;
    };

    const editList = (value) => {
      showCustomLists.value = false;
      emit('editList', value);
    };

    const createList = () => {
      showCustomLists.value = false;
      emit('createList');
    };
    const walletsCustomLists = computed(() =>
      customWalletsList.value.filter((item) => item.name !== 'Favourites')
    );
    const toggleShowSearchInput = (value) => {
      showSearchInput.value = value;
      keyword.value = '';
    };
    const blurHandler = async (value) => {
      setTimeout(() => {
        showSearchInput.value = value;
        keyword.value = '';
      }, 200);
    };

    return {
      activeTab,
      toAddAddress,
      walletsList,
      totalBTCBalance,
      totalBalanceWithSubTokensUSD,
      setActiveTab,
      showCustomLists,
      width,
      closeCustomListModal,
      editList,
      createList,
      walletsCustomLists,
      keyword,
      showSearchInput,
      displayData,
      filterValue,
      filterList,
      filteredWallets,
      toggleShowSearchInput,
      blurHandler,
    };
  },
  data() {
    return {
      windowWidth: window.innerWidth,
      sidebarClass: '',
    };
  },
  created() {
    window.addEventListener('resize', this.onResize);
    this.sidebarClass = window.innerWidth <= 1024 ? 'compact' : '';
  },
  methods: {
    onResize() {
      this.sidebarClass = window.innerWidth <= 1024 ? 'compact' : '';
    },

    sideBarView() {
      if (window.innerWidth <= 1024) {
        this.sidebarClass = !this.sidebarClass ? 'compact' : '';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.active {
  background-image: $blue-gradient;
  box-shadow: 0 10px 15px 0 #50647c29, 0 15px 50px 0 #50647c1a;
}
.sidebar {
  max-width: $sidebar-max-width;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
  padding: $sidebar-padding;
  transition: all 0.4s;
  background-color: trasparent;

  @include md {
    padding: $sidebar-padding-md;
    max-width: $sidebar-max-width-md;
  }

  &:hover {
    .sidebar__addresses-top {
      @include laptop {
        border-color: transparent;
      }
    }
  }

  &__compact-view-button {
    display: none;
  }

  @include laptop {
    filter: $sidebar-shadow;
    background-color: $white;
    padding: $sidebar-padding-laptop;
    @include sidebar-compact-view;
    max-width: calc(#{$sidebar-max-width-md} - 30px);
    position: fixed;
    z-index: 3;
    &__compact-view-button {
      background: $too-ligth-blue;
      width: 24px;
      height: 24px;
      border: none;
      border-radius: 4px;

      position: absolute;
      top: 143px;
      right: -12px;

      transition: 0.15s;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #00a3ff;
      & svg {
        fill: $white;
        height: 10px;
        transform: rotate(180deg);
      }
      &:hover {
        background-color: $too-ligth-blue;
      }
    }
  }

  &.compact {
    max-width: $sidebar-compact-max-width;
    background: $white;
  }

  &__compact-logo-citadel {
    display: none;
  }

  &.compact &__logo-citadel {
    display: none;
  }

  &.compact &__compact-logo-citadel {
    display: block;

    svg {
      height: 24px;
    }
  }

  &__logo {
    margin: 0 auto 40px;
    max-width: calc(#{$sidebar-max-width} - 50px);
    width: 100%;
    text-align: left;
    @include md {
      max-width: calc(#{$sidebar-max-width-md} - 50px);
      margin: 0 auto 20px;
    }
  }
  &__overall {
    max-width: calc(#{$sidebar-max-width} - 50px);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow: hidden;
    width: 100%;
    margin: 25px auto;
    position: relative;
    @include md {
      max-width: calc(#{$sidebar-max-width-md} - 50px);
      margin: 20px auto;
    }
  }

  &__addresses {
    max-width: calc(#{$sidebar-max-width} - 50px);
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    @include md {
      max-width: calc(#{$sidebar-max-width-md} - 50px);
    }
    &-top {
      border-radius: 8px;
      margin-bottom: 25px;
      @include md {
        margin-bottom: 15px;
      }
    }
  }

  &__addresses-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: auto;
  }

  &__addresses-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &-compact {
      display: none;
      justify-content: center;
    }
  }

  &__addresses-header-title {
    font-size: 20px;
    line-height: 30px;
    font-family: 'Panton_Bold';
    margin: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 135px;

    @include lg {
    }

    @include md {
    }
  }

  &__addresses-header-controls {
    display: flex;
    align-items: center;
    @include laptop {
      margin-right: 15px;
    }
  }

  &__addresses-header-controls-search-icon {
    & svg {
      width: 20px;
      height: 20px;
      fill: $mid-blue;
      margin-right: 19px;
      cursor: pointer;

      @include md {
        width: 18px;
        height: 18px;
      }

      &:hover {
        fill: $blue;
      }
    }
  }

  &__active-icon {
    & svg {
      fill: $too-dark-blue;

      &:hover {
        fill: $too-dark-blue;
      }
    }
  }

  &__addresses-search-input {
    min-height: 68px;
    width: 221px;
    margin-bottom: 16px;
    max-width: calc(#{$sidebar-max-width} - 50px);
    @include md {
      max-width: calc(#{$sidebar-max-width-md} - 50px);
    }
  }

  &__addresses-addresses {
    display: flex;
    flex-direction: column;
    position: relative;
    border: 1px solid transparent;
    background: transparent;
    overflow: hidden;
    height: 100%;
    box-shadow: none;
    &-full-list {
      display: flex;
      flex-direction: column;
      overflow-y: overlay;
      overflow-x: hidden;
      padding-bottom: 15px;
    }

    // &.bottom::after {
    //   visibility: hidden;
    // }

    // &.top::before {
    //   visibility: hidden;
    // }

    // &.active::after,
    // &.active::before {
    //   visibility: visible;
    // }

    // &::after,
    // &::before {
    //   content: '';
    //   height: 15px;
    //   width: calc(#{$sidebar-max-width} - 50px);
    //   position: absolute;
    //   padding: 0;
    //   visibility: hidden;
    //   @include md {
    //     width: calc(#{$sidebar-max-width-md} - 50px);
    //   }
    // }

    // &::after {
    //   bottom: 0;
    //   margin-top: auto;
    //   background: linear-gradient(to top, rgba(0, 0, 0, 0.2) 40%, transparent);
    //   z-index: 1;
    // }

    // &::before {
    //   top: 0;
    //   margin-bottom: auto;

    //   background: linear-gradient(
    //     to bottom,
    //     rgba(0, 0, 0, 0.2) 40%,

    //     transparent
    //   );
    //   z-index: 1;
    // }
  }

  &__address-placeholder {
    margin: 0 auto;
  }

  &__add-address-button {
    display: flex;
    align-items: center;
    justify-content: space-around;
    max-width: calc(#{$sidebar-max-width} - 50px);
    max-height: 80px;
    width: 100%;
    height: 100%;
    border-radius: 16px;
    background: $white;
    @include title-default;
    font-size: $add-btn-font-size !important;
    margin-bottom: 8px;
    transition: background 0.2s;

    &:hover {
      background: $dark-blue;
      color: $white;
      & div {
        background: $white;
        color: $dark-blue;
        box-shadow: 0px 4px 20px rgba(105, 95, 225, 0.7);
      }
    }

    & div {
      width: 48px;
      height: 48px;
      border-radius: $round;
      background: $dark-blue;
      font-size: 24px;
      color: $white;
      display: flex;
      justify-content: center;
      align-items: center;

      @include md {
        width: 32px;
        height: 32px;
        font-size: 18px;
      }
    }

    @include md {
      max-width: calc(#{$sidebar-max-width-md} - 50px);
      height: 60px;
    }

    @include laptop {
      height: 60px;
      margin-top: auto;
      border-color: transparent;
      border-top-style: dashed;
      border-top-color: $too-ligth-blue;
      padding: 0 10%;
      border-radius: 0 0 8px 8px;
    }
  }
}

@include sidebar-compact-view;

.drop-enter-active,
.drop-leave-active {
  transition: all 0.7s ease;
}

.drop-enter-from,
.drop-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
