import { sortByAlphabet } from '@/helpers';
import notify from '@/plugins/notify';
import citadel from '@citadeldao/lib-citadel';
import { OUR_TOKEN } from '@/config/walletType';

const types = {
  SET_ACTIVITY: 'SET_ACTIVITY',
  SET_HOLDER_INFO: 'SET_HOLDER_INFO',
  SET_UNASSIGNED_ADDRESSES: 'SET_UNASSIGNED_ADDRESSES',
  SET_ASSIGNED_ADDRESSES: 'SET_ASSIGNED_ADDRESSES',
  SET_TOTAL_CLAIMED_REWARDS_XCT: 'SET_TOTAL_CLAIMED_REWARDS_XCT',
  SET_REWARDS: 'SET_REWARDS',
  SET_CALCULATOR_DATA: 'SET_CALCULATOR_DATA',
  SET_REWARDS_XCT: 'SET_REWARDS_XCT',
};

export default {
  namespaced: true,
  state: () => ({
    activity: [],
    holderInfo: {},
    unassignedAddresses: [],
    assignedAddresses: [],
    totalClaimedRewardsXCT: 0,
    rewards: [],
    calculatorData: {},
    xctRewards: 0,
  }),

  getters: {
    activity: (state) => state.activity,
    holderInfo: (state) => state.holderInfo,
    unassignedAddresses: (state) =>
      sortByAlphabet(state.unassignedAddresses, 'net'),
    assignedAddresses: (state) =>
      sortByAlphabet(state.assignedAddresses, 'net'),
    totalClaimedRewardsXCT: (state) => state.totalClaimedRewardsXCT,
    rewards: (state) => state.rewards,
    calculatorData: (state) => state.calculatorData,
    xctRewards: (state) => state.xctRewards,
  },

  mutations: {
    [types.SET_ACTIVITY](state, activity) {
      state.activity = activity;
    },
    [types.SET_HOLDER_INFO](state, info) {
      state.holderInfo = info;
    },
    [types.SET_UNASSIGNED_ADDRESSES](state, unassignedAddresses) {
      state.unassignedAddresses = unassignedAddresses;
    },
    [types.SET_ASSIGNED_ADDRESSES](state, assignedAddresses) {
      state.assignedAddresses = assignedAddresses;
    },
    [types.SET_TOTAL_CLAIMED_REWARDS_XCT](state, totalClaimedRewardsXCT) {
      state.totalClaimedRewardsXCT = totalClaimedRewardsXCT;
    },
    [types.SET_REWARDS](state, rewards) {
      state.rewards = rewards;
    },
    [types.SET_CALCULATOR_DATA](state, data) {
      state.calculatorData = data;
    },
    [types.SET_REWARDS_XCT](state, data) {
      state.xctRewards = data;
    },
  },

  actions: {
    async getActivity({ commit }) {
      const { error, data } = await citadel.getActiveDaoHolders();

      if (!error) {
        commit(types.SET_ACTIVITY, data);
      } else {
        notify({
          type: 'warning',
          text: error,
        });
      }
    },

    async getHolderInfo({ commit, rootGetters }, walletId) {
      if (!rootGetters['wallets/currentWallet'].hasXCT) {
        return;
      }

      const { error, data } = await citadel.callTokenInfo(
        walletId,
        OUR_TOKEN,
        'assignedAddresses'
      );

      if (!error) {
        if (data.holder) {
          commit(types.SET_HOLDER_INFO, data);
        } else {
          commit(types.SET_HOLDER_INFO, {
            wallets: [],
            holder: { totalUsdt: 0, claimed: 0, claimable: 0 },
          });
        }
      } else {
        notify({
          type: 'warning',
          text: error,
        });
      }
    },

    async getUnassignedAddresses({ commit, rootGetters }, walletId) {
      const { error, data } = await citadel.getUnassignedAddresses(walletId);
      const unassignedAddresses = [];

      if (!error) {
        for (const address of data) {
          const walletInstance =
            rootGetters['wallets/walletByAddress'](address);

          if (walletInstance) {
            walletInstance.assignedTo = address.assignedTo;
            unassignedAddresses.push(walletInstance);
          }
        }

        commit(types.SET_UNASSIGNED_ADDRESSES, unassignedAddresses);
      } else {
        notify({
          type: 'warning',
          text: error,
        });
        commit(types.SET_UNASSIGNED_ADDRESSES, []);
      }
    },

    async getAssignedAddresses({ commit }, walletId) {
      const { error, data } = await citadel.getAssignedAddresses(walletId);

      if (!error) {
        commit(types.SET_ASSIGNED_ADDRESSES, data);
      } else {
        notify({
          type: 'warning',
          text: error,
        });
        commit(types.SET_ASSIGNED_ADDRESSES, []);
      }
    },

    async getTotalClaimedRewardsXCT({ commit, rootGetters }, walletId) {
      if (!rootGetters['wallets/currentWallet'].hasXCT) {
        return;
      }

      const { error, data } = await citadel.callTokenInfo(
        walletId,
        OUR_TOKEN,
        'totalClaimedRewards'
      );

      if (!error) {
        commit(types.SET_TOTAL_CLAIMED_REWARDS_XCT, data);
      } else {
        notify({
          type: 'warning',
          text: error,
        });
      }
    },

    async getRewardsXCT({ commit, rootGetters }, walletId) {
      if (!rootGetters['wallets/currentWallet'].hasXCT) {
        return;
      }

      const { error, data } = await citadel.callTokenInfo(
        walletId,
        OUR_TOKEN,
        'xctRewards'
      );

      if (!error) {
        commit(types.SET_REWARDS_XCT, data.claimable);
      } else {
        notify({
          type: 'warning',
          text: error,
        });
      }
    },

    async getDaoRewardsByRange({ commit }, { walletId, from, to }) {
      const res = await citadel.getDaoRewardsByRange(walletId, from, to);

      if (!res.error) {
        commit(types.SET_REWARDS, res.data);
      } else {
        notify({
          type: 'warning',
          text: res.error,
        });
        commit(types.SET_REWARDS, []);
      }
    },

    async getAllDaoRewards({ commit }, { walletId }) {
      const res = await citadel.getAllDaoRewards(walletId);

      if (!res.error) {
        commit(types.SET_REWARDS, res.data);
      } else {
        notify({
          type: 'warning',
          text: res.error,
        });
        commit(types.SET_REWARDS, []);
      }
    },

    async getCalculatorData({ commit }, { walletId }) {
      const res = await citadel.getDaoCalculatorData(walletId);

      if (!res.error) {
        commit(types.SET_CALCULATOR_DATA, res.data);
      } else {
        notify({
          type: 'warning',
          text: res.error,
        });
        commit(types.SET_CALCULATOR_DATA, []);
      }
    },
  },
};
