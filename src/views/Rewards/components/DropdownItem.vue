<template>
  <div class="dropdown-item">
    <span class="dropdown-item__address">
      {{ reward.address }}
    </span>
    <div class="dropdown-item__line" />
    <div class="dropdown-item__value">
      <span
        v-pretty-number="{
          value: showBalance ? reward.value : HIDE_BALANCE_MASK,
          currency,
        }"
        class="dropdown-item__value-amount"
      />
      <span class="dropdown-item__value-currency">{{ currency }}</span>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { HIDE_BALANCE_MASK } from '@/helpers/prettyNumber';

export default {
  name: 'DropdownItem',
  props: {
    reward: {
      type: Object,
      default: () => ({}),
    },
    currency: {
      type: String,
      default: '',
    },
    opened: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const store = useStore();
    const showBalance = computed(() => store.getters['balance/showBalance']);

    return { showBalance, HIDE_BALANCE_MASK };
  },
};
</script>

<style lang="scss" scoped>
.dropdown-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 24px 0 25px;
  @include lg {
    padding: 0 12px 0 16px;
  }
  @include md {
    padding: 0 12px 0 16px;
  }
  &__address {
    font-size: 16px;
    line-height: 19px;
    letter-spacing: -0.02em;
    color: $too-dark-blue;
    @include lg {
      font-size: 14px;
      line-height: 17px;
    }
    @include md {
      font-size: 14px;
      line-height: 17px;
    }
  }
  &__line {
    display: flex;
    flex: 1;
    border-bottom: 1px dashed $gainsboro;
    margin-left: 5px;
    align-self: flex-end;
    @include lg {
      margin-left: 2px;
    }
    @include md {
      margin-left: 2px;
    }
  }
  &__value {
    display: flex;
    align-items: center;
  }
  &__value-amount,
  &__value-currency {
    font-size: 16px;
    line-height: 19px;
    letter-spacing: -0.02em;
    font-family: 'Panton_Bold' !important;
    margin-right: 3px;
    @include lg {
      font-size: 14px;
      line-height: 17px;
    }
    @include md {
      font-size: 14px;
      line-height: 17px;
    }
  }
  &__value-currency {
    font-family: 'Panton_Regular' !important;
    margin-right: 0px;
  }
}
</style>
