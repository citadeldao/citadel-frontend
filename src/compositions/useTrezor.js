import { computed } from 'vue';
import store from '@/store';
import { WALLET_TYPES } from '@/config/walletType';

export default function useTrezor() {
  const currentWallet = computed(() => store.getters['wallets/currentWallet']);
  const isTrezorWallet = computed(() => currentWallet.value.type === WALLET_TYPES.TREZOR);

  return {
    isTrezorWallet,
  };
}
