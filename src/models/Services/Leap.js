import notify from '@/plugins/notify';
import { leapErrors } from '@/config/errors';
import { keplrNetworksProtobufFormat } from '@/config/availableNets';

export default class leapConnector {
  constructor() {
    this.chainId = 'cosmoshub-4';
    this.offlineSigner = null;
    this.accounts = [];
  }

  // eslint-disable-next-line consistent-return
  async connect(network, stopNotify) {
    if (window.leap) {
      if (network) {
        this.chainId = network;
      }

      await window.leap.enable(this.chainId);
      this.offlineSigner = await window.leap.getOfflineSigner(this.chainId);
      this.accounts = await this.offlineSigner.getAccounts();

      return this.accounts;
    } else {
      if (!stopNotify) {
        notify({
          type: 'warning',
          text: 'Leap extension not found',
        });
      }
    }
  }

  async getSignType(rawTx) {
    return rawTx.directSignKeplrRequired // && !walletInfo.isNanoLedger
      ? 'direct'
      : 'json';
  }

  async getOutputHash(signer, rawTx, leapResult) {
    const granter = rawTx.transaction?.json?.fee?.granter;

    const defaultTx = {
      ...leapResult.signedTx,
      signType: await this.getSignType(
        rawTx
        // rawTx.transaction?.json?.chain_id
      ),
      publicKey: await signer.publicKey /* getPublicKeyDecoded() */,
      signature: leapResult.signature,
    };

    if (granter) {
      defaultTx.fee.granter = granter;
    }

    const defaultSendTx = rawTx.transaction;

    const protobufTx = {
      signType: await this.getSignType(
        rawTx
        // rawTx.transaction?.json?.chain_id
      ),
      mode: 'sync',
      tx: {
        memo: defaultSendTx.json.memo || '',
        fee: leapResult.signedTx.fee,
        msg: defaultSendTx.json.msgs,
        signatures: [
          {
            account_number: leapResult.fullResponse.signed.account_number,
            pub_key: leapResult.fullResponse.signature.pub_key,
            sequence: leapResult.fullResponse.signed.sequence,
            signature: leapResult.fullResponse.signature.signature,
          },
        ],
      },
    };

    return keplrNetworksProtobufFormat.includes(signer.net)
      ? protobufTx
      : defaultTx;
  }

  async sendLeapTransaction(rawTx, signer, advancedParams = {}) {
    const data = rawTx.transaction || rawTx;
    try {
      if (data?.json?.fee?.granter || data?.fee?.granter) {
        window.leap.defaultOptions = {
          sign: {
            disableBalanceCheck: true,
          },
        };
      } else {
        window.leap.defaultOptions = {};
      }

      const walletInfo = await window.leap?.getKey(
        data.chain_id || data.json.chain_id
      );

      if (
        (await this.getSignType(rawTx)) === 'direct' &&
        !walletInfo.isNanoLedger
      ) {
        const res = await window.leap.signDirect(
          data.chain_id || data.json.chain_id,
          signer,
          data.direct,
          advancedParams
        );
        const signature = Buffer.from(
          res.signature.signature,
          'base64'
        ).toString('hex');

        return {
          signature,
          signedTx: data.json,
          fullResponse: res,
          isNanoLedger: walletInfo.isNanoLedger,
        };
      }

      const copiedData = JSON.parse(JSON.stringify(data));

      if (copiedData?.json?.fee?.granter) {
        delete copiedData.json.fee.granter;
      }

      if (copiedData?.fee?.granter) {
        delete copiedData.fee.granter;
      }

      const res = await window.leap.signAmino(
        copiedData.chain_id || copiedData.json.chain_id,
        signer,
        copiedData.json || copiedData,
        advancedParams
      );

      const signature = Buffer.from(res.signature.signature, 'base64').toString(
        'hex'
      );

      return {
        signature,
        signedTx: res.signed,
        fullResponse: res,
        isNanoLedger: walletInfo.isNanoLedger,
      };
    } catch (err) {
      // const accs = await this.connect(data.json.chain_id);
      // ${accs && accs[0] && accs[0].address}

      if (leapErrors[err.message]) {
        notify({
          type: 'warning',
          text: `${leapErrors[err.message]}`,
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
