import CryptoCoin from '../CryptoCoin';
// const secp256k1 = require('secp256k1');
export default class CryptoCoinICON extends CryptoCoin {
  constructor(opts) {
    super(opts);
  }

  // async getPublicKeyDecoded(password) {
  //   const prvKey = await this.getPrivateKeyDecoded(password);
  //   const pkBuffer = Buffer.from(prvKey, 'hex');
  //   const pubKey = secp256k1.publicKeyCreate(pkBuffer, false);

  //   return Buffer.from(pubKey).toString('hex');
  // }
}
