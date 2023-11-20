<template>
  <div class="fees">
    <span class="fees__title"> {{ $t('transactionFee') }} </span>

    <div class="fees__value">
      <span v-if="!hideCustomFee">
        {{ customFee ? 'custom' : feeType }}: &nbsp;&nbsp;
      </span>
      <span
        v-pretty-number="{
          value: customFee || computedFee,
          currency: currentToken ? currentToken.parentCoin.code : wallet?.code,
        }"
        class="fees__amount"
      />
      &nbsp;
      <span :class="{ hideCustomFee }" class="fees__currency">{{
        currentToken ? currentToken.parentCoin.code : wallet?.code
      }}</span>
      <IconButton
        v-if="!hideCustomFee"
        icon="arrow-rigth"
        data-qa="fee-button"
        @click="$emit('select-fee')"
      />
    </div>
  </div>
</template>

<script>
import IconButton from '@/components/UI/IconButton';
import { computed } from 'vue';

export default {
  name: 'Fees',
  components: { IconButton },
  props: {
    hideCustomFee: {
      type: Boolean,
      default: false,
    },
    fees: {
      type: Object,
      default: () => {},
    },
    wallet: {
      type: Object,
      default: () => {},
    },
    feeType: {
      type: String,
      default: '',
    },
    customFee: {
      type: Number,
      default: 0,
    },
    currentToken: {
      type: [Object, null],
      default: null,
    },
    fee: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['select-fee'],
  setup(props) {
    const computedFee = computed(() =>
      props.customFee > 0
        ? 'custom'
        : props.feeType
        ? props.fees[props.feeType]?.fee
        : props.fee.fee
    );

    return {
      computedFee,
    };
  },
};
</script>

<style lang="scss" scoped>
.fees {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-family: 'Panton_SemiBold';
  color: $gray;

  &__value {
    color: $gray;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  &__amount {
    font-family: 'Panton_Bold' !important;
    color: $red;
  }

  &__currency {
    padding-right: 10px;

    &.hideCustomFee {
      padding-right: 0;
    }
  }
}

body.dark {
  .fees {
    &__value {
      color: #6b758e;
    }
  }
}
</style>
