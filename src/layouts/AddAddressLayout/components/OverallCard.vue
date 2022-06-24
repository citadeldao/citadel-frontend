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
  max-width: calc(#{$sidebar-max-width} - 50px);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border: 1px solid $ligthgray;
  border-radius: 8px;
  margin: 0 auto 15px;
  padding: 15px;
  cursor: pointer;
  position: relative;

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
    background: $dark-blue;
    border-color: transparent;
    box-shadow: none;
    & span {
      color: $white;
    }
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
    margin-bottom: 10px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 125px;
    @include md {
      max-width: 73px;
      font-size: 14px;
      font-family: 'Panton_Bold';
      margin-bottom: 3px;
    }
  }
  &__balance,
  &__balance-md {
    font-family: 'Panton_Bold';
    color: $dark-blue;
    font-size: $balance-font-size;
    margin-bottom: 7px;
    transition: 0.2s;
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
    font-family: 'Panton_Regular';
  }
  &__balance-md {
    font-size: $balance-font-size;
    display: none;
    @include md {
      display: initial;
      font-size: $balance-font-size-md;
    }
    @include laptop {
      font-size: $balance-font-size-laptop;
    }
  }

  @include md {
    max-width: calc(#{$sidebar-max-width-md} - 50px);
  }
}

.compact .overall-card {
  background: $dark-blue;
  border-radius: 0;
  color: $white;
  text-align: center;
  justify-content: center;
  align-items: center;
  border-color: transparent;
  padding: 5px 0;

  @include laptop {
    height: 50px;
  }

  &__cryptobalance,
  &__tabs {
    display: none;
  }

  &__balance,
  &__balance-md {
    margin: 0;
    color: $white;
    font-size: $balance-font-size-md;

    & > span {
      color: $white;
    }
    @include laptop-l {
      font-size: $balance-font-size-laptop;
    }
  }

  &__title {
    width: fit-content;
    margin: 0 auto 3px;
  }
}
</style>
