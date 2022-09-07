import CryptoCoin from '../CryptoCoin';
import citadel from '@citadeldao/lib-citadel';
import notify from '@/plugins/notify';
import { i18n } from '@/plugins/i18n';

const { t } = i18n.global;

export default class CryptoToken extends CryptoCoin {
  constructor(opts, tokenBalance) {
    super(opts);
    this.tokenBalance = tokenBalance;
    this.parentCoin = opts.parentCoin;
    this.linked = opts.linked || false;
    this.hasStake = opts?.actions?.stake || false;
    this.hasClaim = opts?.actions?.claim || false;
    this.hasTransfer = opts?.actions?.transfer || false;
    this.fee_key = opts.fee_key;
    this.hasXCT = opts.hasXCT || false;
    this.savedViewingKey = opts.savedViewingKey || null;
    this.hasTransactionComment = opts?.config?.hasTransactionComment;
    this.messages = {
      frozenBalance: opts?.actions?.stake
        ? 'balanceTooltipInfo.frozenBalanceBalanceInfo2'
        : '',
    };
  }

  async prepareTransfer({ walletId, options }) {
    const { error, data } = await citadel.prepareTokenAction(
      walletId,
      this.net,
      'transfer',
      options
    );

    if (!error) {
      return { data: data, error };
    }

    notify({
      type: 'warning',
      text: error,
    });
    console.error(error);

    return { data, error };
  }

  async signAndSendTransfer({
    walletId,
    rawTransaction,
    privateKey,
    derivationPath,
  }) {
    const res = await citadel.signAndSend(walletId, rawTransaction, {
      privateKey,
      derivationPath,
    });

    if (!res.error) {
      return res;
    }

    notify({
      type: 'warning',
      text: res.error,
    });
    console.error(res.error);

    return res;
  }

  async prepareDelegation({ walletId, amount, type, parentWalletBalance }) {
    const res = await citadel.prepareTokenAction(walletId, this.net, type, {
      amount,
    });

    if (!res.error) {
      if (parentWalletBalance < res.data.fee) {
        notify({
          type: 'warning',
          text: t('insufficientFunds'),
        });

        return { ok: false };
      }

      return { ok: true, rawTxs: res.data, resFee: res.data.fee };
    }

    notify({
      type: 'warning',
      text: res.error,
    });

    return { ok: false };
  }

  async prepareXctClaimOrRestake({ walletId, action, type }) {
    const { error, data } = await citadel.prepareTokenAction(
      walletId,
      'bsc_xct',
      action,
      { type }
    );

    if (!error) {
      return { rawTxs: data, fee: data.fee };
    }

    return { rawTxs: [], fee: 0 };
  }
}
