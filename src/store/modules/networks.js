//import models from '@/models';
import notify from '@/plugins/notify';
import citadel from '@citadeldao/lib-citadel';

const types = {
  SET_CONFIG: 'SET_CONFIG',
};

const IGNORE_ERROR = 'Request failed with status code 404';

export default {
  namespaced: true,
  state: () => ({
    config: {},
  }),

  getters: {
    config: (state) => state.config,
    configByNet: (state) => (net) => state.config[net],
    networksList: (state) =>
      Object.values(state.config)
        // .filter((network) => models[network.net.toUpperCase()])
        .sort((a, b) =>
          a.name?.toUpperCase() > b.name?.toUpperCase() ? 1 : -1
        ),
    getSubtokensByNet: (state) => (net) => {
      const data = [];

      for (const item in state.config[net].tokens) {
        data.push({ net: item, ...state.config[net].tokens[item] });
      }

      return data;
    },
  },

  mutations: {
    [types.SET_CONFIG](state, config) {
      for (const item in config) {
        config[item] = {
          ...config[item],
        };
      }

      state.config = config;
    },
  },

  actions: {
    async loadConfig({ commit }) {
      const { error, data } = await citadel.getAllNetworksConfig();

      if (!error) {
        commit(types.SET_CONFIG, data);
      } else {
        notify({
          type: 'warning',
          text: error,
        });
      }
    },

    async getCurrencyHistoryByRange(_, { net, from, to }) {
      const { data, error } = await citadel.getCurrencyHistoryByRange(
        net,
        from,
        to
      );

      if (!error) {
        return { data, error: null };
      }

      if (error.message !== IGNORE_ERROR) {
        notify({
          type: 'warning',
          text: error,
        });
      }

      return { data: null, error: error };
    },
  },
};
