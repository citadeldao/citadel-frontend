<template>
  <Modal>
    <!--Create VK Modal -->
    <Confirm
      v-if="showConfirmModal"
      v-bind="confirmProps"
      @close="closeHandler"
      @buttonClick="confirmClickHandler"
      @goToImportVk="goToImportVk"
    />
    <Import
      v-if="showImportVkModal"
      v-bind="importProps"
      @updateIvk="updateIvk"
      @close="closeHandler"
      @buttonClick="confirmImportHandler"
    />
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
      v-bind="errorProps"
      v-click-away="closeHandler"
      @close="closeHandler"
      @buttonClick="closeHandler"
    />
    <!--Success Modal -->
    <ModalContent
      v-if="showSuccessModal"
      v-bind="successModalProps"
      v-click-away="successCloseHandler"
      @close="successCloseHandler"
      @buttonClick="successCloseHandler"
    >
      <SuccessModalContent v-bind="successContentProps" />
    </ModalContent>
  </Modal>
</template>
<script>
import { ref, provide, inject, computed } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { isHardwareWallet } from '@/config/walletType';
import Modal from '@/components/Modal';
import ModalContent from '@/components/ModalContent';
import SuccessModalContent from '@/views/Wallet/views/Send/components/SuccessModalContent';
import ConfirmLedgerModal from '@/components/Modals/Ledger/ConfirmLedgerModal';
import ConnectLedgerModal from '@/components/Modals/Ledger/ConnectLedgerModal';
import OpenAppLedgerModal from '@/components/Modals/Ledger/OpenAppLedgerModal';
import RejectLedgerModal from '@/components/Modals/Ledger/RejectLedgerModal';
import useCheckPassword from '@/compositions/useCheckPassword';
import useLedger from '@/compositions/useLedger';
import redirectToWallet from '@/router/helpers/redirectToWallet';
import { WALLET_TYPES, PRIVATE_PASSWORD_TYPES } from '@/config/walletType';
import Confirm from '@/views/Wallet/components/CreateVkModal/Confirm';
import Import from '@/views/Wallet/components/CreateVkModal/Import';
export default {
  name: 'CreateVkModal',
  components: {
    Modal,
    ModalContent,
    SuccessModalContent,
    ConfirmLedgerModal,
    ConnectLedgerModal,
    OpenAppLedgerModal,
    RejectLedgerModal,
    Confirm,
    Import,
  },
  props: {
    address: {
      type: String,
      required: true,
    },
    token: {
      type: Object,
      default: () => ({}),
    },
    tokenFee: {
      type: Number,
      default: 0.002,
    },
    currentWallet: {
      type: Object,
      default: () => ({}),
    },
    vkType: {
      type: String,
      default: 'simple',
    },
    redirect: {
      type: Boolean,
      default: true,
    },
    appName: {
      type: String,
    },
    appIcon: {
      type: String,
    },
  },
  emits: ['close', 'success'],
  setup(props, { emit }) {
    // SNIP-20 logic
    const store = useStore();
    const { t } = useI18n();
    const citadel = inject('citadel');

    const showSuccessModal = ref(false);
    const showConfirmModal = ref(true); // should be true
    const showImportVkModal = ref(false);
    const isConfirmModalLoading = ref(false);
    const showFeeSelectModal = ref(false);
    const amount = ref('');
    const txError = ref('');
    const txHash = ref(''); // should be empty
    const viewingKey = ref(''); // should be empty
    const ivk = ref('');
    const ivkInputError = ref('');
    const isKeplrWallet = computed(
      () => props.currentWallet.type === WALLET_TYPES.KEPLR
    );

    const connectionType = computed(
      () => store.getters['ledger/connectionType']
    );

    const { inputError } = useCheckPassword();
    provide('inputError', inputError);

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

    const goToImportVk = () => {
      showConfirmModal.value = false;
      showImportVkModal.value = true;
    };
    const confirmImportHandler = async (ivk) => {
      isConfirmModalLoading.value = true;
      let isError = false;

      if (!ivk) {
        isConfirmModalLoading.value = false;
        isError = true;
      }

      if (isError) {
        return;
      }

      const { error } = await citadel.importViewingKey(
        props.currentWallet.id,
        props.token.net,
        ivk
      );

      if (error) {
        txError.value = error;
        showImportVkModal.value = false;

        return;
      }

      viewingKey.value = ivk;
      showImportVkModal.value = false;
      showSuccessModal.value = true;
      isConfirmModalLoading.value = false;
    };

    const closeHandler = async () => {
      inputError.value = false;
      txError.value = '';
      txHash.value = '';
      emit('close');
    };

    const successCloseHandler = async () => {
      emit('success');
      closeHandler();

      if (props.redirect) {
        await store.dispatch('subtokens/setCurrentToken', props.token);

        redirectToWallet({
          wallet: props.currentWallet,
          token: props.token,
          root: true,
        });
      }
    };

    const confirmClickHandler = async (password) => {
      let error;
      let transactionHash;
      let vk;
      isConfirmModalLoading.value = true;

      if (!isHardwareWallet(props.currentWallet.type) && !isKeplrWallet.value) {
        const res = await citadel.setViewingKey(
          props.currentWallet.id,
          props.token.net,
          props.currentWallet.type === WALLET_TYPES.KEPLR
            ? 'random'
            : props.vkType,
          {
            privateKey: await props.currentWallet.getPrivateKeyDecoded(
              password
            ),
            fee: props.tokenFee,
          }
        );

        // eslint-disable-next-line prefer-destructuring
        error = res.error;
        // eslint-disable-next-line
        transactionHash = res?.data?.transactionHash;
        vk = res?.data?.viewingKey;
      } else {
        if (isKeplrWallet.value) {
          isConfirmModalLoading.value = true;
        } else {
          isConfirmModalLoading.value = false;
          showConfirmModal.value = false;
          // clearLedgerModals();
          showConfirmLedgerModal.value = true;
          // for ledger catch sign finish and start event and then show loader until sign is completed
          citadel.addEventListener('ledgerSigningFinished', () => {
            showConfirmModal.value = true;
            showConfirmLedgerModal.value = false;
            isConfirmModalLoading.value = true;
          });

          citadel.addEventListener('ledgerSigningStarted', () => {
            showConfirmModal.value = false;
            showConfirmLedgerModal.value = true;
            isConfirmModalLoading.value = false;
          });
        }

        console.log('connectionType', connectionType.value);
        const { error: resError, data } = await citadel.setViewingKey(
          props.currentWallet.id,
          props.token.net,
          'random',
          {
            derivationPath: props.currentWallet.derivationPath,
            transportType: connectionType.value,
            fee: props.tokenFee,
          }
        );
        // remove listeners
        citadel.addEventListener('ledgerSigningFinished', () => {});
        citadel.addEventListener('ledgerSigningStarted', () => {});

        // showConfirmLedgerModal.value = false;
        error = resError;
        transactionHash = data?.transactionHash;
        vk = data?.viewingKey;
      }
      showConfirmModal.value = false;
      if (error) {
        if (isHardwareWallet(props.currentWallet.type)) {
          ledgerErrorHandler(error);
          clearLedgerModals();
        }
        txError.value = error;

        return;
      }
      viewingKey.value = vk;
      showSuccessModal.value = true;
      isConfirmModalLoading.value = false;

      await store.dispatch('wallets/getNewWallets', 'lazy');
      txHash.value = transactionHash;
    };

    const connectLedgerCloseHandler = () => {
      showConfirmModal.value = true;
      clearLedgerModals();
    };

    const confirmLedgerCloseHandler = () => {
      connectLedgerCloseHandler();
    };

    const appLedgerCloseHandler = () => {
      connectLedgerCloseHandler();
    };

    const rejectedLedgerCloseHandler = () => {
      clearLedgerModals();
      closeHandler();
    };
    const updateIvk = (value) => (ivk.value = value);
    const confirmProps = computed(() => ({
      appName: props.appName,
      appIcon: props.appIcon,
      address: props.address,
      currentWallet: props.currentWallet,
      tokenFee: props.tokenFee,
      PRIVATE_PASSWORD_TYPES: PRIVATE_PASSWORD_TYPES,
      title: t('viewingKey.confirmOperation'),
      desc: t('viewingKey.addVkFor') + ' ' + props.token.name,
      type: 'action',
      loading: isConfirmModalLoading.value,
      submitButton: false,
    }));
    const importProps = computed(() => ({
      title: t('viewingKey.importVk') + ' ' + props.token.name,
      desc: t('viewingKey.enterYourVk'),
      buttonText: 'confirm',
      type: 'action',
      loading: isConfirmModalLoading.value,
    }));
    const errorProps = computed(() => ({
      title: 'Warning',
      icon: 'warningIcon',
      desc: txError.value,
      buttonText: 'ok',
      type: 'warning',
    }));
    const successModalProps = computed(() => ({
      title: 'Success',
      desc: t('sendModal.desc2'),
      buttonText: 'ok',
      type: 'success',
      icon: 'success',
    }));
    const successContentProps = computed(() => ({
      showFrom: false,
      wallet: props.token,
      snip20Token: props.token,
      txHash: [txHash.value],
      viewingKey: viewingKey.value,
    }));
    return {
      updateIvk,
      confirmProps,
      importProps,
      errorProps,
      successModalProps,
      successContentProps,
      showConfirmModal,
      isConfirmModalLoading,
      showFeeSelectModal,
      closeHandler,
      successCloseHandler,
      amount,
      txError,
      txHash,
      confirmClickHandler,
      inputError,
      viewingKey,
      isHardwareWallet,
      isKeplrWallet,
      showConnectLedgerModal,
      showConfirmLedgerModal,
      showAppLedgerModal,
      showRejectedLedgerModal,
      ledgerError,
      clearLedgerModals,
      ledgerErrorHandler,
      isLedgerWallet,
      showImportVkModal,
      goToImportVk,
      confirmImportHandler,
      ivk,
      ivkInputError,
      showSuccessModal,
      connectLedgerCloseHandler,
      confirmLedgerCloseHandler,
      appLedgerCloseHandler,
      rejectedLedgerCloseHandler,
      PRIVATE_PASSWORD_TYPES,
    };
  },
};
</script>
