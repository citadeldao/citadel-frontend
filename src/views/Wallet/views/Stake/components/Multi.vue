<template>
  <div>
    <StakePlaceholder
      v-if="!list.length > 0 && currentWallet.type !== WALLET_TYPES.PUBLIC_KEY"
      @click:placeholder="toStake"
    />
    <div v-else class="multi">
      <div
        v-if="currentWallet.type === WALLET_TYPES.PUBLIC_KEY"
        class="multi__lock-banner"
      >
        <LockBanner @showPlaceholder="$emit('showPlaceholder')" />
      </div>
      <div v-if="list.length > 0" class="multi__stake-chart">
        <StakeChart :chart-data="chartData" />
      </div>
      <div v-if="list.length > 0" class="multi__stake-list">
        <div class="multi__stake-list-item multi__stake-list-item--md">
          <StakeListItem
            icon="citadel"
            type="avaliable"
            :current-wallet="currentWallet"
            :balance="currentWallet.balance"
          />
        </div>
        <div
          v-if="currentWallet.net === 'polkadot'"
          class="multi__large-stake-list-item"
        >
          <LargeStakeListItem
            :validators="list"
            :icon="currentWallet.net"
            :current-wallet="currentWallet"
          />
        </div>
        <div
          v-for="(item, index) in list"
          v-else
          :key="item.address"
          class="multi__stake-list-item"
        >
          <StakeListItem
            :index="index"
            :icon="currentWallet.net"
            :item="item"
            :current-wallet="currentWallet"
            :balance="currentWallet.balance"
          />
        </div>
        <div class="multi__stake-list-item multi__stake-list-item--md">
          <StakeListItem
            icon="citadel"
            type="frozen"
            :current-wallet="currentWallet"
            :balance="currentWallet.balance"
          />
        </div>
        <div
          v-if="currentWallet.hasStake === 'finalStakeAndDelegation'"
          class="multi__stake-list-item multi__stake-list-item--md"
        >
          <StakeListItem
            type="withoutDelegation"
            :current-wallet="currentWallet"
            :balance="currentWallet.balance"
          />
        </div>
        <div class="multi__stake-list-item multi__stake-list-item--xl">
          <StakeListItem
            icon="citadel"
            type="avaliable"
            :current-wallet="currentWallet"
            :balance="currentWallet.balance"
          />
        </div>
        <div class="multi__stake-list-item multi__stake-list-item--xl">
          <StakeListItem
            icon="citadel"
            type="frozen"
            :current-wallet="currentWallet"
            :balance="currentWallet.balance"
          />
        </div>
        <div
          v-if="currentWallet.hasStake === 'finalStakeAndDelegation'"
          class="multi__stake-list-item multi__stake-list-item--xl"
        >
          <StakeListItem
            type="withoutDelegation"
            :current-wallet="currentWallet"
            :balance="currentWallet.balance"
          />
        </div>
      </div>
      <div
        v-if="currentWallet.type !== WALLET_TYPES.PUBLIC_KEY"
        class="multi__buttons"
      >
        <PrimaryButton
          v-if="currentWallet.hasRedelegation"
          bg-color="white"
          color="#00A3FF"
          box-shadow="none"
          border="1px solid #00A3FF"
          hover-border="1px solid #1A53F0"
          hover-color="#1A53F0"
          hover-bg-color=""
          data-qa="Redelegate"
          @click="toRedelegate"
        >
          {{ $t('redelegation.redelegate') }}
        </PrimaryButton>
        <div
          class="multi__buttons-section"
          :style="{ width: !currentWallet.hasRedelegation && '100%' }"
        >
          <div class="multi__buttons-section-unstake-button">
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
          </div>
          <PrimaryButton data-qa="Stake" @click="toStake">
            {{ $t('Stake') }}
          </PrimaryButton>
        </div>
      </div>
    </div>
    <WalletButtonsPanel
      v-if="currentWallet.type !== WALLET_TYPES.PUBLIC_KEY"
      :current-token="currentToken"
      :current-wallet="currentWallet"
      :button1="buttonsPannelData.button1"
      :button2="buttonsPannelData.button2"
      :type="buttonsPannelData.type"
      :show-redelegation-button="currentWallet.hasRedelegation && !!list.length"
      data-qa="stake"
      @redelegationButtonClick="toRedelegate"
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
    <teleport v-if="showModal || showLedgerModalContent" to="body">
      <Modal>
        <!-- if POLKADOT -->
        <ModalContent
          v-if="showChooseNode && currentWallet.net === 'polkadot'"
          v-click-away="modalCloseHandler"
          :title="$t(chooseNodeModalData.title)"
          :desc="chooseNodeModalData.desc"
          type="action"
          width="600px"
          :button-text="chooseNodeModalData.button"
          :disabled="disabledPolkadot"
          data-qa="staking"
          @close="modalCloseHandler"
          @buttonClick="prepareDelegation"
        >
          <PolkadotChooseStakingNode
            v-model:activeTab="activeTab"
            :amount="amount"
            :mode="mode"
            :additional-fee="additionalFee"
            :current-wallet="currentWallet"
            :reward-destination-address="rewardDestinationAddress"
            :reward-destination-option="rewardDestinationOption"
            :list="list"
            @nextStep="prepareDelegation"
          />
        </ModalContent>

        <!-- if NOT POLKADOT -->
        <ModalContent
          v-else-if="showChooseNode"
          v-click-away="modalCloseHandler"
          :title="$t(chooseNodeModalData.title)"
          :desc="chooseNodeModalData.desc"
          type="action"
          width="600px"
          :button-text="chooseNodeModalData.button"
          :disabled="disabled"
          data-qa="staking"
          @close="modalCloseHandler"
          @buttonClick="prepareDelegation"
        >
          <ChooseStakingNode
            v-model:activeTab="activeTab"
            :amount="amount"
            :current-wallet="currentWallet"
            :list="list"
            @nextStep="prepareDelegation"
          />
        </ModalContent>
        <ModalContent
          v-if="showNodesList"
          v-click-away="modalCloseHandler"
          :title="nodesListModalData.title"
          :desc="nodesListModalData.desc"
          type="action"
          width="600px"
          :submit-button="false"
          @close="nodesListModalCloseHandler"
        >
          <NodesList
            :staked-nodes="list"
            max-height="400px"
            :nodes-list="nodesListModalData.list"
            :current-wallet="currentWallet"
            :is-multiple-mode="isMultiple"
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
          data-qa="staking-confirm"
          @close="modalCloseHandler"
          @buttonClick="stake"
        >
          <ActionModalContent
            :selected-node="selectedNode || list"
            :to="selectedNode?.name"
            :wallet="currentWallet"
            :staking-amount="amount"
            :staking-fee="fee"
            :hide-password="
              isHardwareWallet ||
              [WALLET_TYPES.KEPLR].includes(currentWallet.type)
            "
            :adding="adding"
            :place="
              (mode === 'redelegate' || activeTab === 'redelegate') &&
              !isMultiple
                ? 'singleStake'
                : ''
            "
            :delegation="{
              from: selectedNode?.name,
              to: selectedNodeForRedelegation?.name,
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
          desc="It may take some time for the transaction to complete"
          button-text="ok"
          type="success"
          icon="success"
          data-qa="staking-success"
          @close="finalClose"
          @buttonClick="successClickHandler"
        >
          <SuccessModalContent
            v-model:tx-comment="txComment"
            :to="
              mode === 'redelegate' || activeTab === 'redelegate'
                ? selectedNodeForRedelegation?.address
                : selectedNode?.address
            "
            :wallet="currentWallet"
            :amount="amount"
            :fee="fee"
            :type="mode"
            :tx-hash="txHash"
            :mode="mode"
            :active-tab="activeTab"
            :is-multiple="isMultiple"
            :redelegation-node-address="selectedNode?.address"
            :selected-node="selectedNode || list"
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
  </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import BigNumber from 'bignumber.js';
import WalletButtonsPanel from '@/components/WalletButtonsPanel';
import SuccessModalContent from '../../Send/components/SuccessModalContent.vue';
import ActionModalContent from './ActionModalContent.vue';
import ConfirmLedgerModal from '@/components/Modals/Ledger/ConfirmLedgerModal';
import ConnectLedgerModal from '@/components/Modals/Ledger/ConnectLedgerModal';
import OpenAppLedgerModal from '@/components/Modals/Ledger/OpenAppLedgerModal';
import RejectLedgerModal from '@/components/Modals/Ledger/RejectLedgerModal';
import StakePlaceholder from './StakePlaceholder.vue';
import NodesList from './NodesList.vue';
import Modal from '@/components/Modal';
import ModalContent from '@/components/ModalContent';
import PrimaryButton from '@/components/UI/PrimaryButton';
import StakeListItem from './StakeListItem.vue';
import StakeChart from './StakeChart.vue';
import LockBanner from './LockBanner.vue';
import ChooseStakingNode from './ChooseStakingNode.vue';
import PolkadotChooseStakingNode from './PolkadotChooseStakingNode.vue';
import { WALLET_TYPES } from '@/config/walletType';
import { shareInValue } from '@/helpers';
import useLedger from '@/compositions/useLedger';
import useWallets from '@/compositions/useWallets';

import LargeStakeListItem from './LargeStakeListItem.vue';

import useStaking from '@/compositions/useStaking';
import useApi from '@/api/useApi';
import notify from '@/plugins/notify';
import { keplrNetworksProtobufFormat } from '@/config/availableNets';

export default {
  name: 'Multi',
  components: {
    LockBanner,
    StakeListItem,
    StakeChart,
    PrimaryButton,
    Modal,
    ModalContent,
    ChooseStakingNode,
    PolkadotChooseStakingNode,
    NodesList,
    StakePlaceholder,
    ActionModalContent,
    SuccessModalContent,
    WalletButtonsPanel,
    ConfirmLedgerModal,
    ConnectLedgerModal,
    OpenAppLedgerModal,
    RejectLedgerModal,
    LargeStakeListItem,
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
    onMounted(() => {
      setStyleForStakeItemTitleType();
    });
    const {
      showModal,
      modalCloseHandler,
      amount,
      additionalFee,
      rewardDestinationAddress,
      rewardDestinationOption,
      selectedNode,
      showChooseNode,
      showNodesList,
      showConfirmTransaction,
      toStake,
      toUnstake,
      toggleShowPlaceholder,
      activeTab,
      updateShowChooseNode,
      updateShowConfirmTransaction,
      updateShowSuccessModal,
      showSuccessModal,
      password,
      passwordIncorrect,
      stakeNodesWithValue,
      disabled,
      maxAmount,
      finalClose,
      showWarningModal,
      mode,
      nodesListModalData,
      chooseNodeModalData,
      actionModalData,
      inputError,
      passwordError,
      isLoading,
      fee,
      adding,
      toRedelegate,
      selectedNodeForRedelegation,
      nodesListModalCloseHandler,
      isMultiple,
      disabledPolkadot,
      isWithoutDelegation,
    } = useStaking(props.stakeNodes, props.list);
    const setStyleForStakeItemTitleType = () => {
      const items = document.querySelectorAll('.stake-list-item__title');
      items.forEach((e) => {
        const label = e.querySelector('.label--type--label');
        if (label) {
          if (e.clientWidth >= 400) {
            label.style.right = '-49px';
          } else if (e.clientWidth >= 280) {
            label.style.right = '-49px';
          }
        }
      });
    };
    const keplrConnector = computed(
      () => store.getters['keplr/keplrConnector']
    );

    const { isHardwareWallet } = useWallets();
    const disabledConfirm = computed(
      () => passwordIncorrect.value && !isHardwareWallet.value
    );

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

    const showLedgerModalContent = computed(() => {
      return (
        showConnectLedgerModal.value ||
        showConfirmLedgerModal.value ||
        showAppLedgerModal.value ||
        showRejectedLedgerModal.value
      );
    });

    const buttonsPannelData = computed(() => {
      if (!props.currentWallet.balance.stake || !props.list.length > 0) {
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

    const chartData = computed(() => {
      const withoutDelegation =
        props.currentWallet.hasStake === 'finalStakeAndDelegation'
          ? {
              name: 'Stake without delegation',
              color: '#C3CEEB',
              share: shareInValue(
                props.currentWallet.balance.calculatedBalance,
                BigNumber(props.currentWallet.balance.stake)
                  .minus(props.currentWallet.balance.delegatedBalance)
                  .toNumber()
              ),
            }
          : {};
      const finalData = isMultiple.value
        ? [
            {
              color: '#FF5722',
              share: shareInValue(
                props.currentWallet.balance.calculatedBalance,
                props.currentWallet.balance.stake
              ),
            },
          ]
        : props.list;
      const data = [
        ...finalData,
        {
          name: 'Avaliable balance',
          color: '#AFBCCB',
          share: shareInValue(
            props.currentWallet.balance.calculatedBalance,
            props.currentWallet.balance.mainBalance
          ),
        },
        {
          name: 'Frozen balance',
          color: '#6B93C0',
          share: shareInValue(
            props.currentWallet.balance.calculatedBalance,
            props.currentWallet.balance.frozenBalance
          ),
        },
        withoutDelegation,
      ];

      return data.filter((item) => item.share > 0);
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
        nodeAddress: isMultiple.value
          ? selectedNode.value || props.list
          : selectedNode.value?.address,
        amount: amount.value,
        type: activeTab.value || mode.value,
        redelegateNodeAddress: isMultiple.value
          ? selectedNodeForRedelegation?.value
          : selectedNodeForRedelegation?.value?.address,
        additionalFee: isMultiple.value ? additionalFee.value : '',
        rewardsAddress: rewardDestinationAddress.value,
        rewardsRestake: rewardDestinationOption.value === 0,
        isWithoutDelegation: isWithoutDelegation.value,
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
      // KEPLR
      if (props.currentWallet.type === WALLET_TYPES.KEPLR) {
        isLoading.value = true;

        let keplrResult;

        try {
          keplrResult = await keplrConnector.value.sendKeplrTransaction(
            resRawTxs.value,
            props.currentWallet.address,
            { preferNoSetFee: true }
          );
        } catch (err) {
          notify({
            type: 'warning',
            text: JSON.stringify(err),
          });
          isLoading.value = false;

          return;
        }

        if (keplrResult.error) {
          notify({
            type: 'warning',
            text: keplrResult.error,
          });
          isLoading.value = false;

          return;
        }

        const defaultTx = {
          ...keplrResult.signedTx,
          publicKey: props.currentWallet.getPublicKeyDecoded(),
          signature: keplrResult.signature,
        };

        const defaultSendTx = resRawTxs.value?.transaction || resRawTxs.value;
        const protobufTx = {
          mode: 'sync',
          tx: {
            memo: defaultSendTx.json.memo || '',
            fee: keplrResult.signedTx.fee,
            msg: defaultSendTx.json.msgs,
            signatures: [
              {
                account_number: keplrResult.fullResponse.signed.account_number,
                pub_key: keplrResult.fullResponse.signature.pub_key,
                sequence: keplrResult.fullResponse.signed.sequence,
                signature: keplrResult.fullResponse.signature.signature,
              },
            ],
          },
        };

        const data = await useApi('wallet').sendSignedTransaction({
          hash: keplrNetworksProtobufFormat.includes(props.currentWallet.net)
            ? protobufTx
            : defaultTx,
          deviceType: WALLET_TYPES.KEPLR,
          proxy: false,
          network: props.currentWallet.net,
          from: props.currentWallet.address,
          mem_tx_id: resRawTxs.value.mem_tx_id,
        });

        if (data.ok) {
          txHash.value = [data.data.txhash];
          updateShowConfirmTransaction(false);
          updateShowSuccessModal(true);
          isLoading.value = false;
        } else {
          modalCloseHandler();
          notify({
            type: 'warning',
            text: data.error,
          });
          isLoading.value = false;

          return;
        }
      }

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
        modalCloseHandler();
        isLoading.value = false;
      }
    };

    // ledger modal handlers
    const connectLedgerClickHandler = () => {
      stake();
    };
    const connectLedgerCloseHandler = () => {
      showConfirmTransaction.value = true;
      clearLedgerModals();
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
      clearLedgerModals();
      modalCloseHandler();
    };

    return {
      txComment,
      successClickHandler,
      buttonsPannelData,
      passwordIncorrect,
      stakeNodesWithValue,
      WALLET_TYPES,
      chartData,
      modalCloseHandler,
      showModal,
      showLedgerModalContent,
      showChooseNode,
      showNodesList,
      selectedNode,
      toStake,
      toggleShowPlaceholder,
      stake,
      activeTab,
      prepareDelegation,
      maxAmount,
      amount,
      additionalFee,
      rewardDestinationAddress,
      rewardDestinationOption,
      disabled,
      showConfirmTransaction,
      fee,
      txHash,
      resRawTxs,
      showSuccessModal,
      txError,
      showWarningModal,
      isLoading,
      finalClose,
      chooseNodeModalData,
      nodesListModalData,
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
      adding,
      toRedelegate,
      mode,
      selectedNodeForRedelegation,
      nodesListModalCloseHandler,
      isMultiple,
      disabledPolkadot,
    };
  },
};
</script>

<style lang="scss" scoped>
.multi {
  display: flex;
  flex-direction: column;
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
      width: 100%;
      flex-direction: column;
      flex-wrap: initial;
      gap: 16px;
    }
    @include md {
      width: 100%;
      flex-direction: column;
      flex-wrap: initial;
      gap: 8px;
    }
  }

  &__large-stake-list-item {
    width: 100%;
  }

  &__stake-list-item {
    width: 538px;

    &--xl {
      display: none;
      @include xl {
        display: flex;
      }
    }

    &--md {
      display: flex;
      @include xl {
        display: none;
      }
    }

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

  &__buttons-section {
    display: flex;
    justify-content: space-between;
  }

  &__buttons-section-unstake-button {
    margin-right: 24px;
  }
}
</style>
