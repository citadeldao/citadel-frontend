import notify from '@/plugins/notify';
import axios from 'axios';

const types = {
  SET_TOKENS: 'SET_TOKENS',
  SET_CHAINS: 'SET_CHAINS',
  SET_ROUTE: 'SET_ROUTE',
  SET_COSMOS_TX: 'SET_COSMOS_TX',
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
    chains: (state) => state.chains,
    route: (state) => state.route,
    cosmosTx: (state) => state.cosmosTx,
  },

  mutations: {
    [types.SET_TOKENS](state, value) {
      state.tokens = value;
    },
    [types.SET_CHAINS](state, value) {
      value.forEach((chain) => {
        if (chain.chainId == 137) {
          chain.nativeCurrency.symbol = 'POL';
        }
      });
      state.chains = value;
    },
    [types.SET_ROUTE](state, value) {
      state.route = value;
    },
    [types.SET_COSMOS_TX](state, value) {
      state.cosmosTx = value;
    },
  },

  actions: {
    async convertToCosmosTx({ commit }, { net, address, data, publicKey }) {
      const result = await axios.post(
        `${process.env.VUE_APP_PUBLIC_BACKEND_URL}/blockchain/${net}/${address}/builder/customTx`,
        {
          data,
          publicKey,
        }
      );

      if (result?.data?.data?.transaction) {
        commit(types.SET_COSMOS_TX, result?.data?.data);
      }
    },
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
        // .filter((ch) => ch.chainType === 'evm')
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
            fromChain: `${fromChain}`,
            toChain: `${toChain}`,
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
