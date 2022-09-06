import * as bip39 from 'bip39';
import notify from '@/plugins/notify';
import { cosmosNetworks } from '@/config/walletTemplatesDerivation';
import citadel from '@citadeldao/lib-citadel';
import { i18n } from '@/plugins/i18n';
import store from '@/store';
import router from '@/router';

const { t } = i18n.global;
const CryptoJS = require('crypto-js');
export default class CryptoCoin {
  constructor(opts) {
    // common properties of wallets
    this.type = opts?.type;
    this.title = opts?.title || '';
    this.balance = opts?.balance || { calculatedBalance: 0 };
    this.id = opts?.id || null;
    this.net = opts?.config?.net;
    this.name = opts?.config?.name;
    this.code = opts?.config?.code;
    this.address = opts?.address;
    // this.mnemonicEncoded = opts?.mnemonicEncoded || null;
    this.privateKeyEncoded = opts?.privateKeyEncoded || null;
    this.publicKey = opts?.publicKey || null;
    this.derivationPath = opts?.derivationPath;
    this.fee_key = opts?.config?.fee_key;
    this.config = { ...opts?.config, tokens: {} };
    this.subtokensList = opts?.subtokensList || [];
    this.subtokenBalanceUSD = opts?.subtokenBalanceUSD || 0;
    this.balanceUSD = opts?.balanceUSD;
    this.hasTransactionComment = true;
    this.hasSubtoken = !!opts?.config?.tokens;
    this.hasBuy = opts?.config?.methods?.buy || false;
    this.hasExchange = opts?.config?.methods?.exchange || false;
    this.hasStake = opts?.config?.methods?.stake || false;
    this.hasClaim = opts?.config?.methods?.claim || false;
    this.hasPledged = false;
    this.hasFee = true;
    this.importedFromSeed = opts?.importedFromSeed || false;
    this.decimals = opts?.config?.decimals;
    this.hasCustomFee = opts?.config?.fee_key === 'fee';
    this.unstakeingPerioud = opts?.config?.unstakeingPerioud;

    this.messages = {
      frozenBalance: 'balanceTooltipInfo.frozenBalanceBalanceInfo2',
    };
    this.isCosmosNetwork = cosmosNetworks.includes(this.net);
    opts.config.nativeTokenName
      ? (this.nativeTokenName = opts.config.nativeTokenName)
      : '';
  }

  getScannerLink() {
    const { data: scannerLink } = citadel.getScannerLinkById(this.id);

    return scannerLink;
  }

  getTxUrl(walletid, hash) {
    const { data: txLink } = citadel.getTransactionURLByHash(walletid, hash);

    return txLink;
  }

  getPrivateKeyDecoded(password) {
    const { error, data } = citadel.decodePrivateKeyByPassword(
      this.net,
      this.mnemonicEncoded ||
        this.privateKeyEncoded ||
        store.getters['crypto/encodeUserMnemonic'],
      password
    );

    if (!error) {
      return data;
    }

    notify({
      type: 'warning',
      text: error,
    });

    return data;
  }

  getShortAddress(maxLength = 13, address = this.address) {
    const tailsLength = Math.floor((maxLength - 3) / 2);

    return address.length > maxLength
      ? `${address.slice(0, tailsLength)}...${address.slice(-tailsLength)}`
      : address;
  }

  validateAddress(address) {
    const regExp = new RegExp(this.config.validating);

    return regExp.test(address);
  }

  async signAndSendMulti({ walletId, rawTransactions, ...options }) {
    const { data, error } = await citadel.signAndSend(
      walletId,
      rawTransactions,
      options
    );

    if (!error) {
      return { ok: true, data: Array.isArray(data) ? data : [data] };
    }

    notify({
      type: 'warning',
      text: error,
    });

    return { ok: false, error };
  }

  async signAndSendTransfer({ walletId, rawTransaction, ...options }) {
    const res = await citadel.signAndSend(walletId, rawTransaction, options);

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

  async prepareTransfer({ walletId, options }) {
    const { error, data } = await citadel.prepareTransfer(walletId, options);

    if (!error) {
      return { data, error };
    }

    notify({
      type: 'warning',
      text: error,
    });
    console.error(error);

    return { data, error };
  }

  async getBuildBridgeTransaction({ walletId, token, ...options }) {
    const res = await citadel.prepareCrossNetworkTransfer(
      walletId,
      token,
      options
    );

    if (!res.error) {
      return { data: res.data, error: res.error, ok: true };
    }

    notify({
      type: 'warning',
      text: res.error,
    });
    console.error(res.error);

    return { data: null, error: res.error, ok: false };
  }

  async prepareDelegation({ walletId, ...options }) {
    const { data, error } = await citadel.prepareDelegation(walletId, options);

    if (!error) {
      return { ok: true, rawTxs: data };
    }

    notify({
      type: 'warning',
      text: error,
    });

    return { ok: false };
  }

  async prepareClaimUnstaked(walletId) {
    const { error, data } = await citadel.prepareClaimUnstaked(walletId);

    if (!error) {
      return { rawTx: data, ok: true };
    }

    return { ok: false };
  }

  async prepareClaim(walletId) {
    const { error, data } = await citadel.prepareClaim(walletId);

    if (!error) {
      return { rawTxs: data, ok: true };
    }

    notify({
      type: 'warning',
      text: error,
    });

    return { ok: false };
  }

  static async getBalance({ walletId, net, address, token }) {
    let res;

    if (walletId) {
      res = await citadel.getBalanceById(walletId, token);
      // if(token){
      //   await store.dispatch('wallets/getNewWallets','lazy');
      // }
    } else {
      res = await citadel.getBalanceByAddress(net, address);
    }

    if (!res.error) {
      return { data: res.data };
    }

    if (res.error.name === 'ViewingKeyError') {
      await store.dispatch('subtokens/setCurrentToken', null);
      router.push({
        name: router.currentRoute.value.name,
        params: {
          net: router.currentRoute.value.params.net,
          address: router.currentRoute.value.params.address,
        },
      });
    }

    notify({
      type: 'warning',
      text: res.error,
    });

    return {};
  }

  async getMarketcap() {
    const { error, data } = await citadel.getNetworkMarketcap(this.net);

    if (!error) {
      return { data };
    }

    notify({
      type: 'warning',
      text: error,
    });

    return { data: {} };
  }

  async assignToDao({ walletId, holderAddress, ...options }) {
    const res = await citadel.assignToDao(walletId, holderAddress, options);

    if (res.error) {
      notify({
        type: 'warning',
        text: res.error,
      });
    }

    return res;
  }

  async getFees(walletId, token) {
    const { error, data } = await citadel.getFees(walletId, token);

    if (!error) {
      return { error, data };
    }

    notify({
      type: 'warning',
      text: error,
    });
    console.error(error);

    return { error, data };
  }

  async getDelegationFee({ walletId, ...options }) {
    const { data, error } = await citadel.getDelegationFee(walletId, options);

    if (!error) {
      if (!data.enough && options.transactionType !== 'transfer') {
        const availableBalance =
          this?.tokenBalance?.mainBalance || this?.balance?.mainBalance;
        notify({
          type: 'warning',
          text:
            availableBalance < +data.fee
              ? t('dontHaveEnoughFoundsForFee')
              : t('dontHaveEnoughFounds', { type: options.transactionType }),
        });
      }

      return {
        ok: true,
        resFee: +data.fee,
        maxAmount: data.maxAmount,
        resAdding: data.adding,
        error: error,
        enough: data.enough,
      };
    }

    notify({
      type: 'warning',
      text: error,
    });

    return {
      ok: false,
      error: error,
      resFee: '',
      maxAmount: '',
      resAdding: '',
      enough: false,
    };
  }

  getCrossNetworkRoutes({ walletId, token }) {
    const res = citadel.getCrossNetworkRoutes(walletId, token);

    if (!res.error) {
      return res.data;
    }

    notify({
      type: 'warning',
      text: res.error,
    });

    return [];
  }

  async prepareAssignToDaoMessage(walletId) {
    const res = await citadel.prepareAssignToDaoMessage(walletId);

    if (!res.error) {
      return { data: res.data, error: res.error };
    }

    notify({
      type: 'warning',
      text: res.error,
    });

    return { data: res.data, error: res.error };
  }

  async sendAssignToDaoMessage(holderAddress, messageId, messageSignature) {
    const { error } = await citadel.sendAssignToDaoMessage(
      holderAddress,
      messageId,
      messageSignature
    );

    if (error) {
      notify({
        type: 'warning',
        text: error,
      });
    }

    return { error };
  }

  getFormattedPublicKey() {
    return typeof this.publicKey === 'string'
      ? this.publicKey
      : Buffer.from(this.publicKey).toString('hex');
  }

  async getTxDuration({ type, fee }) {
    const { data, error } = await citadel.getTransactionDuration(this.net, {
      type,
      fee,
    });

    if (error) {
      console.error(error);
    }

    return { data, error };
  }

  static getDerivationPath(net, index, type = 'seed') {
    const res = citadel.getDerivationPathByIndex(net, type, index);

    if (!res.error) {
      return res.data;
    }

    notify({
      type: 'warning',
      text: res.error,
    });

    return '';
  }

  static getDerivationPathTemplates(net, type) {
    const res = citadel.getDerivationPathTemplates(net, type);

    if (!res.error) {
      return res.data;
    }

    notify({
      type: 'warning',
      text: res.error,
    });

    return [];
  }

  async preparePledgeUnpledge({ walletId, type, amount }) {
    const res = await citadel.prepareGasPledgeUnpledge(walletId, type, amount);

    if (!res.error) {
      return { rawTxs: res.data, ok: true };
    }

    notify({
      type: 'warning',
      text: res.error,
    });

    return { ok: false };
  }

  static encodeMnemonic(mnemonic, password) {
    return CryptoJS.AES.encrypt(mnemonic, password).toString();
  }

  static decodeMnemonic(encodeMnemonic, password) {
    return CryptoJS.AES.decrypt(encodeMnemonic, password).toString(
      CryptoJS.enc.Utf8
    );
  }

  static validateMnemonic(mnemonic) {
    return bip39.validateMnemonic(mnemonic);
  }

  static encodePrivateKeyByPassword(net, privateKey, password) {
    const { data, error } = citadel.encodePrivateKeyByPassword(
      net,
      privateKey,
      password
    );

    if (!error) {
      return data;
    }

    notify({
      type: 'warning',
      text: error,
    });

    return data;
  }

  // Keplr wallet factory
  static async createWalletByKeplr(addOpts) {
    return new this(addOpts);
  }
}
