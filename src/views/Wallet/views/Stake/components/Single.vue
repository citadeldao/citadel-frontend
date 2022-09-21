<template>
  <StakePlaceholder
    v-if="!dataList.length && currentWallet.type !== WALLET_TYPES.PUBLIC_KEY"
    :current-wallet="currentWallet"
    :current-token="currentToken"
    @click:placeholder="toggleShowPlaceholder"
  />
  <div v-else class="single">
    <div
      v-if="currentWallet.type === WALLET_TYPES.PUBLIC_KEY"
      class="single__lock-banner"
    >
      <LockBanner @showPlaceholder="$emit('showPlaceholder')" />
    </div>
    <div v-if="dataList.length" class="single__stake-chart">
      <StakeChart :chart-data="dataList" />
    </div>
    <div class="single__stake-list">
      <div
        v-for="(item, index) in dataList"
        :key="item.address"
        class="single__stake-list-item"
      >
        <StakeListItem
          :index="index"
          :icon="currentWallet.net"
          :item="item"
          :current-wallet="currentWallet"
          :balance="currentWallet.balance"
          type="singele"
        />
      </div>
    </div>
    <div
      v-if="currentWallet.type !== WALLET_TYPES.PUBLIC_KEY"
      class="single__buttons"
    >
      <PrimaryButton @click="toStake">
        {{ $t('changeNode') }}
      </PrimaryButton>
    </div>
  </div>
  <WalletButtonsPanel
    v-if="currentWallet.type !== WALLET_TYPES.PUBLIC_KEY"
    :current-token="currentToken"
    :current-wallet="currentWallet"
    :button2="buttonsPannelData.button2"
    :type="buttonsPannelData.type"
    data-qa="stake"
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
        v-if="showChooseNode"
        v-click-away="modalCloseHandler"
        :title="$t('staking.Stake')"
        :desc="`${$t('singleStake.chooseNodeModalDesc')} ${
          currentWallet.name
        }.`"
        type="action"
        width="600px"
        button-text="staking.Stake"
        :disabled="!!!selectedNode"
        :loading="isLoading"
        data-qa="staking"
        @close="modalCloseHandler"
        @buttonClick="prepareDelegation"
      >
        <ChooseStakingNode
          v-model:activeTab="activeTab"
          :amount="amount"
          :current-wallet="currentWallet"
          :list="list"
        />
      </ModalContent>
      <ModalContent
        v-if="showNodesList"
        v-click-away="modalCloseHandler"
        :title="$t('staking.chooseNodeForStaking')"
        :desc="`${$t('singleStake.chooseNodeModalDesc')} ${
          currentWallet.name
        }.`"
        type="action"
        width="600px"
        :submit-button="false"
        @close="modalCloseHandler"
      >
        <NodesList
          max-height="400px"
          :nodes-list="stakeNodesWithValue"
          :current-wallet="currentWallet"
        />
      </ModalContent>
      <ModalContent
        v-if="showConfirmTransaction"
        v-click-away="modalCloseHandler"
        :title="actionModalData.title"
        :desc="actionModalData.desc"
        :loading="isLoading"
        button-text="confirm"
        type="action"
        :disabled="!!inputError"
        data-qa="staking-confirm"
        @close="modalCloseHandler"
        @buttonClick="stake"
      >
        <ActionModalContent
          :to="selectedNode.address"
          :wallet="
            currentKtAddress
              ? { ...currentWallet, address: currentKtAddress.address }
              : currentWallet
          "
          :staking-amount="currentWallet.balance.mainBalance"
          :staking-fee="fee"
          :place="actionModalData.place"
          :hide-password="isHardwareWallet"
          :delegation="{
            from: dataList[0]?.name || currentWallet.address,
            to: selectedNode.name,
          }"
          @submitSend="stake"
        />
      </ModalContent>

      <!--Confirm Ledger Modals-->
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
        v-click-away="finalClose"
        title="Success"
        desc="The transaction is in progress"
        button-text="ok"
        type="success"
        icon="success"
        data-qa="staking-success"
        @close="finalClose"
        @buttonClick="successClickHandler"
      >
        <SuccessModalContent
          v-model:txComment="txComment"
          :to="selectedNode.address"
          :wallet="currentWallet"
          :amount="list.length ? currentWallet.balance.stake : amount.value"
          :tx-hash="txHash"
          :type="mode"
          :fee="fee"
          data-qa="staking-success"
        />
      </ModalContent>
      <ModalContent
        v-if="showWarningModal"
        v-click-away="finalClose"
        title="Warning"
        icon="warningIcon"
        :desc="txError"
        button-text="ok"
        type="warning"
        @close="finalClose"
        @buttonClick="finalClose"
      />
    </Modal>
  </teleport>
</template>

<script>
import WalletButtonsPanel from '@/components/WalletButtonsPanel';
import SuccessModalContent from '../../Send/components/SuccessModalContent.vue';
import ActionModalContent from './ActionModalContent.vue';
import StakePlaceholder from './StakePlaceholder.vue';
import PrimaryButton from '@/components/UI/PrimaryButton';
import StakeChart from './StakeChart.vue';
import StakeListItem from './StakeListItem.vue';
import LockBanner from './LockBanner.vue';
import { WALLET_TYPES } from '@/config/walletType';
import NodesList from './NodesList.vue';
import Modal from '@/components/Modal';
import ModalContent from '@/components/ModalContent';
import ChooseStakingNode from './ChooseStakingNode.vue';
import ConfirmLedgerModal from '@/components/Modals/Ledger/ConfirmLedgerModal';
import ConnectLedgerModal from '@/components/Modals/Ledger/ConnectLedgerModal';
import OpenAppLedgerModal from '@/components/Modals/Ledger/OpenAppLedgerModal';
import RejectLedgerModal from '@/components/Modals/Ledger/RejectLedgerModal';
import { computed, inject, ref } from '@vue/runtime-core';
import { shareInValue } from '@/helpers';
import useStaking from '@/compositions/useStaking';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import useLedger from '@/compositions/useLedger';
import useWallets from '@/compositions/useWallets';

export default {
  name: 'Single',
  components: {
    LockBanner,
    StakeListItem,
    StakeChart,
    PrimaryButton,
    StakePlaceholder,
    Modal,
    ModalContent,
    ChooseStakingNode,
    NodesList,
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
    list: {
      type: Array,
      default: () => [],
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
    const { t } = useI18n();
    const {
      showModal,
      modalCloseHandler,
      amount,
      selectedNode,
      showChooseNode,
      showNodesList,
      showConfirmTransaction,
      toggleShowPlaceholder,
      activeTab,
      updateShowChooseNode,
      updateShowConfirmTransaction,
      updateShowSuccessModal,
      showSuccessModal,
      password,
      passwordIncorrect,
      disabled,
      maxAmount,
      finalClose,
      showWarningModal,
      updateShowModal,
      updateShowNodesList,
      inputError,
      passwordError,
      isLoading,
      fee,
      mode,
    } = useStaking(props.stakeNodes, props.list);

    const { isHardwareWallet } = useWallets();
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

    // ledger modal handlers
    const connectLedgerClickHandler = () => {
      stake();
    };
    const connectLedgerCloseHandler = () => {
      showConnectLedgerModal.value = false;
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
    };
    const rejectedLedgerCloseHandler = () => {
      connectLedgerCloseHandler();
    };
    const buttonsPannelData = computed(() => {
      if (!props.currentWallet.balance.stake || !props.list.length > 0) {
        return {
          type: '',
          button2: 'startStaking',
        };
      }

      return {
        type: '',
        button2: 'changeNode',
      };
    });

    const actionModalData = computed(() => {
      if (!props.currentWallet.balance.stake || !props.list.length > 0) {
        return {
          title: t('staking.actionModalTitle'),
          desc: t('staking.actionModalDesc'),
          place: '',
        };
      }

      return {
        title: t('singleStake.actionModalTitle'),
        desc: t('singleStake.actionModalDesc'),
        place: 'singleStake',
      };
    });

    const toStake = () => {
      if (dataList.value.length) {
        updateShowModal(true);
        updateShowNodesList(true);
      } else {
        updateShowModal(true);
        updateShowChooseNode(true);
      }
    };
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
      finalClose();
    };
    const currentKtAddress = inject('currentKtAddress');
    const currentKtAddressNodeList = inject('currentKtAddressNodeList');

    const dataList = computed(() => {
      const initialData = currentKtAddress.value
        ? currentKtAddressNodeList.value
        : props.list;

      const stakeValue = currentKtAddress.value
        ? currentKtAddress.value.balance.stake
        : props.currentWallet.balance.stake;
      const data = initialData.map((item) => ({
        ...item,
        value: stakeValue,
        share: shareInValue(stakeValue, stakeValue),
        stakeShare: shareInValue(stakeValue, stakeValue),
      }));

      return data;
    });

    const stakeNodesWithValue = computed(() => {
      return props.stakeNodes.map((item) => {
        const stakedNode = dataList.value.find(
          (i) => i.address.toLowerCase() === item.address.toLowerCase()
        );

        if (stakedNode) {
          return { ...stakedNode, value: props.currentWallet.balance.stake };
        }

        return item;
      });
    });

    const txHash = ref();
    const resRawTxs = ref();
    const prepareDelegation = async () => {
      if (isLoading.value) {
        return;
      }

      isLoading.value = true;
      const { rawTxs, ok } = await props.currentWallet.prepareDelegation({
        walletId: props.currentWallet.id,
        nodeAddress: selectedNode.value.address,
        kt: currentKtAddress.value ? currentKtAddress.value.address : undefined,
      });

      if (ok) {
        resRawTxs.value = rawTxs;
        updateShowChooseNode(false);
        updateShowConfirmTransaction(true);
        isLoading.value = false;
      } else {
        modalCloseHandler();
      }

      isLoading.value = false;
    };

    const txError = ref();
    const stake = async () => {
      if (passwordError.value && !isHardwareWallet.value) {
        inputError.value = passwordError.value;

        return;
      }

      isLoading.value = true;
      let res;

      if (isLedgerWallet.value) {
        isLoading.value = false;
        showConfirmTransaction.value = false;
        clearLedgerModals();
        showConfirmLedgerModal.value = true;

        try {
          res = await props.currentWallet.signAndSendMulti({
            walletId: props.currentWallet.id,
            rawTransactions: resRawTxs.value,
            derivationPath: props.currentWallet.derivationPath,
          });
          showConfirmLedgerModal.value = false;
        } catch (e) {
          ledgerErrorHandler(e);

          return;
        }
      } else {
        res = await props.currentWallet.signAndSendMulti({
          walletId: props.currentWallet.id,
          rawTransactions: resRawTxs.value,
          privateKey: props.currentWallet.getPrivateKeyDecoded(password.value),
        });
      }

      if (res.ok) {
        txHash.value = res.data;
        updateShowConfirmTransaction(false);
        updateShowSuccessModal(true);
        isLoading.value = false;
      } else {
        updateShowConfirmTransaction(false);
        updateShowModal(true);
        showWarningModal.value = true;
        txError.value = res.error;
        isLoading.value = false;
      }
    };

    return {
      txComment,
      successClickHandler,
      passwordIncorrect,
      stakeNodesWithValue,
      WALLET_TYPES,
      modalCloseHandler,
      showModal,
      showChooseNode,
      showNodesList,
      selectedNode,
      toStake,
      toggleShowPlaceholder,
      dataList,
      stake,
      activeTab,
      prepareDelegation,
      maxAmount,
      amount,
      disabled,
      showConfirmTransaction,
      fee,
      mode,
      txHash,
      resRawTxs,
      showSuccessModal,
      txError,
      showWarningModal,
      finalClose,
      isLoading,
      buttonsPannelData,
      actionModalData,
      inputError,
      showConnectLedgerModal,
      showConfirmLedgerModal,
      showAppLedgerModal,
      showRejectedLedgerModal,
      ledgerError,
      clearLedgerModals,
      ledgerErrorHandler,
      appLedgerClickHandler,
      appLedgerCloseHandler,
      confirmLedgerCloseHandler,
      rejectedLedgerClickHandler,
      rejectedLedgerCloseHandler,
      connectLedgerClickHandler,
      connectLedgerCloseHandler,
      isHardwareWallet,
      currentKtAddress,
    };
  },
};
</script>

<style lang="scss" scoped>
.single {
  padding: 43px 0 47px 0;
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
      gap: 16px;
    }
    @include md {
      gap: 8px;
    }
  }

  &__stake-list-item {
    width: 100%;
  }

  &__buttons {
    display: flex;
    justify-content: flex-end;
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
