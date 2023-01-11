import MetamaskConnector from '@/models/Services/Metamask';
import { metamaskNets } from '@/config/availableNets';

export default {
  namespaced: true,
  state: () => ({
    metamaskConnector: new MetamaskConnector(),
    // only for UI
    metamaskAddress: '',
    isShow: false,
  }),

  getters: {
    metamaskConnector: (state) => state.metamaskConnector,
    isShow: (state) => state.isShow,
    metamaskAddress: (state) => state.metamaskAddress,
  },

  mutations: {},

  actions: {
    async connectToMetamask({ state }) {
      try {
        await state.metamaskConnector.connect();
        if (!metamaskNets.includes(state.metamaskConnector.network)) {
          await state.metamaskConnector.changeNetwork();
        }
        if (state.metamaskConnector.accounts[0] !== state.metamaskAddress) {
          state.metamaskAddress = state.metamaskConnector.accounts[0];
        }
        state.isShow = false;
      } catch (e) {
        state.isShow = true;
      }
    },
  },
};
