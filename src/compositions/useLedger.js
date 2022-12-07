import { ref, computed } from 'vue';
import store from '@/store';
import { i18n } from '@/plugins/i18n';
import { WALLET_TYPES } from '@/config/walletType';
import customErrors from '@/helpers/customErrors';

const { t } = i18n.global;

export default function useLedger() {
  const showConnectLedgerModal = ref(false);
  const showConfirmLedgerModal = ref(false);
  const showAppLedgerModal = ref(false);
  const showRejectedLedgerModal = ref(false);
  const ledgerError = ref('');

  const currentWallet = computed(() => store.getters['wallets/currentWallet']);
  const isLedgerWallet = computed(
    () => currentWallet.value.type === WALLET_TYPES.LEDGER
  );

  const clearLedgerModals = () => {
    ledgerError.value = false;
    showConnectLedgerModal.value = false;
    showAppLedgerModal.value = false;
    showConfirmLedgerModal.value = false;
    showRejectedLedgerModal.value = false;
  };

  const getCustomErrorMessage = (error) => {
    let message = error;

    for (const key in customErrors) {
      if (customErrors[key].find((check) => error.message.includes(check))) {
        const code = currentWallet.value.code;
        message = t(key, { code });
        return message;
      }
    }

    return message;
  };

  const ledgerErrorHandler = (error) => {
    // unknown errors handling
    const isUnknownStatus = RegExp(/Unknown Status Code:/gim).test(
      error.message
    );
    const errorCode = isUnknownStatus
      ? error.message.match(/\d+/)[0]
      : undefined;
    const errorMessage = errorCode ? t(`ledger.errors.${errorCode}`) : error;

    if (error.code === 11) {
      // appear after "not open App" error
      showConnectLedgerModal.value = false;
      showAppLedgerModal.value = true;
      // tx rejected
    } else if (
      error.code === 27014 ||
      error.code === 27013 ||
      error.statusCode === 27013
    ) {
      showConnectLedgerModal.value = false;
      showAppLedgerModal.value = false;
      showConfirmLedgerModal.value = false;
      showRejectedLedgerModal.value = true;
    } else {
      showConfirmLedgerModal.value = false;
      showConnectLedgerModal.value = true;
      showAppLedgerModal.value = false;
    }

    ledgerError.value = getCustomErrorMessage(
      errorMessage || error.message || error
    );
  };

  return {
    showConnectLedgerModal,
    showConfirmLedgerModal,
    showAppLedgerModal,
    showRejectedLedgerModal,
    ledgerError,
    isLedgerWallet,
    clearLedgerModals,
    ledgerErrorHandler,
  };
}
