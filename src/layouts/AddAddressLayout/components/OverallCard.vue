<template>
  <div :class="{ active: route.path.includes('overall') }" class="overall-card">
    <span class="overall-card__title">
      {{ title === 'all' ? $t('layouts.addAddressLayout.overall') : title }}
    </span>
    <span class="overall-card__balance-md">
      <span class="overall-card__currency-md">
        {{ balanceValue[currentTab].currency }}
      </span>
      <span v-pretty-number="{ ...balanceValue[currentTab] }" />
      <span
        v-pretty-number="{ ...balanceValue[laptopTab] }"
        class="overall-card__balance-laptop"
      />
    </span>
    <span class="overall-card__balance">
      <span class="overall-card__currency">$</span>
      <span
        v-pretty-number="{ ...balanceValue['USD'] }"
        class="overall-card__balance-value"
      />
    </span>
    <span class="overall-card__cryptobalance">
      <span v-pretty-number="{ ...balanceValue['BTC'] }" />
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
  setup(props) {
    const route = useRoute();
    const balanceValue = ref({});

    balanceValue.value = {
      USD: {
        currency: '$',
        value: props.balance,
      },
      BTC: {
        currency: 'BTC',
        value: props.cryptobalance,
      },
    };

    return { prettyNumber, route, balanceValue };
  },
  data() {
    return {
      currentTab: 'USD',
      laptopTab: 'BTC',
      windowSize: window.innerWidth,
    };
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
  margin: 0 auto;
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
    box-shadow: 0px 15px 50px rgba(80, 100, 124, 0.1),
      0px 10px 15px rgba(80, 100, 124, 0.16);
    & span {
      color: $white;
    }
    @include laptop {
      box-shadow: none;
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
    @include laptop {
      display: none;
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
    @include laptop {
      margin-left: 0;
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
    color: $blue;
    transition: 0s all;
    @include md {
      display: none;
    }
  }

  &__balance-laptop {
    display: none;
  }

  &__cryptocurrency,
  &__currency-md,
  &__currency {
    color: $black;
    @include laptop {
      color: $too-ligth-blue !important;
      font-weight: 400 !important;
      font-family: 'Panton_Regular';
    }
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
  @include laptop {
    max-width: calc(#{$sidebar-max-width-md} - 30px);
    height: 50px;
    border-radius: 0;
    margin-bottom: 0;
    flex-direction: row;
    background-color: $dark-blue;
    justify-content: space-between;
    border-color: transparent;
    & span {
      color: $white;
    }
    &__balance-laptop {
      display: initial;
      position: absolute;
      right: 15px;
      color: transparent !important;
      z-index: 1;
    }
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
    font-size: $sidebar-title-font-size-laptop;

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
