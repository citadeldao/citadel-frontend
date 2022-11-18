import { computed } from 'vue';
import types from '@/views/Wallet/views/Transactions/config';

export default function useTransaction(transaction) {
  const type = computed(() => {
    if (!transaction) return types.unknown;
    if (transaction.direction === 'lost' || !transaction.type) {
      return types.unknown;
    }

    if (transaction.isReward) {
      return types.reward;
    }

    if (transaction.to && transaction.from) {
      if (transaction.to.toLowerCase() === transaction.from.toLowerCase()) {
        return types.selfSend;
      }
    }

    if (['vote', 'unvote'].includes(transaction.type)) {
      return types.vote;
    }

    if (transaction.type === 'fees' || transaction.originalOpType === 'fees') {
      return types.fee;
    }

    if (transaction.type === 'transfer' && transaction.direction === 'income') {
      return types.income;
    }

    if (
      transaction.type === 'transfer' &&
      transaction.direction === 'outcome'
    ) {
      return types.outcome;
    }

    return types[transaction.type] || types.undefined;
  });

  return {
    type,
  };
}
