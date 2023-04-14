import CryptoCoin from '../CryptoCoin';

export default class CryptoCoinSUI extends CryptoCoin {
  constructor(opts) {
    super(opts);
    this.privateKeyEncoded = opts.privateKeyEncoded || null;
    this.publicKey = opts.publicKey || null;
    this.minStakingAmount = 1;
    this.hasFee = false;
    this.hasMultiUnstake = true;
    this.hasResource = true;
  }

  getPublicKeyDecoded() {
    return typeof this.publicKey === 'string'
      ? this.publicKey
      : Buffer.from(this.publicKey).toString('hex');
  }
}
