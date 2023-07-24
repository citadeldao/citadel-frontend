// import bs58 from 'bs58';
import CryptoCoin from '../CryptoCoin';
export default class CryptoCoinIOST extends CryptoCoin {
  constructor(opts) {
    super(opts);
  }

  // static hasAccount = true;

  // getPublicKeyDecoded() {
  //   return typeof this.publicKey === 'string'
  //     ? this.publicKey
  //     : bs58.encode(this.publicKey.data);
  // }
}
