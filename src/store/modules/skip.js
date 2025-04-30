import notify from '@/plugins/notify';
import axios from 'axios';

const types = {
  SET_CHAINS: 'SET_CHAINS',
  SET_TOKENS: 'SET_TOKENS',
  SET_COSMOS_TX: 'SET_COSMOS_TX',
  SET_ROUTE: 'SET_ROUTE',
  SET_ASSETS: 'SET_ASSETS',
  SET_SLIPPAGE: 'SET_SLIPPAGE',
};

export default {
  namespaced: true,
  state: () => ({
    chains: [],
    tokens: [],
    cosmosTx: null,
    route: null,
    assets: {},
    slippage: 0.5,
  }),

  getters: {
    chains: (state) => state.chains,
    tokens: (state) => state.tokens,
    cosmosTx: (state) => state.cosmosTx,
    route: (state) => state.route,
    assets: (state) => state.assets,
    slippage: (state) => state.slippage,
  },

  mutations: {
    [types.SET_CHAINS](state, value) {
      state.chains = value;
    },
    [types.SET_TOKENS](state, value) {
      state.tokens = value;
    },
    [types.SET_COSMOS_TX](state, value) {
      state.cosmosTx = value;
    },
    [types.SET_ROUTE](state, value) {
      state.route = value;
    },
    [types.SET_ASSETS](state, value) {
      state.assets = value;
    },
    [types.SET_SLIPPAGE](state, value) {
      state.slippage = value;
    },
  },

  actions: {
    setSlippage({ commit }, val) {
      commit(types.SET_SLIPPAGE, val);
    },
    resetRoute({ commit }) {
      commit(types.SET_ROUTE, null);
    },
    async fetchChains({ commit }) {
      const result = await axios.get('https://api.skip.money/v1/info/chains');

      if (result && result.data && result.data.chains) {
        commit(types.SET_CHAINS, result.data.chains);
      }
    },
    async convertToCosmosTx({ commit }, { net, address, data, publicKey }) {
      // 'https://api.3ahtim54r.ru'
      // process.env.VUE_APP_PUBLIC_BACKEND_URL
      const result = await axios.post(
        `${'https://api.3ahtim54r.ru'}/blockchain/${net}/${address}/builder/customTx`,
        {
          data,
          publicKey,
        }
      );

      if (result?.data?.data?.transaction) {
        commit(types.SET_COSMOS_TX, result?.data?.data);
      }
    },
    async fetchAssets({ commit }) {
      let result;

      try {
        result = await axios.get(`https://api.skip.build/v2/fungible/assets`);

        if (result.data && result.data.chain_to_assets_map) {
          commit(types.SET_ASSETS, result.data.chain_to_assets_map);
        }
      } catch (err) {
        notify({
          type: 'warning',
          text: err.response.data.message,
        });
        return;
      }
    },
    async getRoute({ commit, dispatch }, options = {}) {
      let result;

      try {
        result = await axios.post(
          `https://api.skip.money/v2/fungible/route`,
          {
            amount_in: options.amount,
            dest_asset_chain_id: options.toChain,
            dest_asset_denom: options.toDenom,
            source_asset_chain_id: options.fromChain,
            source_asset_denom: options.fromDenom,
          },
          {
            headers: {
              accept: 'application/json',
              'content-type': 'application/json',
            },
          }
        );

        if (result && result.data && result.data.operations) {
          commit(types.SET_ROUTE, result.data);
          let resultMSG;
          try {
            resultMSG = await axios.post(
              `https://api.skip.money/v2/fungible/msgs`,
              {
                address_list:
                  result.data.chain_ids.length === 2
                    ? [options.fromAddress, options.toAddress]
                    : [
                        options.fromAddress,
                        options.osmosisAddress,
                        options.toAddress,
                      ],
                slippage_tolerance_percent: `${options.slippage}`,
                amount_out: result.data.amount_out,
                operations: result.data.operations,
                amount_in: options.amount,
                dest_asset_chain_id: options.toChain,
                dest_asset_denom: options.toDenom,
                source_asset_chain_id: options.fromChain,
                source_asset_denom: options.fromDenom,
              },
              {
                headers: {
                  accept: 'application/json',
                  'content-type': 'application/json',
                },
              }
            );

            if (resultMSG?.data?.txs[0]?.cosmos_tx?.msgs[0].msg) {
              const msg = JSON.parse(
                resultMSG?.data?.txs[0]?.cosmos_tx?.msgs[0].msg
              );

              if (msg.timeout_timestamp) {
                msg.timeout_timestamp = `${msg.timeout_timestamp}`;
              }

              try {
                await dispatch('convertToCosmosTx', {
                  net: options?.wallet?.net,
                  address: options.fromAddress,
                  publicKey: options?.wallet?.publicKey,
                  data: [
                    {
                      type: resultMSG?.data?.txs[0]?.cosmos_tx?.msgs[0]
                        .msg_type_url,
                      value: msg,
                    },
                  ],
                });
              } catch (err) {
                notify({
                  type: 'warning',
                  text: err.response.data.error,
                });
                return;
              }
            }
          } catch (err) {
            notify({
              type: 'warning',
              text: err.response.data.message,
            });
            return;
          }
        }
      } catch (err) {
        notify({
          type: 'warning',
          text: err.response.data.message,
        });
        return;
      }
    },
    async fetchTokens({ commit }, { fromChain, toChain }) {
      let result;

      try {
        result = await axios.post(
          `https://api.skip.money/v2/fungible/assets_between_chains`,
          {
            include_no_metadata_assets: false,
            include_cw20_assets: false,
            include_evm_assets: false,
            allow_multi_tx: false,
            source_chain_id: fromChain,
            dest_chain_id: toChain,
          },
          {
            headers: {
              accept: 'application/json',
              'content-type': 'application/json',
            },
          }
        );

        if (result && result.data && result.data.assets_between_chains) {
          commit(types.SET_TOKENS, result.data.assets_between_chains);
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};
