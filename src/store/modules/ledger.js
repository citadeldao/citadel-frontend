const types = {
  SET_CONNECTION_TYPE: 'SET_CONNECTION_TYPE',
};

export default {
  namespaced: true,
  state: () => ({
    connectionType: 'usb',
  }),

  getters: {
    connectionType: (state) => state.connectionType,
  },

  mutations: {
    [types.SET_CONNECTION_TYPE](state, type) {
      state.connectionType = type;
    },
  },

  actions: {
    setConnectionType({ commit }, type) {
      commit(types.SET_CONNECTION_TYPE, type);
    },
  },
};
