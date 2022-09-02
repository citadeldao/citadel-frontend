import CryptoCoin from '@/models/CryptoCoin';

export default class CryptoCoinPOLKADOT extends CryptoCoin {
  constructor(opts, password) {
    super(opts);
    this.privateKeyEncoded = opts.privateKeyEncoded || null;
    this.mnemonicEncoded = opts.mnemonicEncoded = opts.mnemonicEncoded
      ? opts.mnemonicEncoded
      : opts.mnemonic
      ? CryptoCoin.encodePrivateKeyByPassword(opts.net, opts.mnemonic, password)
      : null;
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
  static hasNoAdvancedSettings = true;
}
