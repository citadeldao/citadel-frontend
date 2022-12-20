import MetamaskConnector from '@/models/Services/Metamask';
import { metamaskNets } from '@/config/availableNets';

export default {
  namespaced: true,
  state: () => ({
    metamaskConnector: new MetamaskConnector(),
    isShow: false,
  }),

  getters: {
    metamaskConnector: (state) => state.metamaskConnector,
    isShow: (state) => state.isShow,
  },

  mutations: {},

  actions: {
    async connectToMetamask({ state }) {
      try {
        await state.metamaskConnector.connect();
        if (!metamaskNets.includes(state.metamaskConnector.network)) {
          await state.metamaskConnector.changeNetwork();
        }
        state.isShow = false;
      } catch (e) {
        state.isShow = true;
      }
    },
  },
};
