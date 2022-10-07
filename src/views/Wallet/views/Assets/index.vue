<template>
  <div v-if="subtokensIsLoading" class="assets__loading">
    <Loading />
  </div>
  <div v-else class="assets">
    <template
      v-if="
        stateCurrentWallet.balance.calculatedBalance ||
        stateCurrentWallet.subtokenBalanceUSD ||
        showAssetsExep.includes(stateCurrentWallet.net) ||
        currentToken
      "
    >
      <div class="assets__header">
        <BalanceCard
          type="red"
          :text="$t('wallet.info.totalAssets')"
          :value="balanceUSD"
        />
        <BalanceCard
          type="blue"
          :text="$t('wallet.info.availableAssets')"
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
            relative-component="body"
            :items="filterList"
            input-style
            id="assetsFilter"
          />
        </div>
      </div>

      <div class="assets-table">
        <div class="assets-table__thead">
          <div>{{ $t('asset') }}</div>
          <div>{{ $t('balance') }}</div>
          <div>USD {{ $t('balance') }}</div>
          <div>{{ $t('price') }}</div>
        </div>

        <AssetsItem
          :item="stateCurrentWallet"
          :balance="stateCurrentWallet.balance"
          is-native-token
          :is-active="currentWallet.net === stateCurrentWallet.net"
          @click="setCurrentToken(stateCurrentWallet)"
          :class="{ 'assets-single__item': !displayData.length }"
        />
        <AssetsItem
          v-for="(item, index) in displayData"
          :key="`${item.name}-${index}`"
          :balance="item.tokenBalance"
          :item="item"
          :is-not-linked="isNotLinkedSnip20(item)"
          :is-active="item.net === currentWallet.net"
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
      <div v-if="!displayData.length && keyword" class="assets__placeholder">
        <searchError />
        <span>
          {{ $t('tokenSearchError') }}
        </span>
      </div>
    </template>
    <template v-else>
      <div class="empty__balance">
        <h2>{{ $t('assetsStubs.title') }}</h2>
        <h3>
          {{ $t('assetsStubs.subtitle') }}
        </h3>
        <div class="cards__container">
          <router-link to="/extensions">
            <Card class="card-special" iconName="zeroBalanceStub">
              <template #default>
                <span class="card-special-title">
                  {{ $t('assetsStubs.card1.title') }}
                </span>
                <span class="card-special-title-staking">
                  {{ $t('assetsStubs.card1.action') }}
                </span>
                <RoundArrowButton data-qa="stake__start-staking-button" />
              </template>
            </Card>
          </router-link>
          <a
            target="_blank"
            href="https://medium.com/citadel-one/how-to-withdraw-cryptocurrency-from-cex-to-citadel-one-71886d084f08"
          >
            <Card class="card-special" iconName="zeroBalanceStub1">
              <template #default>
                <span class="card-special-title">
                  {{ $t('assetsStubs.card2.title') }}
                </span>
                <span class="card-special-title-staking">
                  {{ $t('assetsStubs.card2.action') }}
                </span>
                <RoundArrowButton data-qa="stake__start-staking-button" />
              </template>
            </Card>
          </a>
        </div>
      </div>
    </template>
  </div>
  <teleport v-if="showCreateVkModal" to="body">
    <CreateVkModal
      :address="stateCurrentWallet.address"
      :token="snip20Token"
      :token-fee="snip20TokenFee"
      :current-wallet="stateCurrentWallet"
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
import RoundArrowButton from '@/components/UI/RoundArrowButton';
import Card from '@/components/UI/Card';
import useWallets from '@/compositions/useWallets';
import { OUR_TOKEN, WALLET_TYPES } from '@/config/walletType';
import { showAssetsExep } from '@/config/availableNets';

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
    RoundArrowButton,
    Card,
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
    const { currentWallet: stateCurrentWallet } = useWallets();
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
      if (
        token.net.toLowerCase() === stateCurrentWallet.value.net.toLowerCase()
      ) {
        store.dispatch('subtokens/setCurrentToken', null);
        redirectToWallet({
          wallet: store.getters['wallets/walletByAddress'](route.params),
          root: true,
        });
      } else if (isNotLinkedSnip20(token) && !token.linked) {
        if (stateCurrentWallet.value.type === WALLET_TYPES.PUBLIC_KEY) {
          return;
        }
        mainIsLoading.value = true;
        snip20TokenFee.value =
          (await token.getFees(token.id, token.net))?.data?.high?.fee || 0.2;
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
      const data = [...filteredTokensList.value].sort(
        (a, b) => isNotLinkedSnip20(b) - isNotLinkedSnip20(a)
      );
      const byAlphabet = sortByAlphabet(data, 'name').sort(
        (a, b) => isNotLinkedSnip20(b) - isNotLinkedSnip20(a)
      );
      const byValue = data
        .sort((a, b) => a.balanceUSD - b.balanceUSD)
        .sort((a, b) => isNotLinkedSnip20(b) - isNotLinkedSnip20(a));
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
      const indexXCT = filteredTokens.value.findIndex(
        (e) => e.net === OUR_TOKEN
      );
      if (indexXCT !== -1) {
        const xctItem = filteredTokens.value[indexXCT];
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        filteredTokens.value.splice(indexXCT, 1);
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        filteredTokens.value.splice(0, 0, xctItem);
      }
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
      return BigNumber(stateCurrentWallet.value.balanceUSD)
        .plus(stateCurrentWallet.value.subtokenBalanceUSD)
        .toNumber();
    });

    const balanceAvailableUSD = computed(() => {
      const nativeTokenBalance = BigNumber(
        stateCurrentWallet.value.balance.mainBalance
      )
        .multipliedBy(
          store.getters['profile/rates'][stateCurrentWallet.value.net].USD
        )
        .toNumber();
      return BigNumber(
        props.tokenList.reduce((acc, token) => {
          const availableUSD = BigNumber(token.tokenBalance.mainBalance)
            .multipliedBy(token.tokenBalance.price.USD)
            .toNumber();
          return BigNumber(acc).plus(availableUSD).toNumber();
        }, 0)
      )
        .plus(nativeTokenBalance)
        .toNumber();
    });
    const filteredTokensList = computed(() => {
      if (!keyword.value) {
        return props.tokenList.filter((e) => isNotLinkedSnip20(e) || e.linked);
      }
      return props.tokenList;
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
      () => stateCurrentWallet.value,
      (newVal, oldVal) => {
        if (
          newVal?.net.toLowerCase() !== oldVal?.net.toLowerCase() ||
          newVal?.address.toLowerCase() !== oldVal?.address.toLowerCase()
        )
          clearFilters();
      }
    );
    return {
      TOKEN_STANDARDS,
      filteredTokensList,
      OUR_TOKEN,
      setCurrentToken,
      setMainToken,
      isNotLinkedSnip20,
      closeCreateVkModal,
      stateCurrentWallet,
      keyword,
      filterValue,
      filteredTokens,
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
      WALLET_TYPES,
      showAssetsExep,
    };
  },
};
</script>

<style lang="scss" scoped>
.cards__container {
  display: flex;
  width: 100%;
  justify-content: center;
  a {
    text-decoration: none;
    max-width: 359px;
    width: 100%;
    &:first-child {
      margin-right: 3%;
    }
    &:last-child {
      margin-left: 3%;
    }
    @media (max-width: 1400px) {
      max-width: 260px;
    }
  }
  & .card {
    position: relative;
    max-width: 359px;
    width: 100%;
    height: 300px;
    transition: none;
    &:hover {
      background: linear-gradient(90deg, #f1f0ff 0%, #e3f6ff 100%);
    }
    color: initial;
    img {
      right: 0;
      left: 0;
      bottom: 0;
      border-radius: 16px;
    }
    @media (max-width: 1400px) {
      max-width: 260px;
      width: 100%;
      height: 220px;
      &-special {
        padding: 22px 0 0 22px;
      }
      & .round-arrow-button {
        top: 46px !important;
        right: 20px !important;
      }
      & .round-arrow-button__icon {
        margin-right: -41px;
        margin-top: -19px;
        top: -16px;
      }
    }
    @media (max-width: 1280px) {
      & .round-arrow-button {
        right: 35px !important;
      }
    }
  }
}
.assets {
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  background: $white;
  padding: 24px 0 11px 0;
  &-single__item {
    margin-bottom: 0;
  }
  &__header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    text-transform: capitalize;

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
      text-transform: capitalize;

      @include lg {
        font-size: $wallet-assets-heading-font-size;
      }

      @include md {
        font-size: $wallet-assets-heading-font-size-md;
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
        @include laptop {
          width: 18%;
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
.empty__balance {
  padding: 55px 0 97px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 18px;
  h2,
  h3 {
    margin: 0 auto;
  }
  h2 {
    font-weight: 700;
    font-size: 1.6666667em;
    line-height: 1.6666667em;
  }
  h3 {
    font-weight: 400;
    font-size: 1em;
    line-height: 1em;
    text-align: center;
    color: $mid-blue;
    margin: 11px auto 42px auto;
  }
  @include lg {
    font-size: 18px;
  }
  @include md {
    font-size: 15px;
  }
}
.card-special {
  padding: 33px 0 0 33px;
  &-title {
    font-size: 18px;
  }
  button {
    top: 64px;
    right: 75px;
  }
}
</style>
