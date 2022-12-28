import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { WALLET_TYPES } from '@/config/walletType';

export default function useSigner(options = {}) {
  const store = useStore();
  const signResult = ref('');

  const signer = options.signer;
  const tx = options.tx;

  const keplrConnector = computed(() => store.getters['keplr/keplrConnector']);

  const signTx = async () => {
    const SIGNERS = {
      // KEPLR
      [WALLET_TYPES.KEPLR]: async () => {
        return await keplrConnector.value.sendKeplrTransaction(
          tx,
          signer.address,
          { preferNoSetFee: true }
        );
      },
    };

    try {
      signResult.value = await SIGNERS[signer.type]();
    } catch (err) {
      console.log('new sign error', err);
    }
  };

  return {
    signTx,
  };
}
