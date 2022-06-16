import notify from '@/plugins/notify';
import citadel from '@citadeldao/lib-citadel';

const types = {
  SET_KT_ADRESSES: 'SET_KT_ADRESSES',
  SET_CURRENT_KT_ADRESSES: 'SET_CURRENT_KT_ADRESSES',
};

export default {
  namespaced: true,
  state: () => ({
    ktAddresses: [],
    currentKtAddress: null,
  }),

  getters: {
    ktAddresses: (state) => state.ktAddresses,
    currentKtAddress: (state) => state.currentKtAddress,
  },

  mutations: {
    [types.SET_KT_ADRESSES](state, ktAddresses) {
      state.ktAddresses = ktAddresses;
    },
    [types.SET_CURRENT_KT_ADRESSES](state, currentKtAddress) {
      state.currentKtAddress = currentKtAddress;
    },
  },

  actions: {
    async loadKtAddresses({ commit, rootGetters }, { walletId }) {
      if (!rootGetters['wallets/currentWallet'].hasKtAddresses) {
        return;
      }

      const res = await citadel.getKTAddresses(walletId);

      if (!res.error) {
        commit(types.SET_KT_ADRESSES, res.data);
      } else {
        notify({
          type: 'warning',
          text: res.error,
        });
        commit(types.SET_KT_ADRESSES, []);
      }
    },
    setCurrentKtAddress({ commit }, currentKtAddress) {
      commit(types.SET_CURRENT_KT_ADRESSES, currentKtAddress);
    },
  },
};
