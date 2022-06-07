import CryptoCoin from '../CryptoCoin';
const secp256k1 = require('secp256k1');
export default class CryptoCoinICON extends CryptoCoin {
  constructor(opts) {
    super(opts);
    this.privateKeyEncoded = opts.privateKeyEncoded || null;
    this.publicKey = opts.publicKey || null;
    this.showFrozenBalance = true;
    this.messages = {
      frozenBalance: 'balanceTooltipInfo.frozenBalanceBalanceInfo1',
      unstakeingPrefix: 'unstaking.customPrefix',
    };
    this.hasRedelegation = true;
    this.unstakePerioudFrom = '5';
    this.unstakePerioudTo = '20';
    this.unstakePerioudLink = 'https://icxstakr.io/';
  }

  getPublicKeyDecoded(password) {
    const prvKey = this.getPrivateKeyDecoded(password);
    const pkBuffer = Buffer.from(prvKey, 'hex');
    const pubKey = secp256k1.publicKeyCreate(pkBuffer, false);

    return Buffer.from(pubKey).toString('hex');
  }
}
