<template>
  <div :class="{ active: route.path.includes('overall') }" class="overall-card">
    <span class="overall-card__title">
      {{ title === 'all' ? $t('layouts.addAddressLayout.overall') : title }}
    </span>
    <span class="overall-card__balance-md">
      <span class="overall-card__currency-md">
        {{ currentTab === 'USD' ? `$` : `BTC` }}
      </span>
      <span
        v-pretty-number="{
          value: currentTab === 'USD' ? balance : cryptobalance,
          currency: currentTab,
        }"
      />
    </span>
    <span class="overall-card__balance">
      <span class="overall-card__currency">$</span>
      <span
        v-pretty-number="{ value: balance, currency: 'USD' }"
        class="overall-card__balance-value"
      />
    </span>
    <span class="overall-card__cryptobalance">
      <span v-pretty-number="{ value: cryptobalance, currency: 'BTC' }" />
      <span class="overall-card__cryptocurrency"> BTC </span>
    </span>
    <div class="overall-card__tabs">
      <div class="overall-card__tab">
        <NetworkTab
          :id="1"
          v-model:currentTab="currentTab"
          value="USD"
          icon="USD"
        />
      </div>
      <div class="overall-card__tab">
        <NetworkTab
          :id="2"
          v-model:currentTab="currentTab"
          value="BTC"
          icon="btc"
        />
      </div>
    </div>
  </div>
</template>

<script>
import NetworkTab from '@/components/UI/NetworkTab';
import { ref } from '@vue/reactivity';
import { prettyNumber } from '@/helpers/prettyNumber';
import { useRoute } from 'vue-router';

export default {
  name: 'OverallCard',
  components: { NetworkTab },
  props: {
    balance: {
      type: [String, Number],
    },
    cryptobalance: {
      type: [String, Number],
    },
    title: {
      type: String,
    },
  },
  setup() {
    const currentTab = ref('USD');
    const route = useRoute();

    return { currentTab, prettyNumber, route };
  },
};
</script>

<style lang="scss" scoped>
.overall-card {
  width: 218px;
  display: flex;
  flex-direction: column;
  padding: 20px 0 21px 22px;
  border: 1px solid $ligthgray;
  border-radius: 8px;
  margin-bottom: 24px;
  cursor: pointer;

  &:hover:not(.active) {
    background: $blue;
    .overall-card__currency,
    .overall-card__currency-md,
    .overall-card__cryptocurrency,
    .overall-card__cryptobalance,
    .overall-card__title,
    .overall-card__balance,
    .overall-card__balance-md {
      color: $white;
    }
  }

  &.active {
    background: $white;
    border: none;
  }

  @include md {
    margin-bottom: 18px;
    width: 165px;
    padding: 13px 10px 13px 13px;
    background: $white;
    border: none;
    position: relative;
  }
  &__tabs {
    display: none;
    position: absolute;
    top: 13px;
    right: 10px;
    @include md {
      display: flex;
    }
  }
  &__tab {
    &:first-child {
      margin-right: 8px;
    }
  }
  &__title {
    font-size: 16px;
    line-height: 19px;
    margin-bottom: 10px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 125px;
    @include md {
      max-width: 73px;
      font-size: 14px;
      line-height: 30px;
      font-family: 'Panton_Bold';
      margin-bottom: 3px;
    }
  }
  &__balance,
  &__balance-md {
    font-family: 'Panton_Bold';
    color: $dark-blue;
    font-size: 28px;
    line-height: 34px;
    margin-bottom: 7px;
    @include md {
      display: none;
      margin-bottom: 0;
    }
  }
  &__balance-value {
    transition: 0s all;
  }
  &__cryptobalance {
    font-size: 16px;
    line-height: 19px;
    color: $blue;
    transition: 0s all;
    @include md {
      display: none;
    }
  }
  &__cryptocurrency,
  &__currency-md,
  &__currency {
    color: $black;
    font-family: 'Panton_Bold';
  }
  &__balance-md {
    font-size: 18px;
    line-height: 22px;
    display: none;
    @include md {
      display: initial;
    }
  }
}
</style>
