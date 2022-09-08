import CryptoCoin from '../CryptoCoin';
const secp256k1 = require('secp256k1');
export default class CryptoCoinICON extends CryptoCoin {
  constructor(opts) {
    super(opts);
    this.privateKeyEncoded = opts.privateKeyEncoded || null;
    this.publicKey = opts.publicKey || null;
    this.messages = {
      frozenBalance: 'balanceTooltipInfo.frozenBalanceBalanceInfo1',
      unstakeingPrefix: 'unstaking.customPrefix',
    };
    this.hasRedelegation = true;
    this.unstakePerioudLink = 'https://icxstakr.io/';
    this.hideCustomFee = true;
  }

  getPublicKeyDecoded(password) {
    const prvKey = this.getPrivateKeyDecoded(password);
    const pkBuffer = Buffer.from(prvKey, 'hex');
    const pubKey = secp256k1.publicKeyCreate(pkBuffer, false);

    return Buffer.from(pubKey).toString('hex');
  }
}
