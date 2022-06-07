import CryptoCoin from '../CryptoCoin';
export default class CryptoCoinBSC extends CryptoCoin {
  constructor(opts) {
    super(opts);
    this.hideMemo = true;
    this.privateKeyEncoded = opts.privateKeyEncoded || null;
    this.publicKey = opts.publicKey || null;
    this.showFrozenBalance = false;
    this.shortName = 'BNB';
    this.hasXCT = true;
  }
}
