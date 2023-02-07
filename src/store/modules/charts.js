import moment from 'moment';
import notify from '@/plugins/notify';
import citadel from '@citadeldao/lib-citadel';

const ONE_DAY_MS = 86400000;
const ONE_MONTH_DAYS_COUNT = 30;

const types = {
  SET_CHART_LOADING: 'SET_CHART_LOADING',
  SET_CHART_DATA: 'SET_CHART_DATA',
};

const REWARDS_METHOD = 'getGraphRewardsSummary';
const BALANCE_METHOD = 'getBalanceHistory';

const ALL = 'all';
const CUSTOM = 'custom';

const sendCitadelGraphRequest = async (method, params) => {
  return await citadel[method](params);
};

export default {
  namespaced: true,

  state: () => ({
    // Charts data may contain data for each custom list and each period of time
    charts: {
      balanceHistory: {
        all: {},
      },
      balanceHistoryExpanded: {
        all: {},
      },
      rewardsChart: {
        all: {},
      },
      rewardsChartExpanded: {
        all: {},
      },
    },
    loading: {
      balanceHistory: false,
      balanceHistoryExpanded: false,
      rewardsChart: false,
      rewardsChartExpanded: false,
    },
  }),

  getters: {
    getCharts:
      (state) =>
      (target, list, period = 1) =>
        state.charts[target][list][period],
    isLoading: (state) => (target) => state.loading[target],
  },

  mutations: {
    [types.SET_CHART_DATA](state, { list, data, period, target }) {
      if (!state.charts[target]) {
        state.charts[target] = {};
      }

      if (!state.charts[target][list]) {
        state.charts[target][list] = {};
      }
      if (period !== CUSTOM) {
        delete state.charts[target][list][CUSTOM];
      }

      state.charts[target][list][period] = data;
    },

    [types.SET_CHART_LOADING](state, { target, isLoading }) {
      state.loading[target] = isLoading;
    },
  },
  actions: {
    async fetchChartData(
      { commit, rootGetters },
      { months = 1, dateFrom, dateTo, list, target = 'rewardsChart' }
    ) {
      await commit(types.SET_CHART_LOADING, {
        target,
        isLoading: true,
      });

      const periods = [ALL, CUSTOM];

      // Assigning a method name by the ID of the chart canvas
      const METHOD = target.startsWith('rewards')
        ? REWARDS_METHOD
        : BALANCE_METHOD;

      const isNotCustomDates = !(dateFrom && dateTo);

      let from = dateFrom;

      const listId = list === ALL ? undefined : list;

      // If the date is not "custom" and not "all", we assign it a new value of the period by month
      if (isNotCustomDates && !periods.includes(months)) {
        const days = months * ONE_MONTH_DAYS_COUNT;
        const period = ONE_DAY_MS * days;

        from = Number(new Date(Number(new Date()) - period));
      }

      // Resetting custom period data
      if (isNotCustomDates && months === CUSTOM) {
        await commit(types.SET_CHART_DATA, {
          list,
          data: undefined,
          period: CUSTOM,
          target,
        });

        commit(types.SET_CHART_LOADING, {
          target,
          isLoading: false,
        });

        return { data: [], error: null };
      }

      const params = {
        dateFrom: from,
        dateTo,
        listId,
      };

      const { data, error } = await sendCitadelGraphRequest(METHOD, params);

      if (!error) {
        const todayDate = moment().format('YYYY-MM-DD');

        if ((METHOD !== REWARDS_METHOD && !dateTo) || dateTo === todayDate) {
          data.list[todayDate] = {
            usd: rootGetters['balance/usdWithTokens'],
            btc: rootGetters['balance/btc'],
          };
        }

        commit(types.SET_CHART_DATA, {
          list,
          data,
          period: dateFrom ? CUSTOM : months,
          target,
        });

        commit(types.SET_CHART_LOADING, {
          target,
          isLoading: false,
        });

        return { data, error: null };
      }

      commit(types.SET_CHART_LOADING, {
        target,
        isLoading: false,
      });

      notify({
        type: 'warning',
        text: error,
      });

      return {
        data: null,
        error: error,
      };
    },
  },
};
