import notify from '@/plugins/notify';
import axios from 'axios';

const types = {
  SET_TOKENS: 'SET_TOKENS',
  SET_ROUTE: 'SET_ROUTE',
  SET_TX: 'SET_TX',
  SET_SLIPPAGE: 'SET_SLIPPAGE',
};

export default {
  namespaced: true,
  state: () => ({
    tokens: [],
    chains: [],
    route: null,
    tx: null,
    slippage: 0.5,
  }),

  getters: {
    tokens: (state) => state.tokens,
    route: (state) => state.route,
    tx: (state) => state.tx,
    slippage: (state) => state.slippage,
  },

  mutations: {
    [types.SET_TOKENS](state, value) {
      state.tokens = value;
    },
    [types.SET_ROUTE](state, value) {
      state.route = value;
    },
    [types.SET_TX](state, value) {
      state.tx = value;
    },
    [types.SET_SLIPPAGE](state, value) {
      state.slippage = value;
    },
  },

  actions: {
    setSlippage({ commit }, val) {
      commit(types.SET_SLIPPAGE, val);
    },
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
      { inputMint, outputMint, amount, slippageBps = 100, publicKey }
    ) {
      let result;
      try {
        result = await axios.get(`https://api.jup.ag/swap/v1/quote`, {
          params: {
            inputMint,
            outputMint,
            amount,
            slippageBps,
            restrictIntermediateTokens: true,
          },
          headers: {
            accept: 'application/json',
            // 'x-integrator-id': process.env.VUE_APP_SQUID_KEY,
          },
        });

        if (result.data) {
          commit(types.SET_ROUTE, result.data);
          const tx = await axios.post(
            `https://api.jup.ag/swap/v1/swap`,

            {
              quoteResponse: result.data,
              userPublicKey: publicKey,

              // ADDITIONAL PARAMETERS TO OPTIMIZE FOR TRANSACTION LANDING
              // See next guide to optimize for transaction landing
              dynamicComputeUnitLimit: true,
              dynamicSlippage: true,
              prioritizationFeeLamports: {
                priorityLevelWithMaxLamports: {
                  maxLamports: 1000000,
                  priorityLevel: 'veryHigh',
                },
              },
            },
            {
              headers: {
                accept: 'application/json',
                'content-type': 'application/json',
              },
            }
          );
          if (tx.data && tx.data.simulationError) {
            notify({
              type: 'warning',
              text: `${tx.data.simulationError?.errorCode}: ${tx.data.simulationError?.error}`,
            });
            return {
              error: true,
            };
          }
          if (tx.data && tx.data.swapTransaction) {
            commit(types.SET_TX, tx.data && tx.data.swapTransaction);
            return { success: true };
          } else {
            notify({
              type: 'warning',
              text: `Transaction not found`,
            });
            return {
              error: true,
            };
          }
        }
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
    },
    resetRoute({ commit }) {
      commit(types.SET_ROUTE, null);
    },
  },
};
