import KeplrConnector from '@/models/Services/Keplr';

export default {
  namespaced: true,
  state: () => ({
    keplrConnector: new KeplrConnector(),
  }),

  getters: {
    keplrConnector: (state) => state.keplrConnector,
  },

  mutations: {},

  actions: {
    async connectToKeplr({ state }, chainId) {
      await state.keplrConnector.connect(chainId);
    },
  },
};
