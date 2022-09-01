import CryptoCoin from '../CryptoCoin';
export default class CryptoCoinOSMOSIS extends CryptoCoin {
  constructor(opts) {
    super(opts);
    this.privateKeyEncoded = opts.privateKeyEncoded || null;
    this.publicKey = opts.publicKey || null;
    this.messages = {
      frozenBalance: 'balanceTooltipInfo.frozenBalanceBalanceInfo1',
    };
    this.hasRedelegation = true;
  }

  getPublicKeyDecoded() {
    return typeof this.publicKey === 'string'
      ? this.publicKey
      : Buffer.from(this.publicKey).toString('hex');
  }
}
