import useApi from '@/api/useApi';
import { io } from 'socket.io-client';
import store from '@/store/index';
import notify from '@/plugins/notify';
import citadel from '@citadeldao/lib-citadel';
import useWallets from '@/compositions/useWallets';
import { WALLET_TYPES } from '@/config/walletType';

const api = useApi('auth');

export class SocketManager {
  // contains a socket connection
  static socket;

  static async connect() {
    try {
      const {
        ok,
        data: token,
        error,
      } = await api.getSocketToken();

      if (!ok) {
        throw error;
      }

      this.socket = io(
        process.env.VUE_APP_BACKEND_WS_URL,
        {
          transports: ['websocket'],
          upgrade: false,
          query: { token },
        },
      );

      this.startListeners();

    } catch (err) {
      console.error(`Error on initSocketConnection: `, err);
    }
  }

  static async disconnect() {
    await this.socket.disconnect();
    this.socket = null;
  }

  static startListeners() {
    try {
      // notifications
      this.socket.on('transaction-events-client', (tx) => {
        store.commit('extensions/SET_TRANSACTION_FOR_SIGN', tx, { root: true });
      });

      this.socket.on('message-from-app', async (data) => {
        if (data.type === 'view-scrt-balance') {
          const secretAddress = data.message.address;
          const sSecretContract = data.message.tokenContract;

          const sendErrorMsg = () => {
            store.dispatch('extensions/sendCustomMsg', {
              token: store.getters['extensions/currentAppInfo'].token,
              message: {
                balance: 'Viewingkey not found, balance: ?',
                tokenContract: sSecretContract,
              },
              type: data.type,
            });
          };

          const { wallets } = useWallets();
          const wallet = wallets.value
            .filter(w => w.type !== WALLET_TYPES.WALLET_TYPES)
            .find(w => w.address === secretAddress);

          if (wallet) {
            store.dispatch('wallets/setCurrentWallet', wallet);
            const searchToken = store.getters['subtokens/formatedSubtokens']('myTokens', wallet);

            if (searchToken[0] && searchToken[0].tokenBalance) {
              store.dispatch('extensions/sendCustomMsg', {
                token: store.getters['extensions/currentAppInfo'].token,
                message: {
                  balance: searchToken[0].tokenBalance.calculatedBalance,
                  tokenContract: sSecretContract,
                },
                type: data.type,
              });
            } else {
              sendErrorMsg();
            }
          }
        }

        if (data.type === 'sign-message') {
          store.commit('extensions/SET_MESSAGE_FOR_SIGN', data.message, { root: true });
        }
      });

      //update balance
      this.socket.on('address-balance-updated-client', async (socketObject) => {
        /* const res = */ await citadel.parseSocketObject('address-balance-updated-client', socketObject);
        // if(!res.error){
        //   store.dispatch('wallets/getNewWallets','lazy');
        // }
      });

      // mempool
      this.socket.on('mempool-add-tx-client', (tx) => {
        store.commit('transactions/ADD_TO_MEMPOOL', tx);
      });

      this.socket.on('mempool-remove-tx-client', async (tx) => {
        // show notify when tx success
        const { wallets } = useWallets();
        const wallet = wallets.value.find(w => w.net === tx.net && tx.from.toLowerCase() === w.address.toLowerCase());

        if (wallet) {
          notify({
            type: tx.status === 'success' ? tx.status : 'warning',
            text: '',
            hash: wallet.getTxUrl(wallet.id, tx.hash),
            duration: 10000,
          });
        }

        const res = await citadel.parseSocketObject('mempool-remove-tx-client', tx);
        if(!res.error){
          store.commit('transactions/REMOVE_FROM_MEMPOOL', tx);
          // store.dispatch('wallets/getNewWallets','lazy');
          if(res.data.updateStakeListRequired){
            await store.dispatch('staking/updateStakeList', ({ address: tx.from, net: tx.net }),{ root: true });
            if(tx.from.toLowerCase() !== tx.to.toLowerCase()){
              await store.dispatch('staking/updateStakeList', ({ address: tx.to, net: tx.net }),{ root: true });
            }
          }
        }
      });
    } catch (err) {
      console.error(`Error starting listeners: `, err);
    }
  }

  static async reconnect() {
    await this.disconnect();
    await this.connect();
  }
}
