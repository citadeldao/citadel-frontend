import router from '@/router';
import { prettyNumber } from '@/helpers/prettyNumber';
import citadel from '@citadeldao/lib-citadel';

const types = {
  SET_INFO: 'SET_INFO',
  SET_SUBSCRIBE_REWARDS: 'SET_SUBSCRIBE_REWARDS',
};

export default {
  namespaced: true,
  state: {
    info: {
      info: null,
    },
  },
  getters: {
    info: state => state.info,
    formatYeldByNet: (state) => (net) => prettyNumber(state.info?.marketcap?.[net]?.yield),
  },
  mutations: {
    [types.SET_INFO](state, info) {
      state.info = info;
    },
    [types.SET_SUBSCRIBE_REWARDS](state, value) {
      state.info.subscribe_rewards = value;
    },
  },
  actions: {
    async getInfo({ commit, dispatch }) {
      const { data, error } = await citadel.init({
        backendUrl: process.env.VUE_APP_BACKEND_URL,
        debug: JSON.parse(process.env.VUE_APP_DEBUG_LIB),
      });
      if (!error) {
        const { data: marketcap } = await citadel.getAllMarketcaps();
        const { data: rates } = await citadel.getAllRates();
        dispatch('auth/setIsAuthenticated', true, { root: true });
        const info = {
          ...data.user,
          marketcap,
          rates,
        };
        commit(types.SET_INFO, info);

        return { error };
      }
      dispatch('auth/setIsAuthenticated', false, { root: true });
      router.push({ name: 'Login' });

      return { error };
    },

    async changeSubscribeRewards({ commit }, newValue) {
      const res = await citadel.subscribeRewards(newValue);

      if (!res.error) {
        commit(types.SET_SUBSCRIBE_REWARDS, newValue);

        return { ok: true, error: res.error };
      }

      return { ok: false, error: res.error };
    },
  },
};
