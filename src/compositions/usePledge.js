
import { computed, provide, ref } from 'vue';
import useCheckPassword from '@/compositions/useCheckPassword';
import { useI18n } from 'vue-i18n';
import useWallets from '@/compositions/useWallets';
import { useStore } from 'vuex';
import BigNumber from 'bignumber.js';

export default function usePledge() {
  const store = useStore();
  const { currentWallet } = useWallets();
  const { t } = useI18n();

  const isLoading = ref(false);
  provide('isLoading', isLoading);

  const showModal = ref(false);
  provide('showModal', showModal);

  const showCooseModeModal = ref(false);
  provide('showCooseModeModal', showCooseModeModal);

  const showConfirmModal = ref(false);
  provide('showConfirmModal', showConfirmModal);

  const showSuccessModal = ref(false);
  provide('showSuccessModal', showSuccessModal);


  const openPledgeModal = async () => {
    await getDelegationFee(activeTab.value);
    showModal.value = true,
    showCooseModeModal.value = true;
  };
  provide('openPledgeModal', openPledgeModal);

  const activeTab = ref('pledge');
  provide('activeTab', activeTab);

  const amount = ref('');
  provide('amount', amount);

  const updateAmount = (value) => {
    amount.value = value;
  };
  provide('updateAmount', updateAmount);

  const maxAmount = computed(() => +BigNumber(resMaxAmount.value).toFixed(2, 1) || 0);
  provide('maxAmount', maxAmount);

  const insufficientFunds = computed(() => {
    const symbolCount = amount.value.toString().split('.')[1]?.length || 0;
    if (amount.value && amount.value > maxAmount.value) {
      return t('insufficientFunds');
    } else if (amount.value && amount.value < 1) {
      return t('minAmmount');
    } else if (amount.value && symbolCount > 2) {
      return t('maxFloatDigits');
    }

    return'';

  });
  provide('insufficientFunds', insufficientFunds);

  const fee = ref();
  provide('fee', fee);
  const adding = ref();
  provide('adding', adding);
  const resEnough = ref();
  provide('enough', resEnough);
  const resMaxAmount = ref();
  const getDelegationFee = async () => {
    isLoading.value = true;
    const { ok, resFee, maxAmount, resAdding, enough } = await currentWallet.value.getDelegationFee({
      walletId: currentWallet.value.id,
      transactionType: activeTab.value,
      nodeAddress: currentWallet.value.address,
    });
    if (ok) {
      fee.value = resFee;
      adding.value = resAdding;
      resMaxAmount.value = maxAmount;
      resEnough.value = enough;
    } else {
      modalCloseHandler();
    }
    isLoading.value = false;
  };
  provide('getDelegationFee', getDelegationFee);

  const disabled = computed(() => !resEnough.value || !amount.value || !!insufficientFunds.value);
  provide('disabled', disabled);

  const resRawTxs = ref();
  const preparePledgeUnpledge = async () => {
    if (isLoading.value) {return;}
    isLoading.value = true;
    const { rawTxs, ok } = await currentWallet.value.preparePledgeUnpledge({
      walletId: currentWallet.value.id,
      type: activeTab.value,
      amount: amount.value,
    });
    if (ok) {
      resRawTxs.value = rawTxs;
      showCooseModeModal.value = false;
      showConfirmModal.value = true;
      isLoading.value = false;
    } else {
      modalCloseHandler();
    }
    isLoading.value = false;
  };
  provide('preparePledgeUnpledge', preparePledgeUnpledge);

  const txHash = ref();
  provide('txHash', txHash);

  const send = async () => {
    if (passwordError.value) {
      inputError.value = passwordError.value;

      return;
    }
    isLoading.value = true;
    const res = await currentWallet.value.signAndSendMulti({
      walletId: currentWallet.value.id,
      rawTransactions: resRawTxs.value,
      privateKey: currentWallet.value.getPrivateKeyDecoded(password.value),
    });
    if (res.ok) {
      txHash.value = res.data;
      showConfirmModal.value = false;
      showSuccessModal.value = true;
      isLoading.value = false;
    } else {
      modalCloseHandler();
      isLoading.value = false;
    }

  };
  provide('send', send);

  const { password, passwordError, inputError } = useCheckPassword();
  const updatePassword = (value) => {
    password.value = value;
  };
  provide('password', password);
  provide('updatePassword', updatePassword);
  provide('passwordError', passwordError);
  provide('inputError', inputError);

  const txComment = ref('');
  provide('txComment', txComment);

  const successClickHandler = async () => {
    txComment.value &&
            (await store.dispatch('transactions/postTransactionNote', {
              network: currentWallet.value.net,
              hash: txHash.value[0],
              text: txComment.value,
            }));
    txComment.value = '';
    modalCloseHandler();
  };
  provide('successClickHandler', successClickHandler);

  const chooseNodeModalData = computed(() => {
    if (activeTab.value === 'pledge') {
      return {
        title: t('pledge.chooseModeModalTitle1'),
        subtitle: t('pledge.chooseModeModalSubtitle'),
      };
    }
    if (activeTab.value === 'unpledge') {
      return {
        title: t('pledge.chooseModeModalTitle2'),
        subtitle: t('pledge.chooseModeModalSubtitle'),
      };
    }

    return{};

  });
  provide('chooseNodeModalData', chooseNodeModalData);

  const actionModalData = computed(() => {
    if (activeTab.value === 'pledge') {
      return {
        title: t('pledge.confirmModalTitle1'),
        desc: t('pledge.confirmModalDesc1'),
      };
    }
    if (activeTab.value === 'unpledge') {
      return {
        title: t('pledge.confirmModalTitle2'),
        desc: t('pledge.confirmModalDesc2'),
      };
    }

    return {};

  });
  provide('actionModalData', actionModalData);

  const modalCloseHandler = () => {
    showModal.value = false;
    showCooseModeModal.value = false;
    activeTab.value = 'pledge';
    updateAmount('');
    showConfirmModal.value = false;
    showSuccessModal.value = false;
    password.value = '';
    txComment.value = '';
  };
  provide('modalCloseHandler', modalCloseHandler);

  return {
    showModal,
    isLoading,
    modalCloseHandler,
    showCooseModeModal,
    openPledgeModal,
    activeTab,
    amount,
    maxAmount,
    disabled,
    preparePledgeUnpledge,
    showConfirmModal,
    fee,
    adding,
    send,
    showSuccessModal,
    inputError,
    txHash,
    successClickHandler,
    txComment,
    password,
    actionModalData,
  };
}
