const types = {
  ADD_MODAL: 'ADD_MODAL',
  REMOVE_MODAL: 'REMOVE_MODAL',
};

export default {
  namespaced: true,
  state: () => ({
    modals: [],
  }),
  getters: {
    isModalShown: (state) => (name) => state.modals.includes(name),
  },
  mutations: {
    [types.ADD_MODAL](state, name) {
      state.modals.push(name);
    },
    [types.REMOVE_MODAL](state, name) {
      state.modals.splice(state.modals.findIndex((n) => n === name), 1);
    },
  },
  actions: {
    showModal({ commit }, name) {
      commit(types.ADD_MODAL, name);
    },
    hideModal({ commit }, name) {
      commit(types.REMOVE_MODAL, name);
    },
  },
};