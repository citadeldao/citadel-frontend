<template>
  <div class="xct-set-staking-amount">
    <div
      v-if="mode==='unstake'"
      class="xct-set-staking-amount__stake-balance"
    >
      <span class="xct-set-staking-amount__stake-balance-title">
        {{ $t('balanceTooltipInfo.stakedBalance') }}
      </span>
      <div class="xct-set-staking-amount__stake-balance-line" />
      <div class="xct-set-staking-amount__stake-balance-balance">
        <span
          v-pretty-number="{ value: currentWallet.tokenBalance.stake, currency: currentWallet.code }"
          class="xct-set-staking-amount__stake-balance-amount"
        />
        <span class="xct-set-staking-amount__stake-balance-currency">
          {{ currentWallet.code }}
        </span>
      </div>
    </div>
    <div
      class="xct-set-staking-amount__amount-input"
    >
      <Input
        id="amount"
        :value="amount"
        :label="$t('amount')"
        type="currency"
        :currency="currentWallet.code"
        :max="maxAmount"
        icon="coins"
        placeholder="0.0"
        :error="insufficientFunds"
        show-set-max
        @input="updateAmount"
        @keyup.enter="$emit('nextStep')"
      />
      <span
        v-if="showAmount"
        class="xct-set-staking-amount__available-balance"
      >
        {{ $t("balanceTooltipInfo.availableBalance") }}:
        <span
          v-pretty-number="{ value: currentWallet.tokenBalance.mainBalance, currency: currentWallet.code }"
          class="xct-set-staking-amount__available-balance-balance"
        />
        <span class="xct-set-staking-amount__available-balance-currency">
          {{ currentWallet.code }}
        </span>
      </span>
    </div>
  </div>
</template>

<script>
import Input from '@/components/UI/Input';
import { computed, inject } from '@vue/runtime-core';
export default {
  name:'XCTSetStakingAmount',
  components: { Input },
  props: {
    currentWallet: {
      type: [Object, null],
      default: null,
    },
    amount: {
      type: [Number, String],
    },
  },
  emits: ['nextStep'],
  setup() {
    const updateAmount = inject('updateAmount');
    const maxAmount = inject('maxAmount');
    const insufficientFunds = inject('insufficientFunds');
    const mode = inject('mode');

    const showAmount = computed(() => {
      if (insufficientFunds.value) {
        return false;
      } else if (mode.value === 'unstake') {
        return false;
      }else if (mode.value === 'stake') {
        return true;
      }

      return false;
    });

    return{ updateAmount, maxAmount, insufficientFunds, showAmount, mode };
  },
};
</script>

<style lang="scss" scoped>
.xct-set-staking-amount{
    width: 100%;
    display: flex;
    flex-direction: column;
    padding-top: 24px;
      &__stake-balance{
          display: flex;
          margin-bottom: 15px;
          align-items: baseline;
      }
      &__stake-balance-title,
      &__stake-balance-amount,
      &__stake-balance-currency{
          font-size: 16px;
          line-height: 19px;
          font-family: "Panton_Bold" !important;
      }
      &__stake-balance-line{
          flex-grow: 1;
          border-bottom: 1px dashed $gainsboro;
      }
      &__stake-balance-balance{
          display: flex;
      }
      &__stake-balance-amount{
           color: $blue;
           margin-right: 3px;
      }
      &__stake-balance-currency{
          font-family: 'Panton_Regular' !important;
      }
  &__amount-input {
    height: 68px;
    position: relative;
  }
  &__available-balance,
  &__available-balance-balance,
  &__available-balance-currency {
    font-size: 12px;
    line-height: 14px;
    color: $mid-blue;
  }
  &__available-balance {
    position: absolute;
    display: flex;
    align-items: center;
    margin-top: 8px;
  }
  &__available-balance-balance {
    color: $ligth-blue;
    font-family: "Panton_Bold" !important;
    margin-left: 6px;
    margin-right: 3px;
  }
  &__input-note{
    position: absolute;
    font-size: 14px;
    line-height: 17px;
    color: $blue;
    right: 0;
    margin-top: 6px;
  }
}
</style>

