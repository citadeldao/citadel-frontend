import notify from '@/plugins/notify';
import { keplrErrors } from '@/config/errors';

export default class keplrConnector {
  constructor() {
    this.chainId = 'cosmoshub-4';
    this.offlineSigner = null;
    this.accounts = [];
  }

  // eslint-disable-next-line consistent-return
  async connect(network) {
    if (window.keplr) {
      if (network) {
        this.chainId = network;
      }

      await window.keplr.enable(this.chainId);
      this.offlineSigner = window.keplr.getOfflineSigner(this.chainId);
      this.accounts = await this.offlineSigner.getAccounts();

      return this.accounts;
    } else {
      notify({
        type: 'warning',
        text: 'Keplr extension not found',
      });
    }
  }

  async sendKeplrTransaction(rawTx, signer, advancedParams = {}) {
    try {
      const data = rawTx.transaction || rawTx;

      if (data.direct && data.json.memo.toLowerCase().includes('permission')) {
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

      const res = await window.keplr.signAmino(
        data.chain_id || data.json.chain_id,
        signer,
        data.json || data,
        advancedParams
      );
      const signature = Buffer.from(res.signature.signature, 'base64').toString(
        'hex'
      );

      return { signature, signedTx: res.signed, fullResponse: res };
    } catch (err) {
      if (keplrErrors[err.message]) {
        notify({
          type: 'warning',
          text: keplrErrors[err.message],
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
