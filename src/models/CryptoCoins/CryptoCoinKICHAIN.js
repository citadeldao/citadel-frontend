import CryptoCoin from '../CryptoCoin';
export default class CryptoCoinKICHAIN extends CryptoCoin {
  constructor(opts) {
    super(opts);
    this.privateKeyEncoded = opts?.privateKeyEncoded || null;
    this.publicKey = opts?.publicKey || null;
    this.showFrozenBalance = true;
    this.unstakeingPerioud = '28';
    this.hasRedelegation = true;
  }

  getPublicKeyDecoded() {
    return typeof this.publicKey === 'string'
      ? this.publicKey
      : Buffer.from(this.publicKey).toString('hex');
  }
}
