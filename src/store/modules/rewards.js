import { sortByAlphabet } from '@/helpers';
import notify from '@/plugins/notify';
import citadel from '@citadeldao/lib-citadel';


const types = {
  SET_REWARDS: 'SET_REWARDS',
  SET_REWARDS_BY_RANGE: 'SET_REWARDS_BY_RANGE',
  SET_TOTAL: 'SET_TOTAL',
  SET_DATE: 'SET_DATE',

};

export default {
  namespaced: true,
  state: () => ({
    rewards: [],
    rewardsByRange: {},
    total: 0,
    date: {
      from: '',
      to: '',
    },
  }),

  getters: {
    rewards: state => (sortByAlphabet(state.rewards, 'net')),
    total: state => state.total,
    rewardsByRange: state => state.rewardsByRange,
    date: state => state.date,
  },

  mutations: {
    [types.SET_REWARDS](state, rewards) {
      state.rewards = rewards;
    },
    [types.SET_REWARDS_BY_RANGE](state, rewards) {
      state.rewardsByRange = rewards;
    },
    [types.SET_TOTAL](state, total) {
      state.total = total;
    },
    [types.SET_DATE](state, { from, to }) {
      state.date = { from, to };
    },


  },

  actions: {
    async getRewards({ commit }) {
      const { data, error } = await citadel.getRewards();
      if (!error) {
        commit(types.SET_REWARDS, data.claims);
        commit(types.SET_TOTAL, data.total);
        commit(types.SET_DATE, { from: data.rewards.date_from, to: data.rewards.date_to });
      }else{
        notify({
          type: 'warning',
          text: error,
        });
      }
    },
    async getRewardsByRange({ commit }, { from, to }) {
      const { data, error } = await citadel.getRewardsByRange(from, to );
      if (!error) {
        commit(types.SET_REWARDS_BY_RANGE, data);
      }else{
        notify({
          type: 'warning',
          text: error,
        });
        commit(types.SET_REWARDS_BY_RANGE, {});
      }
    },
    async getAllRewards({ commit }) {
      const { data, error } = await citadel.getAllRewards();
      if (!error) {
        commit(types.SET_REWARDS_BY_RANGE, data);
      }else{
        notify({
          type: 'warning',
          text: error,
        });
        commit(types.SET_REWARDS_BY_RANGE, {});
      }
    },
  },
};
