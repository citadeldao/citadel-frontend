import citadel from '@citadeldao/lib-citadel';
import notify from '@/plugins/notify';
import axios from 'axios';

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
    stakeNodes: (state) => state.stakeNodes,
    stakeList: (state) => state.stakeList,
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

        if (
          currentWallet?.net?.toLowerCase() === wallet?.net?.toLowerCase() &&
          currentWallet?.address?.toLowerCase() ===
            wallet?.address?.toLowerCase()
        ) {
          if (currentWallet.net === 'solana') {
            const result = await axios.get(
              `${process.env.VUE_APP_PUBLIC_BACKEND_URL}/blockchain/solana/${currentWallet.address}/stake_accounts`
            );

            let solanaAccountsList = [];
            if (result.data.ok) {
              solanaAccountsList = result.data?.data?.map((item) => {
                return {
                  current: item.validator,
                  holderAccount: item.address,
                  value: item.staked,
                  staked: true,
                  activationDate: item.activationDate || null,
                  deactivationDate: item.deactivationDate || null,
                  isInactive: item.isInactive ? 'Inactive' : 'Active',
                };
              });
            }
            commit(types.SET_STAKE_LIST, solanaAccountsList);
          } else {
            commit(types.SET_STAKE_LIST, data);
          }
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
      const isCurrentWallet =
        address.toLowerCase() === currentWallet?.address?.toLowerCase() &&
        net.toLowerCase() === currentWallet?.net?.toLowerCase();
      // for token, if it has stakeList
      const isCurrentToken =
        address.toLowerCase() === currentToken?.address?.toLowerCase() &&
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
