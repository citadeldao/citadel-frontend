import { ref, computed, provide } from 'vue';
import { useStore } from 'vuex';
import useWallets from './useWallets';

export default function useKtAddresses() {
  const store = useStore();
  const { currentWallet } = useWallets();
  const ktLoading = ref(false);
  provide('ktLoading', ktLoading);

  const ktAddresses = computed(() => store.getters['ktAddresses/ktAddresses']);
  provide('ktAddresses', ktAddresses);

  const currentKtAddress = computed(() => store.getters['ktAddresses/currentKtAddress']);
  provide('currentKtAddress', currentKtAddress);

  const updateCurrentKtAddress = (ktAddress) => {
    store.dispatch('ktAddresses/setCurrentKtAddress', ktAddress);
    ktAddress && ktAddresses.value.sort((x, y) => x.address === ktAddress.address ? -1 : y.address === ktAddress.address ? 1 : 0);
  };
  provide('updateCurrentKtAddress', updateCurrentKtAddress);

  const loadKtAddresses = async (walletId) => {
    if (currentWallet?.value?.hasKtAddresses) {
      ktLoading.value = true;
      await store.dispatch('ktAddresses/loadKtAddresses', { walletId });
      ktLoading.value = false;
    }
  };

  const currentKtAddressNodeList = computed(() => {
    if (currentKtAddress.value && currentKtAddress.value?.delegate && currentKtAddress.value?.delegate?.active) {
      return [{
        ...currentKtAddress.value.delegate,
        name: currentKtAddress.value.delegate.alias,
        color: '#FF5722',
      }];
    }

    return [];
  });

  provide('currentKtAddressNodeList', currentKtAddressNodeList);

  return { loadKtAddresses, ktAddresses };
}
