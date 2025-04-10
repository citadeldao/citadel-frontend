<template>
  <div class="swap">
    <teleport to="body">
      <Modal v-if="showInfoModal">
        <InfoModal
          :tx-route="txRoute"
          :nonce="txNonce"
          :chain-id-from="hasSwap.chainId"
          :signer-wallet="currentWallet"
          :on-close="closeAppInfoModal"
          :to-token="searchTokenToComputed"
          :from-token="searchTokenFromComputed"
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
          :custom-code="searchTokenFromComputed?.symbol || ''"
          :amount="amount"
          :success-tx="successHash"
          @changeComment="onChangeComment"
        />
      </Modal>
    </teleport>
    <Info
      v-if="
        currentWallet.type === WALLET_TYPES.PUBLIC_KEY &&
        currentWalletType !== WALLET_TYPES.METAMASK
      "
      title="wallet.info.title"
      data-qa="send__info"
    />
    <template v-else>
      <div v-if="isLoadingData" class="load">
        <Loading />
      </div>
      <template v-else>
        <EmptyList v-if="!hasSwap" :title="appError" />
        <template v-else>
          <!-- NEW -->
          <template v-if="hasSwap && !isLoadingData">
            <div class="swap-wrap">
              <div class="swap-wrap__reverse">
                <arrowDownIcon width="15" height="13" />
              </div>
              <div class="swap-wrap__input mt10">
                <Input
                  id="amount"
                  v-model="amount"
                  :decimals="searchNetworkToData?.decimals"
                  type="currency"
                  :currency="searchNetworkToData?.symbol || ''"
                  :label="$t('swapView.amount')"
                  :max="maxAmount"
                  :show-set-max="+maxAmount !== 0"
                  :usd-amount="inAmountUsd"
                  placeholder="0.0"
                  icon="coins"
                  select-mode
                />
                <SwapSelect
                  :z-index="101"
                  :items="chainTokensFrom"
                  :selected-token="searchFromTokenData"
                  :custom-icon="
                    searchFromTokenData?.logoURI ? 'logoURI' : 'iconLink'
                  "
                  placeholder="Search for a token"
                  class="swap-wrap__select"
                  style="z-index: 1114"
                  @select="selectFromToken"
                />
              </div>
              <!-- // second -->
              <div class="autocomplete mt10" style="z-index: 1100">
                <Autocomplete
                  id="chains"
                  v-model:value="searchNetworkTo"
                  :items="allNetworks"
                  split-value
                  :custom-icon="searchNetworkToData?.iconLink || ''"
                  initial-icon="curve-arrow"
                  label="To chain"
                  :placeholder="$t('swapView.selectChain')"
                  @update:value="selectNetworkTo"
                />
              </div>
              <div v-if="searchNetworkToData" class="swap-wrap__input mt10">
                <Input
                  id="amount"
                  v-model="amountToReceive"
                  :decimals="searchTokenToComputed?.decimals"
                  type="currency"
                  readonly
                  :currency="searchTokenToComputed?.symbol || ''"
                  :label="$t('swapView.amount')"
                  :usd-amount="inAmountUsd"
                  placeholder="0.0"
                  icon="coins"
                  select-mode
                />
                <SwapSelect
                  :items="chainTokensTo"
                  :selected-token="searchTokenToComputed"
                  custom-icon="logoURI"
                  placeholder="Search for a token"
                  class="swap-wrap__select"
                  @select="selectToToken"
                />
              </div>
              <div
                v-if="searchNetworkToData"
                class="swap__input mt10"
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
              <div v-if="searchNetworkToData" class="swap__input mt10">
                <Input
                  id="fromTokenAddr"
                  v-model="fallbackAddress"
                  :label="$t('swapView.fallbackAddressLabel')"
                  :placeholder="$t('swapView.fallbackAddressPlaceholder')"
                  type="text"
                />
              </div>
              <div v-if="+maxAmount < +amount" class="error-input">
                {{ errorAmount }}
              </div>
              <div v-if="searchNetworkToData" class="swap-wrap__slippage-wrap">
                Powered by SQUID API
                <div
                  :class="{ active: showSlippage }"
                  class="slippage-settings"
                  @click="showSlippage = true"
                >
                  <SettingsIcon />
                </div>
              </div>
              <SwapSlippage
                v-if="showSlippage"
                store-name="squid"
                class="swap-wrap__slippage"
                @close="showSlippage = false"
              />
            </div>
            <PrimaryButton
              class="swap-jupiter__submit-swap"
              :loading="isLoading"
              :disabled="!!errorAmount || !+amount || !addressTo || isLoading"
              @click="getRoute(true)"
            >
              {{ $t('SWAP') }}
            </PrimaryButton>
          </template>
          <!-- OLD -->
          <div v-if="false" class="swap__select-chain z1001">
            <div class="autocomplete">
              <Autocomplete
                id="chainTokenFrom"
                v-model:value="searchFromToken"
                :items="chainTokensFrom"
                show-balance
                :custom-icon="
                  searchFromTokenData?.logoURI ||
                  searchFromTokenData?.iconLink ||
                  ''
                "
                initial-icon="curve-arrow"
                :label="$t('swapView.fromToken')"
                :placeholder="$t('swapView.selectContract')"
                @update:value="selectFromToken"
              />
            </div>
          </div>
          <div v-if="false" class="towrap">
            <div class="section">
              <div class="section__title">
                TO CHAIN <span>{{ searchNetworkTo }}</span>
              </div>
            </div>
            <div class="swap__select-chain z1000">
              <!-- <div v-if="false" class="autocomplete">
                <Autocomplete
                  id="chains"
                  v-model:value="searchNetworkFrom"
                  :items="allNetworks"
                  split-value
                  initial-icon="curve-arrow"
                  :label="$t('swapView.swapFromNetwork')"
                  :placeholder="$t('swapView.selectChain')"
                  @update:value="selectNetworkFrom"
                />
              </div> -->
              <div class="autocomplete">
                <Autocomplete
                  id="chains"
                  v-model:value="searchNetworkTo"
                  :items="allNetworks"
                  split-value
                  :custom-icon="searchNetworkToData?.iconLink || ''"
                  initial-icon="curve-arrow"
                  :label="$t('swapView.swapToNetwork')"
                  :placeholder="$t('swapView.selectChain')"
                  @update:value="selectNetworkTo"
                />
              </div>
            </div>
            <!-- contracts -->
            <div class="swap__select-chain mt10">
              <div class="autocomplete">
                <Autocomplete
                  id="chainTokenTo"
                  v-model:value="searchToToken"
                  :items="chainTokensTo"
                  split-value
                  :custom-icon="searchTokenToComputed?.logoURI || ''"
                  initial-icon="curve-arrow"
                  :label="$t('swapView.toToken')"
                  :placeholder="$t('swapView.selectContract')"
                  @update:value="selectToToken"
                />
              </div>
            </div>
            <div class="swap__contracts">
              <div
                :class="{
                  hide:
                    nativeContract.toLowerCase() ===
                    searchTokenToComputed?.address?.toLowerCase(),
                }"
                v-if="searchTokenToComputed?.address"
                class="ml10"
              >
                {{ searchTokenToComputed.address }}
              </div>
            </div>
          </div>
          <div
            class="swap__addresses"
            v-if="false && searchTokenFromComputed && searchTokenToComputed"
          >
            <div v-if="false" class="swap__input">
              <Input
                id="fromTokenAddr"
                v-model="addressFrom"
                disabled
                :label="$t('swapView.fromAddressLabel')"
                :placeholder="$t('swapView.addressPlaceholder')"
                type="text"
              />
            </div>
            <!-- SELECT TO ADDR -->
            <div
              class="swap__input mt10"
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
            <div v-if="false" class="swap__input mt10">
              <Input
                id="fromTokenAddr"
                v-model="fallbackAddress"
                :label="$t('swapView.fallbackAddressLabel')"
                :placeholder="$t('swapView.fallbackAddressPlaceholder')"
                type="text"
              />
            </div>
            <div
              v-if="false"
              :class="{ withError: +maxAmount < +amount }"
              class="swap__input mt10"
            >
              <Input
                id="amount"
                v-model="amount"
                :decimals="currentWallet?.config?.decimals"
                type="currency"
                :currency="searchTokenFromComputed?.symbol"
                :label="$t('swapView.amount')"
                :max="maxAmount"
                :show-set-max="+maxAmount !== 0"
                :show-error-text="+maxAmount < +amount"
                :error="errorAmount"
                placeholder="0.0"
                icon="coins"
              />
            </div>
            <!--  -->
            <div v-if="false" class="wrap-row mt10">
              <div class="swap__input">
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
            v-if="false"
            class="swap__submit-swap"
            :loading="isLoading"
            :disabled="!!errorAmount || !+amount || !addressTo"
            @click="getRoute(true)"
          >
            {{ $t('SWAP') }}
          </PrimaryButton>
        </template>
      </template>
    </template>
  </div>
</template>
<script>
import { computed, onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import Autocomplete from '@/components/UI/Autocomplete';
import PrimaryButton from '@/components/UI/PrimaryButton';
import Input from '@/components/UI/Input';
import useWallets from '@/compositions/useWallets';
import notify from '@/plugins/notify';
import Info from '@/components/Info';
import { WALLET_TYPES } from '@/config/walletType';
import Loading from '@/components/Loading';
import EmptyList from '@/components/EmptyList';
import BigNumber from 'bignumber.js';
import Modal from '@/components/Modal';
import InfoModal from './InfoModal.vue';
import SuccessModal from '@/views/Extensions/SuccessModal.vue';
import ConfirmLedgerModal from '@/components/Modals/Ledger/ConfirmLedgerModal';
import useCurrentWalletRequests from '@/compositions/useCurrentWalletRequests';
import AddressItem from '@/layouts/AddAddressLayout/components/CutomLists/components/AddressItem';
import { useI18n } from 'vue-i18n';
import SwapSelect from '@/components/UI/SwapSelect';
import SettingsIcon from '@/assets/icons/settings.svg';
import SwapSlippage from '@/components/UI/SwapSlippage';
import arrowDownIcon from '@/assets/icons/arrow-down.svg';

export default {
  components: {
    ConfirmLedgerModal,
    PrimaryButton,
    Autocomplete,
    Input,
    Info,
    Loading,
    EmptyList,
    Modal,
    InfoModal,
    SuccessModal,
    AddressItem,
    SwapSelect,
    SwapSlippage,
    SettingsIcon,
    arrowDownIcon,
  },
  setup() {
    const { t } = useI18n();
    const showInfoModal = ref(false);
    const showSuccessModal = ref(false);
    const txComment = ref('');
    const appError = ref(t('swapView.swapNotFound'));
    const isLoading = ref(false);
    const isLoadingData = ref(false);
    const store = useStore();
    const { currentWallet, wallets } = useWallets();
    const amount = ref('');
    const amountTo = ref('');
    const showSlippage = ref(false);
    const successHash = ref([]);
    const txNonce = ref(null);
    const slippage = ref(0.5);
    const showNetworkTargetWallets = ref(false);
    const nativeContract = ref('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE');

    const fromTokenAddrInput = ref('');
    const toTokenAddrInput = ref('');
    const fallbackAddress = ref('');

    const searchNetworkFrom = ref('');
    const searchNetworkTo = ref('');
    const searchNetworkToData = ref('');

    const searchFromToken = ref('');
    const searchFromTokenData = ref('');
    const searchToToken = ref('');
    const searchToTokenFullStr = ref('');

    const chainTokensFrom = ref([]);
    const chainTokensTo = ref([]);

    const addressFrom = ref('');
    const addressTo = ref('');

    const hasSwap = ref(null);
    const showLedgerConnect = ref(false);

    const squidChains = computed(() => store.getters['squid/chains']);
    const allTokens = computed(() => store.getters['squid/tokens']);
    const txRoute = computed(() => store.getters['squid/route']);

    const amountToReceive = computed(() => {
      return BigNumber(txRoute.value?.estimate?.toAmount)
        .div(BigNumber(10).pow(searchTokenToComputed?.value?.decimals))
        .toFixed(5);
    });

    const inAmountUsd = computed(() => {
      return +txRoute.value?.estimate?.toAmountUSD || 0;
    });

    const metamaskConnector = computed(
      () => store.getters['metamask/metamaskConnector']
    );

    const subtokensWallet = computed(() =>
      store.getters['subtokens/formatedSubtokens']()
    );

    const currentWalletType = computed(() => {
      const metamaskNet = metamaskConnector.value.network;
      const metamaskAddress =
        metamaskConnector.value.accounts[0] &&
        metamaskConnector.value.accounts[0].toLowerCase();
      const { address, net, type } = currentWallet.value;

      if (
        address.toLowerCase() === metamaskAddress &&
        net.includes(metamaskNet) &&
        type === WALLET_TYPES.PUBLIC_KEY
      ) {
        return WALLET_TYPES.METAMASK;
      }

      return currentWallet.value.type;
    });

    const { rawTx, rawTxError, prepareTransfer } = useCurrentWalletRequests();

    const connectLedgerCloseHandler = () => {
      showLedgerConnect.value = false;
    };

    const onCancel = () => {
      showLedgerConnect.value = false;
      isLoading.value = false;
    };

    watch(
      () => addressTo.value,
      () => {
        if (addressTo.value) {
          getRoute();
        }
      }
    );

    watch(
      () => amount.value,
      () => {
        if (!+amount.value) {
          store.dispatch('squid/resetRoute');
          return;
        } else {
          getRoute();
        }
      }
    );

    watch(
      () => store.getters['squid/slippage'],
      (newV) => {
        if (!newV) {
          store.dispatch('squid/resetRoute');
          return;
        }
        getRoute();
      }
    );

    onMounted(async () => {
      isLoadingData.value = true;
      addressFrom.value = currentWallet.value.address;

      try {
        await store.dispatch('squid/fetchChains');
        //await store.dispatch('squid/fetchTokens');
      } catch (err) {
        isLoadingData.value = false;
        appError.value = t('swapView.notAvailableRegion');
      }

      hasSwap.value = squidChains.value.find(
        (ch) =>
          ch.nativeCurrency.symbol.toLowerCase() ===
          currentWallet.value.code.toLowerCase()
      );

      if (currentWallet.value.net === 'arbitrum') {
        hasSwap.value = squidChains.value.find(
          (ch) => ch.chainName === 'Arbitrum'
        );
      }
      if (currentWallet.value.net === 'optimism') {
        hasSwap.value = squidChains.value.find(
          (ch) => ch.chainName === 'optimism'
        );
      }

      if (currentWallet.value.net === 'coreum') {
        hasSwap.value = squidChains.value.find(
          (ch) => ch.chainName === 'coreum'
        );
      }

      if (hasSwap.value) {
        selectNetworkFrom(
          `${hasSwap.value.chainName}:${hasSwap.value.chainId}`
        );
      }

      isLoadingData.value = false;
    });

    const allNetworks = computed(() =>
      []
        .concat(squidChains.value)
        .map((w) => ({
          axelarChainName: w.axelarChainName,
          id: w.chainName,
          title: `${w.chainName.slice(0, 1).toUpperCase()}${w.chainName.slice(
            1
          )}:${w.chainId}`,
          key: w.chainName,
          chainId: w.chainId,
          iconLink: w.chainIconURI,
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
      let parseNetwork = searchNetworkTo.value.toLowerCase(); // currentWallet.value.parentCoin?.net || currentWallet.value?.net;
      const networkSquid = allNetworks.value.find((item) =>
        item.title.includes(searchNetworkTo.value)
      );
      const networkChainId = networkSquid?.chainId;

      parseNetwork = citadelNetworks.value.find(
        (network) => network.chainId == networkChainId
      )?.net;

      return wallets.value.filter((w) => {
        const findFromAlias =
          w.net === parseNetwork &&
          w.title.toLowerCase().includes(addressTo.value.toLowerCase());

        if (!addressTo.value) {
          return w.net === parseNetwork || findFromAlias;
        }

        if (w.address === addressTo.value) {
          return (
            (w.net === parseNetwork || findFromAlias) &&
            w.address !== addressTo.value
          );
        }

        return (
          (w.net === parseNetwork && w.address.includes(addressTo.value)) ||
          findFromAlias
        );
      });
    });

    const setAddress = (item) => {
      addressTo.value = item.address;
      showNetworkTargetWallets.value = false;
    };

    const selectNetworkFrom = (network) => {
      searchFromToken.value = '';
      const selectChain = network.split(':')[0];

      if (!selectChain) {
        chainTokensFrom.value = [];
        return;
      }

      searchNetworkFrom.value = selectChain;

      const currentChain = squidChains.value.find(
        (n) =>
          n.chainName.toLocaleLowerCase() === selectChain.toLocaleLowerCase()
      );
      const tokens = allTokens.value.filter(
        (t) => t.chainId === currentChain?.chainId
      );

      const native = tokens.find(
        (token) =>
          token?.address?.toLowerCase() ===
            '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'.toLowerCase() ||
          token?.address?.length < 15
      );

      chainTokensFrom.value = [native].concat(
        tokens.filter((token) => {
          // filter citadel assets with balance in all tokens squid
          return subtokensWallet.value.find((subToken) => {
            return (
              +subToken?.tokenBalance?.mainBalance &&
              subToken?.net
                .toLowerCase()
                .includes(token?.address?.toLowerCase())
            );
          });
        })
      );

      if (!native) {
        chainTokensFrom.value = chainTokensFrom.value.slice(1);
      }

      if (
        chainTokensFrom.value[0]?.chainId ===
          chainTokensFrom.value[1]?.chainId &&
        chainTokensFrom.value[0]?.address === chainTokensFrom.value[1]?.address
      ) {
        chainTokensFrom.value = chainTokensFrom.value.slice(1);
      }

      chainTokensFrom.value = chainTokensFrom.value
        .map((token) => {
          const subToken = subtokensWallet.value.find((subToken) => {
            return (
              subToken?.net
                .toLowerCase()
                .includes(token?.address?.toLowerCase()) &&
              token?.address?.length > 20
            );
          });
          let balance;

          if (!subToken) {
            balance =
              BigNumber(currentWallet.value.balance.mainBalance).toFixed(4) ||
              0;
          } else {
            balance =
              BigNumber(subToken?.tokenBalance?.mainBalance).toFixed(4) || 0;
          }

          return {
            ...token,
            balance,
          };
        })
        .sort((a, b) => b.balance - a.balance);

      if (localStorage.getItem('swapContract')) {
        let swapFrom = localStorage.getItem('swapContract').split(':')[0];
        const symbolFrom = localStorage.getItem('swapContract').split(':')[1];
        localStorage.removeItem('swapContract');

        const findTokenFrom = chainTokensFrom.value.find(
          (t) =>
            t?.address?.toLowerCase() === swapFrom?.toLowerCase() ||
            t?.address?.toLowerCase().includes(swapFrom?.toLowerCase()) ||
            t?.address
              ?.toLowerCase()
              .includes(nativeContract.value.toLowerCase()) ||
            t?.name?.toLowerCase().includes(swapFrom?.toLowerCase()) ||
            t?.symbol.toLowerCase() === symbolFrom.toLowerCase()
        );

        if (findTokenFrom) {
          selectFromToken(findTokenFrom.name);
        }
      }
    };

    const selectNetworkTo = (network) => {
      searchToToken.value = '';
      searchToTokenFullStr.value = '';
      const selectChain = network.split(':')[0];

      if (!selectChain) {
        chainTokensTo.value = [];
        return;
      }

      searchNetworkTo.value = selectChain;
      searchNetworkToData.value = allNetworks.value.find(
        (item) => item.title === network
      );

      let currentChain = squidChains.value.find(
        (n) =>
          n.chainName.toLocaleLowerCase() === selectChain.toLocaleLowerCase()
      );

      if (!currentChain) currentChain = squidChains.value[0];

      const tokens = allTokens.value.filter(
        (t) => t.chainId === currentChain?.chainId
      );

      const nativeCoin = tokens.find(
        (t) => t.address?.toLowerCase() === nativeContract.value.toLowerCase()
      );

      chainTokensTo.value = [nativeCoin].concat(
        tokens
          .filter(
            (t) =>
              t.address?.toLowerCase() !== nativeContract.value.toLowerCase()
          )
          .sort((a, b) => {
            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1;
            return 0;
          })
      );

      if (!nativeCoin) {
        chainTokensTo.value = chainTokensTo.value.slice(1);
      }

      chainTokensTo.value = chainTokensTo.value.map((item) => {
        return {
          ...item,
          title: `${item.title}:${item.address}`,
        };
      });
    };

    const searchTokenFromComputed = computed(() => {
      return chainTokensFrom.value.find(
        (t) => t.name === searchFromToken.value
      );
    });

    const searchTokenToComputed = computed(() => {
      return chainTokensTo.value.find(
        (t) => t?.title === searchToTokenFullStr.value
      );
    });

    const selectFromToken = async (token) => {
      if (typeof token !== 'string') return;
      searchFromToken.value = token;

      searchFromTokenData.value = chainTokensFrom.value.find(
        (item) => item.name === token
      );
      amount.value = '';
      getRoute();
    };

    const selectToToken = (token) => {
      if (typeof token !== 'string') return;
      searchToTokenFullStr.value = token;

      searchToToken.value = token.split(':')[0];

      getRoute();
    };

    const getRoute = async (showLoadersAndModal) => {
      if (
        !+amount.value ||
        !searchTokenFromComputed.value ||
        !searchTokenFromComputed.value ||
        !addressTo.value
      )
        return;
      const slipp = store.getters['squid/slippage'];
      const fromChain = allNetworks.value.find(
        (item) => item.key === searchNetworkFrom.value
      )?.chainId;
      const toChain = allNetworks.value.find(
        (item) => item.key.toLowerCase() === searchNetworkTo.value.toLowerCase()
      )?.chainId;
      const fromToken = searchTokenFromComputed.value.address;
      const toToken = searchTokenToComputed.value.address;

      const valueMantissa = BigNumber(+amount.value)
        .times(BigNumber(10).pow(searchTokenFromComputed.value.decimals))
        .toFixed();
      const fromAmount = valueMantissa;
      const fromAddress = addressFrom.value;
      const toAddress = addressTo.value;

      isLoading.value = true;
      store.dispatch('squid/resetRoute');

      try {
        await store.dispatch('squid/getRoute', {
          fromChain,
          toChain,
          fromToken,
          toToken,
          fromAmount,
          fromAddress,
          toAddress,
          slippage: slipp,
          fallbackAddresses: fallbackAddress.value
            ? [{ address: fallbackAddress.value, coinType: 118 }]
            : [],
          // isEvm: currentWallet.value.fee_key === 'gasPrice',
        });
      } catch (err) {
        isLoading.value = false;
        if (err.response) {
          notify({
            type: 'warning',
            text: `${err?.response?.data?.errors[0]?.errorType}: ${err?.response?.data?.errors[0]?.message}`,
          });
        }
      }
      isLoading.value = false;

      const isCosmosNet =
        currentWallet.value?.config?.frontConfiguration?.data?.codebase ===
        'cosmos-sdk';

      if (txRoute.value?.estimate && !isCosmosNet) {
        try {
          await prepareTransfer({
            amount: 0.00001,
            toAddress: currentWallet.value.address,
            publicKey: currentWallet.value.publicKey,
          });
          if (rawTx.value.transaction) {
            txNonce.value = rawTx.value.transaction.nonce;
          }
          if (showLoadersAndModal) {
            showInfoModal.value = true;
          }
        } catch (err) {
          isLoadingData.value = false;
          notify({
            type: 'warning',
            text: rawTxError.value,
          });
          return;
        }
      }
      if (txRoute.value?.estimate && showLoadersAndModal) {
        showInfoModal.value = true;
      }
    };

    const closeAppInfoModal = () => {
      showInfoModal.value = false;
      store.dispatch('squid/resetRoute');
    };

    const onSuccess = (hash) => {
      successHash.value = hash;
      showSuccessModal.value = true;
    };

    const onChangeComment = (comm) => {
      txComment.value = comm;
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
      store.dispatch('squid/resetRoute');
      connectLedgerCloseHandler();
    };

    const setSlippage = (val) => {
      slippage.value = val;
    };

    const maxAmount = computed(() => {
      const token = subtokensWallet.value.find((token) => {
        return token.net
          .toLowerCase()
          .includes(
            searchTokenFromComputed.value?.address.toLowerCase() &&
              searchTokenFromComputed.value?.address?.length > 20
          );
      });

      if (
        searchTokenFromComputed.value?.address?.toLowerCase() ===
        '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'.toLowerCase()
      ) {
        if (currentWallet.value?.balance?.mainBalance - 0.0005 < 0) return 0;
        return currentWallet.value?.balance?.mainBalance - 0.0005;
      }

      if (!token) return searchTokenFromComputed.value?.balance || 0;

      return token?.tokenBalance?.mainBalance;
    });

    const errorAmount = computed(() => {
      if (+amount.value > +maxAmount.value) {
        return `Max amount for swap ${maxAmount.value}`;
      }
      return '';
    });

    return {
      nativeContract,
      showNetworkTargetWallets,
      networkTargetWallets,
      errorAmount,
      maxAmount,
      showLedgerConnect,
      connectLedgerCloseHandler,
      txNonce,
      onCancel,
      appError,

      showInfoModal,
      showSuccessModal,
      txRoute,

      isLoading,
      isLoadingData,
      WALLET_TYPES,
      amount,
      currentWallet,
      allNetworks,

      searchNetworkFrom,
      searchNetworkTo,

      searchFromToken,
      searchToToken,

      fallbackAddress,

      chainTokensFrom,
      chainTokensTo,

      searchFromTokenData,
      searchNetworkToData,

      fromTokenAddrInput,
      toTokenAddrInput,

      searchTokenFromComputed,
      searchTokenToComputed,

      addressFrom,
      addressTo,

      selectNetworkFrom,
      selectNetworkTo,

      selectFromToken,
      selectToToken,

      getRoute,

      hasSwap,

      currentWalletType,
      successHash,
      txComment,
      closeAppInfoModal,
      onSuccess,
      onChangeComment,
      successClickHandler,
      closeSuccessModal,
      slippage,
      setSlippage,
      setAddress,

      // new
      amountTo,
      showSlippage,
      amountToReceive,
      inAmountUsd,
    };
  },
};
</script>
<style lang="scss" scoped>
// NEW
.swap-wrap {
  width: 516px;
  position: relative;
  margin: 50px 0;

  .error-input {
    font-size: 14px;
    color: red;
    margin-top: 10px;
    position: absolute;
  }

  &__reverse {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #c3ceeb;
    position: absolute;
    left: calc(50% - 20px);
    z-index: 1114;
    top: 64px;

    svg {
      fill: #fff;
    }
  }

  &__input {
    position: relative;
  }

  &__slippage {
    position: absolute;
    top: 220px;
    z-index: 1112;
  }

  &__slippage-wrap {
    color: #afbccb;
    font-size: 14px;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 15px;

    .slippage-settings {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: #dae1f2;
      margin-left: 10px;
      cursor: pointer;

      &.active {
        background-color: $dark-blue;

        svg {
          fill: #fff;
        }
      }

      svg {
        fill: #4b4c63;
      }
    }
  }

  &__select {
    position: absolute;
    z-index: 100;
    right: 10px;
    top: 10px;
  }
}
// old
.swap {
  padding: 20px 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  .towrap {
    margin-top: 20px;
    background: #eaeef7;
    display: flex;
    flex-direction: column;
    width: 100%;
    border-radius: 20px;
    box-sizing: border-box;
    padding: 20px;
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

  .network-target-wallets {
    width: 100%;
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

  .wrap-row {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__select-chain {
    width: 100%;
    display: flex;
    align-items: center;

    @include md {
      flex-direction: column;
    }

    &.z1000 {
      z-index: 999;
    }

    &.z1001 {
      z-index: 1000;
    }
  }

  &__submit-swap {
    margin-top: 30px;
  }

  &__contracts {
    margin-top: 10px;
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
}

.autocomplete {
  width: 100%;
  height: 68px;
  position: relative;
  @include md {
    // width: 483px;

    &.ml10 {
      margin-left: 0;
      margin-top: 10px;
    }
  }
}

.ml10 {
  margin-left: 10px;
}

.mt10 {
  margin-top: 10px;
}

.load {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 272px;
}

body.dark {
  .swap {
    .towrap {
      margin-top: 20px;
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

body.dark {
  // NEW
  .swap-wrap {
    &__reverse {
      background-color: rgba(57, 59, 83, 1);

      svg {
        fill: rgba(139, 155, 199, 1);
      }
    }

    &__slippage-wrap {
      color: rgba(107, 147, 192, 1);

      .slippage-settings {
        background-color: rgba(49, 51, 84, 1);

        &.active {
          background-color: $dark-blue;

          svg {
            fill: #fff;
          }
        }

        svg {
          fill: rgba(139, 155, 199, 1);
        }
      }
    }
  }
}
</style>
