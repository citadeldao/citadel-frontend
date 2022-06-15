import useApi from '@/api/useApi';
import citadel from '@citadeldao/lib-citadel';
import notify from '@/plugins/notify';
import { findWalletInArray } from '@/helpers';
import useWallets from '@/compositions/useWallets';

const api = useApi('transactions');
const types = {
  SET_TRANSACTIONS: 'SET_TRANSACTIONS',
  SET_IS_TRANSACTIONS_LOADING: 'SET_IS_TRANSACTIONS_LOADING',
  SET_TRANSACTIONS_COUNT: 'SET_TRANSACTIONS_COUNT',
  SET_MEMPOOL: 'SET_MEMPOOL',
  ADD_TO_MEMPOOL: 'ADD_TO_MEMPOOL',
  REMOVE_FROM_MEMPOOL: 'REMOVE_FROM_MEMPOOL',
};

export default {
  namespaced: true,
  state: () => ({
    transactions: null,
    isTransactionsLoading: false,
    transactionsCount: 0,
    mempool: [],
  }),

  getters: {
    transactions: (state) =>
      state.transactions?.map(
        ({
          type,
          direction,
          isCanceled,
          isReward,
          originalOpType,
          ...rest
        }) => ({
          ...rest,
          type,
          direction,
          isCanceled,
          isReward,
          originalOpType,
          status: {},
        })
      ),
    isTransactionsLoading: (state) => state.isTransactionsLoading,
    transactionsCount: (state) => state.transactionsCount,
    mempool: (state) => state.mempool,
  },

  mutations: {
    [types.SET_TRANSACTIONS](state, transactions) {
      state.transactions = transactions;
    },
    [types.SET_IS_TRANSACTIONS_LOADING](state, value) {
      state.isTransactionsLoading = value;
    },
    [types.SET_TRANSACTIONS_COUNT](state, count) {
      state.transactionsCount = count;
    },
    [types.SET_MEMPOOL](state, mempool) {
      // saving txs in state
      for (const tx of mempool) {
        const found = state.mempool.find(
          (stateTx) =>
            tx.hash === stateTx.hash &&
            tx.net === stateTx.net &&
            tx.direction === stateTx.direction
        );

        if (!found) {
          state.mempool.push(tx);
        }
      }
    },
    [types.ADD_TO_MEMPOOL](state, tx) {
      const found = state.mempool.find(
        (mempoolTx) =>
          tx.hash === mempoolTx.hash &&
          tx.net === mempoolTx.net &&
          tx.direction === mempoolTx.direction
      );

      if (!found) {
        state.mempool.push(tx);
      }
    },
    [types.REMOVE_FROM_MEMPOOL](state, tx) {
      state.mempool = state.mempool.filter(
        (c) =>
          !(c.hash === tx.hash) &&
          !(c.net === tx.net) &&
          !(c.direction === tx.direction)
      );
    },
  },

  actions: {
    async getTransactions({ commit }, { walletId, ...options }) {
      commit(types.SET_TRANSACTIONS, null);
      commit(types.SET_IS_TRANSACTIONS_LOADING, true);
      const { data, error } = await citadel.getTransactionsById(
        walletId,
        options
      );

      if (!error) {
        commit(types.SET_TRANSACTIONS, data.list);
        commit(types.SET_IS_TRANSACTIONS_LOADING, false);
        commit(types.SET_TRANSACTIONS_COUNT, data.count);
      } else {
        notify({
          type: 'warning',
          text: error,
        });
        commit(types.SET_TRANSACTIONS, []);
        commit(types.SET_IS_TRANSACTIONS_LOADING, false);
      }
    },
    async postTransactionNote(_, { network, hash, text }) {
      const { error } = await citadel.postTransactionNote(
        network.toLowerCase(),
        hash,
        text
      );

      if (error) {
        notify({
          type: 'warning',
          text: error,
        });
      }
    },

    async getMempool({ commit }) {
      try {
        const data = await api.getMempool();

        if (!data.ok) {
          throw data.error;
        }

        const txs = [];
        const { wallets: walletList } = useWallets();

        for (const tx of data.data) {
          if (
            findWalletInArray(walletList.value, {
              address: tx.from,
              net: tx.net,
            }) &&
            findWalletInArray(walletList.value, { address: tx.to, net: tx.net })
          ) {
            txs.push({ ...tx, direction: 'income' });
            txs.push({ ...tx, direction: 'outcome' });
          } else {
            txs.push(tx);
          }
        }

        commit('transactions/SET_MEMPOOL', txs, { root: true });
      } catch (err) {
        console.error(err);
      }
    },
  },
};
