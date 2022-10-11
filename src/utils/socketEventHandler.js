import store from '@/store/index';
import useWallets from '@/compositions/useWallets';
import { WALLET_TYPES } from '@/config/walletType';
import extensionsSocketTypes from '@/config/extensionsSocketTypes';
import notify from '@/plugins/notify';
import citadel from '@citadeldao/lib-citadel';

export async function socketEventHandler({ eventName, data }) {
  // this.socket.on('transaction-events-client', (tx) => {
  //   store.commit('extensions/SET_TRANSACTION_FOR_SIGN', tx, { root: true });
  // });
  switch (eventName) {
    // notifications
    case 'transaction-events-client':
      store.commit('extensions/SET_TRANSACTION_FOR_SIGN', data, { root: true });

      break;
    // this.socket.on('message-from-app', async (data) => {
    //   if (data.type === 'view-scrt-balance') {
    //     const secretAddress = data.message.address;
    //     const sSecretContract = data.message.tokenContract;

    //     const sendErrorMsg = () => {
    //       store.dispatch('extensions/sendCustomMsg', {
    //         token: store.getters['extensions/currentAppInfo'].token,
    //         message: {
    //           balance: 'Viewingkey not found, balance: ?',
    //           tokenContract: sSecretContract,
    //         },
    //         type: data.type,
    //       });
    //     };

    //     const { wallets } = useWallets();
    //     const wallet = wallets.value
    //       .filter(w => w.type !== WALLET_TYPES.WALLET_TYPES)
    //       .find(w => w.address === secretAddress);

    //     if (wallet) {
    //       store.dispatch('wallets/setCurrentWallet', wallet);
    //       const searchToken = store.getters['subtokens/formatedSubtokens']('myTokens', wallet);

    //       if (searchToken[0] && searchToken[0].tokenBalance) {
    //         store.dispatch('extensions/sendCustomMsg', {
    //           token: store.getters['extensions/currentAppInfo'].token,
    //           message: {
    //             balance: searchToken[0].tokenBalance.calculatedBalance,
    //             tokenContract: sSecretContract,
    //           },
    //           type: data.type,
    //         });
    //       } else {
    //         sendErrorMsg();
    //       }
    //     }
    //   }

    //   if (data.type === 'sign-message') {
    //     store.commit('extensions/SET_MESSAGE_FOR_SIGN', data.message, { root: true });
    //   }
    // });
    case 'message-from-app':
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

      if (data.type === extensionsSocketTypes.types.balance) {
        if (!data?.message) {
          return;
        }
        const secretAddress = data.message.address;
        const tokenContract = data.message.tokenContract;
        const tokenKey = data.message.net;

        const sendErrorMsg = () => {
          store.dispatch('extensions/sendCustomMsg', {
            token: store.getters['extensions/currentAppInfo'].token,
            message: {
              balance: 'Viewingkey not found, balance: ?',
              tokenContract,
            },
            type: data.type,
          });
        };

        const { wallets } = useWallets();
        const wallet = wallets.value.find(
          (w) =>
            w.type !== WALLET_TYPES.PUBLIC_KEY && w.address === secretAddress
        );

        if (wallet) {
          // update balance (by SVK, keplr etc)
          const { data: balance, error } = await citadel.getBalanceById(
            wallet.id,
            tokenKey
          );
          if (error) {
            sendErrorMsg();
            error.code === 1 &&
              notify({
                type: 'warning',
                text: error.message,
              });
            return;
          }
          store.dispatch('extensions/sendCustomMsg', {
            token: store.getters['extensions/currentAppInfo'].token,
            message: {
              balance: balance.calculatedBalance,
              tokenContract,
            },
            type: data.type,
          });
          return;
        }
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
    // this.socket.on('mempool-remove-tx-client', async (tx) => {
    //   // show notify when tx success
    //   const { wallets } = useWallets();
    //   const wallet = wallets.value.find(w => w.net === tx.net && tx.from.toLowerCase() === w.address.toLowerCase());

    //   if (wallet) {
    //     notify({
    //       type: tx.status === 'success' ? tx.status : 'warning',
    //       text: '',
    //       hash: wallet.getTxUrl(wallet.id, tx.hash),
    //       duration: 10000,
    //     });
    //   }

    //   const res = await citadel.parseSocketObject('mempool-remove-tx-client', tx);
    //   if(!res.error){
    //     store.commit('transactions/REMOVE_FROM_MEMPOOL', tx);
    //     // store.dispatch('wallets/getNewWallets','lazy');
    //     if(res.data.updateStakeListRequired){
    //       await store.dispatch('staking/updateStakeList', ({ address: tx.from, net: tx.net }),{ root: true });
    //       if(tx.from.toLowerCase() !== tx.to.toLowerCase()){
    //         await store.dispatch('staking/updateStakeList', ({ address: tx.to, net: tx.net }),{ root: true });
    //       }
    //     }
    //   }
    // });
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

    case 'change-email-client':
      if (data.msg.new === true && data.msg.old === true) {
        await store.dispatch('auth/logout');
        window.location.reload();
      }
      break;
  }
}
