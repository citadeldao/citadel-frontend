import LeapConnector from '@/models/Services/Leap';

export default {
  namespaced: true,
  state: () => ({
    leapConnector: new LeapConnector(),
  }),

  getters: {
    leapConnector: (state) => state.leapConnector,
  },

  mutations: {},

  actions: {
    async connectToLeap({ state }, chainId) {
      if (typeof chainId === 'object') {
        await state.leapConnector.connect(chainId.chainId, true);
      } else {
        await state.leapConnector.connect(chainId);
      }
    },
  },
};
