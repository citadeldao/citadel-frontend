const types = {
  SET_BTC_ADDRESS_TYPE: 'SET_BTC_ADDRESS_TYPE',
  SET_BTC_BALANCE: 'SET_BTC_BALANCE',
};

export default {
  namespaced: true,
  state: () => ({
    selectedBtcAddressType: '',
    segwitAddressBalance: 0,
    nativeAddressBalance: 0,
  }),

  getters: {
    selectedBtcAddressType: (state) => state.selectedBtcAddressType,
    segwitAddressBalance: (state) => state.segwitAddressBalance,
    nativeAddressBalance: (state) => state.nativeAddressBalance,
  },

  mutations: {
    [types.SET_BTC_ADDRESS_TYPE](state, value) {
      state.selectedBtcAddressType = value;
    },
    [types.SET_BTC_BALANCE](state, { balance, type }) {
      if (type === 'segwit') state.segwitAddressBalance = balance;
      if (type === 'native') state.nativeAddressBalance = balance;
      console.log(
        'balances seg/nat',
        state.segwitAddressBalance,
        state.nativeAddressBalance
      );
    },
  },

  actions: {
    setBtcAddressType({ commit, state }, value) {
      if (state.selectedBtcAddressType === value) {
        commit(types.SET_BTC_ADDRESS_TYPE, '');
        return;
      }
      commit(types.SET_BTC_ADDRESS_TYPE, value);
    },
    setBtcBalanceType({ commit }, value) {
      commit(types.SET_BTC_BALANCE, value);
    },
  },
};
