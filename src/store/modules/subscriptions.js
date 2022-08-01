import citadel from '@citadeldao/lib-citadel';
import notify from '@/plugins/notify';

const types = {
  SET_SUBSCRIPTIONS: 'SET_SUBSCRIPTIONS',
};

export default {
  namespaced: true,

  state: () => ({
    subscriptions: {
      rewardsDigest: false,
      newsletter: false,
    },
  }),

  getters: {
    subscriptions: (state) => state.subscriptions,
  },

  mutations: {
    [types.SET_SUBSCRIPTIONS](state, subscriptionItems) {
      state.subscriptions = subscriptionItems;
    },
  },

  actions: {
    async getSubscriptions({ commit }) {
      const { data, error } = await citadel.getSubscriptions();

      if (!error) {
        commit(types.SET_SUBSCRIPTIONS, data);
      } else {
        notify({
          type: 'warning',
          text: error,
        });
      }
    },

    async updateSubscriptions({ rewardsDigest, newsletter }) {
      const { error } = await citadel.manageSubscriptions({
        rewardsDigest,
        newsletter,
      });

      if (!error) {
        this.getSubscriptions();
      } else {
        notify({
          type: 'warning',
          text: error,
        });
      }
    },
  },
};
