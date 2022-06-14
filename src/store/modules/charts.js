import moment from 'moment';
import notify from '@/plugins/notify';
import citadel from '@citadeldao/lib-citadel';

const types = {
  SET_BALANCE_HISTORY: 'SET_BALANCE_HISTORY',
  SET_REWARDS_CHART: 'SET_REWARDS_CHART',
};

export default {
  namespaced: true,
  state: () => ({
    // balanceHistory may contain data for each custom list and each period of time
    balanceHistory: {
      all: {},
    },
    rewardsChart: {},
  }),
  getters: {
    balanceHistory: (state) => state.balanceHistory,
    rewardsChart: (state) => state.rewardsChart,
  },
  mutations: {
    [types.SET_BALANCE_HISTORY](state, { list, blncHistory, period }) {
      if (!state.balanceHistory[list]) {
        state.balanceHistory[list] = {};
      }

      state.balanceHistory[list][period] = blncHistory;
    },
    [types.SET_REWARDS_CHART](state, { list, rewards, period }) {
      if (!state.rewardsChart[list]) {
        state.rewardsChart[list] = {};
      }

      state.rewardsChart[list][period] = rewards;
    },
  },
  actions: {
    // dateFrom and dateTo is send only on custom dates
    async getBalanceHistory(
      { commit, rootGetters },
      { list, months = 1, dateFrom, dateTo }
    ) {
      const days = months * 30;
      const period = 86400000 * days;

      const res = await citadel.getBalanceHistory({
        dateFrom: dateFrom
          ? dateFrom
          : months === 'all'
          ? undefined
          : Number(new Date(Number(new Date()) - period)),
        dateTo,
        listId: list === 'all' ? undefined : list,
      });
      const todayDate = moment().format('YYYY-MM-DD');

      if (!dateTo || dateTo === todayDate) {
        res.data.list[todayDate] = {
          usd: rootGetters['balance/usdWithTokens'],
          btc: rootGetters['balance/btc'],
        };
      }

      if (!res.error) {
        commit(types.SET_BALANCE_HISTORY, {
          list,
          blncHistory: res.data,
          period: dateFrom ? 'custom' : months,
        });

        return { balanceHistory: res.data, error: null };
      }

      notify({
        type: 'warning',
        text: res.error,
      });

      return { balanceHistory: null, error: res.error };
    },
    // dateFrom and dateTo is send only on custom dates
    async getRewardsChart({ commit }, { months = 1, dateFrom, dateTo, list }) {
      const days = months * 30;
      const period = 86400000 * days;
      const res = await citadel.getGraphRewardsSummary({
        dateFrom: dateFrom
          ? dateFrom
          : months === 'all'
          ? undefined
          : Number(new Date(Number(new Date()) - period)),
        dateTo,
        listId: list === 'all' ? undefined : list,
      });

      if (!res.error) {
        commit(types.SET_REWARDS_CHART, {
          list,
          rewards: res.data,
          period: dateFrom ? 'custom' : months,
        });

        return { rewardsChart: res.data, error: null };
      }

      notify({
        type: 'warning',
        text: res.error,
      });

      return {
        rewardsChart: null,
        error: res.error,
      };
    },
  },
};
