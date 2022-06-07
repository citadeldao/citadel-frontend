import CryptoCoin from '../CryptoCoin';
export default class CryptoCoinPERSISTENCE extends CryptoCoin {
  constructor(opts) {
    super(opts);
    this.privateKeyEncoded = opts.privateKeyEncoded || null;
    this.publicKey = opts.publicKey || null;
    this.privateKeyHash = opts.privateKeyHash || null;
    this.showFrozenBalance = true;
    this.hasFee = true;
    this.unstakeingPerioud = '21';
    this.hasRedelegation = true;
  }

  getPublicKeyDecoded() {
    return typeof this.publicKey === 'string' ? this.publicKey : Buffer.from(this.publicKey).toString('hex');
  }
}
