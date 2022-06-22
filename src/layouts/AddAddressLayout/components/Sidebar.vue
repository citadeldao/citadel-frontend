<template>
  <div class="sidebar">
    <div class="sidebar__logo">
      <div
        data-qa="main-logo"
        class="sidebar__logo-inner-wrapper"
        @click="setActiveTab('all')"
      >
        <citadelLogo class="sidebar__logo-citadel" />
      </div>
    </div>

    <OverallCard
      :balance="totalBalanceWithSubtokensUSD"
      :cryptobalance="totalBTCBalance"
      :title="activeTab"
      @click="setActiveTab(activeTab)"
    />

    <div v-if="walletsList?.length > 0" class="sidebar__overall">
      <div class="sidebar__addresses">
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
              class="sidebar__addresses-header-controls-serach-icon"
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
        <transition name="fade">
          <div v-if="showSearchInput" class="sidebar__addresses-serach-input">
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
              @blur="blurHandrer(false)"
            />
          </div>
        </transition>
        <div v-if="!displayData.length" class="sidebar__addresses-addresses">
          <SerchPlaceholder />
        </div>
        <div v-else class="sidebar__addresses-addresses">
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
      {{ $t('addAddressExp') }}
      <div>+</div>
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
import SerchPlaceholder from './SerchPlaceholder.vue';
import AddressItem from './AddressItem';
import OverallCard from './OverallCard';
import AddressPlaceholder from './AddressPlaceholder';
import citadelLogo from '@/assets/icons/citadelLogo.svg';
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
    SerchPlaceholder,
    WalletFilterDropdown,
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

    const subtokensBalanceUSD = computed(() => {
      return walletsList.value.reduce((total, currentValue) => {
        return BigNumber(total)
          .plus(currentValue.subtokenBalanceUSD || 0)
          .toNumber();
      }, 0);
    });

    const totalBalanceWithSubtokensUSD = computed(() => {
      const value = BigNumber(subtokensBalanceUSD.value)
        .plus(totalUSDBalance.value)
        .toNumber();

      store.dispatch('balance/setBalance', { type: 'usdWithTokens', value });

      return value;
    });
    const totalBTCBalance = computed(() => {
      const value = BigNumber(totalBalanceWithSubtokensUSD.value)
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
      const byAlphabet = sortByAlphabet(data, 'name', 'address');
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
    const blurHandrer = async (value) => {
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
      totalBalanceWithSubtokensUSD,
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
      blurHandrer,
    };
  },
};
</script>

<style lang="scss" scoped>
.active {
  background-image: $blue-gradient;
  box-shadow: 0 10px 15px 0 #50647c29, 0 15px 50px 0 #50647c1a;
}
.sidebar {
  padding: 42px 0 0 24px;
  min-width: 246px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  @include lg {
    padding: 42px 0 0 25px;
  }
  @include md {
    padding: 26px 0 0 25px;
    min-width: 194px;
  }
  &__logo {
    display: flex;
    align-items: center;
    margin-bottom: 43px;
    @include md {
      margin-bottom: 28px;
    }
  }
  &__logo-inner-wrapper {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  &__overall {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  &__addresses {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow: hidden;
  }
  &__addresses-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: auto;
  }
  &__addresses-header {
    margin-bottom: 21px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    @include lg {
      margin-bottom: 27px;
    }
    @include md {
      margin-bottom: 8px;
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
      line-height: 24px;
    }
    @include md {
      max-width: 95px;
      font-size: 14px;
      line-height: 17px;
    }
  }
  &__addresses-header-controls {
    display: flex;
    align-items: center;
  }
  &__addresses-header-controls-serach-icon {
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
  &__addresses-serach-input {
    min-height: 68px;
    width: 221px;
    margin-bottom: 16px;
    @include md {
      width: 169px;
    }
  }
  &__addresses-addresses {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
    flex-grow: 1;
  }
  &__address-placeholder {
    flex-grow: 1;
  }
  &__add-address-button {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 221px;
    height: 80px;
    border-radius: 16px;
    background: $white;
    font-family: 'Panton_Bold';
    font-size: 18px;
    line-height: 22px;
    margin-top: 10px;
    margin-bottom: 8px;
    @include md {
      width: 165px;
      height: 60px;
      font-size: 14px;
      line-height: 17px;
      border-radius: 8px;
    }
    &:hover {
      background: $dark-blue;
      color: $white;
      & div {
        background: $white;
        color: $dark-blue;
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
      box-shadow: 0px 4px 20px rgba(105, 95, 225, 0.7);
      @include md {
        width: 32px;
        height: 32px;
        font-size: 18px;
      }
    }
  }
}

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
