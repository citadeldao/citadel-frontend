<template>
  <div class="swap-skip">
    <teleport to="body">
      <Modal v-if="showInfoModal">
        <InfoModal
          :signer-wallet="currentWallet"
          :on-close="closeAppInfoModal"
          :to-token="searchNetworkToDataCitadelFormat"
          :to-address="addressTo"
          :from-ibc="searchFromTokenData"
          :to-ibc="searchToTokenData"
          @onCancel="onCancel"
          @onSuccess="onSuccess"
          @showLedger="
            () => {
              showLedgerConnect = true;
            }
          "
        />
      </Modal>
      <Modal v-if="showLedgerConnect">
        <ConfirmLedgerModal
          v-click-away="connectLedgerCloseHandler"
          @close="connectLedgerCloseHandler"
        />
      </Modal>
      <Modal v-if="showSuccessModal">
        <SuccessModal
          :close-success-modal="closeSuccessModal"
          :success-click-handler="successClickHandler"
          :wallet="currentWallet"
          :custom-code="
            searchFromTokenData?.symbol || currentWallet?.code || ''
          "
          :amount="amount"
          :success-tx="successHash"
          @changeComment="onChangeComment"
        />
      </Modal>
    </teleport>
    <Info
      v-if="currentWallet.type === WALLET_TYPES.PUBLIC_KEY"
      title="wallet.info.title"
      data-qa="send__info"
    />
    <template v-else>
      <div v-if="isLoadingData" class="load">
        <Loading />
      </div>
      <EmptyList v-if="!hasSwap && !isLoadingData" :title="appError" />
      <template v-if="hasSwap && !isLoadingData">
        <div class="wrap-tabs">
          <TabsGroup
            v-model:currentValue="currentTab"
            class="xct-calculator-expand__tabs"
            :tabs="tabs"
            @update:currentValue="onChangeCurrentTab"
          />
        </div>
        <div v-if="isBridgeMode" class="towrap">
          <div class="section">
            <div class="section__title">
              TO CHAIN <span>{{ searchNetworkTo }}</span>
            </div>
          </div>
          <div class="swap-skip__select-chain z1000">
            <div class="autocomplete">
              <Autocomplete
                id="chainTokenFrom"
                v-model:value="searchNetworkTo"
                :items="allNetworks"
                split-value
                :custom-icon="networkToData?.logo_uri || ''"
                initial-icon="curve-arrow"
                :label="$t('swapView.swapToNetwork')"
                :placeholder="$t('swapView.swapToNetwork')"
                @update:value="selectToNetwork"
              />
            </div>
          </div>
          <!-- <template v-if="skipTokens.length"> -->
          <!-- <div class="swap-skip__contracts">
            <div>{{ searchToTokenData.asset_on_dest?.denom }}</div>
          </div> -->
          <!-- </template> -->
          <!-- <Loading v-else small /> -->
        </div>
        <div v-if="!isBridgeMode" class="towrap">
          <div class="section">
            <div class="section__title">
              ON CHAIN <span>{{ currentWallet?.config?.name }}</span>
            </div>
          </div>
          <div class="swap-skip__select-chain z1001">
            <div class="autocomplete">
              <Autocomplete
                id="chainTokenFrom"
                v-model:value="searchFromToken"
                :items="skipTokensFrom"
                show-balance
                split-value
                :custom-icon="searchFromTokenData?.iconLink || ''"
                initial-icon="curve-arrow"
                :label="$t('swapView.fromToken')"
                :placeholder="$t('swapView.selectContract')"
                @update:value="selectFromToken"
              />
            </div>
          </div>
          <div class="swap-skip__select-chain z1002">
            <div class="autocomplete">
              <Autocomplete
                id="chainTokenTo"
                v-model:value="searchToToken"
                :items="skipTokensTo"
                show-balance
                split-value
                :custom-icon="searchToTokenData?.iconLink || ''"
                initial-icon="curve-arrow"
                :label="$t('swapView.toToken')"
                :placeholder="$t('swapView.selectContract')"
                @update:value="selectToToken"
              />
            </div>
          </div>
        </div>
        <!-- PART2 -->
        <div
          class="swap-skip__addresses"
          v-if="
            searchNetworkToData?.chain_id ||
            (searchFromTokenData && searchToTokenData)
          "
        >
          <div
            class="swap-skip__input"
            v-click-away="() => (showNetworkTargetWallets = false)"
          >
            <Input
              id="toTokenAddr"
              v-model="addressTo"
              :label="$t('swapView.toAddressLabel')"
              :placeholder="$t('swapView.addressPlaceholder')"
              type="text"
              @focus="showNetworkTargetWallets = true"
            />
            <div
              v-if="showNetworkTargetWallets && networkTargetWallets.length"
              class="network-target-wallets"
            >
              <AddressItem
                v-for="(item, index) in networkTargetWallets"
                :key="`${item.address}${item.net}${index}`"
                :address="item"
                :last-child="index === networkTargetWallets.length - 1"
                :checked="false"
                @click="setAddress(item)"
              />
            </div>
          </div>
          <div
            :class="{ withError: +maxAmount < +amount }"
            class="swap-skip__input mt10"
          >
            <Input
              id="amount"
              v-model="amount"
              :decimals="
                searchFromTokenData
                  ? searchFromTokenData?.decimals
                  : currentWallet?.config?.decimals
              "
              type="currency"
              :currency="
                searchFromTokenData
                  ? searchFromTokenData?.symbol
                  : currentWallet?.code
              "
              :label="$t('swapView.amount')"
              :max="maxAmount"
              :show-set-max="+maxAmount !== 0"
              :show-error-text="+maxAmount < +amount"
              :error="errorAmount"
              placeholder="0.0"
              icon="coins"
            />
          </div>
          <div
            v-if="
              currentWallet.net !== 'osmosis' &&
              searchNetworkToData?.chain_id !== 'osmosis-1'
            "
            class="swap-skip__input mt10"
            v-click-away="() => (showNetworkTargetWalletsOsmo = false)"
          >
            <Input
              id="toTokenOsmo"
              warning-label
              v-model="osmosisAddress"
              label="Input address for transaction between them"
              placeholder="Osmosis address"
              type="text"
              @focus="showNetworkTargetWalletsOsmo = true"
            />
            <div
              v-if="
                showNetworkTargetWalletsOsmo && networkTargetWalletsOsmo.length
              "
              class="network-target-wallets"
            >
              <AddressItem
                v-for="(item, index) in networkTargetWalletsOsmo"
                :key="`${item.address}${item.net}${index}`"
                :address="item"
                :last-child="index === networkTargetWalletsOsmo.length - 1"
                :checked="false"
                @click="setAddressOsmo(item)"
              />
            </div>
          </div>
          <!--  -->
          <div class="wrap-row mt10">
            <div class="swap-skip__input">
              <Input
                id="slippage"
                v-model="slippage"
                :label="$t('swapView.slippage')"
                :placeholder="$t('swapView.slippagePlaceholder')"
                type="text"
              />
            </div>
            <div class="slippage">
              <div
                v-for="(slipp, ndx) in [0.1, 0.3, 0.5, 1, 2, 3]"
                :key="ndx"
                :class="{ active: slippage === slipp }"
                class="slippage__item"
                @click="setSlippage(slipp)"
              >
                {{ slipp }}%
              </div>
            </div>
          </div>
        </div>
        <PrimaryButton
          class="swap-skip__submit-swap"
          :loading="isLoading"
          :disabled="
            (currentWallet.net !== 'osmosis' &&
            searchNetworkToData?.chain_id !== 'osmosis-1'
              ? !osmosisAddress
              : false) ||
            !!errorAmount ||
            !+amount ||
            !addressTo
          "
          @click="getRoute"
        >
          {{ $t('SWAP') }}
        </PrimaryButton>
      </template>
    </template>
  </div>
</template>
<script>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import useWallets from '@/compositions/useWallets';
import Autocomplete from '@/components/UI/Autocomplete';
import BigNumber from 'bignumber.js';
import Loading from '@/components/Loading';
import PrimaryButton from '@/components/UI/PrimaryButton';
import Input from '@/components/UI/Input';
import AddressItem from '@/layouts/AddAddressLayout/components/CutomLists/components/AddressItem';
import Modal from '@/components/Modal';
import InfoModal from './InfoModal.vue';
import SuccessModal from '@/views/Extensions/SuccessModal.vue';
import ConfirmLedgerModal from '@/components/Modals/Ledger/ConfirmLedgerModal';
import EmptyList from '@/components/EmptyList';
import Info from '@/components/Info';
import { WALLET_TYPES } from '@/config/walletType';
import { useI18n } from 'vue-i18n';
import TabsGroup from '@/components/UI/TabsGroup';

export default {
  components: {
    Info,
    Loading,
    Autocomplete,
    PrimaryButton,
    Input,
    AddressItem,
    Modal,
    InfoModal,
    SuccessModal,
    ConfirmLedgerModal,
    EmptyList,
    TabsGroup,
  },
  setup() {
    const { t } = useI18n();
    const store = useStore();
    const { currentWallet, wallets } = useWallets();
    const showInfoModal = ref(false);
    const successHash = ref([]);
    const txComment = ref('');
    const showSuccessModal = ref(false);
    const appError = ref(t('swapView.swapNotFound'));

    const hasSwap = ref(false);

    const isLoadingData = ref(false);
    const isLoading = ref(false);
    const loadingTokens = ref(false);
    const chainFrom = ref(null);

    const searchFromToken = ref('');
    const searchFromTokenData = ref('');

    const searchToToken = ref('');
    const searchToTokenData = ref({});

    const searchNetworkTo = ref('');
    const searchNetworkToData = ref({});
    const searchNetworkToDataCitadelFormat = ref({});
    const showLedgerConnect = ref(false);

    //
    const slippage = ref(0.5);
    const showNetworkTargetWallets = ref(false);
    const showNetworkTargetWalletsOsmo = ref(false);
    const addressTo = ref('');
    const osmosisAddress = ref('');
    const amount = ref('');
    const currentTab = ref('swap');

    const isBridgeMode = computed(() => currentTab.value === 'bridge');

    const skipChains = computed(() => store.getters['skip/chains']);

    const routeTx = computed(() => store.getters['skip/route']);

    const subtokensWallet = computed(() =>
      store.getters['subtokens/formatedSubtokens']()
    );

    const skipTokens = computed(() => {
      const chainId = currentWallet.value?.config?.chainId;
      const tokens = store.getters['skip/assets'][chainId]?.assets;

      return tokens;
    });

    const shortIBC = (denom) => {
      return `${denom.slice(0, 6)}...${denom.slice(-5)}`;
    };

    const skipTokensFrom = computed(() => {
      const tokens = skipTokens.value
        .map((token) => {
          const isNative = token.denom === 'uosmo' && token.description.length;
          // token.denom.length < 15 && token.description.length > 100;

          const tokenCitadel = subtokensWallet.value.find((subToken) => {
            const denom = token.denom.split('/')[1] || token.denom || '';
            return (
              +subToken?.tokenBalance?.mainBalance &&
              subToken?.net.toLowerCase().includes(denom?.toLowerCase())
            );
          });

          return {
            ...token,
            id: token.denom,
            title: `${token.name}:${shortIBC(token.denom)}`,
            key: token.denom,
            chainId: token.chain_id,
            iconLink: token.logo_uri,
            icon: 'curve-arrow',
            balance: isNative
              ? currentWallet.value.balance?.mainBalance || 0
              : tokenCitadel?.tokenBalance?.mainBalance
              ? BigNumber(tokenCitadel?.tokenBalance?.mainBalance).toFixed(6)
              : 0,
          };
        })
        .filter((t) => !!t.balance)
        .sort((a, b) => {
          if (+a.balance < +b.balance) return 1;
          if (+a.balance > +b.balance) return -1;

          if (a.title > b.title) return 1;
          if (a.title < b.title) return -1;
          return 0;
        });

      return tokens;
    });

    const skipTokensTo = computed(() => {
      const tokens = skipTokens.value
        .map((token) => {
          const isNative = token.denom === 'uosmo' && token.description.length;
          // const isNative =
          //   token.denom.length < 15 && token.description.length > 100;

          const tokenCitadel = subtokensWallet.value.find((subToken) => {
            const denom = token.denom.split('/')[1] || token.denom || '';

            return (
              +subToken?.tokenBalance?.mainBalance &&
              subToken?.net.toLowerCase().includes(denom?.toLowerCase())
            );
          });

          return {
            ...token,
            id: token.denom,
            title: `${token.name}:${shortIBC(token.denom)}`,
            key: token.denom,
            chainId: token.chain_id,
            iconLink: token.logo_uri,
            icon: 'curve-arrow',
            balance: isNative
              ? currentWallet.value.balance?.mainBalance || 0
              : tokenCitadel?.tokenBalance?.mainBalance
              ? BigNumber(tokenCitadel?.tokenBalance?.mainBalance).toFixed(6)
              : 0,
          };
        })
        .sort((a, b) => {
          if (+a.balance < +b.balance) return 1;
          if (+a.balance > +b.balance) return -1;

          if (a.title > b.title) return 1;
          if (a.title < b.title) return -1;

          return 0;
        });

      return tokens;
    });

    const tabs = ref([
      { label: 'SWAP', value: 'swap' },
      { label: 'BRIDGE', value: 'bridge' },
    ]);

    const onChangeCurrentTab = () => {
      searchNetworkTo.value = '';
      searchNetworkToData.value = '';
      searchFromTokenData.value = '';
      searchToTokenData.value = '';
      searchFromToken.value = '';
      searchToToken.value = '';
    };

    const maxAmount = computed(() => {
      const balance = searchFromTokenData.value
        ? searchFromTokenData.value.balance || 0
        : currentWallet.value?.balance?.mainBalance || 0;
      if (balance - 0.0005 < 0) return 0;
      return balance - 0.0005;
    });

    // const currentToken = computed(
    //   () => store.getters['subtokens/currentToken']
    // );

    const errorAmount = computed(() => {
      if (+amount.value > +maxAmount.value) {
        return `Max amount for swap ${maxAmount.value}`;
      }
      return '';
    });

    const allNetworks = computed(() =>
      []
        .concat(skipChains.value)
        .map((w) => ({
          id: w.chain_name,
          title: `${w.chain_name.slice(0, 1).toUpperCase()}${w.chain_name.slice(
            1
          )}:${w.chain_id}`,
          key: w.chain_name,
          chainId: w.chain_id,
          iconLink: w.logo_uri,
          icon: 'curve-arrow',
        }))
        .sort((a, b) => {
          if (a.title > b.title) return 1;
          if (a.title < b.title) return -1;
          return 0;
        })
    );

    const citadelNetworks = computed(
      () => store.getters['networks/networksList']
    );

    const networkTargetWallets = computed(() => {
      if (!isBridgeMode.value) {
        return wallets.value.filter((w) => w.net === currentWallet.value.net);
      }

      return wallets.value.filter(
        (w) => w.config.chainId === searchNetworkToData.value.chain_id
      );
    });

    const networkTargetWalletsOsmo = computed(() => {
      const parseNetwork = citadelNetworks.value.find(
        (network) => network.chainId == 'osmosis-1'
      )?.net;

      return wallets.value.filter((w) => {
        const findFromAlias =
          w.net === parseNetwork &&
          w.title.toLowerCase().includes(osmosisAddress.value.toLowerCase());

        if (!osmosisAddress.value) {
          return w.net === parseNetwork || findFromAlias;
        }

        if (w.address === osmosisAddress.value) {
          return (
            (w.net === parseNetwork || findFromAlias) &&
            w.address !== osmosisAddress.value
          );
        }

        return (
          (w.net === parseNetwork &&
            w.address.includes(osmosisAddress.value)) ||
          findFromAlias
        );
      });
    });

    const setSlippage = (val) => {
      slippage.value = val;
    };

    const setAddress = (item) => {
      addressTo.value = item.address;
      showNetworkTargetWallets.value = false;
    };

    const setAddressOsmo = (item) => {
      osmosisAddress.value = item.address;
      showNetworkTargetWalletsOsmo.value = false;
    };

    const selectFromToken = (value) => {
      const tokenIBC = value.split(':')[1];

      const token = skipTokensFrom.value.find(
        (t) => shortIBC(t.denom?.toLowerCase()) === tokenIBC?.toLowerCase()
      );

      searchFromTokenData.value = token;
    };

    const selectToToken = (value) => {
      const tokenIBC = value.split(':')[1];
      const token = skipTokensTo.value.find(
        (t) => shortIBC(t.denom?.toLowerCase()) === tokenIBC?.toLowerCase()
      );

      searchToTokenData.value = token;
    };

    const networkToData = ref('');

    const selectToNetwork = async (network) => {
      searchNetworkTo.value = network.split(':')[0];
      searchNetworkToData.value = skipChains.value.find((ch) => {
        return ch.chain_id === network.split(':')[1];
      });

      searchNetworkToDataCitadelFormat.value = citadelNetworks.value.find(
        (c) => c.chainId === searchNetworkToData.value?.chain_id
      );

      networkToData.value = skipChains.value.find(
        (item) => item.chain_id === network.split(':')[1]
      );
      addressTo.value = '';
    };

    const getRoute = async () => {
      if (searchFromTokenData.value) {
        const valueMantissa = BigNumber(+amount.value)
          .times(BigNumber(10).pow(searchFromTokenData.value.decimals))
          .toFixed();
        const fromAmount = valueMantissa;
        const fromAddress = currentWallet.value.address;
        const toAddress = addressTo.value;

        isLoading.value = true;
        try {
          await store.dispatch('skip/getRoute', {
            amount: fromAmount,
            wallet: currentWallet.value,
            osmosisAddress: osmosisAddress.value,
            fromChain: currentWallet.value.config.chainId,
            toChain: currentWallet.value.config.chainId,
            fromDenom: searchFromTokenData.value.denom,
            toDenom: searchToTokenData.value.denom,
            fromAddress,
            toAddress,
            slippage: slippage.value,
          });

          isLoading.value = false;

          if (routeTx.value.amount_out) {
            showInfoModal.value = true;
          }
        } catch (err) {
          isLoading.value = false;
        }
        return;
      }

      // bridge
      const valueMantissa = BigNumber(+amount.value)
        .times(BigNumber(10).pow(currentWallet.value.decimals))
        .toFixed();
      const fromAmount = valueMantissa;
      const fromAddress = currentWallet.value.address;
      const toAddress = addressTo.value;

      const toNetwork = citadelNetworks.value.find(
        (network) => network.chainId == searchNetworkToData.value.chain_id
      );

      if (!toNetwork) {
        alert('no network');
        return;
      }
      isLoading.value = true;
      try {
        await store.dispatch('skip/getRoute', {
          amount: fromAmount,
          wallet: currentWallet.value,
          osmosisAddress: osmosisAddress.value,
          fromChain: currentWallet.value?.config?.chainId,
          toChain: searchNetworkToData.value.chain_id,
          fromDenom:
            currentWallet.value?.config?.primaryToken?.metaInfo?.nativeDenom,
          toDenom: toNetwork?.primaryToken?.metaInfo?.nativeDenom,
          fromAddress,
          toAddress,
          slippage: slippage.value,
        });

        if (routeTx.value.amount_out) {
          showInfoModal.value = true;
        }

        isLoading.value = false;
      } catch (err) {
        isLoading.value = false;
      }
    };

    const onCancel = () => {
      showLedgerConnect.value = false;
      isLoading.value = false;
      store.dispatch('skip/resetRoute');
    };

    const onSuccess = (hash) => {
      successHash.value = hash;
      showSuccessModal.value = true;
      store.dispatch('skip/resetRoute');
    };

    const closeAppInfoModal = () => {
      showInfoModal.value = false;
      store.dispatch('skip/resetRoute');
    };

    const connectLedgerCloseHandler = () => {
      showLedgerConnect.value = false;
    };

    const successClickHandler = async () => {
      txComment.value &&
        (await store.dispatch('transactions/postTransactionNote', {
          network: currentWallet.value.net,
          hash: successHash.value[0],
          text: txComment.value,
        }));
      txComment.value = '';
      showSuccessModal.value = false;
      connectLedgerCloseHandler();
    };

    const closeSuccessModal = () => {
      txComment.value = '';
      successHash.value = [];
      showSuccessModal.value = false;
      isLoading.value = false;
      showInfoModal.value = false;
      store.dispatch('skip/resetRoute');
      connectLedgerCloseHandler();
    };

    const onChangeComment = (comm) => {
      txComment.value = comm;
    };

    onMounted(async () => {
      isLoadingData.value = true;

      try {
        await store.dispatch('skip/fetchAssets');
        await store.dispatch('skip/fetchChains');
        onChangeCurrentTab('swap');
        chainFrom.value = skipChains.value.find((ch) => {
          return ch.chain_id === currentWallet.value.config.chainId;
        });

        hasSwap.value = !!chainFrom.value;
      } catch (err) {
        isLoadingData.value = false;
      }
      isLoadingData.value = false;
    });

    return {
      tabs,
      showInfoModal,
      searchNetworkToData,
      isLoadingData,
      isLoading,
      loadingTokens,
      chainFrom,

      osmosisAddress,

      searchToToken,
      searchFromToken,

      searchNetworkTo,
      selectToNetwork,

      allNetworks,
      WALLET_TYPES,

      skipTokens,
      skipTokensFrom,
      skipTokensTo,
      selectFromToken,
      selectToToken,

      isBridgeMode,

      searchToTokenData,
      searchFromTokenData,
      networkToData,

      //
      showNetworkTargetWallets,
      showNetworkTargetWalletsOsmo,
      networkTargetWallets,
      setAddress,
      setAddressOsmo,
      addressTo,
      amount,
      maxAmount,
      errorAmount,
      setSlippage,
      slippage,
      getRoute,
      currentWallet,
      networkTargetWalletsOsmo,
      showLedgerConnect,
      successHash,
      showSuccessModal,
      onCancel,
      onSuccess,
      closeAppInfoModal,
      connectLedgerCloseHandler,
      successClickHandler,
      closeSuccessModal,
      onChangeComment,
      appError,
      hasSwap,
      currentTab,
      onChangeCurrentTab,
      searchNetworkToDataCitadelFormat,
    };
  },
};
</script>
<style lang="scss" scoped>
.swap-skip {
  padding: 20px 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  .wrap-tabs {
    display: flex;
    width: 100%;
  }

  .mt10 {
    margin-top: 10px;
  }

  .network-target-wallets {
    width: calc(100% - 58px);
    z-index: 10;
    background: $white;
    padding: 10px 10px 0 10px;
    box-sizing: border-box;
    position: absolute;
    border-radius: 12px;
    border: 1px solid #c3ceeb;
    // border-top: none;
    // top: 70px;
  }

  .slippage {
    display: flex;
    align-items: center;
    // justify-content: space-between;

    &__wrap {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &__label {
      margin: 0 10px;
      font-family: 'Panton_Regular';
    }

    &__item {
      font-family: 'Panton_Bold';
      cursor: pointer;
      width: 55px;
      margin: 0 2px;
      height: 68px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      border-radius: 8px;
      background: #dae1f2;
      border: 1px solid #dae1f2;

      &.active {
        border: 1px solid $dark-blue;
      }

      &:first-child {
        margin-left: 10px;
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .wrap-row {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__submit-swap {
    margin-top: 30px;
  }

  &__contracts {
    width: 100%;
    display: flex;

    div {
      width: 50%;
      min-width: 50%;
      font-size: 11px;
      text-align: left;
      color: #00a3ff;
      word-wrap: break-word;

      &.hide {
        opacity: 0;
      }
    }
  }

  &__addresses {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  &__input {
    width: 100%;
    height: 68px;

    &.withError {
      margin-bottom: 25px;
    }
  }

  &__select-chain {
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    @include md {
      flex-direction: column;
    }

    &.z1000 {
      z-index: 1000;
    }

    &.z1001 {
      z-index: 1300;
    }

    &.z1002 {
      z-index: 1200;
    }
  }

  .towrap {
    background: #eaeef7;
    display: flex;
    flex-direction: column;
    width: 100%;
    border-radius: 20px;
    box-sizing: border-box;
    padding: 20px;
    margin-top: 20px;
  }

  .section {
    display: flex;
    width: 100%;
    align-items: baseline;
    margin-bottom: 20px;

    &__title {
      font-size: 22px;
      color: #000;

      span {
        text-transform: capitalize;
        color: #ff900d;
      }
    }

    &__sep {
      flex-grow: 1;
      border-bottom: 1px dashed #fff;
    }
  }

  .autocomplete {
    width: 100%;
    height: 68px;
    position: relative;
    @include md {
      &.ml10 {
        margin-left: 0;
        margin-top: 10px;
      }
    }
  }

  .load {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 272px;
  }
}

body.dark {
  .swap-skip {
    .towrap {
      background: #313354;
      display: flex;
      flex-direction: column;
      width: 100%;
      border-radius: 20px;
      box-sizing: border-box;
      padding: 20px;

      .section {
        .section__title {
          color: #fff;
        }
      }
    }

    .network-target-wallets {
      background: #393c55;
      border: 1px solid #4b4c63;
    }

    .slippage {
      &__item {
        background: #313354;
        color: #fff;
        border: 1px solid #4b4c63;

        &.active {
          border: 1px solid #00a3ff;
        }
      }
    }
  }
}
</style>
