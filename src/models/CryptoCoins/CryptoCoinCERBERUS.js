import CryptoCoin from '../CryptoCoin';
export default class CryptoCoinCERBERUS extends CryptoCoin {
  constructor(opts, api) {
    super(opts, api);
    this.privateKeyEncoded = opts.privateKeyEncoded || null;
    this.publicKey = opts.publicKey || null;
    this.hasRedelegation = true;
  }

  getPublicKeyDecoded() {
    return typeof this.publicKey === 'string'
      ? this.publicKey
      : Buffer.from(this.publicKey).toString('hex');
  }
}
