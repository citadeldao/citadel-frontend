const types = {
  SET_BALANCE: 'SET_BALANCE',
  TOGGLE_BALANCE: 'TOGGLE_BALANCE',
};

export default {
  namespaced: true,
  state: () => ({
    usd: 0,
    usdWithTokens: 0,
    btc: 0,
    showBalance: true,
  }),

  getters: {
    showBalance: (state) => state.showBalance,
    usd: (state) => state.usd,
    usdWithTokens: (state) => state.usdWithTokens,
    btc: (state) => state.btc,
  },

  mutations: {
    [types.TOGGLE_BALANCE](state, value) {
      state.showBalance = value;
    },
    [types.SET_BALANCE](state, { type, value }) {
      state[type] = value;
    },
  },

  actions: {
    toggleShowBalance({ commit }, value) {
      commit(types.TOGGLE_BALANCE, value);
    },
    setBalance({ commit }, { type, value }) {
      commit(types.SET_BALANCE, { type, value });
    },
  },
};
