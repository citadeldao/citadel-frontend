import notify from '@/plugins/notify';
import { keplrErrors } from '@/config/errors';
import { keplrNetworksProtobufFormat } from '@/config/availableNets';

export default class keplrConnector {
  constructor() {
    this.chainId = 'cosmoshub-4';
    this.offlineSigner = null;
    this.accounts = [];
  }

  // eslint-disable-next-line consistent-return
  async connect(network, stopNotify) {
    if (window.keplr) {
      if (network) {
        this.chainId = network;
      }

      await window.keplr.enable(this.chainId);
      this.offlineSigner = await window.keplr.getOfflineSigner(this.chainId);
      this.accounts = await this.offlineSigner.getAccounts();

      return this.accounts;
    } else {
      if (!stopNotify) {
        notify({
          type: 'warning',
          text: 'Keplr extension not found',
        });
      }
    }
  }

  getSignType(rawTx) {
    return rawTx.directSignKeplrRequired ? 'direct' : 'json';
  }

  async getOutputHash(signer, rawTx, keplrResult) {
    const granter = rawTx.transaction?.json?.fee?.granter;

    const defaultTx = {
      ...keplrResult.signedTx,
      signType: this.getSignType(rawTx),
      publicKey: await signer.getPublicKeyDecoded(),
      signature: keplrResult.signature,
    };

    if (granter) {
      defaultTx.fee.granter = granter;
    }

    const defaultSendTx = rawTx.transaction;

    const protobufTx = {
      signType: this.getSignType(rawTx),
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

    return keplrNetworksProtobufFormat.includes(signer.net)
      ? protobufTx
      : defaultTx;
  }

  async sendKeplrTransaction(rawTx, signer, advancedParams = {}) {
    const data = rawTx.transaction || rawTx;
    try {
      if (data?.json?.fee?.granter || data?.fee?.granter) {
        window.keplr.defaultOptions = {
          sign: {
            disableBalanceCheck: true,
          },
        };
      } else {
        window.keplr.defaultOptions = {};
      }

      if (this.getSignType(rawTx) === 'direct') {
        const res = await window.keplr.signDirect(
          data.chain_id || data.json.chain_id,
          signer,
          data.direct,
          advancedParams
        );
        const signature = Buffer.from(
          res.signature.signature,
          'base64'
        ).toString('hex');

        return { signature, signedTx: data.json, fullResponse: res };
      }

      const copiedData = JSON.parse(JSON.stringify(data));

      if (copiedData?.json?.fee?.granter) {
        delete copiedData.json.fee.granter;
      }

      if (copiedData?.fee?.granter) {
        delete copiedData.fee.granter;
      }

      const res = await window.keplr.signAmino(
        copiedData.chain_id || copiedData.json.chain_id,
        signer,
        copiedData.json || copiedData,
        advancedParams
      );

      const signature = Buffer.from(res.signature.signature, 'base64').toString(
        'hex'
      );

      return { signature, signedTx: res.signed, fullResponse: res };
    } catch (err) {
      // const accs = await this.connect(data.json.chain_id);
      // ${accs && accs[0] && accs[0].address}

      if (keplrErrors[err.message]) {
        notify({
          type: 'warning',
          text: `${keplrErrors[err.message]}`,
        });
      }

      return { error: err };
    }
  }

  async changeNetwork() {}
  disconnect() {
    this.accounts = [];
  }
}
