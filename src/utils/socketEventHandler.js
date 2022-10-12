import store from '@/store/index';
import useWallets from '@/compositions/useWallets';
import extensionsSocketTypes from '@/config/extensionsSocketTypes';
import notify from '@/plugins/notify';
import { WALLET_TYPES } from '@/config/walletType';

export async function socketEventHandler({ eventName, data }) {
  switch (eventName) {
    // notifications
    case 'transaction-events-client':
      store.commit('extensions/SET_TRANSACTION_FOR_SIGN', data, { root: true });

      break;

    case 'message-from-app':
      if (data.type === extensionsSocketTypes.types.balance) {
        if (!data?.message) {
          return;
        }
        // get wallet
        const { wallets } = useWallets();
        const wallet = wallets.value.find(
          (wallet) => data.message.address === wallet.address
        );
        if (!wallet || wallet.type !== WALLET_TYPES.KEPLR) {
          return;
        }
        // get curent keplr address
        const keplrAddress = (await window.keplr.getKey('secret-4'))
          ?.bech32Address;
        // check keplr account
        if (data.message.address !== keplrAddress) {
          notify({
            type: 'warning',
            text: 'Please change Keplr account',
            duration: 3000,
          });
        }
      }

      if (data.type === extensionsSocketTypes.types.execute) {
        store.commit(
          'extensions/SET_TRANSACTION_FOR_SIGN',
          {
            transaction: {},
            address: data.message.sender || data.message[0]?.sender,
            net: 'secret',
            messageScrt: data.message,
            type: data.type,
            meta_info: data.meta_info,
          },
          { root: true }
        );
      }

      if (data.type === extensionsSocketTypes.types.generateVK) {
        store.commit(
          'extensions/SET_TRANSACTION_FOR_SIGN',
          {
            transaction: {},
            address: data.message.address,
            net: 'secret',
            messageScrt: data.message,
            type: data.type,
            meta_info: data.meta_info,
          },
          { root: true }
        );
      }

      if (data.type === 'sign-message') {
        store.commit('extensions/SET_MESSAGE_FOR_SIGN', data.message, {
          root: true,
        });
      }

      break;

    case 'mempool-add-tx-client':
      store.commit('transactions/ADD_TO_MEMPOOL', data);

      break;

    case 'mempool-remove-tx-client':
      // show notify when tx success
      {
        const { wallets } = useWallets();
        const isSubtoken = data.net.includes('_');
        const wallet = wallets.value.find((w) => {
          if (isSubtoken) {
            return data.from.toLowerCase() === w.address.toLowerCase();
          } else {
            return (
              w.net === data.net &&
              data.from.toLowerCase() === w.address.toLowerCase()
            );
          }
        });

        if (wallet) {
          notify({
            type: data && data.status === 'success' ? data.status : 'warning',
            text: '',
            hash: wallet.getTxUrl(wallet.id, data.hash),
            duration: 10000,
          });
        }

        //const res = await citadel.parseSocketObject('mempool-remove-tx-client', data);
        // if(!res.error){
        store.commit('transactions/REMOVE_FROM_MEMPOOL', data);
        // store.dispatch('wallets/getNewWallets','lazy');
        if (data.updateStakeListRequired) {
          await store.dispatch(
            'staking/updateStakeList',
            { address: data.from, net: data.net },
            { root: true }
          );
          if (data.from.toLowerCase() !== data.to.toLowerCase()) {
            await store.dispatch(
              'staking/updateStakeList',
              { address: data.to, net: data.net },
              { root: true }
            );
          }
          // }
        }
      }

      break;
    case 'marketCap-update-client':
      //update marketcap
      await store.dispatch('profile/updateMarketcap', data);
      await store.dispatch('profile/updateRates', data);
      await store.dispatch('profile/updateCurrentWalletMarketcap', data);

      break;
  }
}
