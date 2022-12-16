import CryptoCoin from '@/models/CryptoCoin';

export default class CryptoCoinPOLKADOT extends CryptoCoin {
  constructor(opts) {
    super(opts);
    this.privateKeyEncoded = opts.privateKeyEncoded || null;
    this.mnemonicEncoded = opts.mnemonicEncoded;
    // this.mnemonicEncoded = opts.mnemonicEncoded
    //   ? opts.mnemonicEncoded
    //   : opts.mnemonic
    //   ? await CryptoCoin.encodePrivateKeyByPassword(opts.net, opts.mnemonic, password)
    //   : null;
    this.hasFee = false;
    this.hideCustomFee = true;
    this.publicKey = opts.publicKey || null;
    this.hasClaimUnstaked = true;
    this.maxNodes = 16;
    this.minSendAmount = 1;
    this.minStakingAmount = 10;
    this.hasRedelegation = true;
    this.claimRewardsMessage = 'polkadot.claimTooltip';
  }
  static hasNoAdvancedSettings = true;
}
