import MetamaskConnector from '@/models/Services/Metamask';

export default {
  namespaced: true,
  state: () => ({
    metamaskConnector: new MetamaskConnector(),
  }),

  getters: {
    metamaskConnector: (state) => state.metamaskConnector,
  },

  mutations: {},

  actions: {
    async connectToMetamask({ state }) {
      await state.metamaskConnector.connect();

      if (!['bsc', 'eth'].includes(state.metamaskConnector.network)) {
        await state.metamaskConnector.changeNetwork();
      }
    },
  },
};
