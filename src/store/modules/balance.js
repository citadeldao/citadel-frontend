const types = {
  SET_BALANCE: 'SET_BALANCE',
};

export default {
  namespaced: true,
  state: () => ({
    usd: 0,
    usdWithTokens: 0,
    btc: 0,
  }),

  getters: {
    usd: (state) => state.usd,
    usdWithTokens: (state) => state.usdWithTokens,
    btc: (state) => state.btc,
  },

  mutations: {
    [types.SET_BALANCE](state, { type, value }) {
      state[type] = value;
    },
  },

  actions: {
    setBalance({ commit }, { type, value }) {
      commit(types.SET_BALANCE, { type, value });
    },
  },
};
