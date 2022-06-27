import router from '@/router';
import { prettyNumber } from '@/helpers/prettyNumber';
import citadel from '@citadeldao/lib-citadel';

const types = {
  SET_INFO: 'SET_INFO',
  SET_SUBSCRIBE_REWARDS: 'SET_SUBSCRIBE_REWARDS',
  SET_MARKETCAPS: 'SET_MARKETCAPS',
  SET_RATES: 'SET_RATES',
};

export default {
  namespaced: true,
  state: {
    info: {
      info: null,
      marketcaps: {},
      rates: {},
    },
  },
  getters: {
    info: (state) => state.info,
    formatYeldByNet: (state) => (net) =>
      prettyNumber(state.marketcaps?.[net]?.yield),
    marketcaps: (state) => state.marketcaps,
    rates: (state) => state.rates,
  },
  mutations: {
    [types.SET_INFO](state, info) {
      state.info = info;
    },
    [types.SET_SUBSCRIBE_REWARDS](state, value) {
      state.info.subscribe_rewards = value;
    },
    [types.SET_MARKETCAPS](state, value) {
      state.marketcaps = value;
    },
    [types.SET_RATES](state, value) {
      state.rates = value;
    },
  },
  actions: {
    async getInfo({ commit, dispatch }) {
      const { data, error } = await citadel.init({
        backendUrl: process.env.VUE_APP_BACKEND_URL,
        debug: JSON.parse(process.env.VUE_APP_DEBUG_LIB),
      });

      if (!error) {
        await dispatch('getMarketcaps');
        await dispatch('getRates');
        dispatch('auth/setIsAuthenticated', true, { root: true });
        const info = {
          ...data.user,
        };
        commit(types.SET_INFO, info);

        return { error };
      }

      dispatch('auth/setIsAuthenticated', false, { root: true });
      router.push({ name: 'Login' });

      return { error };
    },

    async getMarketcaps({ commit }) {
      const { data, error } = await citadel.getAllMarketcaps();
      if (!error) {
        commit(types.SET_MARKETCAPS, data);
      }
    },

    async getRates({ commit }) {
      const { data, error } = await citadel.getAllRates();
      if (!error) {
        commit(types.SET_RATES, data);
      }
    },

    // eslint-disable-next-line no-unused-vars
    async updateMarketcap({ commit }, data) {
      const ifSubtoken = data.net.includes('_');
      console.log('test', ifSubtoken, data.net);
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
