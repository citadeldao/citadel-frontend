<template>
  <div class="balance-tooltip-info">
    <span class="balance-tooltip-info__line">
      <span class="balance-tooltip-info__line-label">
        {{ $t('balanceTooltipInfo.availableBalance') }}
      </span>
      - {{ $t('balanceTooltipInfo.availableBalanceInfo') }}
    </span>
    <span class="balance-tooltip-info__line">
      <span class="balance-tooltip-info__line-label">
        {{ $t('balanceTooltipInfo.stakedBalance') }}
      </span>
      - {{ $t('balanceTooltipInfo.stakedBalanceBalanceInfo') }}
    </span>
    <span class="balance-tooltip-info__line">
      <span class="balance-tooltip-info__line-label">
        {{ $t('balanceTooltipInfo.frozenBalance') }}
      </span>
      - {{ $t(`${currentWallet.messages.frozenBalance}`) }}
    </span>
    <span
      v-if="currentWallet.unstakePerioudFrom"
      class="balance-tooltip-info__period"
    >
      {{
        $t('balanceTooltipInfo.withFromPeriod', { code: currentWallet.name })
      }}
      <span class="balance-tooltip-info__period-days"
        >{{ currentWallet.unstakePerioudFrom }}
      </span>
      {{ $t('balanceTooltipInfo.to') }}
      <span class="balance-tooltip-info__period-days"
        >{{ currentWallet.unstakePerioudTo }} {{ $t('days') }}.
      </span>
    </span>
    <span
      v-if="currentWallet.unstakePerioudLink"
      class="balance-tooltip-info__period"
    >
      {{ $t('balanceTooltipInfo.iconPeriodLink') }}
      <a
        target="_blank"
        :href="currentWallet.unstakePerioudLink"
        class="balance-tooltip-info__balance-title"
        >{{ $t('link') }}.</a
      >
    </span>
    <span v-else class="balance-tooltip-info__period">
      {{
        !currentWallet.hasUnstakeingPerioud
          ? `${$t('balanceTooltipInfo.noPeriod')} ${currentWallet.name}.`
          : `${$t(
              'balanceTooltipInfo.unstakingPeriod'
            )} ${currentWallet.net.toUpperCase()} ${$t(
              'balanceTooltipInfo.is'
            )}`
      }}
      <span
        v-if="currentWallet.hasUnstakeingPerioud"
        class="balance-tooltip-info__period-days"
        >{{ currentWallet.unstakeingPerioud }}
        days.
      </span>
    </span>
    <div v-if="currentWallet.hasPledged" class="balance-tooltip-info__balance">
      <span class="balance-tooltip-info__balance-title"
        >{{ $t('balance') }}:</span
      >
      <span class="balance-tooltip-info__balance-line"
        >iGas -
        <span
          v-pretty-number="gas"
          class="balance-tooltip-info__balance-amount"
        />
        iGas
      </span>
      <span class="balance-tooltip-info__balance-line"
        >iRam -
        <span
          v-pretty-number="ram"
          class="balance-tooltip-info__balance-amount"
        />
        iRam
      </span>
    </div>
  </div>
</template>
<script>
import useIostProps from '@/compositions/useIostProps.js';
export default {
  name: 'BalanceTooltipInfo',
  props: {
    currentWallet: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    const { gas, ram } = useIostProps();

    return { gas, ram };
  },
};
</script>

<style lang="scss" scoped>
.balance-tooltip-info {
  display: flex;
  flex-direction: column;
  &__line,
  &__line-label,
  &__period,
  &__period-days,
  &__balance-title,
  &__balance-line,
  &__balance-amount {
    font-size: 12px;
    line-height: 16px;
    color: $mid-blue;
  }
  &__line-label {
    color: $too-dark-blue;
  }
  &__period,
  &__period-days,
  &__balance-title,
  &__balance-line,
  &__balance-amount {
    font-family: 'Panton_Bold';
    color: $too-dark-blue;
  }
  &__period-days {
    color: $blue;
  }
  &__balance {
    display: flex;
    flex-direction: column;
    border-top: 1px dashed $too-ligth-blue;
    padding-top: 10px;
    margin-top: 15px;
  }
  &__balance-title {
    color: $orange;
    text-decoration: none;
    text-transform: capitalize;
  }

  &__balance-amount {
    color: $ligth-blue;
  }
}
</style>
