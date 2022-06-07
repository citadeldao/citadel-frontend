import CryptoCoin from '../CryptoCoin';
export default class CryptoCoinBTC extends CryptoCoin {
  constructor(opts) {
    super(opts);
    this.privateKeyEncoded = opts.privateKeyEncoded || null;
    this.publicKey = opts.publicKey || null;
    this.hideMemo = true;
  }
}
