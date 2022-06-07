import CryptoCoin from '@/models/CryptoCoin';
export default class CryptoCoinPOLKADOT extends CryptoCoin {
  constructor(opts) {
    super(opts);
    this.privateKeyEncoded = opts.privateKeyEncoded || null;
    this.mnemonicEncoded = opts.mnemonicEncoded || null;
    this.publicKey = opts.publicKey || null;
    this.showFrozenBalance = true;
    this.hasFee = true;
    this.hasClaimUnstaked = true;
    this.unstakeingPerioud = '28';
    this.maxNodes = 16;
    this.minSendAmount = 1;
    this.minStakingAmount = 10;
    this.hasRedelegation = true;
  }
  static hasNoAdvancedSettings = true
}
