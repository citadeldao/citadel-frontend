import bs58 from 'bs58';
import CryptoCoin from '../CryptoCoin';
export default class CryptoCoinIOST extends CryptoCoin {
  constructor(opts) {
    super(opts);
    this.privateKeyEncoded = opts.privateKeyEncoded || null;
    this.publicKey = opts.publicKey || null;
    this.hasPledged = true;
    this.showFrozenBalance = true;
    this.hasFee = false;
    this.unstakeingPerioud = '3';
  }

  static hasAccount = true;

  getPublicKeyDecoded() {
    return typeof this.publicKey === 'string' ? this.publicKey : bs58.encode(this.publicKey.data);
  }
}
