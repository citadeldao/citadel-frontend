<template>
  <StakePlaceholder
    v-if="
      !currentToken.tokenBalance.stake &&
      (currentWallet.type !== WALLET_TYPES.PUBLIC_KEY ||
        currentWalletType === WALLET_TYPES.METAMASK)
    "
    :current-wallet="currentWallet"
    :current-token="currentToken"
    is-xct
    @click:placeholder="toggleShowPlaceholder"
  />
  <div v-else class="xct-staking">
    <div
      v-if="
        currentWallet.type === WALLET_TYPES.PUBLIC_KEY &&
        currentWalletType !== WALLET_TYPES.METAMASK
      "
      class="xct-staking__lock-banner"
    >
      <LockBanner @showPlaceholder="$emit('showPlaceholder')" />
    </div>
    <div
      v-if="currentToken.tokenBalance.stake"
      class="xct-staking__stake-chart"
    >
      <StakeChart :chart-data="chartData" />
    </div>
    <div v-if="currentToken.tokenBalance.stake" class="xct-staking__stake-list">
      <div class="xct-staking__stake-list-item">
        <StakeListItem
          :index="0"
          icon="citadel"
          :item="{
            name: 'Staked balance',
            value: currentToken.tokenBalance.stake,
            stakeShare: shareInValue(
              currentToken.tokenBalance.stake,
              currentToken.tokenBalance.stake
            ),
          }"
          type="staked"
          :current-wallet="currentToken"
          :balance="currentToken.tokenBalance"
        />
      </div>
      <div class="xct-staking__stake-list-item">
        <StakeListItem
          icon="citadel"
          type="avaliable"
          :current-wallet="currentToken"
          :balance="currentToken.tokenBalance"
        />
      </div>
    </div>
    <div
      v-if="
        currentWallet.type !== WALLET_TYPES.PUBLIC_KEY ||
        currentWalletType === WALLET_TYPES.METAMASK
      "
      class="xct-staking__buttons"
    >
      <PrimaryButton
        bg-color="white"
        color="#6B93C0"
        box-shadow="none"
        border="1px solid #6B93C0"
        hover-border="1px solid #1A53F0"
        hover-color="#1A53F0"
        hover-bg-color=""
        data-qa="Unstake"
        @click="toUnstake"
      >
        {{ $t('unstake') }}
      </PrimaryButton>
      <PrimaryButton @click="toStake" data-qa="Stake">
        {{ $t('Stake') }}
      </PrimaryButton>
    </div>
  </div>
  <WalletButtonsPanel
    v-if="
      currentWallet.type !== WALLET_TYPES.PUBLIC_KEY ||
      currentWalletType === WALLET_TYPES.METAMASK
    "
    :current-token="currentToken"
    :current-wallet="currentWallet"
    :button1="buttonsPannelData.button1"
    :button2="buttonsPannelData.button2"
    :type="buttonsPannelData.type"
    @button1click="toUnstake"
    @button2click="toStake"
    @prepareClaim="$emit('prepareClaim')"
    @prepareXctClaim="$emit('prepareXctClaim')"
  />
  <teleport v-if="isLoading" to="body">
    <Modal>
      <img src="@/assets/gif/loader.gif" alt="" />
    </Modal>
  </teleport>
  <teleport v-if="showModal" to="body">
    <Modal>
      <ModalContent
        v-if="showSetStakingAmount"
        v-click-away="modalCloseHandler"
        :title="$t(setStakingAmountModalData.title)"
        :desc="setStakingAmountModalData.desc"
        type="action"
        :button-text="setStakingAmountModalData.button"
        :disabled="disabled"
        @close="modalCloseHandler"
        @buttonClick="prepareDelegation"
      >
        <XCTSetStakingAmount
          :amount="amount"
          :current-wallet="currentToken"
          @nextStep="prepareDelegation"
        />
      </ModalContent>
      <ModalContent
        v-if="showConfirmTransaction"
        v-click-away="modalCloseHandler"
        :title="actionModalData.title"
        :desc="actionModalData.desc"
        button-text="confirm"
        type="action"
        :disabled="!!inputError"
        @close="modalCloseHandler"
        @buttonClick="stake"
      >
        <ActionModalContent
          :current-token="currentToken"
          :wallet="currentWallet"
          :staking-amount="amount"
          :staking-fee="fee"
          :hide-password="
            isHardwareWallet || currentWalletType === WALLET_TYPES.METAMASK
          "
          @submitSend="stake"
        />
      </ModalContent>

      <!-- Confirm Ledger Modals -->
      <ConnectLedgerModal
        v-else-if="showConnectLedgerModal"
        v-click-away="connectLedgerCloseHandler"
        :error="ledgerError"
        @close="connectLedgerCloseHandler"
        @buttonClick="connectLedgerClickHandler"
      />
      <OpenAppLedgerModal
        v-else-if="showAppLedgerModal"
        v-click-away="appLedgerCloseHandler"
        @close="appLedgerCloseHandler"
        @buttonClick="appLedgerClickHandler"
      />
      <ConfirmLedgerModal
        v-else-if="showConfirmLedgerModal"
        @close="confirmLedgerCloseHandler"
      />
      <RejectLedgerModal
        v-else-if="showRejectedLedgerModal"
        v-click-away="rejectedLedgerCloseHandler"
        @close="rejectedLedgerCloseHandler"
        @buttonClick="rejectedLedgerClickHandler"
      />

      <ModalContent
        v-if="showSuccessModal"
        v-click-away="modalCloseHandler"
        title="Success"
        :desc="$t('txWaitTitle')"
        button-text="ok"
        type="success"
        icon="success"
        @close="modalCloseHandler"
        @buttonClick="successClickHandler"
      >
        <SuccessModalContent
          v-model:txComment="txComment"
          :to="mode === 'unstake' ? currentWallet.address : ''"
          :wallet="currentWallet"
          :amount="amount"
          :fee="fee"
          :type="mode"
          :tx-hash="txHash"
          :show-from="mode === 'stake'"
        />
      </ModalContent>
    </Modal>
  </teleport>
</template>

<script>
import XCTSetStakingAmount from './XCTSetStakingAmount.vue';
import { useI18n } from 'vue-i18n';
import useCheckPassword from '@/compositions/useCheckPassword';

import WalletButtonsPanel from '@/components/WalletButtonsPanel';
import SuccessModalContent from '../../Send/components/SuccessModalContent.vue';
import ActionModalContent from './ActionModalContent.vue';
import ConfirmLedgerModal from '@/components/Modals/Ledger/ConfirmLedgerModal';
import ConnectLedgerModal from '@/components/Modals/Ledger/ConnectLedgerModal';
import OpenAppLedgerModal from '@/components/Modals/Ledger/OpenAppLedgerModal';
import RejectLedgerModal from '@/components/Modals/Ledger/RejectLedgerModal';
import StakePlaceholder from './StakePlaceholder.vue';
import Modal from '@/components/Modal';
import ModalContent from '@/components/ModalContent';
import PrimaryButton from '@/components/UI/PrimaryButton';
import StakeListItem from './StakeListItem.vue';
import StakeChart from './StakeChart.vue';
import LockBanner from './LockBanner.vue';
import { WALLET_TYPES } from '@/config/walletType';
import { computed, provide, ref } from '@vue/runtime-core';
import { shareInValue } from '@/helpers';
import useStaking from '@/compositions/useStaking';
import { useStore } from 'vuex';
import useLedger from '@/compositions/useLedger';
import useTrezor from '@/compositions/useTrezor';
import useWallets from '@/compositions/useWallets';
import useCurrentWalletRequests from '@/compositions/useCurrentWalletRequests';

import notify from '@/plugins/notify';
import amountInputValidation from '@/helpers/amountInputValidation';

export default {
  name: 'XCTStaking',
  components: {
    LockBanner,
    StakeListItem,
    StakeChart,
    PrimaryButton,
    Modal,
    ModalContent,
    XCTSetStakingAmount,
    StakePlaceholder,
    ActionModalContent,
    SuccessModalContent,
    WalletButtonsPanel,
    ConfirmLedgerModal,
    ConnectLedgerModal,
    OpenAppLedgerModal,
    RejectLedgerModal,
  },
  props: {
    currentWallet: {
      type: Object,
      default: () => ({}),
    },
    stakeNodes: {
      type: Array,
      default: () => [],
    },
    currentToken: {
      type: [Object, null],
      default: null,
    },
  },
  emits: ['showPlaceholder', 'prepareClaim', 'prepareXctClaim', 'stake'],
  setup(props, { emit }) {
    useStaking();

    const { isHardwareWallet } = useWallets();

    const { getDelegationBalance } = useCurrentWalletRequests();

    const disabledConfirm = computed(
      () => passwordIncorrect.value && !isHardwareWallet.value
    );
    const mode = ref('stake');
    provide('mode', mode);

    const { t } = useI18n();
    const showSetStakingAmount = ref(false);
    const showConfirmTransaction = ref(false);
    const showSuccessModal = ref(false);

    const metamaskConnector = computed(
      () => store.getters['metamask/metamaskConnector']
    );

    const currentWalletType = computed(() => {
      const metamaskNet = metamaskConnector.value.network;
      const metamaskAddress =
        metamaskConnector.value.accounts[0] &&
        metamaskConnector.value.accounts[0].toLowerCase();
      const { address, net, type } = props.currentWallet;

      if (
        address.toLowerCase() === metamaskAddress &&
        net.includes(metamaskNet) &&
        type === WALLET_TYPES.PUBLIC_KEY
      ) {
        return WALLET_TYPES.METAMASK;
      }

      return props.currentWallet.type;
    });

    const showModal = computed(() => {
      return (
        showSetStakingAmount.value ||
        showConfirmTransaction.value ||
        showConnectLedgerModal.value ||
        showAppLedgerModal.value ||
        showConfirmLedgerModal.value ||
        showRejectedLedgerModal.value ||
        showSuccessModal.value
      );
    });

    const toggleShowPlaceholder = () => {
      showSetStakingAmount.value = true;
    };
    const modalCloseHandler = () => {
      showSetStakingAmount.value = false;
      mode.value = 'stake';
      showConfirmTransaction.value = false;
      showSuccessModal.value = false;
      updatePassword('');
      txComment.value = '';
      amount.value = '';
      clearLedgerModals();
      getDelegationBalance();
    };

    const toStake = () => {
      showSetStakingAmount.value = true;
    };

    const setStakingAmountModalData = computed(() => {
      if (mode.value === 'stake') {
        return {
          title: 'staking.Stake',
          desc: t('xct.setStakingAmountModalDesc'),
          button: 'staking.Stake',
        };
      }

      return {
        title: 'unstaking.unstake',
        desc: t('xct.setStakingAmountModalDesc1'),
        button: 'unstaking.unstake',
      };
    });

    const amount = ref('');
    const updateAmount = (value) => {
      amount.value = value;
    };
    provide('updateAmount', updateAmount);

    const maxAmount = computed(() => {
      if (mode.value === 'unstake') {
        return props.currentToken.tokenBalance.stake;
      }

      const max = props.currentToken.tokenBalance.mainBalance;

      if (max > 0) {
        return max;
      }

      return 0;
    });
    provide('maxAmount', maxAmount);

    const insufficientFunds = computed(() =>
      amountInputValidation({
        amount: amount.value,
        wallet: props.currentWallet,
        maxAmount: +maxAmount.value,
      })
    );
    provide('insufficientFunds', insufficientFunds);

    const disabled = computed(() => {
      if (insufficientFunds.value || amount.value <= 0) {
        return true;
      }

      return false;
    });

    const toUnstake = () => {
      mode.value = 'unstake';
      showSetStakingAmount.value = true;
    };

    const { password, passwordIncorrect, passwordError, inputError } =
      useCheckPassword();
    const updatePassword = (value) => {
      password.value = value;
    };
    provide('password', password);
    provide('updatePassword', updatePassword);
    provide('passwordError', passwordError);
    provide('inputError', inputError);

    const actionModalData = computed(() => {
      if (mode.value === 'unstake') {
        return {
          title: t('unstaking.actionModalTitle'),
          desc: t('unstaking.actionModalDesc'),
        };
      }

      return {
        title: t('staking.actionModalTitle'),
        desc: t('staking.actionModalDesc'),
      };
    });

    const fee = ref();
    const txHash = ref();
    const resRawTxs = ref();
    const prepareDelegation = async () => {
      isLoading.value = true;
      const { currentWallet: parrentWallet } = useWallets();
      const { ok, rawTxs, resFee } =
        await props.currentWallet.prepareDelegation({
          walletId: props.currentWallet.id,
          amount: amount.value,
          type: mode.value,
          parentWalletBalance: parrentWallet.value.balance.mainBalance,
        });

      if (ok) {
        fee.value = resFee;
        resRawTxs.value = rawTxs;
        showSetStakingAmount.value = false;
        showConfirmTransaction.value = true;
        isLoading.value = false;
      } else {
        modalCloseHandler();
      }

      isLoading.value = false;
    };

    const {
      showConnectLedgerModal,
      showConfirmLedgerModal,
      showAppLedgerModal,
      showRejectedLedgerModal,
      ledgerError,
      clearLedgerModals,
      ledgerErrorHandler,
      isLedgerWallet,
    } = useLedger();

    const { isTrezorWallet } = useTrezor();

    const store = useStore();
    const txComment = ref('');
    const successClickHandler = async () => {
      txComment.value &&
        (await store.dispatch('transactions/postTransactionNote', {
          network: props.currentWallet.net,
          hash: txHash.value[0],
          text: txComment.value,
        }));
      txComment.value = '';
      emit('stake');
      modalCloseHandler();
    };

    const buttonsPannelData = computed(() => {
      if (!props.currentWallet?.tokenBalance.stake) {
        return {
          type: '',
          button2: 'startStaking',
        };
      }

      return {
        type: 'stake',
        button1: 'unstake',
        button2: 'Stake',
      };
    });

    const isLoading = ref(false);
    const chartData = computed(() => {
      const data = [
        {
          name: 'Staked balance',
          color: '#FF5722',
          share: shareInValue(
            props.currentToken?.tokenBalance.calculatedBalance,
            props.currentToken?.tokenBalance.stake
          ),
        },
        {
          name: 'Avaliable balance',
          color: '#AFBCCB',
          share: shareInValue(
            props.currentToken?.tokenBalance.calculatedBalance,
            props.currentToken?.tokenBalance.mainBalance
          ),
        },
      ];

      return data.filter((item) => item.share > 0);
    });

    const txError = ref();

    const stake = async () => {
      // metamask, ...
      if (currentWalletType.value === WALLET_TYPES.METAMASK) {
        isLoading.value = true;
        const metamaskResult =
          await metamaskConnector.value.sendMetamaskTransaction(
            resRawTxs.value
          );

        if (metamaskResult.error) {
          notify({
            type: 'warning',
            text: metamaskResult.error,
          });
        } else {
          showConfirmTransaction.value = false;
          showSuccessModal.value = true;
          txHash.value = [metamaskResult.txHash];
        }

        isLoading.value = false;

        return;
      }

      if (passwordError.value && !isHardwareWallet.value) {
        inputError.value = passwordError.value;

        return;
      }

      isLoading.value = true;

      if (isLedgerWallet.value || isTrezorWallet.value) {
        isLoading.value = false;
        showConfirmTransaction.value = false;

        clearLedgerModals();

        if (isLedgerWallet.value) {
          showConfirmLedgerModal.value = true;
        }

        const res = await props.currentWallet.signAndSendMulti({
          walletId: props.currentWallet.id,
          rawTransactions: resRawTxs.value,
          derivationPath: props.currentWallet.derivationPath,
        });

        if (!res.error) {
          showConfirmLedgerModal.value = false;
          showSuccessModal.value = true;
          txHash.value = res.data;
        } else {
          ledgerErrorHandler(res.error);

          return;
        }
      } else {
        const res = await props.currentWallet.signAndSendMulti({
          walletId: props.currentWallet.id,
          rawTransactions: resRawTxs.value,
          privateKey: await props.currentWallet.getPrivateKeyDecoded(
            password.value
          ),
        });

        if (!res.error) {
          txHash.value = res.data;
          showConfirmTransaction.value = false;
          showSuccessModal.value = true;
          isLoading.value = false;
        } else {
          modalCloseHandler();
          isLoading.value = false;
        }
      }
    };

    // ledger modal handlers
    const connectLedgerClickHandler = () => {
      stake();
    };
    const connectLedgerCloseHandler = () => {
      showConnectLedgerModal.value = false;
      clearLedgerModals();
      showConfirmTransaction.value = true;
    };
    const appLedgerClickHandler = () => {
      connectLedgerClickHandler();
    };
    const appLedgerCloseHandler = () => {
      connectLedgerCloseHandler();
    };
    const confirmLedgerCloseHandler = () => {
      connectLedgerCloseHandler();
    };
    const rejectedLedgerClickHandler = () => {
      connectLedgerCloseHandler();
      modalCloseHandler();
    };
    const rejectedLedgerCloseHandler = () => {
      connectLedgerCloseHandler();
      modalCloseHandler();
    };

    return {
      showSetStakingAmount,
      setStakingAmountModalData,
      txComment,
      successClickHandler,
      buttonsPannelData,
      passwordIncorrect,
      WALLET_TYPES,
      chartData,
      modalCloseHandler,
      showModal,
      toStake,
      toggleShowPlaceholder,
      stake,
      prepareDelegation,
      maxAmount,
      amount,
      disabled,
      showConfirmTransaction,
      fee,
      txHash,
      resRawTxs,
      showSuccessModal,
      txError,
      isLoading,
      toUnstake,
      actionModalData,
      disabledConfirm,
      showConnectLedgerModal,
      showConfirmLedgerModal,
      showAppLedgerModal,
      ledgerError,
      connectLedgerClickHandler,
      connectLedgerCloseHandler,
      appLedgerClickHandler,
      appLedgerCloseHandler,
      confirmLedgerCloseHandler,
      showRejectedLedgerModal,
      rejectedLedgerCloseHandler,
      rejectedLedgerClickHandler,
      inputError,
      isHardwareWallet,
      mode,
      shareInValue,
      currentWalletType,
    };
  },
};
</script>

<style lang="scss" scoped>
.xct-staking {
  display: flex;
  flex-direction: column;
  padding: 35px 0 47px 0;
  @include lg {
    padding: 34px 0 30px 0;
  }
  @include md {
    padding: 28px 0 16px 0;
  }
  &__lock-banner {
    margin-bottom: 32px;
    @include lg {
      margin-bottom: 24px;
    }
    @include md {
      margin-bottom: 16px;
    }
  }
  &__stake-chart {
    margin-bottom: 40px;
    @include lg {
      margin-bottom: 32px;
    }
    @include md {
      margin-bottom: 16px;
    }
  }
  &__stake-list {
    display: flex;
    flex-wrap: wrap;
    align-self: center;
    gap: 20px;
    max-width: 1098px;
    @include lg {
      width: 100%;
      flex-direction: column-reverse;
      flex-wrap: initial;
      gap: 16px;
    }
    @include md {
      width: 100%;
      flex-direction: column-reverse;
      flex-wrap: initial;
      gap: 8px;
    }
  }
  &__stake-list-item {
    width: 538px;
    @include lg {
      width: 100%;
    }
    @include md {
      width: 100%;
    }
  }
  &__buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 32px;
    @include lg {
      margin-top: 24px;
    }
    @include md {
      display: none;
    }
  }
}
</style>
