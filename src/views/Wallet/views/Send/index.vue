<template>
  <Info
    v-if="
      currentWallet.type === WALLET_TYPES.PUBLIC_KEY &&
      currentWalletType !== WALLET_TYPES.METAMASK
    "
    title="wallet.info.title"
    data-qa="send__info"
  />
  <div
    v-else
    v-click-away="
      () => {
        showNetworkTargetWallets ? (showNetworkTargetWallets = false) : null;
      }
    "
    class="send"
  >
    <div v-if="dataLoaded" class="send__loader">
      <Loading />
    </div>
    <form v-if="!dataLoaded" @submit.prevent="submitHandler">
      <div v-if="itemsNetworks.length && bridgeTargetNet" class="send__section">
        <div class="send__switch">
          <span>{{ $t('sendAssetsToAnotherNetwork') }}</span>
          <el-switch
            v-model="isSendToAnotherNetwork"
            active-color="#6a4bff"
            inactive-color="#dfe9f5"
            @input="switchChangeHandler"
          />
        </div>
        <div
          v-if="isSendToAnotherNetwork && bridgeTargetNet"
          class="send__autocomplete"
        >
          <Select
            v-model="bridgeTargetNet"
            :label="$t('sendAssetsDestination')"
            icon="curve-arrow"
            :options="itemsNetworks"
            value-key="key"
            data-qa="send__destination-network-field"
            @change="selectBridgeNetwork"
            @click="showNetworkTargetWallets = false"
          />
        </div>
      </div>
      <div class="send__section">
        <div class="send__section-input">
          <Input
            id="to"
            v-model="toAddress"
            :label="$t('to')"
            type="text"
            icon="curve-arrow"
            :with-copy="true"
            :placeholder="$t('selectAddress')"
            :disabled="isSendToAnotherNetwork && !bridgeTargetNet"
            :show-error-text="showErrorText"
            :error="incorrectAddress"
            data-qa="send__to-field"
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
          <transition name="fade">
            <div v-if="incorrectAddress" class="send__section-error">
              <error class="send__section-error-icon" />
              <span class="send__section-error-text">
                {{ incorrectAddress }}
              </span>
            </div>
          </transition>
        </div>
        <div class="send__section-input">
          <Input
            id="amount"
            v-model="amount"
            type="currency"
            :currency="currentWallet.code"
            :label="$t('amount')"
            :max="maxAmount"
            :disabled="
              (isSendToAnotherNetwork && !bridgeTargetNet) || maxAmount === 0
            "
            placeholder="0.0"
            icon="coins"
            :show-error-text="showErrorText"
            :error="insufficientFunds"
            data-qa="send__amount-field"
            :show-set-max="maxAmount !== 0"
          />
          <transition name="fade">
            <div
              v-if="insufficientFunds"
              class="send__section-error"
              :class="{ doNotHaveEnoughFunds: maxAmount === 0 }"
            >
              <error class="send__section-error-icon" />
              <span class="send__section-error-text">
                {{ insufficientFunds }}
              </span>
            </div>
          </transition>

          <span v-if="false" class="send__input-note-xl"
            >{{ $t('includingFunds-xl') }}
          </span>
          <transition name="fade">
            <span 
              v-if="!insufficientFunds" 
              class="send__input-note"
              :class="{ 'send__input-note-laptop': insufficientFunds }" 
            >
              {{ $t('includingFunds') }}
            </span>
          </transition>
        </div>
      </div>
      <div
        v-if="
          !currentWallet.hideMemo &&
          !['eth', 'bsc'].includes(currentToken?.parentCoin?.net)
        "
        class="send__memo"
      >
        <div class="send__memo-toggle">
          <span class="send__memo-title">
            {{ $t('memo') }}
          </span>
          <Tooltip left="-95px" width="200px" class="send__memo-tooltip">
            <info />
            <template #content>
              <span class="send__memo-tooltip-text">{{
                $t('memoTooltip')
              }}</span>
            </template>
          </Tooltip>
          <el-switch
            v-model="showMemo"
            active-color="#6a4bff"
            inactive-color="#dfe9f5"
            data-qa="send__memo-checkbox"
          />
        </div>
        <transition name="fade">
          <div v-if="showMemo" class="send__memo-input">
            <Input
              id="memo"
              v-model="memo"
              :label="$t('memo')"
              type="text"
              icon="text"
              :placeholder="$t('inputMemo')"
              :label-info="false"
              data-qa="send__memo-field"
            />
          </div>
        </transition>
      </div>
      <div v-if="isSendToAnotherNetwork" class="send__info">
        <div v-if="false" class="send__info-banner">
          <bannerInfo />
          <p>
            {{ $t('sendBannerInfo') }}<a href="#">{{ $t('link') }}</a
            >.
          </p>
        </div>
        <div v-if="false" class="send__info-info">
          <span class="send__info-line">
            {{ $t('price') }}:
            <span class="send__info-price">
              1
              <span class="send__info-currency">
                {{ currentWallet.net }}
                <span class="send__info-per"> {{ $t('per') }}</span>
                {{ currentWallet.net.slice(8) }}
              </span>
            </span>
          </span>
          <span class="send__info-line">
            {{ $t('transactionFee') }}:
            <span class="send__info-fee">
              0.1
              <span class="send__info-currency"> OSMO </span>
            </span>
          </span>
        </div>
      </div>
      <div class="send__button">
        <PrimaryButton
          :loading="prepareLoading"
          :disabled="disabledSend"
          data-qa="send__send-button"
        >
          {{ $t('send') }}
        </PrimaryButton>
      </div>
    </form>
    <WalletButtonsPanel
      :current-token="currentToken"
      :current-wallet="currentWallet"
      :disabled-send="disabledSend"
      type="send"
      button2="send"
      data-qa="send"
      @button2click="submitHandler"
      @prepareClaim="$emit('prepareClaim')"
      @prepareXctClaim="$emit('prepareXctClaim')"
    />
  </div>
  <teleport v-if="showModal" to="body">
    <Modal>
      <!--Confirm Modal -->
      <ModalContent
        v-if="showConfirmModal"
        v-click-away="confirmModalCloseHandler"
        :title="$t('sendModal.title1')"
        :desc="$t('sendModal.desc1')"
        button-text="confirm"
        type="action"
        :disabled="confirmModalDisabled"
        @close="confirmModalCloseHandler"
        @buttonClick="confirmClickHandler"
      >
        <div v-if="isLoading" class="loader">
          <Loading />
        </div>
        <ActionModalContent
          v-model:password="password"
          :hide-fee="!!isSendToAnotherNetwork"
          :password-error="passwordError"
          :to="toAddress"
          :wallet="currentWallet"
          :amount="amount"
          :confirm-clicked="confirmClicked"
          :max-amount="maxAmount"
          :total-amount="totalAmount"
          :fees="fees"
          :memo="memo"
          :fee-type="feeType"
          :hide-password="
            isHardwareWallet ||
            [WALLET_TYPES.METAMASK, WALLET_TYPES.KEPLR].includes(
              currentWalletType
            )
          "
          :custom-fee="customFee"
          :current-token="currentToken"
          :fee="fee"
          :iost-fee="iostFee"
          :adding="adding"
          @select-fee="openFeeSelectModal"
          @submitSend="confirmClickHandler"
          @update:password="onChangePassword"
        />
        <!-- Changing Amount Modals -->
        <Modal v-if="showChangingAmountModal">
          <!-- Decrease Amount modal -->
          <ModalContent
            v-if="showDecreaseAmountModal"
            v-click-away="cancelDecreaseAmount"
            :title="$t('sendModal.changingModals.title')"
            :desc="$t('sendModal.changingModals.decreaseDesc')"
            :button-text="$t('yes')"
            :button-text2="$t('no')"
            type="system"
            @close.stop="cancelDecreaseAmount"
            @buttonClick="allowDecreaseAmount"
            @buttonClick2="cancelDecreaseAmount"
          >
            <ChangingModalContent
              :currency="
                currentToken ? currentToken.parentCoin.code : currentWallet.code
              "
              :amount="amount"
              :amount-next="maxAmount"
              :fee-prev="lastCorrectFee.fee"
              :fee="fee.fee"
            />
          </ModalContent>
          <!-- Increase Amount modal -->
          <ModalContent
            v-else-if="showIncreaseAmountModal"
            v-click-away="cancelIncreaseAmount"
            :title="$t('sendModal.changingModals.title')"
            :desc="$t('sendModal.changingModals.increaseDesc')"
            :button-text="$t('yes')"
            :button-text2="$t('no')"
            type="system"
            @close.stop="cancelIncreaseAmount"
            @buttonClick="allowIncreaseAmount"
            @buttonClick2="cancelIncreaseAmount"
          >
            <ChangingModalContent
              :currency="
                currentToken ? currentToken.parentCoin.code : currentWallet.code
              "
              :amount="amount"
              :amount-next="maxAmount"
              :fee-prev="lastCorrectFee.fee"
              :fee="fee.fee"
            />
          </ModalContent>
        </Modal>
      </ModalContent>

      <transition name="fade">
        <Modal v-if="showFeeSelectModal">
          <SelectFeeModal
            v-click-away="closeFeeSelectModal"
            :fees="fees"
            :fee-type="feeType"
            :custom-fee="customFee"
            :currency="
              currentToken ? currentToken.parentCoin.code : currentWallet.code
            "
            :balance="balance"
            @close="closeFeeSelectModal"
            @confirm="updateFee"
          />
        </Modal>
      </transition>

      <!--Confirm Ledger Modals-->
      <ConnectLedgerModal
        v-if="showConnectLedgerModal"
        v-click-away="connectLedgerCloseHandler"
        :error="ledgerError"
        @close="connectLedgerCloseHandler"
        @buttonClick="connectLedgerClickHandler"
      />
      <OpenAppLedgerModal
        v-if="showAppLedgerModal"
        v-click-away="appLedgerCloseHandler"
        @close="appLedgerCloseHandler"
        @buttonClick="appLedgerClickHandler"
      />
      <ConfirmLedgerModal
        v-if="showConfirmLedgerModal"
        @close="confirmLedgerCloseHandler"
      />
      <RejectLedgerModal
        v-if="showRejectedLedgerModal"
        v-click-away="rejectedLedgerCloseHandler"
        @close="rejectedLedgerCloseHandler"
        @buttonClick="rejectedLedgerClickHandler"
      />

      <!--Error Modal -->
      <ModalContent
        v-if="txError"
        v-click-away="errorCloseHandler"
        title="Warning"
        icon="warningIcon"
        :desc="txError"
        button-text="ok"
        type="warning"
        @close="errorCloseHandler"
        @buttonClick="errorClickHandler"
      />
      <!--Success Modal -->
      <ModalContent
        v-if="showSuccessModal && !txError"
        v-click-away="successCloseHandler"
        title="Success"
        desc="The transaction is in progress"
        button-text="ok"
        type="success"
        icon="success"
        @close="successCloseHandler"
        @buttonClick="successClickHandler"
      >
        <SuccessModalContent
          v-model:txComment="txComment"
          :to="toAddress"
          :wallet="currentWallet"
          :amount="amount"
          :fee="fee.fee"
          type="transfer"
          :tx-hash="txHash"
        />
      </ModalContent>
    </Modal>
  </teleport>
</template>

<script>
import error from '@/assets/icons/input/error.svg';
import { useWindowSize } from 'vue-window-size';
import ActionModalContent from './components/ActionModalContent.vue';
import SuccessModalContent from './components/SuccessModalContent.vue';
import ChangingModalContent from '@/views/Wallet/views/Send/components/ChangingModalContent.vue';
import SelectFeeModal from '@/views/Wallet/views/Send/components/SelectFeeModal';
import Modal from '@/components/Modal';
import ModalContent from '@/components/ModalContent';
import ConfirmLedgerModal from '@/components/Modals/Ledger/ConfirmLedgerModal';
import ConnectLedgerModal from '@/components/Modals/Ledger/ConnectLedgerModal';
import OpenAppLedgerModal from '@/components/Modals/Ledger/OpenAppLedgerModal';
import RejectLedgerModal from '@/components/Modals/Ledger/RejectLedgerModal';
import bannerInfo from '@/assets/icons/banner-info.svg';
import info from '@/assets/icons/info.svg';
import Info from '@/components/Info';
import Select from '@/components/UI/Select';
import PrimaryButton from '@/components/UI/PrimaryButton';
import Input from '@/components/UI/Input';
import WalletButtonsPanel from '@/components/WalletButtonsPanel';
import BigNumber from 'bignumber.js';
import useCurrentWalletRequests from '@/compositions/useCurrentWalletRequests';
import useLedger from '@/compositions/useLedger';
import { ref, computed, watch, provide, inject } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import useCheckPassword from '@/compositions/useCheckPassword';
import Loading from '@/components/Loading';
import { WALLET_TYPES, TOKEN_STANDARDS } from '@/config/walletType';
import { screenWidths } from '@/config/sreenWidthThresholds';
import Tooltip from '@/components/Tooltip';
import useApi from '@/api/useApi';
import useWallets from '@/compositions/useWallets';
import notify from '@/plugins/notify';

import { useI18n } from 'vue-i18n';
import AddressItem from '@/layouts/AddAddressLayout/components/CutomLists/components/AddressItem';
import { keplrNetworksProtobufFormat } from '@/config/availableNets';
import { getDecorateLabel } from '@/config/decorators';
import amountInputValidation from '@/helpers/amountInputValidation';

export default {
  name: 'Send',
  components: {
    SelectFeeModal,
    Tooltip,
    Input,
    PrimaryButton,
    Select,
    info,
    Info,
    bannerInfo,
    Modal,
    ModalContent,
    ActionModalContent,
    SuccessModalContent,
    Loading,
    error,
    ChangingModalContent,
    WalletButtonsPanel,
    ConfirmLedgerModal,
    ConnectLedgerModal,
    OpenAppLedgerModal,
    RejectLedgerModal,
    AddressItem,
  },
  props: {
    currentWallet: {
      type: Object,
      default: () => ({}),
    },
    tokenList: {
      type: Array,
      default: () => [],
    },
    currentToken: {
      type: [Object, null],
      default: null,
    },
    subtokensIsLoading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['prepareClaim', 'prepareXctClaim'],
  setup(props) {
    const loadingSign = ref(false);
    const showSuccessModal = ref(false);
    const { t } = useI18n();
    // const isSendToAnotherNetwork = ref(false);
    const showAdvanced = ref(false);
    const showMemo = ref(false);
    const store = useStore();
    const route = useRoute();
    const toAddress = ref('');
    const amount = ref('');
    const memo = ref('');
    const prepareLoading = ref(false);
    const { width } = useWindowSize();
    const showErrorText = computed(() =>
      width.value < screenWidths.xl ? false : true
    );
    // const prepareBuildTransaction = ref({});

    const {
      formatedFee: fees,
      feesError,
      getFees,
      balance,
      balanceError,
      getDelegationBalance,
      rawTx,
      rawTxError,
      prepareTransfer,
      signAndSendTransfer,
      txHash,
      txError,
      clearTxData,
      iostFee,
      adding,
      resMaxAmount,
      isSendToAnotherNetwork,
    } = useCurrentWalletRequests();

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

    const showNetworkTargetWallets = ref(false);

    const metamaskConnector = computed(
      () => store.getters['metamask/metamaskConnector']
    );
    const keplrConnector = computed(
      () => store.getters['keplr/keplrConnector']
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

    const switchChangeHandler = async (value) => {
      if (value) {
        await getFees(bridgeTargetNet.value);
      }
      toAddress.value = '';
    };
    const { isHardwareWallet, wallets } = useWallets();

    const defaultFee = computed(() => fees.value?.medium);
    const customFee = ref(0);

    // заглушка для бриджей
    const itemsNetworks = ref([{ key: props.currentWallet.net }]);

    const bridgeTargetNet = ref(itemsNetworks.value[0].key);

    const setAddress = (item) => {
      toAddress.value = item.address;
      showNetworkTargetWallets.value = false;
    };

    const networkTargetWallets = computed(() => {
      const parseNetwork =
        props.currentWallet?.parentCoin?.net || props.currentWallet.net;

      // parent coin
      if (!isSendToAnotherNetwork.value) {
        return wallets.value.filter((w) => {
          const findFromAlias =
            w.net === parseNetwork &&
            w.title.toLowerCase().includes(toAddress.value.toLowerCase());

          if (!toAddress.value) {
            return w.net === parseNetwork || findFromAlias;
          }

          if (w.address === toAddress.value) {
            return (
              (w.net === parseNetwork || findFromAlias) &&
              w.address !== toAddress.value
            );
          }

          return (
            (w.net === parseNetwork && w.address.includes(toAddress.value)) ||
            findFromAlias
          );
        });
      }

      return wallets.value.filter((w) => {
        const findFromAlias =
          w.net === bridgeTargetNet.value &&
          w.title.toLowerCase().includes(toAddress.value.toLowerCase());

        if (!toAddress.value) {
          return w.net === bridgeTargetNet.value || findFromAlias;
        }

        if (w.address === toAddress.value) {
          return (
            (w.net === bridgeTargetNet.value || findFromAlias) &&
            w.address !== toAddress.value
          );
        }

        return (
          (w.net === bridgeTargetNet.value &&
            w.address.includes(toAddress.value)) ||
          findFromAlias
        );
      });
    });

    const setCosmosNetworkBridgeToken = () => {
      const newWallet = store.getters['wallets/walletByAddress']({
        net: route.params.net,
        address: route.params.address,
      });
      // const parseNetwork =
      //   props.currentWallet?.parentCoin?.net || props.currentWallet.net;
      // const parseNetworkLength = parseNetwork.length + 1;

      // if (route.params.token) {
      //   itemsNetworks.value = props.currentWallet.getCrossNetworkRoutes({
      //     walletId: newWallet.id,
      //     token: route.params.token,
      //   });

      //   // const bridgeToken = itemsNetworks.value?.find((item) => {
      //   //   if (props.currentWallet.config.standard === TOKEN_STANDARDS.CW_20) {
      //   //     return itemsNetworks.value[0];
      //   //   } else {
      //   //     return (
      //   //       item.key === props.currentWallet.net.slice(parseNetworkLength)
      //   //     );
      //   //   }
      //   // });

      //   // if (bridgeToken) {
      //   bridgeTargetNet.value =
      //     itemsNetworks.value && itemsNetworks.value[0]?.key;
      //   // } else {
      //   //   bridgeTargetNet.value = null; // itemsNetworks.value[0].key
      //   //   isSendToAnotherNetwork.value = false;
      //   // }
      // } /* if (cosmosBridgeNetworks.includes(route.params.net)) */ else {
      itemsNetworks.value = props.currentWallet.getCrossNetworkRoutes({
        walletId: newWallet.id,
        token: route.params.token || route.params.net,
      });
      itemsNetworks.value = itemsNetworks.value.map((item) => {
        return {
          ...item,
          label: getDecorateLabel(props.currentWallet.net, item.label),
        };
      });

      bridgeTargetNet.value =
        itemsNetworks.value && itemsNetworks.value[0]?.key;
      // }
    };

    setCosmosNetworkBridgeToken();

    const clearState = () => {
      toAddress.value = '';
      memo.value = '';
      amount.value = '';
      feeType.value = 'medium';
      customFee.value = 0;
      showMemo.value = false;
      clearTxData();
    };
    const dataLoaded = ref(false);
    const loadData = async () => {
      dataLoaded.value = true;
      await getFees();
      await getDelegationBalance();
      dataLoaded.value = false;
    };
    loadData();

    watch(
      () => props.currentWallet,
      (newVal, oldVal) => {
        if (
          newVal.net !== oldVal.net ||
          newVal.address.toLowerCase() !== oldVal.address.toLowerCase()
        ) {
          setCosmosNetworkBridgeToken();
        }
      }
    );

    watch(
      () => route.params,
      (newParams) => {
        if (newParams.net && newParams.address) {
          isSendToAnotherNetwork.value = false;
          clearState();
          loadData();
          showNetworkTargetWallets.value = false;
          bridgeTargetNet.value = route.params.net;
          setCosmosNetworkBridgeToken();
        }
      },
      { deep: true }
    );

    // Calc Max Amount
    const maxAmount = computed(() => {
      if (props.currentToken) {
        return balance.value?.mainBalance;
      }

      return props.currentWallet.hasPledged
        ? resMaxAmount.value
        : balance.value?.mainBalance > fee.value.fee
        ? BigNumber(balance.value?.mainBalance).minus(fee.value.fee).toNumber()
        : 0;
    });
    const isMaxSelected = computed(() => amount.value === maxAmount.value);

    // Select Fee
    const showFeeSelectModal = ref(false);
    const feeType = ref('medium');
    const fee = computed(() =>
      // fee is object to keep fee-appropriate key (eg gasPrice)
      feeType.value === 'custom'
        ? { fee: customFee.value }
        : fees.value?.[feeType.value] || { fee: 0 }
    );

    const openFeeSelectModal = () => {
      setLastCorrectFee(fee.value, feeType.value);
      showConfirmModal.value = false;
      showFeeSelectModal.value = true;
    };

    const closeFeeSelectModal = () => {
      showConfirmModal.value = true;
      showFeeSelectModal.value = false;
    };

    // Change amount modals management
    const showDecreaseAmountModal = ref(false);
    const showIncreaseAmountModal = ref(false);
    const showChangingAmountModal = computed(
      () => showDecreaseAmountModal.value || showIncreaseAmountModal.value
    );
    const closeFeeModal = () => {
      showDecreaseAmountModal.value = false;
      showIncreaseAmountModal.value = false;
    };

    const onChangeFee = () => {
      if (fee.value.fee > lastCorrectFee.value.fee && insufficientFunds.value) {
        showDecreaseAmountModal.value = true;
      } else if (
        isMaxSelected.value &&
        fee.value.fee < lastCorrectFee.value.fee &&
        amount.value < maxAmount.value
      ) {
        showIncreaseAmountModal.value = true;
      }
    };

    const updateFee = ({ type, custom }) => {
      feeType.value = type;
      customFee.value = custom;

      closeFeeSelectModal();
      onChangeFee();
    };

    const lastCorrectFee = ref(null);
    const lastCorrectFeeType = ref(null);
    const setLastCorrectFee = (fee, type) => {
      lastCorrectFee.value = fee;
      lastCorrectFeeType.value = type;
    };
    const backToLastCorrectFee = () => {
      if (feeType.value === 'custom') {
        customFee.value = lastCorrectFee.value.fee;
      }

      feeType.value = lastCorrectFeeType.value;
    };

    watch(
      () => [fee.value, feeType.value],
      (newFee, prevFee) => {
        setLastCorrectFee(prevFee[0], prevFee[1]);
        onChangeFee();
      }
    );

    // Fee Error Modal Handlers
    const closeFeeErrorModal = () => {
      backToLastCorrectFee();
      closeFeeModal();
    };

    // Decrease Amount Modal Handlers
    const cancelDecreaseAmount = () => {
      backToLastCorrectFee();
      closeFeeModal();
    };
    const allowDecreaseAmount = () => {
      amount.value = maxAmount.value;
      closeFeeModal();
    };

    // Increase Amount Modal Handlers
    const cancelIncreaseAmount = () => {
      closeFeeModal();
    };
    const allowIncreaseAmount = () => {
      amount.value = maxAmount.value;
      closeFeeModal();
    };

    const totalAmount = computed(() =>
      BigNumber(amount.value).plus(fee.value.fee).toNumber()
    );

    // Error Handlers
    const insufficientFunds = computed(() =>
      amountInputValidation({
        amount: amount.value,
        wallet: props.currentWallet,
        maxAmount: +maxAmount.value,
        type: 'send',
      })
    );

    const networksConfig = computed(() => store.getters['networks/config']);
    // const parseNetwork =
    //   props.currentWallet?.parentCoin?.net || props.currentWallet.net;
    // const parseNetworkLength = parseNetwork.length + 1;

    const incorrectAddress = computed(() => {
      // for networks that has not selfSend
      if (
        toAddress.value &&
        props.currentWallet.noSelfSend &&
        toAddress.value.toLowerCase() ===
          props.currentWallet.address.toLowerCase()
      ) {
        return t('noSelfSendError');
      }

      // validate if switch another network
      const validateAddress = (address, validateNetwork) => {
        const regExp = new RegExp(
          networksConfig.value[
            validateNetwork || bridgeTargetNet.value
          ].validating
        );

        return regExp.test(address);
      };

      if (isSendToAnotherNetwork.value) {
        // if (props.currentToken) {
        //   // check select network in cosmosnetworks ibc token to bridge
        //   if (
        //     props.currentToken.net.slice(parseNetworkLength) !==
        //       bridgeTargetNet.value &&
        //     props.currentWallet.config.standard !== TOKEN_STANDARDS.CW_20
        //   ) {
        //     return t('messages.incorrectNetwork');
        //   }
        // }

        return (
          toAddress.value &&
          !validateAddress(toAddress.value) &&
          t('messages.incorrectAddress')
        );
      }

      // default check
      return (
        toAddress.value &&
        !props.currentWallet.validateAddress(toAddress.value) &&
        t('messages.incorrectAddress')
      );
    });
    const requestsError = computed(
      () =>
        feesError.value ||
        balanceError.value ||
        rawTxError.value ||
        txError.value
    );
    const disabledSend = computed(
      () =>
        !!(
          requestsError.value ||
          insufficientFunds.value ||
          incorrectAddress.value ||
          !+amount.value ||
          !toAddress.value
        )
    );
    const confirmClicked = ref(false);

    // Check Password
    const { password, passwordError, inputError } = useCheckPassword();
    provide('inputError', inputError);

    const disableBtn = ref(false);

    const confirmModalDisabled = computed(() => {
      return (
        (!isHardwareWallet.value && !!inputError.value) ||
        insufficientFunds.value ||
        disableBtn.value
      );
    });

    const onChangePassword = () => {
      confirmClicked.value = false;
      disableBtn.value = false;
    };

    const currentKtAddress = inject('currentKtAddress');
    // Prepare and Send tx
    const transferParams = computed(() => ({
      amount: amount.value,
      toAddress: toAddress.value,
      kt: currentKtAddress.value && currentKtAddress.value.address,
      memo: memo.value,
      ...(props.currentWallet.fee_key && {
        [props.currentWallet.fee_key]: fee.value[props.currentWallet.fee_key],
      }),
      //for crossnetwork transfer
      token: props.currentWallet.net,
      toNetwork: bridgeTargetNet.value,
    }));

    const showModal = ref(false);
    const showConfirmModal = ref(false);

    const selectBridgeNetwork = async (key) => {
      await getFees(key);
      bridgeTargetNet.value = key;
      toAddress.value = '';
    };

    const submitHandler = async () => {
      if (prepareLoading.value) {
        return;
      }

      // bridge
      // if (isSendToAnotherNetwork.value) {
      //   prepareLoading.value = true;
      //   prepareBuildTransaction.value =
      //     await props.currentWallet.getBuildBridgeTransaction({
      //       walletId: props.currentWallet.id,
      //       token: props.currentWallet.net,
      //       toNetwork: bridgeTargetNet.value,
      //       toAddress: toAddress.value,
      //       amount: amount.value,
      //     });
      //   prepareLoading.value = false;

      //   if (prepareBuildTransaction.value.ok) {
      //     showConnectLedgerModal.value = false;
      //     showAppLedgerModal.value = false;
      //     showConfirmLedgerModal.value = false;
      //     showRejectedLedgerModal.value = false;
      //     showConfirmModal.value = true;
      //     showModal.value = true;
      //   } else {
      //     showConfirmModal.value = false;
      //     showModal.value = false;
      //     clearTxData();
      //   }

      //   return;
      // }

      prepareLoading.value = true;
      try {
        await prepareTransfer(transferParams.value);
        prepareLoading.value = false;
      } catch (err) {
        prepareLoading.value = false;
        return;
      }

      if (!rawTxError.value) {
        showConnectLedgerModal.value = false;
        showAppLedgerModal.value = false;
        showConfirmLedgerModal.value = false;
        showRejectedLedgerModal.value = false;
        showConfirmModal.value = true;
        showModal.value = true;
      } else {
        showConfirmModal.value = false;
        showModal.value = false;
        clearTxData();
      }
    };

    const isLoading = ref(false);
    const confirmClickHandler = async () => {
      // prepare new tx if fee was changed
      if (fee.value && fee.value !== defaultFee.value) {
        await prepareTransfer(transferParams.value);

        if (rawTxError.value) {
          showConfirmModal.value = false;
          showModal.value = false;
          clearTxData();
        }
      }
      loadingSign.value = true;

      // metamask, ...
      if (currentWalletType.value === WALLET_TYPES.METAMASK) {
        isLoading.value = true;
        const metamaskResult =
          await metamaskConnector.value.sendMetamaskTransaction(rawTx.value);

        if (metamaskResult.error) {
          loadingSign.value = false;
          notify({
            type: 'warning',
            text: metamaskResult.error,
          });
        } else {
          loadingSign.value = false;
          showConfirmModal.value = false;
          showSuccessModal.value = true;
          txHash.value = [metamaskResult.txHash];
        }

        isLoading.value = false;

        return;
      }

      if (
        props.currentWallet.type === WALLET_TYPES.KEPLR &&
        props.currentWallet?.config?.standard !== TOKEN_STANDARDS.SNIP_20
      ) {
        // const tx = isSendToAnotherNetwork.value
        //   ? prepareBuildTransaction.value.data
        //   : rawTx.value;
        let keplrResult;

        try {
          loadingSign.value = true;
          isLoading.value = true;
          keplrResult = await keplrConnector.value.sendKeplrTransaction(
            rawTx.value,
            props.currentWallet.address,
            { preferNoSetFee: true }
          );
          loadingSign.value = false;
          isLoading.value = false;
        } catch (err) {
          isLoading.value = false;
          loadingSign.value = false;
          notify({
            type: 'warning',
            text: JSON.stringify(err),
          });

          return;
        }

        if (keplrResult.error) {
          notify({
            type: 'warning',
            text: keplrResult.error,
          });

          return;
        }

        isLoading.value = true;

        const { currentWallet: parentWallet } = useWallets();

        const defaultTx = {
          ...keplrResult.signedTx,
          publicKey: await parentWallet.value.getPublicKeyDecoded(),
          signature: keplrResult.signature,
        };

        const defaultSendTx = rawTx.value.transaction || rawTx.value;
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
          hash: keplrNetworksProtobufFormat.includes(parentWallet.value.net)
            ? protobufTx
            : defaultTx,
          deviceType: WALLET_TYPES.KEPLR,
          proxy: false,
          network: parentWallet.value.net,
          from: parentWallet.value.address,
          mem_tx_id: rawTx.value.mem_tx_id,
        });

        if (data.ok) {
          loadingSign.value = false;
          isLoading.value = false;
          showConfirmModal.value = false;
          showSuccessModal.value = true;
          txHash.value = [data.data.txhash];
          return;
        } else {
          loadingSign.value = false;
          notify({
            type: 'warning',
            text: data.error,
          });
          isLoading.value = false;

          return;
        }
      }

      confirmClicked.value = true;

      if (
        (!isHardwareWallet.value &&
          !password.value &&
          props.currentWallet.type !== WALLET_TYPES.KEPLR) ||
        (passwordError.value &&
          !isHardwareWallet.value &&
          !props.currentWallet.type === WALLET_TYPES.KEPLR)
      ) {
        inputError.value = passwordError.value;
        disableBtn.value = true;
        return;
      }

      if (passwordError.value === 'Incorrect password' && password.value) {
        disableBtn.value = true;
        return;
      }

      try {
        isLoading.value = true;

        // sign and send transfer
        if (isLedgerWallet.value) {
          isLoading.value = false;
          showConfirmModal.value = false;
          clearLedgerModals();
          showConfirmLedgerModal.value = true;

          try {
            // const tx = isSendToAnotherNetwork.value
            //   ? prepareBuildTransaction.value.data
            //   : rawTx.value;
            await signAndSendTransfer(rawTx.value, null, {
              currentToken: props.currentToken,
            });
            showConfirmLedgerModal.value = false;
            showConfirmModal.value = false;
            showSuccessModal.value = true;
            loadingSign.value = false;
            disableBtn.value = false;
            confirmClicked.value = false;
          } catch (e) {
            confirmClicked.value = false;
            disableBtn.value = false;
            loadingSign.value = false;
            if (!showConfirmModal.value) {
              ledgerErrorHandler(e);
              showConfirmLedgerModal.value = false;
            }
          }
        } else {
          // const tx = isSendToAnotherNetwork.value
          //   ? prepareBuildTransaction.value.data
          //   : rawTx.value;
          await signAndSendTransfer(rawTx.value, password.value, {
            currentToken: props.currentToken,
          });
          loadingSign.value = false;
          password.value = '';
          inputError.value = '';
          confirmClicked.value = false;
          disableBtn.value = false;
          showConfirmModal.value = false;
          showSuccessModal.value = true;
          isLoading.value = false;
        }
      } catch (e) {
        loadingSign.value = false;
        confirmClicked.value = false;
        disableBtn.value = false;
        password.value = '';
        inputError.value = '';
        console.error(e);
      }
    };

    const confirmModalCloseHandler = () => {
      password.value = '';
      inputError.value = false;
      passwordError.value = '';
      confirmClicked.value = false;
      disableBtn.value = false;
      feeType.value = 'medium';
      customFee.value = 0;
      showSuccessModal.value = false;

      if (txHash?.value?.[0]) {
        amount.value = '';
        txComment.value = '';
      }

      clearTxData();
      showModal.value = false;
    };

    // ledger modal handlers
    const connectLedgerClickHandler = () => {
      ledgerError.value = '';
      showConnectLedgerModal.value = false;
      confirmClickHandler();
    };
    const connectLedgerCloseHandler = () => {
      showConnectLedgerModal.value = false;
      showConfirmLedgerModal.value = false;
      showRejectedLedgerModal.value = false;
      showConfirmModal.value = true;
    };
    const appLedgerClickHandler = () => {
      confirmClickHandler();
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

    // error modal handlers
    const errorCloseHandler = confirmModalCloseHandler;
    const successCloseHandler = () => {
      clearState();
      showSuccessModal.value = false;
      loadData();
      confirmModalCloseHandler();
      txComment.value = '';
    };
    const errorClickHandler = confirmModalCloseHandler;

    // add comment to a successfull tx
    const txComment = ref('');
    const successClickHandler = async () => {
      txComment.value &&
        (await store.dispatch('transactions/postTransactionNote', {
          network: props.currentWallet.net,
          hash: txHash.value[0],
          text: txComment.value,
        }));
      successCloseHandler();
    };

    return {
      switchChangeHandler,
      WALLET_TYPES,
      isHardwareWallet,
      isSendToAnotherNetwork,
      showMemo,
      toAddress,
      amount,
      maxAmount,
      showAdvanced,
      memo,
      submitHandler,
      itemsNetworks,
      balance,
      fees,
      isMaxSelected,
      disabledSend,
      insufficientFunds,
      incorrectAddress,
      txError,
      txHash,
      showModal,
      showConfirmModal,
      confirmModalDisabled,
      confirmModalCloseHandler,
      confirmClickHandler,
      errorClickHandler,
      successClickHandler,
      errorCloseHandler,
      successCloseHandler,
      isLoading,
      showErrorText,
      totalAmount,
      password,
      passwordError,
      fee,
      customFee,
      lastCorrectFee,
      showFeeSelectModal,
      openFeeSelectModal,
      closeFeeSelectModal,
      dataLoaded,
      /* onCustomFocus,*/
      feeType,
      showChangingAmountModal,
      updateFee,
      closeFeeErrorModal,
      showIncreaseAmountModal,
      allowIncreaseAmount,
      cancelIncreaseAmount,
      showDecreaseAmountModal,
      allowDecreaseAmount,
      cancelDecreaseAmount,
      txComment,
      showConnectLedgerModal,
      showConfirmLedgerModal,
      ledgerError,
      connectLedgerClickHandler,
      connectLedgerCloseHandler,
      confirmLedgerCloseHandler,
      showAppLedgerModal,
      appLedgerClickHandler,
      appLedgerCloseHandler,
      showRejectedLedgerModal,
      rejectedLedgerCloseHandler,
      rejectedLedgerClickHandler,
      iostFee,
      adding,
      currentWalletType,
      prepareLoading,
      // bridge
      selectBridgeNetwork,
      bridgeTargetNet,
      networkTargetWallets,
      showNetworkTargetWallets,
      setAddress,
      showSuccessModal,
      confirmClicked,
      onChangePassword,
    };
  },
};
</script>

<style lang="scss" scoped>
.loader {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background: white;
  z-index: 10;
}

.send {
  width: 100%;
  flex-grow: 1;
  padding: 34px 0 120px 0;

  & form {
    display: flex;
    flex-direction: column;
  }

  @include lg {
    padding: 21px 0 17px 0;
  }
  @include md {
    padding: 19px 0 63px;
  }

  &__switch {
    width: 49.5%;
    display: flex;
    align-items: center;
    margin-right: 20px;

    @include lg {
      width: 100%;
      margin-bottom: 22px;
    }
    @include md {
      width: 100%;
      margin-bottom: 18px;
    }

    & span {
      font-size: 18px;
      line-height: 30px;
      font-family: 'Panton_Bold';
      margin-right: 1.5rem;
      @include md {
        font-size: 16px;
      }
    }
  }

  &__section {
    width: 100%;
    display: flex;
    height: 68px;
    justify-content: space-between;
    margin-bottom: 24px;

    &:first-child {
      @include lg {
        margin-bottom: 0;
      }
      @include md {
        margin-bottom: 0;
      }
    }

    @include lg {
      height: initial;
      flex-direction: column;
      margin-bottom: 0;
    }
    @include md {
      height: initial;
      flex-direction: column;
      margin-bottom: 0;
    }
    @include laptop {
      flex-direction: row;
    }
  }

  &__autocomplete {
    width: 100%;
    height: 68px;
    margin-bottom: 16px;
    z-index: 10;
    position: relative;
  }

  &__section-input {
    height: 68px;
    width: 49.5%;
    position: relative;
    @include lg {
      width: 100%;
      margin-bottom: 23px;
    }
    @include md {
      width: 100%;
      margin-bottom: 23px;
    }
    @include laptop {
      width: 48%;
    }
  }

  &__section-error {
    display: flex;
    position: absolute;
    align-items: center;
    bottom: -25px;

    @include xl {
      display: none;
    }

    @include md {
      &.doNotHaveEnoughFunds {
        bottom: -30px;
      }

      bottom: -22px;
    }
  }

  &__section-error-icon {
    margin-right: 8px;
    width: 19px;
  }

  &__section-error-text {
    font-size: 14px;
    color: $red;
    font-family: 'Panton_Regular';
    width: fit-content;
    word-break: break-word;

    @include md {
      font-size: 12px;
    }
  }

  &__input-note-xl {
    display: none;
    font-size: 14px;
    line-height: 17px;
    position: absolute;
    right: 0px;
    bottom: -25px;
    color: $blue;
    @include xl {
      display: initial;
    }
  }

  &__input-note {
    display: none;
    font-size: 14px;
    line-height: 17px;
    color: $mid-gray;
    position: absolute;
    right: 0px;
    bottom: -25px;
    @include lg {
      display: initial;
    }
    @include md {
      display: initial;
      font-size: 12px;
      line-height: 14px;
      bottom: -22px;
    }
    &-laptop {
      @include laptop {
        left: 25px;
        bottom: -38px;
      }
    }
  }

  &__advanced {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 8px;
    @include lg {
      margin-top: 21px;
    }
    @include md {
      margin-top: 19px;
    }
  }

  &__memo {
    display: flex;
    flex-direction: column;
    margin-top: 12px;
  }

  &__memo-title {
    font-weight: bold;
    margin-right: 8px;
    font-size: 18px;
  }

  &__memo-toggle {
    display: flex;
    margin-bottom: 15px;
    align-items: center;
  }

  &__memo-tooltip {
    margin-right: 26px;
  }

  &__memo-tooltip-text {
    font-size: 12px;
    color: $mid-blue;
  }

  &__advanced-settings {
    background: transparent;
    display: flex;
    align-items: center;
    margin-bottom: 31px;
    cursor: pointer;
    @include lg {
      margin-bottom: 20px;
    }
    @include md {
      margin-bottom: 12px;
    }

    & span {
      font-size: 20px;
      line-height: 24px;
      color: $darkgray;
      margin-right: 12px;
      @include lg {
        font-size: 18px;
        line-height: 22px;
      }
      @include md {
        font-size: 16px;
        line-height: 19px;
      }
    }

    &:hover {
      & span {
        color: $blue;
      }

      & svg {
        fill: $blue;
      }
    }

    & svg {
      height: 14px;
      width: 9px;
      fill: $darkgray;
      transform: rotate(90deg);
    }

    &--active {
      & span {
        color: $blue;
      }

      & svg {
        transform: rotate(270deg);
        fill: $blue;
      }
    }
  }

  &__memo-input {
    width: 100%;
    height: 68px;
    margin-bottom: 32px;
    @include lg {
      margin-bottom: 24px;
    }
  }

  &__info {
    display: flex;
    justify-content: space-between;
    @include lg {
      flex-direction: column;
    }
    @include md {
      flex-direction: column;
    }
  }

  &__info-banner {
    order: 1;
    width: 49.5%;
    max-width: 545px;
    margin-bottom: 40px;
    background: $banner-blue;
    border-radius: 16px;
    padding: 18px 12px 13px 19px;
    height: 100px;
    display: flex;

    & p {
      width: 457px;
      margin: 0px;
      font-size: 14px;
      line-height: 23px;
      color: $ligth-blue;
      @include lg {
        width: 473px;
      }
      @include md {
        line-height: 20px;
        width: 360px;
      }

      & a {
        color: $royalblue1;
        font-family: 'Panton_Bold';
      }
    }

    & svg {
      margin-right: 15px;
      width: 42px;
      height: 42px;
    }

    @include lg {
      order: 2;
      width: 100%;
      max-width: 573px;
      margin-bottom: 30px;
      padding: 18px 24px 13px 19px;
    }
    @include md {
      order: 2;
      width: 100%;
      max-width: 469px;
      margin-bottom: 16px;
      padding: 20px 16px 19px 19px;
    }
  }

  &__info-info {
    order: 2;
    width: 49.5%;
    display: flex;
    flex-direction: column;
    @include lg {
      order: 1;
      width: 100%;
      max-width: 552px;
      margin-bottom: 11px;
    }
    @include md {
      order: 1;
      width: 100%;
      max-width: 478px;
      margin-bottom: 14px;
    }
  }

  &__info-line {
    display: flex;
    align-items: center;
    font-size: 14px;
    line-height: 30px;
    color: $gray;
  }

  &__info-price,
  &__info-fee {
    font-size: 14px;
    line-height: 17px;
    color: $blue;
    font-family: 'Panton_Bold';
    margin-left: 8px;
  }

  &__info-fee {
    color: $ligth-blue;
  }

  &__info-currency {
    margin-left: 5px;
    color: $mid-gray;
    font-family: 'Panton_Regular';
  }

  &__info-per {
    color: $blue;
  }

  &__button {
    align-self: center;
    @include md {
      display: none;
    }
  }

  &__loader {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 300px;
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
  top: 70px;
}
</style>
