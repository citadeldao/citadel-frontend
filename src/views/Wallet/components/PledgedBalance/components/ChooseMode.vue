<template>
  <div class="choose-mode">
    <span class="choose-mode__title">
      {{ chooseNodeModalData.title }}
    </span>
    <span class="choose-mode__subtitle" v-html="chooseNodeModalData.subtitle" />
    <div class="choose-mode__tabs-wrapper">
      <div class="choose-mode__tabs">
        <span
          :class="{ 'choose-mode__active-tab': activeTab === 'pledge' }"
          class="choose-mode__tabs-item"
          @click="setActiveTab('pledge')"
        >
          {{ $t('pledge.pledge') }}
        </span>
        <span
          :class="{
            'choose-mode__active-tab': activeTab === 'unpledge',
            disabled: !pledgedBalance,
          }"
          class="choose-mode__tabs-item"
          @click="setActiveTab('unpledge')"
        >
          {{ $t('pledge.unpledge') }}
        </span>
      </div>
    </div>
    <div class="choose-mode__amount-input">
      <Input
        id="amount"
        :value="amount"
        :label="$t('amount')"
        :decimals="currentWallet?.config?.decimals"
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
      <span v-if="!insufficientFunds" class="choose-mode__available-balance">
        {{ $t('balanceTooltipInfo.availableBalance') }}:
        <span
          v-pretty-number="{ value: maxAmount, currency: currentWallet.code }"
          class="choose-mode__available-balance-balance"
        />
        <span class="choose-mode__available-balance-currency">
          {{ currentWallet.code }}
        </span>
      </span>
    </div>
  </div>
</template>

<script>
import Input from '@/components/UI/Input';
import { inject } from '@vue/runtime-core';

export default {
  name: 'ChooseMode',
  components: { Input },
  props: {
    activeTab: {
      type: String,
      default: '',
    },
    currentWallet: {
      type: Object,
      default: () => ({}),
    },
    amount: {
      type: [Number, String],
      default: '',
    },
    pledgedBalance: {},
  },
  emits: ['update:activeTab', 'nextStep'],
  setup(props, { emit }) {
    const updateAmount = inject('updateAmount');
    const maxAmount = inject('maxAmount');
    const insufficientFunds = inject('insufficientFunds');
    const getDelegationFee = inject('getDelegationFee');
    const chooseNodeModalData = inject('chooseNodeModalData');

    const setActiveTab = async (value) => {
      if (value === 'unpledge' && !props.pledgedBalance) {
        return;
      }

      emit('update:activeTab', value);
      await getDelegationFee(value);
      updateAmount('');
    };

    return {
      setActiveTab,
      updateAmount,
      maxAmount,
      insufficientFunds,
      chooseNodeModalData,
    };
  },
};
</script>

<style lang="scss" scoped>
.choose-mode {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 0 0 0;

  &__title {
    font-size: 20px;
    line-height: 30px;
    font-family: 'Panton_Bold';
  }

  &__subtitle {
    font-size: 16px;
    line-height: 30px;
    color: $mid-blue;
    margin-bottom: 21px;
  }

  &__tabs-wrapper {
    width: 100%;
    height: 59px;
    border-bottom: 2px solid $too-ligth-gray;
    position: relative;
    margin-bottom: 24px;
  }

  &__tabs {
    display: flex;
    position: absolute;
    top: 8px;
  }

  &__tabs-item {
    cursor: pointer;
    font-size: 20px;
    line-height: 30px;
    text-transform: uppercase;
    color: $mid-gray;
    border-bottom: 6px solid transparent;
    margin-right: 37px;
    padding-bottom: 17px;
    font-family: 'Panton_Bold';

    &:last-child {
      margin-right: 0;
    }
  }

  &__active-tab {
    border-color: $too-dark-blue;
    color: $too-dark-blue;
  }

  &__amount-input {
    width: 100%;
    height: 68px;
    position: relative;
    margin-bottom: 19px;
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
    font-family: 'Panton_Bold' !important;
    margin-left: 6px;
    margin-right: 3px;
  }

  &__available-balance-currency {
  }
}

.disabled {
  cursor: not-allowed;
}
</style>
