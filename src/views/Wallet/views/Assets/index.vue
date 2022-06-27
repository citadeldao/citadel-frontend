<template>
  <div v-if="subtokensIsLoading" class="assets__loading">
    <Loading />
  </div>
  <div v-else class="assets">
    <div class="assets__header">
      <BalanceCard type="red" text="Total Assets" :value="balanceUSD" />
      <BalanceCard
        type="blue"
        text="Available assets"
        :value="balanceAvailableUSD"
      />

      <div class="assets__search">
        <Input
          id="assetsSearch"
          v-model="keyword"
          :label="$t('searchToken')"
          type="text"
          icon="loop"
          :placeholder="$t('inputToken')"
          clearable
        />
      </div>
      <div class="assets__sort">
        <WalletFilterDropdown
          v-model:value="filterValue"
          relative-component=".assets__sort"
          :items="filterList"
          input-style
          id="assetsFilter"
        />
      </div>
    </div>

    <div class="assets-table">
      <div class="assets-table__thead">
        <div>Asset</div>
        <div>Balance</div>
        <div>USD Balance</div>
        <div>Price</div>
      </div>

      <AssetsItem
        :item="currentWallet"
        :balance="currentWallet.balance"
        is-native-token
      />
      <AssetsItem
        v-for="(item, index) in displayData"
        :key="`${item.name}-${index}`"
        :balance="item.tokenBalance"
        :item="item"
        :is-not-linked="isNotLinkedSnip20(item)"
        @click="setCurrentToken(item)"
      />

      <Pagination
        :total="total"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        @change-page="setCurrentPage"
        @change-page-size="setPageSize"
      />
    </div>
    <div v-if="!displayData.length" class="assets__placeholder">
      <searchError />
      <span>
        {{ $t('tokenSearchError') }}
      </span>
    </div>
  </div>

  <teleport v-if="showCreateVkModal" to="body">
    <CreateVkModal
      :address="currentWallet.address"
      :token="snip20Token"
      :token-fee="snip20TokenFee"
      :current-wallet="currentWallet"
      @close="closeCreateVkModal"
    />
  </teleport>
</template>

<script>
import { computed, ref, inject, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import BigNumber from 'bignumber.js';
import searchError from '@/assets/icons/search-error.svg';
import WalletFilterDropdown from '@/components/UI/WalletFilterDropdown';
import Input from '@/components/UI/Input';
import Loading from '@/components/Loading';
import AssetsItem from './components/AssetsItem.vue';
import BalanceCard from './components/BalanceCard.vue';
import CreateVkModal from '@/views/Wallet/components/CreateVkModal.vue';
import { sortByAlphabet } from '@/helpers';
import redirectToWallet from '@/router/helpers/redirectToWallet';
import { TOKEN_STANDARDS } from '@/config/walletType';
import usePaginationWithSearch from '@/compositions/usePaginationWithSearch';
import Pagination from '@/components/Pagination.vue';

export default {
  name: 'AssetsBlock',
  components: {
    AssetsItem,
    Loading,
    Input,
    WalletFilterDropdown,
    searchError,
    BalanceCard,
    CreateVkModal,
    Pagination,
  },
  props: {
    currentWallet: {
      type: Object,
      default: () => ({}),
    },
    currentToken: {
      type: [Object, null],
      default: null,
    },
    tokenList: {
      type: Array,
      default: () => [],
    },
    subtokensIsLoading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['prepareClaim', 'prepareXctClaim'],
  setup(props) {
    const store = useStore();
    const route = useRoute();

    const keyword = ref('');
    const showCreateVkModal = ref(false);
    const snip20TokenFee = ref(null);
    const snip20Token = ref(null);
    const mainIsLoading = inject('isLoading');
    const filterList = ref([
      { icon: 'byAlphabet', value: 'byAlphabet' },
      { icon: 'byAlphabetReverse', value: 'byAlphabetReverse' },
      { icon: 'byValue', value: 'byValue' },
      { icon: 'byValueReverse', value: 'byValueReverse' },
    ]);
    const filterValue = ref(filterList.value[3].value);

    const isNotLinkedSnip20 = (token) => {
      const isSnip20 = computed(
        () => token.config.standard === TOKEN_STANDARDS.SNIP_20
      );

      return isSnip20.value && !token.linked;
    };

    const setCurrentToken = async (token) => {
      if (isNotLinkedSnip20(token)) {
        mainIsLoading.value = true;
        snip20TokenFee.value =
          (await token.getFees(token.id, token.net))?.data?.low?.fee || 0.2;
        mainIsLoading.value = false;
        showCreateVkModal.value = true;
        snip20Token.value = token;
      } else {
        store.dispatch('subtokens/setCurrentToken', token);

        redirectToWallet({
          wallet: store.getters['wallets/walletByAddress'](route.params),
          token,
          root: true,
        });
      }
    };

    const setMainToken = async () => {
      await store.dispatch('subtokens/setCurrentToken', null);

      redirectToWallet({
        wallet: store.getters['wallets/walletByAddress'](route.params),
        root: true,
      });
    };

    const filteredTokens = computed(() => {
      const data = [...props.tokenList];
      const byAlphabet = sortByAlphabet(data, 'code');
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

    const filteredItems = computed(() => {
      if (!keyword.value) {
        return filteredTokens.value;
      }

      return filteredTokens.value.filter(
        (item) =>
          item.name.toLowerCase().includes(keyword.value.toLowerCase()) ||
          item.code.toLowerCase().includes(keyword.value.toLowerCase())
      );
    });

    const balanceUSD = computed(() => {
      const nativeTokenBalance = props.currentWallet.balanceUSD;
      const totalTokenBalance = props.tokenList.reduce((acc, token) => {
        return BigNumber(acc).plus(token.balanceUSD).toNumber();
      }, 0);

      return BigNumber(nativeTokenBalance).plus(totalTokenBalance).toNumber();
    });

    const balanceAvailableUSD = computed(() => {
      return props.tokenList.reduce((acc, token) => {
        const availableUSD = BigNumber(token.tokenBalance.mainBalance)
          .multipliedBy(token.tokenBalance.price.USD)
          .toNumber();

        return BigNumber(acc).plus(availableUSD).toNumber();
      }, 0);
    });

    const {
      displayData,
      currentPage,
      total,
      pageSizes,
      pageSize,
      setCurrentPage,
      setPageSize,
    } = usePaginationWithSearch(filteredItems, 10, [10, 25, 50], 1);

    const closeCreateVkModal = () => {
      snip20Token.value = null;
      showCreateVkModal.value = false;
    };

    const clearFilters = () => {
      keyword.value = '';
      filterValue.value = filterList.value[3].value;
      setCurrentPage(1);
      setPageSize(pageSizes.value[0]);
    };

    watch(
      () => [props.currentWallet, props.currentToken],
      () => {
        clearFilters();
      }
    );

    return {
      setCurrentToken,
      setMainToken,
      isNotLinkedSnip20,
      closeCreateVkModal,
      keyword,
      filterValue,
      filterList,
      displayData,
      currentPage,
      total,
      pageSizes,
      pageSize,
      setPageSize,
      setCurrentPage,
      snip20TokenFee,
      showCreateVkModal,
      snip20Token,
      balanceUSD,
      balanceAvailableUSD,
    };
  },
};
</script>

<style lang="scss" scoped>
.assets {
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  background: $white;
  padding: 24px 0 11px 0;

  &__header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    & > * {
      flex-grow: 1;
    }
  }

  &__search {
    height: 68px;
    margin-right: 8px;

    @include lg {
      width: 135px;
      height: 60px;
    }

    @include md {
      height: 56px;
      width: 120px;
    }
  }

  &__sort {
    flex-grow: initial;
    position: relative;
  }

  &__loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
  }

  &__placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 20px;

    & svg {
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }

    & span {
      font-size: 18px;
      line-height: 24px;
      color: $too-ligth-blue;
    }
  }
}

.assets-table {
  width: 100%;

  &__thead {
    display: flex;

    div {
      padding: 12px 0;
      font-family: 'Panton_Bold';
      font-size: 18px;
      text-align: left;
      color: $mid-blue;

      @include lg {
        font-size: x;
      }

      @include md {
        font-size: 14px;
      }

      &:nth-child(1) {
        flex: 1;
      }

      &:nth-child(2),
      &:nth-child(3),
      &:nth-child(4) {
        width: 20%;

        @include lg {
          width: 21%;
        }

        @include md {
          width: 22%;
        }
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

<style lang="scss">
.assets {
  &__search {
    .input {
      &__clear-icon {
        bottom: 19px;

        @include lg {
          bottom: 15px;
        }

        @include md {
          bottom: 14px;
        }
      }

      & > input {
        @include md {
          padding: 25px 25px 10px 36px;
        }
      }

      svg {
        @include lg {
          bottom: 14px;
        }

        @include md {
          bottom: 13px;
        }
      }

      label {
        @include lg {
          font-size: 13px;
        }

        @include md {
          font-size: 12px;
          top: 8px;
        }
      }
    }
  }

  &__sort {
    .wallet-filter-dropdown {
      @include lg {
        width: 60px;
        height: 60px;
      }

      @include md {
        width: 56px;
        height: 56px;
      }
      @include laptop {
        & svg {
          width: 22px;
          height: 22px;
        }
      }
    }
  }
}
</style>
