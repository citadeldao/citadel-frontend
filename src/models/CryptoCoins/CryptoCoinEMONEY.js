import CryptoCoin from '../CryptoCoin';
export default class CryptoCoinEMONEY extends CryptoCoin {
  constructor(opts, api) {
    super(opts, api);
  }

  // getPublicKeyDecoded() {
  //   return typeof this.publicKey === 'string'
  //     ? this.publicKey
  //     : Buffer.from(this.publicKey).toString('hex');
  // }
}
