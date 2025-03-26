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
      <!-- NEW -->
      <template v-if="hasSwap && !isLoadingData">
        <div class="swap-wrap">
          <div class="swap-wrap__reverse" @click="reverseSwap">
            <arrowDownIcon width="15" height="13" />
          </div>
          <div class="swap-jupiter__input mt10">
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
              :usd-amount="fromAmountUsd"
              placeholder="0.0"
              icon="coins"
              select-mode
            />
            <SwapSelect
              :z-index="101"
              :items="
                allNetworks.filter(
                  (item) => item?.address !== searchToTokenData?.address
                )
              "
              :selected-token="searchFromTokenData"
              custom-icon="logoURI"
              placeholder="Search for a token"
              class="swap-wrap__select"
              @select="selectFromToken"
            />
          </div>
          <div class="swap-jupiter__input mt10">
            <Input
              id="amount"
              v-model="amountToReceive"
              :decimals="searchToTokenData?.decimals"
              type="currency"
              readonly
              :currency="searchToTokenData?.symbol || ''"
              :label="$t('swapView.amount')"
              :show-error-text="+maxAmount < +amount"
              :error="errorAmount"
              :usd-amount="fromAmountUsd"
              placeholder="0.0"
              icon="coins"
              select-mode
            />
            <SwapSelect
              :items="
                allNetworks.filter(
                  (item) => item?.address !== searchFromTokenData?.address
                )
              "
              :selected-token="searchToTokenData"
              custom-icon="logoURI"
              placeholder="Search for a token"
              class="swap-wrap__select"
              @select="selectToToken"
            />
          </div>
          <div class="swap-wrap__slippage-wrap">
            Powered by JUPITER API
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
            class="swap-wrap__slippage"
            @close="showSlippage = false"
          />
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
      <EmptyList v-if="!hasSwap && !isLoadingData" :title="appError" />
    </template>
  </div>
</template>
<script>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import useWallets from '@/compositions/useWallets';
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

import SwapSelect from '@/components/UI/SwapSelect';
import arrowDownIcon from '@/assets/icons/arrow-down.svg';
import SettingsIcon from '@/assets/icons/settings.svg';
import SwapSlippage from '@/components/UI/SwapSlippage';

export default {
  components: {
    Info,
    Loading,
    PrimaryButton,
    Input,
    Modal,
    InfoModal,
    SuccessModal,
    ConfirmLedgerModal,
    EmptyList,
    SwapSelect,
    arrowDownIcon,
    SettingsIcon,
    SwapSlippage,
  },
  setup() {
    const { t } = useI18n();
    const store = useStore();
    const { currentWallet } = useWallets();
    const showInfoModal = ref(false);
    const successHash = ref([]);
    const txComment = ref('');
    const showSuccessModal = ref(false);
    const showSlippage = ref(false);
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

    const addressTo = ref('');

    const amount = ref('');
    const amountTo = ref('');

    const skipTokens = computed(() => store.getters['skip/tokens']);
    const jupTokens = computed(() => store.getters['jupiter/tokens']);

    const route = computed(() => store.getters['jupiter/route']);

    const fromAmountUsd = computed(() => {
      return route?.value?.swapUsdValue?.slice(0, 7);
    });

    const amountToReceive = computed(() => {
      return BigNumber(route.value?.outAmount)
        .div(BigNumber(10).pow(searchToTokenData?.value?.decimals))
        .toFixed(5);
    });

    const inAmountUsd = computed(() => {
      return BigNumber(route.value?.inAmount)
        .div(BigNumber(10).pow(searchFromTokenData?.value?.decimals))
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
      () => {
        return [].concat(
          jupTokens.value.map((item) => {
            const token = subtokensWallet.value.find((t) =>
              t.net.includes(item.address)
            );
            let balance = token?.tokenBalance?.mainBalance || 0;

            if (
              item.address === 'So11111111111111111111111111111111111111112'
            ) {
              balance = currentWallet.value?.balance?.mainBalance;
            }
            return {
              ...item,
              balance,
            };
          })
        );
      }
      // .sort((a, b) => {
      //   if (a.title > b.title) return 1;
      //   if (a.title < b.title) return -1;
      //   return 0;
      // })
    );

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

    const reverseSwap = () => {
      if (!searchFromTokenData.value?.title || !searchToTokenData.value?.title)
        return;
      amount.value = '';
      const from = { ...searchFromTokenData.value };
      const to = { ...searchToTokenData.value };

      searchToTokenData.value = { ...from };
      searchFromTokenData.value = { ...to };
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
          slippageBps: store.getters['jupiter/slippage'] * 100,
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

    watch(
      () => amount.value,
      () => {
        if (!+amount.value) {
          store.dispatch('jupiter/resetRoute');
          return;
        } else {
          getRoute();
        }
      }
    );

    watch(
      () => store.getters['jupiter/slippage'],
      (newV) => {
        if (!newV) {
          store.dispatch('jupiter/resetRoute');
          return;
        }
        getRoute();
      }
    );

    onBeforeUnmount(() => {
      store.dispatch('jupiter/resetRoute');
    });

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
      amountTo,

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

      addressTo,
      amount,
      maxAmount,
      errorAmount,
      getRoute,
      currentWallet,
      routeObj: route,

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
      amountToReceive,
      inAmountUsd,
      fromAmountUsd,
      reverseSwap,
      showSlippage,
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

  &__reverse {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #c3ceeb;
    position: absolute;
    left: calc(50% - 20px);
    z-index: 100;
    top: calc(50% - 35px);

    &:hover {
      background-color: #a8b2cc;
    }

    svg {
      fill: #fff;
    }
  }

  &__slippage {
    position: absolute;
    top: -12px;
    z-index: 105;
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
// OLD
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

  &__submit-swap {
    margin-top: 30px;
  }

  &__input {
    width: 100%;
    height: 68px;
    position: relative;
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
