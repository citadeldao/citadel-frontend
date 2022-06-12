import citadel from '@citadeldao/lib-citadel';
import notify from '@/plugins/notify';


const types = {
  SET_STAKE_NODES: 'SET_STAKE_NODES',
  SET_STAKE_LIST: 'SET_STAKE_LIST',
};

export default {
  namespaced: true,
  state: () => ({
    stakeNodes: [],
    stakeList: [],
  }),

  getters: {
    stakeNodes: state => state.stakeNodes,
    stakeList: state => state.stakeList,
  },

  mutations: {
    [types.SET_STAKE_NODES](state, nodes) {
      state.stakeNodes = nodes;
    },
    [types.SET_STAKE_LIST](state, list) {
      state.stakeList = list;
    },
  },

  actions: {
    async getStakeNodes({ commit }, net) {
      const { data, error } = await citadel.getStakeNodes(net);

      if (!error) {
        commit(types.SET_STAKE_NODES, data);
      } else {
        notify({
          type: 'warning',
          text: error,
        });
      }
    },

    async getStakeList({ commit, rootGetters }, wallet) {
      const { data, error } = await citadel.getStakeList(wallet.id);

      if (!error) {
        const currentWallet = rootGetters['wallets/currentWallet'];

        if (currentWallet?.net?.toLowerCase() === wallet?.net?.toLowerCase() &&
        currentWallet?.address?.toLowerCase() === wallet?.address?.toLowerCase()) {
          commit(types.SET_STAKE_LIST, data);
        }
      } else {
        notify({
          type: 'warning',
          text: error,
        });
        commit(types.SET_STAKE_LIST, []);
      }
    },

    async updateStakeList({ dispatch, rootGetters }, { address, net }) {
      const currentWallet = rootGetters['wallets/currentWallet'];
      const currentToken = rootGetters['subtokens/currentToken'];
      const isCurrentWallet = address.toLowerCase() === currentWallet?.address?.toLowerCase() &&
      net.toLowerCase() === currentWallet?.net?.toLowerCase();
      // for token, if it has stakeList
      const isCurrentToken = address.toLowerCase() === currentToken?.address?.toLowerCase() &&
      net.toLowerCase() === currentToken?.net?.toLowerCase();

      if (isCurrentWallet) {
        await dispatch('getStakeList', currentWallet);
      }

      // for token, if it has stakeList
      if (isCurrentToken) {
        await dispatch('getStakeList', currentToken);
      }
    },
  },
};
