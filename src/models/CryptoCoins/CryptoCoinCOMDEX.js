import CryptoCoin from '../CryptoCoin';
export default class CryptoCoinCOMDEX extends CryptoCoin {
  constructor(opts) {
    super(opts);
  }

  // getPublicKeyDecoded() {
  //   return typeof this.publicKey === 'string'
  //     ? this.publicKey
  //     : Buffer.from(this.publicKey).toString('hex');
  // }
}
