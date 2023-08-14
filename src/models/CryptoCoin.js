import * as bip39 from 'bip39';
import notify from '@/plugins/notify';
import { cosmosNetworks } from '@/config/walletTemplatesDerivation';
import citadel from '@citadeldao/lib-citadel';
import { i18n } from '@/plugins/i18n';
import store from '@/store';
import router from '@/router';
import { getErrorText, getErrorTextByCode } from '@/config/errors';
import BigNumber from 'bignumber.js';
import customErrors from '@/helpers/customErrors';

const { t } = i18n.global;
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
    (this.segwitAddress = opts?.segwitAddress || null),
      (this.nativeAddress = opts?.nativeAddress || null),
      (this.mnemonicEncoded = opts?.mnemonicEncoded || null);
    this.privateKeyEncoded = opts?.privateKeyEncoded || null;
    this.privateKeyHash = opts?.privateKeyHash || null;
    this.savedViewingKeys = opts?.savedViewingKeys || null;
    this.publicKey = opts?.publicKey || null;
    this.derivationPath = opts?.derivationPath;
    this.fee_key = opts?.config?.feeKey;
    this.config = { ...opts?.config, tokens: {} };
    this.subtokensList = opts?.subtokensList || [];
    this.subtokenBalanceUSD = opts?.subtokenBalanceUSD || 0;
    this.balanceUSD = opts?.balanceUSD;
    this.hasTransactionComment = true;
    this.hasSubtoken = !!opts?.config?.totalTokens;
    this.hasBuy = opts?.config?.methods?.buy || false;
    this.hasExchange = opts?.config?.methods?.exchange || false;
    this.hasStake = opts?.config?.methods?.stake || false;
    this.hasClaim = opts?.config?.methods?.claim || false;
    this.importedFromSeed = opts?.importedFromSeed || false;
    this.decimals = opts?.config?.decimals;
    this.hasCustomFee = this.fee_key === 'fee';
    this.minAmount = BigNumber(0.1)
      .exponentiatedBy(opts?.config?.decimals)
      .toNumber()
      .toFixed(opts?.config?.decimals);
    this.unstakeingPerioud = opts?.config?.unstakeingPerioud;
    this.hasRedelegation = opts?.config?.methods?.redelegate;
    this.hideMemo = !opts?.config?.methods?.memo;
    this.hasXCT = opts?.config?.methods?.hasXCT;
    this.shortName = opts?.config?.methods?.shortName;
    this.unstakePerioudLink = opts?.config?.methods?.unstakePerioudLink;
    this.hideCustomFee = opts?.config?.methods?.hideCustomFee;
    this.hasNoFee = opts?.config?.methods?.hasNoFee;
    this.hasPledged = opts?.config?.methods?.hasPledged;
    this.hasResource = opts?.config?.methods?.hasResource;
    this.hasMultiCoinRewards = opts?.config?.methods?.hasMultiCoinRewards;
    this.minSendAmount = opts?.config?.methods?.minSendAmount;
    this.minStakingAmount = opts?.config?.methods?.minStakingAmount;
    this.hasClaimUnstaked = opts?.config?.methods?.hasClaimUnstaked;
    this.maxNodes = opts?.config?.methods?.maxNodes;
    this.minBalance = opts?.config?.methods?.minBalance;
    this.hasMultiUnstake = opts?.config?.methods?.hasMultiUnstake;
    this.isSingleStake = opts?.config?.methods?.isSingleStake;
    this.hasKtAddresses = opts?.config?.methods?.hasKtAddresses;
    this.noSelfSend = opts?.config?.methods?.noSelfSend;
    this.isCosmosNetwork = cosmosNetworks.includes(this.net);
    opts.config?.nativeTokenName
      ? (this.nativeTokenName = opts.config.nativeTokenName)
      : '';
  }

  getCustomErrorMessage(error) {
    const textError = typeof error === 'object' ? JSON.stringify(error) : error;

    const message = {
      type: 'warning',
      text: textError,
    };

    for (const key in customErrors) {
      if (
        customErrors[key].find(
          (check) =>
            textError.includes(check) || textError?.message?.includes(check)
        )
      ) {
        const code = this.code;
        message.text = t(key, { code });
        return message;
      }
    }

    return message;
  }

  getScannerLink() {
    const { data: scannerLink } = citadel.getScannerLinkById(this.id);

    return scannerLink;
  }

  getTxUrl(walletid, hash) {
    const { data: txLink } = citadel.getTransactionURLByHash(walletid, hash);

    return txLink;
  }

  async getPrivateKeyDecoded(password) {
    const { error, data } = await citadel.decodePrivateKeyByPassword(
      this.net,
      this.mnemonicEncoded ||
        this.privateKeyEncoded ||
        (await store.dispatch('crypto/encodeUserMnemonic')),
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
    const connectionType = store.getters['ledger/connectionType'];
    const { data, error } = await citadel.signAndSend(
      walletId,
      rawTransactions,
      {
        ...options,
        transportType: connectionType,
      }
    );

    if (!error) {
      return { ok: true, data: Array.isArray(data) ? data : [data] };
    }

    const errorMessage = getErrorTextByCode(error);

    if (errorMessage) {
      notify({
        type: 'warning',
        text: errorMessage,
      });

      return { ok: false, error: errorMessage };
    } else {
      const message = this.getCustomErrorMessage(error);

      notify(message);

      console.error(error);

      return { ok: false, error };
    }
  }

  async signAndSendTransfer({ walletId, rawTransaction, ...options }) {
    const connectionType = store.getters['ledger/connectionType'];
    const res = await citadel.signAndSend(walletId, rawTransaction, {
      ...options,
      transportType: connectionType,
    });

    if (!res.error) {
      return res;
    }
    const errorMessage = getErrorTextByCode(res.error);

    if (errorMessage) {
      notify({
        type: 'warning',
        text: errorMessage,
      });
      return { error: errorMessage };
    } else {
      const errorText = getErrorText(res.error?.message?.toLowerCase());
      const message = this.getCustomErrorMessage(res.error || errorText);
      notify(message);
      console.error(res.error);
      return res;
    }
  }

  async prepareTransfer({ walletId, options }) {
    const { error, data } = await citadel.prepareTransfer(walletId, options);

    if (!error) {
      return { data, error };
    }

    notify({
      type: 'warning',
      text: error.toString(),
    });

    console.error(error);
    return { data, error: error.toString() };
    // const message = this.getCustomErrorMessage(error);
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
    /* redelegateNodeAddress */
    const formatedNodeAddresses = Array.isArray(options.nodeAddresses)
      ? options.nodeAddresses.map(
          (item) => item.address || item.stakedSuiObjectId
        )
      : [options.nodeAddresses];
    const formatedRedelegateNodeAddress = Array.isArray(
      options.redelegateNodeAddress
    )
      ? options.redelegateNodeAddress.map((item) => item.address)
      : [options.redelegateNodeAddress];
    const { data, error } = await citadel.prepareDelegation(walletId, {
      ...options,
      nodeAddresses: formatedNodeAddresses,
      redelegateNodeAddresses: formatedRedelegateNodeAddress,
    });

    if (!error) {
      return { ok: true, rawTxs: data };
    }

    const message = this.getCustomErrorMessage(error);

    notify(message);

    console.error(error);

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
      if (!net && !address) {
        return {};
      }
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
    const connectionType = store.getters['ledger/connectionType'];
    const res = await citadel.assignToDao(walletId, holderAddress, {
      ...options,
      transportType: connectionType,
    });

    if (res.error) {
      const errorMessage = getErrorTextByCode(res.error);
      notify({
        type: 'warning',
        text: errorMessage,
      });
      return { error: errorMessage };
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

  async getCrossNetFees(walletId, netTo) {
    const { error, data } = await citadel.getCrossNetFees(walletId, { netTo });

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
    const { data, error } = await citadel.getDelegationFee(walletId, {
      ...options,
      newAddingFormat: true,
    });

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

  // getFormattedPublicKey() {
  //   return typeof this.publicKey === 'string'
  //     ? this.publicKey
  //     : Buffer.from(this.publicKey).toString('hex');
  // }

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

  static async encodeMnemonic(mnemonic, password) {
    const { data } = await citadel.encodeMnemonicByPassword(mnemonic, password);
    return data;
  }

  static async decodeMnemonic(encodeMnemonic, password) {
    const { data } = await citadel.decodeMnemonicByPassword(
      encodeMnemonic,
      password
    );
    return data;
  }

  static validateMnemonic(mnemonic) {
    return bip39.validateMnemonic(mnemonic);
  }

  static async encodePrivateKeyByPassword(net, privateKey, password) {
    const { data, error } = await citadel.encodePrivateKeyByPassword(
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

  async getRewardsById() {
    const { error, data } = await citadel.getRewardsById(this.id);
    if (!error) {
      return data;
    }
    notify({
      type: 'warning',
      text: error,
    });
    return { total: [], list: [] };
  }
}
