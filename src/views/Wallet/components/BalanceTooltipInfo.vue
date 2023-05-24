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
    <span
      v-if="currentWallet.unstakePerioud"
      class="balance-tooltip-info__line"
    >
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
    <span class="balance-tooltip-info__period">
      {{
        !currentWallet.unstakeingPerioud
          ? `${$t('balanceTooltipInfo.noPeriod')} ${currentWallet.name}.`
          : `${$t(
              'balanceTooltipInfo.unstakingPeriod'
            )} ${currentWallet.net.toUpperCase()} ${$t(
              'balanceTooltipInfo.is'
            )}`
      }}
      <span
        v-if="currentWallet.unstakeingPerioud"
        class="balance-tooltip-info__period-days"
        >{{ currentWallet.unstakeingPerioud }}
        days.
      </span>
    </span>
    <div
      v-if="currentWallet.hasResource && resources.length"
      class="balance-tooltip-info__balance"
    >
      <span class="balance-tooltip-info__balance-title"
        >{{ $t('balance') }}:</span
      >
      <span
        v-for="item in resources"
        :key="item.name"
        class="balance-tooltip-info__balance-line"
        >{{ item.nameForUser }} -
        <span
          v-pretty-number="{ value: item.current, currency: item.nameForUser }"
          class="balance-tooltip-info__balance-amount"
        />
        {{ item.nameForUser }}
      </span>
    </div>
    <div
      v-if="currentWallet.hasResource && resources.length"
      class="balance-tooltip-info__balance"
    >
      <template v-for="item in resources" :key="item.name">
        <span class="balance-tooltip-info__balance-line"
          >{{ item.nameForUser }}
        </span>
        <span class="balance-tooltip-info__line">
          {{ $t(`${item.name}-desc`) }}
        </span>
      </template>
    </div>
  </div>
</template>
<script>
import { computed } from '@vue/runtime-core';
export default {
  name: 'BalanceTooltipInfo',
  props: {
    currentWallet: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const resources = computed(() => {
      return props.currentWallet.balance.adding.filter(
        (item) => item.isResource
      );
    });

    return { resources };
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
