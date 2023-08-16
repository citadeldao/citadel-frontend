const types = {
  SET_BTC_ADDRESS_TYPE: 'SET_BTC_ADDRESS_TYPE',
};

export default {
  namespaced: true,
  state: () => ({
    selectedBtcAddressType: '',
  }),

  getters: {
    selectedBtcAddressType: (state) => state.selectedBtcAddressType,
  },

  mutations: {
    [types.SET_BTC_ADDRESS_TYPE](state, value) {
      state.selectedBtcAddressType = value;
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
  },
};
