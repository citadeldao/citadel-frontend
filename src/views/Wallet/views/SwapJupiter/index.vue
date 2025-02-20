<template>
  <div class="swap-jupiter">
    <teleport to="body">
      <Modal v-if="showInfoModal">
        <InfoModal
          :signer-wallet="currentWallet"
          :on-close="closeAppInfoModal"
          :from-token="searchFromTokenData"
          :to-token="searchToTokenData"
          :to-address="addressTo"
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
          :custom-code="currentWallet?.code || ''"
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
        <div class="towrap">
          <div class="section">
            <div class="section__title">
              FROM TOKEN <span>{{ searchFromToken }}</span>
            </div>
          </div>
          <div class="swap-jupiter__select-chain z1000">
            <div class="autocomplete">
              <Autocomplete
                id="chainTokenFrom"
                v-model:value="searchFromToken"
                :items="allNetworks"
                split-value
                :custom-icon="searchFromTokenData?.logoURI || ''"
                initial-icon="curve-arrow"
                :label="$t('swapView.selectContract')"
                :placeholder="$t('swapView.fromToken')"
                :slice-items-count="10"
                @update:value="selectFromToken"
              />
            </div>
          </div>
        </div>
        <!-- PART2 -->
        <div class="swap-jupiter__addresses" v-if="searchFromTokenData?.title">
          <div class="swap-jupiter__select-chain z1000">
            <div class="autocomplete">
              <Autocomplete
                id="chainTokenTo"
                v-model:value="searchToToken"
                :items="allNetworks"
                split-value
                initial-icon="curve-arrow"
                :custom-icon="searchToTokenData?.logoURI || ''"
                :label="$t('swapView.selectContract')"
                :placeholder="$t('swapView.toToken')"
                :slice-items-count="10"
                @update:value="selectToToken"
              />
            </div>
            <div
              v-if="!!amountToReceive && amountToReceive !== 'NaN'"
              class="to-receive-block"
            >
              {{ amountToReceive }}
              <span>{{ searchToTokenData?.symbol }}</span>
            </div>
          </div>
          <div
            :class="{ withError: +maxAmount < +amount }"
            class="swap-jupiter__input mt10"
          >
            <Input
              id="amount"
              v-model="amount"
              :decimals="
                searchFromTokenData?.decimals || currentWallet?.config?.decimals
              "
              type="currency"
              :currency="searchFromTokenData?.symbol || currentWallet?.code"
              :label="$t('swapView.amount')"
              :max="maxAmount"
              :show-set-max="+maxAmount !== 0"
              :show-error-text="+maxAmount < +amount"
              :error="errorAmount"
              placeholder="0.0"
              @input="onInputAmount"
              icon="coins"
            />
          </div>
          <!--  -->
          <div class="wrap-row mt10">
            <div class="swap-jupiter__input">
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
          class="swap-jupiter__submit-swap"
          :loading="isLoading"
          :disabled="!!errorAmount || !+amount"
          @click="getRoute(true)"
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
import Modal from '@/components/Modal';
import InfoModal from './InfoModal.vue';
import SuccessModal from '@/views/Extensions/SuccessModal.vue';
import ConfirmLedgerModal from '@/components/Modals/Ledger/ConfirmLedgerModal';
import EmptyList from '@/components/EmptyList';
import Info from '@/components/Info';
import { WALLET_TYPES } from '@/config/walletType';
import { useI18n } from 'vue-i18n';

export default {
  components: {
    Info,
    Loading,
    Autocomplete,
    PrimaryButton,
    Input,
    Modal,
    InfoModal,
    SuccessModal,
    ConfirmLedgerModal,
    EmptyList,
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

    const showLedgerConnect = ref(false);

    //
    const slippage = ref(0.5);
    const showNetworkTargetWallets = ref(false);

    const addressTo = ref('');

    const amount = ref('');

    const skipTokens = computed(() => store.getters['skip/tokens']);
    const jupTokens = computed(() => store.getters['jupiter/tokens']);

    const route = computed(() => store.getters['jupiter/route']);

    const amountToReceive = computed(() => {
      return BigNumber(route.value?.outAmount)
        .div(BigNumber(10).pow(searchToTokenData?.value?.decimals))
        .toFixed(5);
    });

    const subtokensWallet = computed(() =>
      store.getters['subtokens/formatedSubtokens']()
    );

    const maxAmount = computed(() => {
      const token = subtokensWallet.value.find((t) =>
        t?.net?.includes(searchFromTokenData?.value?.address)
      );

      if (token) {
        return token.balanceUSD;
      }
      if (
        searchFromTokenData?.value?.address ===
        'So11111111111111111111111111111111111111112'
      ) {
        if (currentWallet.value?.balance?.mainBalance - 0.0005 < 0) return 0;
        return currentWallet.value?.balance?.mainBalance - 0.0005;
      }
      return 0;
    });

    const errorAmount = computed(() => {
      if (+amount.value > +maxAmount.value) {
        return `Max amount for swap ${maxAmount.value}`;
      }
      return '';
    });

    const allNetworks = computed(
      () => [].concat(jupTokens.value)
      // .sort((a, b) => {
      //   if (a.title > b.title) return 1;
      //   if (a.title < b.title) return -1;
      //   return 0;
      // })
    );

    const networkTargetWallets = computed(() => {
      return wallets.value.filter((w) => {
        return w.net === 'solana';
      });
    });

    const setSlippage = (val) => {
      slippage.value = val;
    };

    const setAddress = (item) => {
      addressTo.value = item.address;
      showNetworkTargetWallets.value = false;
    };

    const selectFromToken = async (title) => {
      searchFromTokenData.value = jupTokens.value.find((token) => {
        return token.title === title;
      });

      addressTo.value = '';
      getRoute();
    };

    const selectToToken = async (title) => {
      searchToTokenData.value = jupTokens.value.find((token) => {
        return token.title === title;
      });

      addressTo.value = '';
      getRoute();
    };

    const getRoute = async (showLoadersAndModal) => {
      if (
        !searchFromTokenData?.value?.address ||
        !searchToTokenData?.value?.address ||
        !amount.value ||
        +maxAmount.value < +amount.value
      ) {
        store.dispatch('jupiter/resetRoute');
        return;
      }
      const valueMantissa = BigNumber(+amount.value)
        .times(
          BigNumber(10).pow(
            searchFromTokenData?.value?.decimals || currentWallet.value.decimals
          )
        )
        .toFixed();

      isLoading.value = true;
      try {
        const res = await store.dispatch('jupiter/getRoute', {
          inputMint: searchFromTokenData?.value?.address,
          outputMint: searchToTokenData?.value?.address,
          amount: valueMantissa.split('.')[0],
          slippageBps: slippage.value * 100,
          publicKey: currentWallet?.value?.publicKey,
        });
        if (!res.error) {
          if (showLoadersAndModal) {
            showInfoModal.value = true;
          }
          isLoading.value = false;
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

    const onInputAmount = (val) => {
      if (!val) {
        store.dispatch('jupiter/resetRoute');
        return;
      }
      getRoute();
    };

    onMounted(async () => {
      isLoadingData.value = true;
      addressTo.value = currentWallet.value.address;

      try {
        await store.dispatch('jupiter/fetchTokens');

        hasSwap.value = jupTokens.value.length;
      } catch (err) {
        isLoadingData.value = false;
      }
      isLoadingData.value = false;
    });

    return {
      showInfoModal,

      isLoadingData,
      isLoading,
      loadingTokens,
      skipTokens,
      chainFrom,

      searchToToken,
      searchToTokenData,

      searchFromToken,
      searchFromTokenData,

      selectFromToken,
      selectToToken,

      allNetworks,
      WALLET_TYPES,

      //
      showNetworkTargetWallets,

      networkTargetWallets,
      setAddress,

      addressTo,
      amount,
      maxAmount,
      errorAmount,
      setSlippage,
      slippage,
      getRoute,
      currentWallet,

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
      onInputAmount,
      amountToReceive,
    };
  },
};
</script>
<style lang="scss" scoped>
.swap-jupiter {
  padding: 20px 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

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
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .to-receive-block {
      position: absolute;
      z-index: 100;
      right: 25px;
      top: 25px;
      font-weight: bold;

      span {
        color: $dark-blue;
      }
    }

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
  .swap-jupiter {
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
</style>
