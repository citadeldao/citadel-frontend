import notify from '@/plugins/notify';
import citadel from '@citadeldao/lib-citadel';

const types = {
  SET_PRIVATE_SALE: 'SET_PRIVATE_SALE',
  SET_PREPARE_PRIVATE_CLAIM: 'SET_PREPARE_PRIVATE_CLAIM',
  SET_PREPARE_TRANSFER_FUND: 'SET_PREPARE_TRANSFER_FUND',
  SET_BALANCE_FUND: 'SET_BALANCE_FUND',
};

export default {
  namespaced: true,
  state: () => ({
    preparePrivateClaim: null,
    prepareTransferFund: null,
    privateSaleInfo: {
      total: 0,
      used: 0,
      pending: 0,
    },
    balanceFundInfo: {
      total: 0,
      used: 0,
      pending: 0,
    },
  }),

  getters: {
    privateSaleInfo: state => state.privateSaleInfo,
    preparePrivateClaim: state => state.preparePrivateClaim,
    prepareTransferFund: state => state.prepareTransferFund,
    balanceFundInfo: state => state.balanceFundInfo,
  },

  mutations: {
    [types.SET_PRIVATE_SALE](state, value) {
      state.privateSaleInfo = value;
    },
    [types.SET_PREPARE_PRIVATE_CLAIM](state, value) {
      state.preparePrivateClaim = value;
    },
    [types.SET_BALANCE_FUND](state, value) {
      state.balanceFundInfo = value;
    },
    [types.SET_PREPARE_TRANSFER_FUND](state, value) {
      state.prepareTransferFund = value;
    },
  },

  actions: {
    async getPreparePrivateClaim({ commit }, { address, category }) {
      const { data, error } = await citadel.getPreparePrivateClaim(address, category);

      if (!error) {
        commit(types.SET_PREPARE_PRIVATE_CLAIM, data);
      } else {
        notify({
          type: 'warning',
          text: error,
        });
      }
    },
    async getPrivateSaleInfo({ commit }, { address, category }) {
      const { data, error } = await citadel.getPrivateSale(address, category);

      if (!error) {
        commit(types.SET_PRIVATE_SALE, data);
      } else {
        notify({
          type: 'warning',
          text: error,
        });
      }
    },
    async getBalanceFundInfo({ commit }, { address, category }) {
      const { data, error } = await citadel.getBalanceFund(address, category);

      if (!error) {
        commit(types.SET_BALANCE_FUND, data);
      } else {
        notify({
          type: 'warning',
          text: error,
        });
      }
    },
    async getPrepareTransferFund({ commit }, { address, category, amount, recipient }) {
      const { data, error } = await citadel.getPrepareTransferFund(address, category, amount, recipient);

      if (!error) {
        commit(types.SET_PREPARE_TRANSFER_FUND, data);
      } else {
        notify({
          type: 'warning',
          text: error,
        });
      }
    },
  },
};
