<template>
  <div class="balance-end-pledged">
    <div class="balance-end-pledged__balance">
      <Balance
        :current-wallet="currentWallet"
        :currency="currency"
        :is-current-token="isCurrentToken"
        :pledged-balance="pledgedBalance"
      />
    </div>
    <div
      v-if="currentWallet.hasPledged"
      class="balance-end-pledged__pledged"
    >
      <PledgedBalance
        :current-wallet="currentWallet"
        :pledged-balance="pledgedBalance"
      />
    </div>
  </div>
</template>

<script>
import Balance from './Balance.vue';
import PledgedBalance from './PledgedBalance';
import useIostProps from '@/compositions/useIostProps.js';
import usePledge from '@/compositions/usePledge.js';

export default {
  components: { Balance, PledgedBalance },
  props: {
    currentWallet: {
      type: Object,
      default: () => ({}),
    },
    currency: {
      type: Object,
      default: () => ({}),
    },
    isCurrentToken: {
      type: Boolean,
      default: false,
    },
  },
  nmae: 'BalanceAndPledged',
  setup() {
    usePledge();
    const { pledgedBalance } = useIostProps();

    return { pledgedBalance };
  },
};
</script>

<style lang="scss" scoped>
.balance-end-pledged {
  &__balance {
    margin-bottom: 24px;
    @include lg {
      margin-bottom: 16px;
    }
    @include md {
      margin-bottom: 16px;
    }
  }

  &__pledged {
    margin-bottom: 24px;
    @include lg {
      margin-bottom: 16px;
    }
    @include md {
      display: none;
    }
  }
}
</style>
