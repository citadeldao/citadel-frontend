import moment from 'moment';
import notify from '@/plugins/notify';
import citadel from '@citadeldao/lib-citadel';

const types = {
  SET_CHART_LOADING: 'SET_CHART_LOADING',
  SET_CHART_DATA: 'SET_CHART_DATA',
  RESET_DATA: 'RESET_DATA',
};

const REWARDS_METHOD = 'getGraphRewardsSummary';
const BALANCE_METHOD = 'getBalanceHistory';
const RATES_METHOD = 'getCurrencyHistoryByRange';

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
      rateHistory: {
        all: {},
      },
    },
    loading: {
      balanceHistory: false,
      balanceHistoryExpanded: false,
      rewardsChart: false,
      rewardsChartExpanded: false,
      rateHistory: false,
    },
  }),

  getters: {
    getCharts:
      (state) =>
      (target, list, period = 1, fiat) => {
        const chartByList = state.charts[target][list];
        if (!chartByList || !chartByList[period]) return undefined;
        if (fiat) {
          return chartByList[period][fiat];
        } else {
          return chartByList[period];
        }
      },
    isLoading: (state) => (target) => state.loading[target],
  },

  mutations: {
    [types.RESET_DATA](state, key) {
      state.charts[key] = { all: {} };
    },
    [types.SET_CHART_DATA](state, { list, data, period, target, fiat }) {
      if (!state.charts[target]) {
        state.charts[target] = {};
      }

      if (!state.charts[target][list]) {
        state.charts[target][list] = {};
      }
      if (period !== CUSTOM) {
        delete state.charts[target][list][CUSTOM];
      }
      if (fiat) {
        state.charts[target][list][period] = {};
        state.charts[target][list][period][fiat] = data;
      } else {
        state.charts[target][list][period] = data;
      }
    },

    [types.SET_CHART_LOADING](state, { target, isLoading }) {
      state.loading[target] = isLoading;
    },
  },
  actions: {
    async fetchChartData(
      { commit /* , rootGetters */ },
      { months = 1, dateFrom, dateTo, list, target = 'rewardsChart', net, fiat }
    ) {
      await commit(types.SET_CHART_LOADING, {
        target,
        isLoading: true,
      });

      const periods = [ALL, CUSTOM];

      // Assigning a method name by the ID of the chart canvas
      const METHOD = target.startsWith('rewards')
        ? REWARDS_METHOD
        : target.startsWith('balance')
        ? BALANCE_METHOD
        : RATES_METHOD;

      const isNotCustomDates = !(dateFrom && dateTo);

      let from = dateFrom;

      const listId = list === ALL ? undefined : list;

      // If the date is not "custom" and not "all", we assign it a new value of the period by month
      if (isNotCustomDates && !periods.includes(months)) {
        const time = new Date();
        time.setHours(0, 0, 0);
        time.setMonth(time.getMonth() - months);
        from = Number(time);
      }

      // Resetting custom period data
      if (isNotCustomDates && months === CUSTOM) {
        await commit(types.SET_CHART_DATA, {
          list,
          data: undefined,
          period: CUSTOM,
          target,
          fiat,
        });

        commit(types.SET_CHART_LOADING, {
          target,
          isLoading: false,
        });

        return { data: [], error: null };
      }

      const params = {
        dateFrom: from,
        dateTo: dateTo,
        listId,
        net: net || '',
        fiat,
      };

      if (params.dateFrom) {
        params.dateFrom = moment(params.dateFrom).format('YYYY-MM-DD');
      }
      if (params.dateTo) {
        params.dateTo = moment(params.dateTo).format('YYYY-MM-DD');
      }
      console.log('chart params', params);

      const { data, error } = await sendCitadelGraphRequest(METHOD, params);

      if (!error) {
        // const todayDate = moment().format('YYYY-MM-DD');

        // if ((METHOD !== REWARDS_METHOD && !dateTo) || dateTo === todayDate) {
        //   data.list[todayDate] = {
        //     usd: rootGetters['balance/usdWithTokens'],
        //     btc: rootGetters['balance/btc'],
        //   };
        // }

        commit(types.SET_CHART_DATA, {
          list,
          data,
          period: dateFrom ? CUSTOM : months,
          target,
          fiat,
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
    resetData({ commit }, key) {
      commit(types.RESET_DATA, key);
    },
  },
};
