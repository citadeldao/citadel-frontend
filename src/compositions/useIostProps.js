import { computed, ref } from 'vue';
import useWallets from './useWallets';
import notify from '@/plugins/notify';
import citadel from '@citadeldao/lib-citadel';

export default function useIostProps() {
  const { currentWallet } = useWallets();
  const gas = computed(() => currentWallet.value.balance.adding?.find(({ name }) => name === 'GAS')?.current || 0);
  const ram = computed(() => currentWallet.value.balance.adding?.find(({ name }) => name === 'RAM')?.current || 0);
  const pledgedBalance = computed(() => currentWallet.value.balance.adding?.find(({ name }) => name === 'Pledged IOST')?.current || 0);

  const waitAccounts = ref(false);
  const accounts = ref([]);
  const account = ref('');

  const loadAccounts = async (privateKey, hasAccount) => {
    accounts.value = [];
    account.value = '';
    waitAccounts.value = false;

    if (hasAccount && privateKey) {
      accounts.value = [];
      const { data, error } = await citadel.getAccountsByPrivateKey('iost', privateKey);
      if (!error) {
        accounts.value = data.map(item => ({ label: item.name, key: item.name }));
        account.value = accounts.value[0].key;
      }else{
        notify({
          type: 'warning',
          text: error,
        });
      }
      waitAccounts.value = false;
    }
  };

  return {
    gas,
    ram,
    loadAccounts,
    waitAccounts,
    accounts,
    account,
    pledgedBalance,
  };
}
