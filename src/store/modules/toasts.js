const types = {
  ADD_TOAST: 'SET_NOTIFICATION',
  REMOVE_TOAST: 'REMOVE_NOTIFICATION',
};

export default {
  namespaced: true,
  state: () => ({
    toasts: [],
  }),

  getters: {
    toasts: (state) => state.toasts,
  },

  mutations: {
    [types.ADD_TOAST](state, toast) {
      state.toasts.unshift(toast);
    },
    [types.REMOVE_TOAST](state, id) {
      const index = state.toasts.findIndex((n) => n.id === id);
      state.toasts.splice(index, 1);
    },
  },

  actions: {
    async addToast({ commit, dispatch }, params) {
      commit(types.ADD_TOAST, {
        ...params,
      });
      setTimeout(() => dispatch('removeToast', params.id), params.duration);

      if (params.text.status === 403) {
        window.location.href = '/login';
      }
    },

    removeToast({ commit }, id) {
      commit(types.REMOVE_TOAST, id);
    },
  },
};
