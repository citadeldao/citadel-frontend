import MetamaskConnector from '@/models/Services/Metamask';
import { metamaskNets } from '@/config/availableNets';

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

      if (!metamaskNets.includes(state.metamaskConnector.network)) {
        await state.metamaskConnector.changeNetwork();
      }
    },
  },
};
