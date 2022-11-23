import CryptoCoin from '../CryptoCoin';

export default class CryptoCoinSECRET extends CryptoCoin {
  constructor(opts) {
    super(opts);
    this.privateKeyEncoded = opts.privateKeyEncoded || null;
    this.publicKey = opts.publicKey || null;
    this.privateKeyHash = opts.privateKeyHash || null;
    this.savedViewingKeys = opts.savedViewingKeys || null;
    this.hasRedelegation = true;
  }

  getPublicKeyDecoded() {
    return typeof this.publicKey === 'string'
      ? this.publicKey
      : Buffer.from(this.publicKey).toString('hex');
  }
}
