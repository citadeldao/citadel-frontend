<template>
  <div class="item">
    <div class="item__top">
      <div class="item__dot" :style="{ 'background-color': gradient }" />
      <div class="item__title">
        <span>
          {{ shortNameCrypto(item.name) }}
        </span>
      </div>
      <div class="item__percent">
        <span v-pretty-number="item.percent.toFixed(2)" />
        <span>%</span>
      </div>
    </div>
    <div class="item__bottom">
      <span v-if="currentTab === 'USD'" class="item__usd">$</span>
      &nbsp;
      <div
        v-pretty-number="{ value: blnc, currency: currentTab }"
        class="item__num"
      />
      &nbsp;
      <span v-if="currentTab === 'BTC'" class="item__code">BTC</span>
    </div>
  </div>
</template>
<script>
import { shortNameCrypto } from '@/helpers';
import { computed } from 'vue';

export default {
  name: 'BalanceStructureItem',
  props: {
    item: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      default: '#000',
    },
    currentTab: {
      validator: (value) => ['USD', 'BTC'].includes(value),
      default: 'USD',
    },
  },
  setup(props) {
    const gradient = computed(() => `${props.color}`);
    const blnc = computed(() =>
      props.currentTab === 'BTC' ? props.item.btc : props.item.usd
    );

    return {
      shortNameCrypto,
      gradient,
      blnc,
    };
  },
};
</script>
<style lang="scss" scoped>
.item {
  width: 185px;
  border-bottom: 1px solid #d1d8e0;
  height: 55px;
  margin-bottom: 21px;
  display: flex;
  flex-direction: column;
  padding-left: 24px;
  position: relative;
  @include lg {
    width: 240px;
  }
  @include md {
    height: 48px;
    margin-bottom: 8px;
  }
  &__dot {
    position: absolute;
    left: 1px;
    top: 6px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
  &__top {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  &__title {
    font-weight: 600;
    font-size: 16px;
    color: $black;
    display: flex;
    overflow: hidden;
    white-space: nowrap;
    & span {
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  &__percent {
    font-weight: 700;
    font-size: 16px;
    color: $dark-blue;
    display: flex;
    @include md {
      font-size: 14px;
    }
  }
  &__bottom {
    display: flex;
    width: 100%;
    margin-top: 5px;
    font-size: 14px;
    color: $slategray1;
    @include md {
      margin-top: 4px;
    }
  }
  &__num {
    font-weight: 700;
    flex-shrink: 1;
  }
  &__code {
    font-weight: 400;
    flex-shrink: 0;
  }
  &__usd {
    font-weight: 400;
  }
}
</style>
