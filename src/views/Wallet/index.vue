<template>
  <div v-if="currentWallet" class="wallet">
    <div class="wallet__central-section">
      <div class="wallet__section-wrapper">
        <Alias
          :current-wallet="currentWallet"
          @qrClick="qrClick"
          :class="{
            'alias-xl': currentToken
              ? currentToken?.hasClaim
              : currentWallet.hasClaim,
          }"
        />
        <transition name="fade">
          <div
            v-if="
              currentToken ? currentToken?.hasClaim : currentWallet.hasClaim
            "
            class="wallet__claim-rewards"
          >
            <ClaimRewards
              :is-current-token="!!currentToken"
              :current-wallet="currentToken || currentWallet"
              @prepareClaim="prepareClaim"
              @prepareXctClaim="prepareXctClaim"
            />
          </div>
        </transition>
      </div>
      <div
        class="wallet__kt-addresses-wrapper"
        v-if="currentWallet.hasKtAddresses && ktAddresses.length"
      >
        <div class="kt-addresses__title">KT {{ $t('address') }}</div>
        <div class="wallet__kt-addresses">
          <KtAddresses :current-wallet="currentWallet" />
        </div>
      </div>
      <div class="wallet__main">
        <template v-if="!currentWallet.isStub">
          <MainHeader
            :current-wallet="currentWallet"
            :current-token="currentToken"
          />
          <div v-if="$route.name === 'Wallet'" class="wallet__loading">
            <Loading />
          </div>
          <router-view
            v-else
            :subtokens-is-loading="subtokensIsLoading"
            :current-wallet="currentToken || currentWallet"
            :token-list="subtokens"
            :current-token="currentToken"
            @prepareClaim="prepareClaim"
            @prepareXctClaim="prepareXctClaim"
          />
        </template>
        <KiChainStub v-else></KiChainStub>
      </div>
    </div>
    <div class="wallet__right-section">
      <transition name="fade">
        <div
          v-if="currentToken ? currentToken?.hasClaim : currentWallet.hasClaim"
          class="wallet__claim-rewards-lg"
        >
          <ClaimRewards
            :disabled="currentWallet.isStub"
            :is-current-token="!!currentToken"
            :current-wallet="currentToken || currentWallet"
            @prepareClaim="prepareClaim"
            @prepareXctClaim="prepareXctClaim"
          />
        </div>
      </transition>
      <BalanceAndPledged
        :current-wallet="currentToken || currentWallet"
        :currency="currency"
        :is-current-token="!!currentToken"
      />
      <div
        v-if="currentWallet.hasClaimUnstaked && currentWallet?.balance?.unstake"
        class="wallet__claim-unstaked"
      >
        <ClaimUnstakedBlock
          :code="currentWallet?.code"
          :wallet-info="currentWallet"
          :wallet-type="currentWallet.type"
          @prepareUnstakedClaim="prepareUnstakedClaim"
        />
      </div>
      <div
        v-if="currentToken?.net === OUR_TOKEN"
        class="wallet__xct-calculator"
      >
        <XCTCalculator
          :info="inflationInfoXCT"
          :is-loading="xctInflationIsLoading"
          :current-token="currentToken"
        />
      </div>
      <div class="wallet__network-info">
        <NetworkInfo
          :current-wallet="currentToken || currentWallet"
          :is-current-token="!!currentToken"
        />
      </div>
    </div>
    <teleport v-if="isLoading" to="body">
      <Modal>
        <img src="@/assets/gif/loader.gif" alt="" />
      </Modal>
    </teleport>
    <teleport v-if="showClaimModal" to="body">
      <Modal>
        <ModalContent
          v-if="showConfirmClaim"
          v-click-away="claimModalCloseHandler"
          :title="$t('claim.confirmModalTitle')"
          :desc="$t('claim.confirmModalDesc')"
          button-text="confirm"
          type="action"
          :loading="isLoading"
          :disabled="!!inputError"
          @close="claimModalCloseHandler"
          @buttonClick="claim"
        >
          <ActionModalContent
            :to="currentWallet.address"
            :wallet="currentWallet"
            :staking-amount="currentWallet.balance.claimableRewards"
            :staking-fee="fee"
            :hide-password="
              isHardwareWallet ||
              [WALLET_TYPES.KEPLR].includes(currentWallet.type)
            "
            :adding="adding"
            @submitSend="claim"
          />
        </ModalContent>
        <ModalContent
          v-if="showConfirmUnstakedClaim"
          v-click-away="claimModalCloseHandler"
          :title="$t('claim.confirmModalTitle')"
          :desc="$t('claim.confirmModalDesc')"
          :loading="isLoading"
          button-text="confirm"
          type="action"
          @close="claimModalCloseHandler"
          @buttonClick="claim"
        >
          <ActionModalContent
            :to="currentWallet.address"
            :wallet="currentWallet"
            :staking-amount="currentWallet.balance.unstake"
            :staking-fee="fee"
            :hide-password="isHardwareWallet"
            @submitSend="claim"
          />
        </ModalContent>
        <ModalContent
          v-if="showXctConfirmClaim"
          v-click-away="claimModalCloseHandler"
          :title="$t('claim.confirmModalTitle')"
          :desc="$t('claim.confirmModalDesc')"
          button-text="restake"
          type="action"
          :disabled="disabled"
          :loading="isLoading"
          :has-slot="true"
          @close="claimModalCloseHandler"
          @buttonClick="restakeXctRewards"
        >
          <template #default>
            <XCTConfirmClaimModal
              :fee="claimFee"
              :current-token="currentToken"
              :claim-options="claimOptions"
              :xct-rewards="xctRewards"
              :hide-password="
                isHardwareWallet || currentWalletType === WALLET_TYPES.METAMASK
              "
              :dao-rewards="daoRewards"
              :total-amount="totalAmount"
              @update:options="updateOptions"
              @submitSend="restakeXctRewards"
            />
          </template>
          <template #cancelButton>
            <span
              class="wallet__modal-claim-button"
              :class="{ 'wallet__modal-claim-button--disabled': disabled }"
              @click="claimXctRewards"
              >{{ $t('claim.claim') }}</span
            >
          </template>
        </ModalContent>
        <ModalContent
          v-else-if="showClaimSuccessModal"
          v-click-away="claimModalCloseHandler"
          title="Success"
          :desc="$t('txWaitTitle')"
          button-text="ok"
          type="success"
          icon="success"
          @close="claimModalCloseHandler"
          @buttonClick="successClickHandler"
        >
          <SuccessModalContent
            v-model:txComment="txComment"
            :to="currentToken ? '' : currentWallet.address"
            :wallet="currentToken || currentWallet"
            :amount="
              currentToken
                ? totalAmount
                : currentWallet.balance.claimableRewards
            "
            :tx-hash="txHash"
            :show-from="false"
            type="reward"
            :fee="mode === 'claim' ? claimFee : fee"
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
      </Modal>
    </teleport>
    <teleport v-if="showModal" to="body">
      <Modal>
        <AliasQrCard
          v-click-away="modalCloseHandler"
          :current-wallet="currentWallet"
          @close="modalCloseHandler"
        />
      </Modal>
    </teleport>
  </div>
</template>

<script>
import BalanceAndPledged from './components/BalanceAndPledged.vue';
import XCTConfirmClaimModal from './views/Stake/components/XCTConfirmClaimModal.vue';
import XCTCalculator from './components/XCTCalculator';
import SuccessModalContent from './views/Send/components/SuccessModalContent.vue';
import ActionModalContent from './views/Stake/components/ActionModalContent.vue';
import ModalContent from '@/components/ModalContent';
import AliasQrCard from './components/AliasQrCard';
import Modal from '@/components/Modal';
import Loading from '@/components/Loading';
import KiChainStub from '@/views/Wallet/components/KiChainStub.vue';
import NetworkInfo from './components/NetworkInfo';
import ClaimRewards from './components/ClaimRewards';
import ClaimUnstakedBlock from './components/ClaimUnstakedBlock';
import MainHeader from './components/MainHeader';
import KtAddresses from './components/KtAddresses';
import Alias from './components/Alias';
import ConfirmLedgerModal from '@/components/Modals/Ledger/ConfirmLedgerModal';
import ConnectLedgerModal from '@/components/Modals/Ledger/ConnectLedgerModal';
import OpenAppLedgerModal from '@/components/Modals/Ledger/OpenAppLedgerModal';
import RejectLedgerModal from '@/components/Modals/Ledger/RejectLedgerModal';
import { useStore } from 'vuex';
import { computed, onMounted, provide, ref, watch } from 'vue';
import useWallets from '@/compositions/useWallets';
import useCheckPassword from '@/compositions/useCheckPassword';
import useKtAddresses from '@/compositions/useKtAddresses';
import { useRoute } from 'vue-router';
import useLedger from '@/compositions/useLedger';
import { SNIP20_PARENT_NET, WALLET_TYPES } from '@/config/walletType';
import { OUR_TOKEN } from '@/config/walletType';
import BigNumber from 'bignumber.js';
import notify from '@/plugins/notify';
import { useI18n } from 'vue-i18n';
import useApi from '@/api/useApi';
import { keplrNetworks } from '@/config/availableNets';

export default {
  name: 'Wallet',
  components: {
    Alias,
    ClaimRewards,
    MainHeader,
    NetworkInfo,
    AliasQrCard,
    Modal,
    ModalContent,
    ActionModalContent,
    SuccessModalContent,
    XCTCalculator,
    ConfirmLedgerModal,
    ConnectLedgerModal,
    OpenAppLedgerModal,
    RejectLedgerModal,
    XCTConfirmClaimModal,
    BalanceAndPledged,
    KtAddresses,
    Loading,
    ClaimUnstakedBlock,
    KiChainStub,
  },
  setup() {
    const { t } = useI18n();
    const store = useStore();
    const route = useRoute();
    const { currency, currentWallet, isHardwareWallet, currentToken } =
      useWallets();
    const subtokensIsLoading = ref(false);
    const { loadKtAddresses, ktAddresses } = useKtAddresses();
    const showClaimModal = computed(() => {
      return (
        showConfirmClaim.value ||
        showXctConfirmClaim.value ||
        showClaimSuccessModal.value ||
        showConnectLedgerModal.value ||
        showAppLedgerModal.value ||
        showConfirmLedgerModal.value ||
        showRejectedLedgerModal.value ||
        showConfirmUnstakedClaim.value
      );
    });

    const keplrConnector = computed(
      () => store.getters['keplr/keplrConnector']
    );
    const subtokens = computed(() =>
      store.getters['subtokens/formatedSubtokens']()
    );

    const checkKeplrAddress = async () => {
      if (
        currentWallet.value &&
        currentWallet.value.type === WALLET_TYPES.KEPLR
      ) {
        try {
          const chain = keplrNetworks.find(
            (conf) => conf.net === currentWallet.value.net
          ).key;
          await window.keplr.enable(chain);
          const accounts = await window.keplr
            .getOfflineSigner(chain)
            .getAccounts();
          const keplrAddress = accounts && accounts[0].address;
          const pubkey = Buffer.from(accounts && accounts[0].pubkey).toString(
            'hex'
          );

          if (keplrAddress === currentWallet.value.address) {
            const walletPublicKey = currentWallet.value.publicKey;

            if (walletPublicKey !== pubkey) {
              await store.dispatch('wallets/pushWallets', {
                wallets: [{ ...currentWallet.value, publicKey: pubkey }],
              });
              window.location.reload();
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
    };

    onMounted(async () => {
      await loadKtAddresses(currentWallet?.value?.id);
      await loadXCTInfo();
      await checkKeplrAddress();
    });

    watch(
      () => route.params,
      async (params, oldParams) => {
        if (
          params.net !== oldParams.net ||
          params.address.toLowerCase() !== oldParams.address.toLowerCase()
        ) {
          store.dispatch('ktAddresses/setCurrentKtAddress', null);

          if (params.net && params.address) {
            await loadKtAddresses(currentWallet?.value?.id);
            await loadXCTInfo();
            await checkKeplrAddress();
          }
        }
      },
      { deep: true }
    );
    const xctInflationIsLoading = ref(false);
    const inflationInfoXCT = computed(
      () => store.getters['subtokens/inflationInfoXCT']
    );
    const loadXCTInfo = async () => {
      if (currentWallet.value?.hasXCT) {
        xctInflationIsLoading.value = true;
        await store.dispatch(
          'subtokens/getInflationInfoXCT',
          currentWallet.value.id
        );
        await store.dispatch('dao/getHolderInfo', currentWallet.value.id);
        await store.dispatch('dao/getRewardsXCT', currentWallet.value.id);
        await store.dispatch(
          'dao/getTotalClaimedRewardsXCT',
          currentWallet.value.id
        );
        xctInflationIsLoading.value = false;
      }
    };

    const showModal = ref(false);
    const modalCloseHandler = () => {
      showModal.value = false;
    };
    const qrClick = () => {
      showModal.value = true;
    };
    const {
      showConnectLedgerModal,
      showConfirmLedgerModal,
      showAppLedgerModal,
      showRejectedLedgerModal,
      ledgerError,
      isLedgerWallet,
      clearLedgerModals,
      ledgerErrorHandler,
    } = useLedger();

    const { password, passwordIncorrect, passwordError, inputError } =
      useCheckPassword();
    const updatePassword = (value) => {
      password.value = value;
    };
    provide('password', password);
    provide('updatePassword', updatePassword);
    provide('passwordError', passwordError);
    provide('inputError', inputError);
    const mode = ref('claim');
    provide('mode', mode);
    const activeTab = ref('claim');
    provide('activeTab', activeTab);

    const showConfirmClaim = ref(false);
    const showClaimSuccessModal = ref(false);
    const showXctConfirmClaim = ref(false);
    const showConfirmUnstakedClaim = ref(false);
    const isLoading = ref(false);
    provide('isLoading', isLoading);
    const fee = ref();
    const txHash = ref();
    const resRawTxs = ref();
    const txComment = ref('');
    const adding = ref();
    const prepareClaim = async () => {
      if (isLoading.value) {
        return;
      }

      isLoading.value = true;
      const {
        resAdding,
        ok: feeOk,
        resFee,
        enough,
        error,
      } = await currentWallet.value.getDelegationFee({
        walletId: currentWallet.value.id,
        transactionType: 'claim',
      });

      if (error) {
        isLoading.value = false;
        return;
      }

      if (feeOk) {
        if (!enough) {
          isLoading.value = false;

          return;
        }

        adding.value = resAdding;
        fee.value = resFee;
        const { rawTxs, ok: prepOk } = await currentWallet.value.prepareClaim(
          currentWallet.value.id
        );

        if (prepOk) {
          resRawTxs.value = rawTxs;
          showConfirmClaim.value = true;
          isLoading.value = false;
        } else {
          claimModalCloseHandler();
          isLoading.value = false;
        }
      } else {
        return;
      }
    };

    const prepareUnstakedClaim = async () => {
      if (isLoading.value) {
        return;
      }

      isLoading.value = true;

      const { rawTx, ok } = await currentWallet.value.prepareClaimUnstaked(
        currentWallet.value.id
      );
      const resOk = ok;

      if (resOk) {
        fee.value = rawTx.fee;
        resRawTxs.value = rawTx;
        isLoading.value = false;
        showConfirmUnstakedClaim.value = true;
      } else {
        claimModalCloseHandler();
        isLoading.value = false;
      }
    };

    const claim = async () => {
      showConfirmClaim.value = false;
      // KEPLR
      if (currentWallet.value.type === WALLET_TYPES.KEPLR) {
        isLoading.value = true;
        let keplrResult;

        try {
          keplrResult = await keplrConnector.value.sendKeplrTransaction(
            resRawTxs.value,
            currentWallet.value.address,
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

        const hash = await keplrConnector.value.getOutputHash(
          currentWallet.value,
          resRawTxs.value,
          keplrResult
        );

        const data = await useApi('wallet').sendSignedTransaction({
          hash,
          deviceType: WALLET_TYPES.KEPLR,
          proxy: false,
          network: currentWallet.value.net,
          from: currentWallet.value.address,
          mem_tx_id: resRawTxs.value.mem_tx_id,
        });

        if (data.ok) {
          txHash.value = [data.data.txhash];
          showConfirmUnstakedClaim.value = false;
          showClaimSuccessModal.value = true;
          isLoading.value = false;
        } else {
          claimModalCloseHandler();
          isLoading.value = false;
          notify({
            type: 'warning',
            text: data.error,
          });

          return;
        }
      }

      if (passwordError.value && !isHardwareWallet.value) {
        inputError.value = passwordError.value;
      } else {
        isLoading.value = true;
        showConnectLedgerModal.value = false;
        showAppLedgerModal.value = false;
        showConfirmLedgerModal.value = false;
        showRejectedLedgerModal.value = false;
        let res;

        if (isLedgerWallet.value) {
          isLoading.value = false;
          showConfirmClaim.value = false;
          clearLedgerModals();
          showConfirmLedgerModal.value = true;
          res = await currentWallet.value.signAndSendMulti({
            walletId: currentWallet.value.id,
            rawTransactions: resRawTxs.value,
            derivationPath: currentWallet.value.derivationPath,
          });
          if (res.ok) {
            txHash.value = res.data;
            showConfirmClaim.value = false;
            showConfirmLedgerModal.value = false;
            showConfirmUnstakedClaim.value = false;
            showClaimSuccessModal.value = true;
          } else {
            ledgerErrorHandler(res.error);
          }
        }
        // if not hardware
        else {
          res = await currentWallet.value.signAndSendMulti({
            walletId: currentWallet.value.id,
            rawTransactions: resRawTxs.value,
            privateKey: await currentWallet.value.getPrivateKeyDecoded(
              password.value
            ),
          });

          if (res.ok) {
            txHash.value = res.data;
            showConfirmClaim.value = false;
            showConfirmUnstakedClaim.value = false;
            showClaimSuccessModal.value = true;
            isLoading.value = false;
            notify({
              type: 'success',
              text: t('claim.claimSuccessfuly'),
            });
          } else {
            claimModalCloseHandler();
            isLoading.value = false;
            notify({
              type: 'warning',
              text: res.error,
            });
          }
        }
      }
    };

    const claimModalCloseHandler = () => {
      updatePassword('');
      inputError.value = false;
      showConfirmClaim.value = false;
      showClaimSuccessModal.value = false;
      showXctConfirmClaim.value = false;
      showConfirmUnstakedClaim.value = false;
      updateOptions({
        xctRewards: !!xctRewards.value,
        daoRewards: !!daoRewards.value,
      });
      fees.value = [];
      clearLedgerModals();
    };

    const successClickHandler = async () => {
      txComment.value &&
        (await store.dispatch('transactions/postTransactionNote', {
          network: currentWallet.value.net,
          hash: txHash.value[0],
          text: txComment.value,
        }));
      txComment.value = '';
      claimModalCloseHandler();
    };

    // ledger modal handlers
    const connectLedgerClickHandler = () => {
      xctAction.value === 'restake'
        ? restakeXctRewards()
        : xctAction.value === 'claim'
        ? claimXctRewards()
        : claim();
    };
    const connectLedgerCloseHandler = () => {
      clearLedgerModals();
      isLoading.value = false;
      showConfirmLedgerModal.value = false;
      showRejectedLedgerModal.value = false;
      showConfirmClaim.value = true;
      claimModalCloseHandler();
    };
    const appLedgerClickHandler = () => {
      xctAction.value === 'restake'
        ? restakeXctRewards()
        : xctAction.value === 'claim'
        ? claimXctRewards()
        : claim();
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

    const daoRewards = computed(
      () => store.getters['dao/holderInfo'].holder?.claimable
    );
    const xctRewards = computed(() => store.getters['dao/xctRewards']);
    const claimOptions = ref({
      xctRewards: !!xctRewards.value,
      daoRewards: !!daoRewards.value,
    });
    const claimFee = computed(() => Math.max(...fees.value));
    watch(
      () => password.value,
      (newVal) => {
        updatePassword(newVal);
      }
    );
    watch(
      () => daoRewards.value,
      (newVal) => {
        claimOptions.value.daoRewards = !!newVal;
      }
    );
    watch(
      () => xctRewards.value,
      (newVal) => {
        claimOptions.value.xctRewards = !!newVal;
      }
    );

    const updateOptions = (options) => {
      Object.assign(claimOptions.value, options);
    };

    const xctAction = ref();

    const restakeAllTxs = ref();
    const restakeAllFee = ref();

    const restakeXctTxs = ref();
    const restakeXctFee = ref();

    const restakeDaoTxs = ref();
    const restakeDaoFee = ref();

    const claimAllTxs = ref();
    const claimAllFee = ref();

    const claimXctTxs = ref();
    const claimXctFee = ref();

    const claimDaoTxs = ref();
    const claimDaoFee = ref();

    const metamaskConnector = computed(
      () => store.getters['metamask/metamaskConnector']
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

    const fees = ref([]);
    const prepareXctClaim = async () => {
      if (isLoading.value) {
        return;
      }

      isLoading.value = true;

      try {
        const { rawTxs: claimAllRawTxs, fee: claimAllRewardsFee } =
          await currentToken.value.prepareXctClaimOrRestake({
            walletId: currentToken.value.id,
            action: 'claim',
            type: 'all',
          });
        claimAllTxs.value = claimAllRawTxs;
        claimAllFee.value = claimAllRewardsFee;
        fees.value.push(claimAllRewardsFee);
        const { rawTxs: restakeAllRawTxs, fee: restakeAllRewardsFee } =
          await currentToken.value.prepareXctClaimOrRestake({
            walletId: currentToken.value.id,
            action: 'restake',
            type: 'all',
          });
        restakeAllTxs.value = restakeAllRawTxs;
        restakeAllFee.value = restakeAllRewardsFee;
        fees.value.push(restakeAllRewardsFee);
        const { rawTxs: claimXctRawTxs, fee: claimXctRewardsFee } =
          await currentToken.value.prepareXctClaimOrRestake({
            walletId: currentToken.value.id,
            action: 'claim',
            type: 'xct',
          });
        claimXctTxs.value = claimXctRawTxs;
        claimXctFee.value = claimXctRewardsFee;
        fees.value.push(claimXctRewardsFee);
        const { rawTxs: claimDaoRawTxs, fee: claimDaoRewardsFee } =
          await currentToken.value.prepareXctClaimOrRestake({
            walletId: currentToken.value.id,
            action: 'claim',
            type: 'dao',
          });
        claimDaoTxs.value = claimDaoRawTxs;
        claimDaoFee.value = claimDaoRewardsFee;
        fees.value.push(claimDaoRewardsFee);
        const { rawTxs: restakeXctRawTxs, fee: restakeXctRewardsFee } =
          await currentToken.value.prepareXctClaimOrRestake({
            walletId: currentToken.value.id,
            action: 'restake',
            type: 'xct',
          });
        restakeXctTxs.value = restakeXctRawTxs;
        restakeXctFee.value = restakeXctRewardsFee;
        fees.value.push(restakeXctRewardsFee);
        const { rawTxs: restakeDaoRawTxs, fee: restakeDaoRewardsFee } =
          await currentToken.value.prepareXctClaimOrRestake({
            walletId: currentToken.value.id,
            action: 'restake',
            type: 'dao',
          });
        restakeDaoTxs.value = restakeDaoRawTxs;
        restakeDaoFee.value = restakeDaoRewardsFee;
        fees.value.push(restakeDaoRewardsFee);

        showXctConfirmClaim.value = true;
        isLoading.value = false;
      } catch {
        claimModalCloseHandler();
        isLoading.value = false;
      }
    };

    const showWarning = () => {
      notify({
        type: 'warning',
        text: t('errors.notEnoughFounds', { code: currentWallet.value.code }),
      });
      claimModalCloseHandler();
      isLoading.value = false;
    };

    const restakeXctRewards = async () => {
      // metamask, ...
      xctAction.value = 'restake';

      if (currentWalletType.value === WALLET_TYPES.METAMASK) {
        isLoading.value = true;

        const metamaskResult =
          await metamaskConnector.value.sendMetamaskTransaction(
            restakeAllTxs.value
          );

        if (metamaskResult.error) {
          notify({
            type: 'warning',
            text: metamaskResult.error,
          });
        } else {
          showXctConfirmClaim.value = false;
          txHash.value = metamaskResult.txHash
            ? [metamaskResult.txHash]
            : metamaskResult;
          showClaimSuccessModal.value = true;
        }

        isLoading.value = false;

        return;
      }

      if (passwordError.value && !isHardwareWallet.value) {
        inputError.value = passwordError.value;
      } else {
        isLoading.value = true;

        if (isHardwareWallet.value) {
          clearLedgerModals();
          isLoading.value = false;
          showConfirmLedgerModal.value = true;
        }

        let res;

        showXctConfirmClaim.value = false;

        if (claimOptions.value.xctRewards && claimOptions.value.daoRewards) {
          if (currentWallet.value.balance.mainBalance < restakeAllFee.value) {
            showWarning();

            return;
          }

          res = await currentToken.value.signAndSendMulti({
            walletId: currentToken.value.id,
            rawTransactions: restakeAllTxs.value,
            privateKey:
              !isHardwareWallet.value &&
              (await currentToken.value.getPrivateKeyDecoded(password.value)),
            derivationPath:
              isHardwareWallet.value && currentToken.value.derivationPath,
          });
        }

        if (claimOptions.value.xctRewards && !claimOptions.value.daoRewards) {
          if (currentWallet.value.balance.mainBalance < restakeXctFee.value) {
            showWarning();

            return;
          }

          res = await currentToken.value.signAndSendMulti({
            walletId: currentToken.value.id,
            rawTransactions: restakeXctTxs.value,
            privateKey:
              !isHardwareWallet.value &&
              (await currentToken.value.getPrivateKeyDecoded(password.value)),
            derivationPath:
              isHardwareWallet.value && currentToken.value.derivationPath,
          });
        }

        if (!claimOptions.value.xctRewards && claimOptions.value.daoRewards) {
          if (currentWallet.value.balance.mainBalance < restakeDaoFee.value) {
            showWarning();

            return;
          }

          res = await currentToken.value.signAndSendMulti({
            walletId: currentToken.value.id,
            rawTransactions: restakeDaoTxs.value,
            privateKey:
              !isHardwareWallet.value &&
              (await currentToken.value.getPrivateKeyDecoded(password.value)),
            derivationPath:
              isHardwareWallet.value && currentToken.value.derivationPath,
          });
        }

        if (res.ok) {
          txHash.value = res.data;
          showClaimSuccessModal.value = true;
          isLoading.value = false;

          return;
        }

        if (!res.ok) {
          if (isHardwareWallet.value) {
            ledgerErrorHandler(res.error);
          } else {
            claimModalCloseHandler();
          }
        }

        isLoading.value = false;
      }
    };

    const claimXctRewards = async () => {
      xctAction.value = 'claim';

      // metamask, ...
      if (currentWalletType.value === WALLET_TYPES.METAMASK) {
        isLoading.value = true;

        const metamaskResult =
          await metamaskConnector.value.sendMetamaskTransaction(
            claimAllTxs.value
          );

        if (metamaskResult.error) {
          notify({
            type: 'warning',
            text: metamaskResult.error,
          });
        } else {
          showXctConfirmClaim.value = false;
          txHash.value = metamaskResult.txHash
            ? [metamaskResult.txHash]
            : metamaskResult;
          showClaimSuccessModal.value = true;
        }

        isLoading.value = false;

        return;
      }

      if (passwordError.value && !isHardwareWallet.value) {
        inputError.value = passwordError.value;
      } else {
        isLoading.value = true;
        showXctConfirmClaim.value = false;

        if (isHardwareWallet.value) {
          clearLedgerModals();
          isLoading.value = false;
          showConfirmLedgerModal.value = true;
        }

        let res;

        if (claimOptions.value.xctRewards && claimOptions.value.daoRewards) {
          if (currentWallet.value.balance.mainBalance < claimAllFee.value) {
            showWarning();

            return;
          }

          res = await currentToken.value.signAndSendMulti({
            walletId: currentToken.value.id,
            rawTransactions: claimAllTxs.value,
            privateKey:
              !isHardwareWallet.value &&
              (await currentToken.value.getPrivateKeyDecoded(password.value)),
            derivationPath:
              isHardwareWallet.value && currentToken.value.derivationPath,
          });
        }

        if (claimOptions.value.xctRewards && !claimOptions.value.daoRewards) {
          if (currentWallet.value.balance.mainBalance < claimXctFee.value) {
            showWarning();

            return;
          }

          res = await currentToken.value.signAndSendMulti({
            walletId: currentToken.value.id,
            rawTransactions: claimXctTxs.value,
            privateKey:
              !isHardwareWallet.value &&
              (await currentToken.value.getPrivateKeyDecoded(password.value)),
            derivationPath:
              isHardwareWallet.value && currentToken.value.derivationPath,
          });
        }

        if (!claimOptions.value.xctRewards && claimOptions.value.daoRewards) {
          if (currentWallet.value.balance.mainBalance < claimDaoFee.value) {
            showWarning();

            return;
          }

          res = await currentToken.value.signAndSendMulti({
            walletId: currentToken.value.id,
            rawTransactions: claimDaoTxs.value,
            privateKey:
              !isHardwareWallet.value &&
              (await currentToken.value.getPrivateKeyDecoded(password.value)),
            derivationPath:
              isHardwareWallet.value && currentToken.value.derivationPath,
          });
        }

        if (res.ok) {
          txHash.value = res.data;
          showClaimSuccessModal.value = true;
          isLoading.value = false;

          return;
        }

        if (!res.ok) {
          if (isHardwareWallet.value) {
            ledgerErrorHandler(res.error);
          } else {
            claimModalCloseHandler();
          }
        }

        isLoading.value = false;
      }
    };
    const disabled = computed(
      () =>
        !!inputError.value ||
        (!claimOptions.value.xctRewards && !claimOptions.value.daoRewards)
    );
    const rewardsArray = computed(() => [
      claimOptions.value.xctRewards ? xctRewards.value : 0,
      claimOptions.value.daoRewards ? daoRewards.value : 0,
    ]);
    const totalAmount = computed(() =>
      rewardsArray.value.reduce(
        (total, currentValue) => BigNumber(total).plus(currentValue).toNumber(),
        0
      )
    );

    return {
      WALLET_TYPES,
      currentWalletType,
      currentWallet,
      qrClick,
      showModal,
      modalCloseHandler,
      currency,
      passwordIncorrect,
      claim,
      isLoading,
      showClaimModal,
      showConfirmClaim,
      fee,
      claimModalCloseHandler,
      txHash,
      showClaimSuccessModal,
      txComment,
      prepareClaim,
      successClickHandler,
      inputError,
      xctInflationIsLoading,
      inflationInfoXCT,
      subtokensIsLoading,
      subtokens,
      showConnectLedgerModal,
      showConfirmLedgerModal,
      showAppLedgerModal,
      showRejectedLedgerModal,
      connectLedgerCloseHandler,
      ledgerError,
      connectLedgerClickHandler,
      appLedgerClickHandler,
      appLedgerCloseHandler,
      confirmLedgerCloseHandler,
      rejectedLedgerClickHandler,
      rejectedLedgerCloseHandler,
      currentToken,
      OUR_TOKEN,
      isHardwareWallet,
      SNIP20_PARENT_NET,
      prepareXctClaim,
      showXctConfirmClaim,
      showConfirmUnstakedClaim,
      prepareUnstakedClaim,
      claimOptions,
      updateOptions,
      restakeXctRewards,
      claimXctRewards,
      xctRewards,
      daoRewards,
      claimFee,
      disabled,
      totalAmount,
      adding,
      ktAddresses,
      mode,
    };
  },
};
</script>

<style lang="scss" scoped>
.kt-addresses {
  &__title {
    position: absolute;
    top: -12px;
    font-size: 22px;
    line-height: 26px;
    font-family: 'Panton_Bold';
    margin-bottom: 18px;
    margin-bottom: 0;
    @include md {
      font-size: 20px;
    }
    @include xs-lg {
      font-size: 20px;
    }
    @include laptop {
      font-size: 17px;
    }
  }
}
.wallet {
  display: flex;
  flex-grow: 1;

  &__central-section {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    margin-right: 29px;
    min-width: 1190px;
    @include lg {
      margin-right: 19px;
      min-width: 631px;
    }
    @include md {
      min-width: 522px;
      margin-right: 16px;
    }
  }

  &__section-wrapper {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
    @include lg {
      margin-bottom: 14px;
    }
    @include md {
      margin-bottom: 16px;
    }
  }

  &__claim-rewards {
    display: none;
    @include xl {
      display: initial;
    }
  }

  &__claim-rewards-lg {
    display: none;
    @include lg {
      display: initial;
      margin-bottom: 14px;
    }
  }

  // &__balance {
  //   margin-bottom: 24px;
  //   @include lg {
  //     margin-bottom: 16px;
  //   }
  //   @include md {
  //     margin-bottom: 16px;
  //   }
  // }
  // &__pledged-balance {
  //   margin-bottom: 24px;
  //   @include lg {
  //     margin-bottom: 16px;
  //   }
  //   @include md {
  //     display: none;
  //   }
  // }

  &__claim-unstaked {
    margin-bottom: 22px;
  }
  &__subtokens-block {
    margin-bottom: 24px;
    @include lg {
      margin-bottom: 16px;
    }
    @include md {
      margin-bottom: 16px;
    }
  }

  &__xct-calculator {
    margin-bottom: 25px;
    @include lg {
      margin-bottom: 16px;
    }
    @include md {
      margin-bottom: 16px;
    }
  }

  &__network-info {
    margin-bottom: 30px;
    @include lg {
      margin-bottom: 16px;
    }
    @include md {
      margin-bottom: 16px;
    }
  }

  &__main {
    position: relative;
    display: flex;
    flex-direction: column;
    background: $white;
    box-shadow: $card-shadow;
    border-radius: 50px;
    padding: 0 45px;
    @include lg {
      border-radius: 25px;
      padding: 0 29px;
    }
    @include md {
      border-radius: 16px;
      padding: 0 24px;
    }
    @include laptop {
      border-radius: 8px;
      padding: 0 20px;
    }
  }

  &__right-section {
    display: flex;
    flex-direction: column;
    max-width: 400px;
    width: 100%;
    margin-bottom: 78px;
    @include lg {
      max-width: 350px;
    }
    @include md {
      max-width: 250px;
      margin-bottom: 54px;
    }
    @include laptop {
      max-width: 200px;
    }

    & > div {
      width: 100%;
    }
  }

  &__notifications {
    margin-bottom: 6px;
    position: fixed;
    bottom: 0;
    width: 400px;
    @include lg {
      width: 329px;
    }
    @include md {
      width: 239px;
    }
  }

  &__modal-claim-button {
    margin-top: 24px;
    cursor: pointer;
    font-size: 18px;
    line-height: 27px;
    text-decoration-line: underline;
    color: $too-dark-blue;
    font-family: 'Panton_Bold';

    &--disabled {
      color: $mid-gray;
      pointer-events: none;
    }

    &:hover {
      color: $blue;
    }

    @include lg {
      align-self: center;
    }
    @include md {
      align-self: flex-end;
    }
  }

  &__kt-addresses {
    overflow: auto;
    position: relative;
    transform: rotateX(180deg);
    perspective: 1px;
    &-wrapper {
      max-width: 100%;
      position: relative;
      margin: 1rem auto 0rem auto;
    }
    &::-webkit-scrollbar {
      max-width: 368px !important;
      height: 4px; /* width of the entire scrollbar */
      border-radius: 20px;
      scrollbar-width: thin;
    }

    &::-webkit-scrollbar-track {
      background: #c3ceeb; /* color of the tracking area */
      border-radius: 20px;
      max-width: 368px !important;
      margin-left: 120px;
      @include laptop {
        margin-left: 94px;
      }
      margin-right: 0px;
      position: absolute;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #6b758e; /* color of the scroll thumb */
      border-radius: 20px; /* roundness of the scroll thumb */
      //border: 3px solid orange; /* creates padding around scroll thumb */
    }
  }

  &__kt-addresses-md {
    margin-bottom: 16px;
    @include lg {
      display: none;
    }
    @include xl {
      display: none;
    }
    @include md {
      display: none;
    }
  }

  &__loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
  }
}
</style>
