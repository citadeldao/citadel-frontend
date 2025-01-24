import notify from '@/plugins/notify';
import axios from 'axios';

const types = {
  SET_TOKENS: 'SET_TOKENS',
  SET_ROUTE: 'SET_ROUTE',
};

export default {
  namespaced: true,
  state: () => ({
    tokens: [],
    chains: [],
    route: null,
    cosmosTx: null,
  }),

  getters: {
    tokens: (state) => state.tokens,
    route: (state) => state.route,
  },

  mutations: {
    [types.SET_TOKENS](state, value) {
      state.tokens = value;
    },
    [types.SET_ROUTE](state, value) {
      state.route = value;
    },
  },

  actions: {
    async fetchTokens({ commit }) {
      const result = await axios.get(
        'https://tokens.jup.ag/tokens?tags=verified'
      );

      if (result.status === 200 && result.data) {
        commit(
          types.SET_TOKENS,
          result.data.map((token) => {
            return {
              ...token,
              id: token.address,
              title: `${token.name} (${token.address.slice(
                0,
                5
              )}...${token.address.slice(-5)})`,
              key: token.address,
              iconLink: token.logoURI,
              icon: 'curve-arrow',
            };
          })
        );
      } else {
        notify({
          type: 'warning',
          text: `JUPITER tokens not loaded.`,
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
        slippage,
        fallbackAddresses,
        // isEvm, // choose route type
      }
    ) {
      let result;

      try {
        result = await axios.post(
          `https://v2.api.squidrouter.com/v2/route`,
          {
            fromChain,
            toChain,
            fromToken,
            toToken,
            fromAmount, // mantissa
            fromAddress,
            toAddress,
            // slippage,
            slippageConfig: {
              slippage,
              autoMode: 1,
            },
          },
          {
            headers: {
              accept: 'application/json',
              'x-integrator-id': process.env.VUE_APP_SQUID_KEY,
            },
          }
        );
      } catch (err) {
        try {
          result = await axios.get(`https://api.0xsquid.com/v1/route`, {
            params: {
              fromChain,
              toChain,
              fromToken,
              toToken,
              fromAmount, // mantissa
              fromAddress,
              toAddress,
              slippage,
              fallbackAddresses,
            },
            headers: {
              accept: 'application/json',
              'x-integrator-id': process.env.VUE_APP_SQUID_KEY,
            },
          });
        } catch (err) {
          console.log(err);
          if (err.response) {
            notify({
              type: 'warning',
              text: `${err?.response?.data?.errors[0]?.errorType}: ${err?.response?.data?.errors[0]?.message}`,
            });
          }
          return;
        }
      }

      if (result?.data?.route) {
        commit(types.SET_ROUTE, result.data.route);
      }
    },
    resetRoute({ commit }) {
      commit(types.SET_ROUTE, null);
    },
  },
};
