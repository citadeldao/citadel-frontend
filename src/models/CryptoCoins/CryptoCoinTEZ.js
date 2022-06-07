import CryptoCoin from '../CryptoCoin';
const base58check = require('bs58check');
export default class CryptoCoinTEZ extends CryptoCoin {
  constructor(opts) {
    super(opts);
    this.privateKeyEncoded = opts.privateKeyEncoded || null;
    this.publicKey = opts.publicKey || null;
    this.hasUnstakeingPerioud = false;
    this.hideMemo = true;
    this.messages = {
      frozenBalance: 'balanceTooltipInfo.frozenBalanceBalanceInfo1',
    };
    this.isSingleStake = true;
    this.hasKtAddresses = true;
  }

  getFormattedPublicKey() {
    return typeof this.publicKey === 'string' ? this.publicKey : base58check.encode(Buffer.from(this.publicKey)); // base58check.encode(Buffer.from(this.publicKey))
  }

  getPublicKeyDecoded(){
    return typeof this.publicKey === 'string' ? this.publicKey : base58check.encode(Buffer.from(this.publicKey));
  }
}
