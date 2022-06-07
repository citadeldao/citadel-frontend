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
    }
  }

  async sendKeplrTransaction(rawTx, signer, advancedParams={}) {
    try {
      const data = rawTx.transaction || rawTx;
      const res = await window.keplr.signAmino(data.chain_id || data.json.chain_id, signer, data.json || data, advancedParams);
      const signature = Buffer.from(res.signature.signature, 'base64').toString('hex');

      return { signature, signedTx: res.signed, fullResponse: res };
    } catch(err) {
      if (keplrErrors[err.message]) {
        notify({
          type: 'warning',
          text: keplrErrors[err.message],
        });

        //return false;
      }

      return { error: err };
    }
  }

  async changeNetwork() {
  }
}
