import { WALLET_TYPES } from '@/config/walletType';

const types = {
  SET_WALLET_ID: 'SET_WALLET_ID',
  SET_SHOW_PASSWORD_MODAL: 'SET_SHOW_PASSWORD_MODAL',
  SET_SHOW_LEDGER_MODAL: 'SET_SHOW_LEDGER_MODAL',
  SET_RESOLVE: 'SET_RESOLVE',
  SET_REJECT: 'SET_REJECT',
  SET_MESSAGE: 'SET_MESSAGE',
};

export default {
  namespaced: true,
  state: () => ({
    walletId: null,
    message: '',
    showPasswordModal: false,
    showLedgerModal: false,
    resolve: () => {},
    reject: () => {},
  }),

  getters: {
    walletId: (state) => state.walletId,
    message: (state) => state.message,
    showPasswordModal: (state) => state.showPasswordModal,
    showLedgerModal: (state) => state.showLedgerModal,
    resolve: (state) => state.resolve,
    reject: (state) => state.reject,
  },
  mutations: {
    [types.SET_WALLET_ID](state, value) {
      state.walletId = value;
    },
    [types.SET_MESSAGE](state, value) {
      state.message = value;
    },
    [types.SET_SHOW_PASSWORD_MODAL](state, value) {
      state.showPasswordModal = value;
    },
    [types.SET_SHOW_LEDGER_MODAL](state, value) {
      state.showLedgerModal = value;
    },
    [types.SET_RESOLVE](state, value) {
      state.resolve = value;
    },
    [types.SET_REJECT](state, value) {
      state.reject = value;
    },
  },
  actions: {
    async sendPrivateKeysToLib(
      { commit, rootGetters },
      { walletId, message } = {}
    ) {
      // get wallet to
      const wallet = rootGetters['wallets/walletById'](walletId);
      // set wallet
      commit(types.SET_WALLET_ID, walletId);

      // set wallet message
      commit(types.SET_MESSAGE, message);

      if (wallet.type === WALLET_TYPES.LEDGER) {
        // open callback modal
        commit(types.SET_SHOW_LEDGER_MODAL, true);
      } else if (
        [WALLET_TYPES.ONE_SEED, WALLET_TYPES.PRIVATE_KEY].includes(wallet.type)
      ) {
        commit(types.SET_SHOW_PASSWORD_MODAL, true);
      } else {
        return { error: new Error('Wrong wallet type') };
      }

      const clearState = () => {
        commit(types.SET_WALLET_ID, null);
        commit(types.SET_MESSAGE, '');
        commit(types.SET_SHOW_LEDGER_MODAL, false);
        commit(types.SET_SHOW_PASSWORD_MODAL, false);
        commit(types.SET_RESOLVE, () => {});
        commit(types.SET_REJECT, () => {});
      };

      return new Promise((resolve, reject) => {
        // set resolve function for modal (on confirm)
        commit(types.SET_RESOLVE, (result) => {
          resolve(result);
          clearState();
        });
        // set reject function for modal (on close)
        commit(types.SET_REJECT, (error) => {
          reject({ error });
          clearState();
        });
      });
    },
  },
};
