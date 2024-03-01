import notify from '@/plugins/notify';
import axios from 'axios';

const types = {
  SET_TOKENS: 'SET_TOKENS',
  SET_CHAINS: 'SET_CHAINS',
  SET_ROUTE: 'SET_ROUTE',
};

export default {
  namespaced: true,
  state: () => ({
    tokens: [],
    chains: [],
    route: null,
  }),

  getters: {
    tokens: (state) => state.tokens,
    chains: (state) => state.chains,
    route: (state) => state.route,
  },

  mutations: {
    [types.SET_TOKENS](state, value) {
      state.tokens = value;
    },
    [types.SET_CHAINS](state, value) {
      state.chains = value;
    },
    [types.SET_ROUTE](state, value) {
      state.route = value;
    },
  },

  actions: {
    async fetchTokens({ commit }) {
      const result = await axios.get('https://api.0xsquid.com/v1/tokens', {
        headers: {
          accept: 'application/json',
          'x-integrator-id': process.env.VUE_APP_SQUID_KEY,
        },
      });
      if (result?.data?.tokens) {
        commit(
          types.SET_TOKENS,
          result.data.tokens.map((token) => {
            return {
              ...token,
              id: token.address,
              title: token.name,
              key: token.address,
              iconLink: token.logoURI,
              icon: 'curve-arrow',
            };
          })
        );
      } else {
        notify({
          type: 'warning',
          text: `SQUID tokens not loaded.`,
        });
      }
    },

    async fetchChains({ commit }) {
      const result = await axios.get('https://api.0xsquid.com/v1/chains', {
        headers: {
          accept: 'application/json',
          'x-integrator-id': process.env.VUE_APP_SQUID_KEY,
        },
      });
      if (result?.data?.chains) {
        commit(types.SET_CHAINS, result.data.chains);
      } else {
        notify({
          type: 'warning',
          text: `SQUID chains not loaded.`,
        });
      }
    },

    async getRoute(
      { commit },
      {
        fromChain,
        toChain,
        fromToken,
        toToken,
        fromAmount, // mantissa
        fromAddress,
        toAddress,
        // slippage = 2,
      }
    ) {
      const result = await axios.post(
        `https://v2.api.squidrouter.com/v2/route`,
        {
          fromChain,
          toChain,
          fromToken,
          toToken,
          fromAmount, // mantissa
          fromAddress,
          toAddress,
          slippageConfig: {
            autoMode: 1, // 1 is "normal" slippage. Always set to 1
          },
        },
        {
          headers: {
            accept: 'application/json',
            'x-integrator-id': process.env.VUE_APP_SQUID_KEY,
          },
        }
      );
      console.log('GET ROUTE', result.data);
      if (result?.data?.route) {
        commit(types.SET_ROUTE, result.data.route);
      }
    },
    resetRoute({ commit }) {
      commit(types.SET_ROUTE, null);
    },
  },
};
