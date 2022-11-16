import { ref, computed } from 'vue';
import store from '@/store';
import { pickKeys } from '@/utils/object';
import CryptoCoin from '@/models/CryptoCoin';
import BigNumber from 'bignumber.js';

export default function useCurrentWalletRequests() {
  const currentWallet = computed(() => store.getters['wallets/currentWallet']);
  const currentToken = computed(() => store.getters['subtokens/currentToken']);
  const wallet = computed(() => currentToken.value || currentWallet.value);
  const fees = ref(null);
  const feesError = ref(null);
  const iostFee = ref();
  const adding = ref();
  const resMaxAmount = ref();
  const l1Fee = ref(0);

  const getFees = async () => {
    if (wallet.value.hasFee) {
      const { data, error } = await wallet.value.getFees(
        wallet.value.id,
        currentToken?.value?.net
      );
      fees.value = pickKeys(data, ['low', 'medium', 'high']);
      feesError.value = error;
    } else if (wallet.value.hasPledged) {
      const { resFee, maxAmount, error, resAdding } =
        await wallet.value.getDelegationFee({
          walletId: wallet.value.id,
          transactionType: 'transfer',
        });
      iostFee.value = resFee;
      adding.value = resAdding;
      resMaxAmount.value = maxAmount;
      feesError.value = error;
    }
  };

  const formatedFee = computed(() => {
    const data = { ...fees.value };
    for (const item in data) {
      fees.value[item].fee = BigNumber(fees.value[item].fee)
        .plus(l1Fee.value || 0)
        .toNumber();
    }
    return data;
  });

  const balance = ref(null);
  const balanceError = ref(null);
  const getDelegationBalance = async () => {
    const { data, error } = await CryptoCoin.getBalance({
      walletId: wallet.value.id,
      token: currentToken?.value?.net,
    });
    balance.value = data;
    balanceError.value = error;
  };

  const currency = ref(null);
  const currencyError = ref(null);
  const rawTx = ref(null);
  const rawTxError = ref(null);
  const prepareTransfer = async (options) => {
    const { data, error } = await wallet.value.prepareTransfer({
      walletId: wallet.value.id,
      options,
    });
    l1Fee.value = data.l1Fee || 0;
    rawTx.value = data;
    rawTxError.value = error;
    if (data.resourcesForTx) {
      iostFee.value = data.resourcesForTx.fee;
      adding.value = data.resourcesForTx.adding;
    }
  };

  const txHash = ref(null);
  const txError = ref(null);

  const signAndSendTransfer = async (rawTx, password) => {
    const res = await wallet.value.signAndSendTransfer({
      walletId: wallet.value.id,
      rawTransaction: rawTx,
      privateKey: password && wallet.value.getPrivateKeyDecoded(password),
      derivationPath: wallet.value.derivationPath,
    });
    const { data } = res;
    const { error } = res;

    if (error) {
      txError.value = error;
    } else {
      txHash.value = data;
    }
  };

  const clearTxData = () => {
    rawTx.value = null;
    rawTxError.value = null;
    txHash.value = null;
    txError.value = null;
  };

  return {
    formatedFee,
    feesError,
    getFees,
    balance,
    balanceError,
    getDelegationBalance,
    currency,
    currencyError,
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
  };
}
