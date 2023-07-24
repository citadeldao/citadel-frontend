import CryptoCoin from '../CryptoCoin';
//const base58check = require('bs58check');
export default class CryptoCoinTEZ extends CryptoCoin {
  constructor(opts) {
    super(opts);
  }

  // getFormattedPublicKey() {
  //   return typeof this.publicKey === 'string'
  //     ? this.publicKey
  //     : base58check.encode(Buffer.from(this.publicKey)); // base58check.encode(Buffer.from(this.publicKey))
  // }

  // getPublicKeyDecoded() {
  //   return typeof this.publicKey === 'string'
  //     ? this.publicKey
  //     : base58check.encode(Buffer.from(this.publicKey));
  // }
}
