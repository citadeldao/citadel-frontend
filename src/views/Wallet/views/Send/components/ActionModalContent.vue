<template>
  <div class="action-modal-content">
    <div
      class="action-modal-content__send-direction"
      :style="{ marginBottom: wallet.hasPledged ? '20px' : '' }"
    >
      <SendDirection
        :to="to"
        :amount="amount"
        :wallet="wallet"
        :current-token="currentToken"
        :fee="wallet.hasPledged"
        :adding="adding"
        :memo="memo"
        :iost-fee="iostFee"
      />
    </div>

    <div v-if="wallet.hasFee && !hideFee" class="action-modal-content__fees">
      <Fees
        :hide-custom-fee="wallet.hideCustomFee"
        :current-token="currentToken"
        :fees="fees"
        :wallet="wallet"
        :fee-type="feeType"
        :custom-fee="customFee"
        @select-fee="$emit('select-fee')"
      />
    </div>

    <div class="action-modal-content__total-amount">
      <span class="action-modal-content__total-amount-title">
        {{ $t('totalAmount') }}:
      </span>
      <div
        v-if="wallet.hasPledged || currentToken"
        class="action-modal-content__total-wrapper"
      >
        <div class="action-modal-content__total-wrapper">
          <span
            v-pretty-number="{ value: amount, currency: wallet?.code }"
            class="action-modal-content__total-amount-value"
          />
          <span class="action-modal-content__total-amount-currency">
            {{ wallet?.code }}
          </span>
        </div>
        <!-- hide separator when fee receive 0 -->
        <span
          v-if="wallet.hasPledged || (!wallet.hasPledged && fee.fee)"
          class="action-modal-content__total-amount-line"
          >/</span
        >
        <div
          v-if="wallet.hasPledged"
          class="action-modal-content__total-wrapper"
        >
          <span
            v-pretty-number="adding.ram"
            class="action-modal-content__total-amount-fee"
          />
          <span class="action-modal-content__total-amount-currency">
            iRam
          </span>
          &nbsp;&nbsp;
          <span
            v-pretty-number="adding.gas"
            class="action-modal-content__total-amount-fee"
          />
          <span class="action-modal-content__total-amount-currency">
            iGas
          </span>
        </div>
        <!-- hide when fee receive 0 -->
        <div
          v-if="!wallet.hasPledged && fee.fee"
          class="action-modal-content__total-wrapper"
        >
          <span
            v-pretty-number="{
              value: fee.fee || 0,
              currency: currentToken
                ? currentToken.parentCoin.code
                : wallet?.code,
            }"
            class="action-modal-content__total-amount-fee"
          />
          <span class="action-modal-content__total-amount-currency">
            {{ currentToken ? currentToken.parentCoin.code : wallet?.code }}
          </span>
        </div>
      </div>
      <div v-else class="action-modal-content__total-amount-wrapper">
        <span
          v-pretty-number="{ value: totalAmount, currency: wallet?.code }"
          class="action-modal-content__total-amount-amount"
        />
        <span class="action-modal-content__total-amount-currency">
          {{ wallet?.code }}
        </span>
      </div>
    </div>
    <div v-if="!hidePassword" class="action-modal-content__password-input">
      <Input
        id="password"
        data-qa="password"
        :value="password"
        :label="$t('enterSendPassword')"
        type="password"
        icon="key"
        :placeholder="$t('password')"
        :error="inputError"
        @input="$emit('update:password', $event)"
        @keyup.enter="$emit('submitSend')"
      />
    </div>
  </div>
</template>

<script>
import SendDirection from './SendDirection.vue';
import Fees from '@/components/Fees';
import Input from '@/components/UI/Input';
import { inject } from '@vue/runtime-core';

export default {
  name: 'ActionModalContent',
  components: { Input, Fees, SendDirection },
  props: {
    hideFee: {
      type: Boolean,
      default: false,
    },
    feeType: {
      type: String,
    },
    customFee: {
      type: Number,
    },
    to: {
      type: String,
    },
    wallet: {
      type: Object,
    },
    amount: {
      type: [Number, String],
    },
    totalAmount: {
      type: Number,
    },
    fees: {
      type: Object,
    },
    password: {
      type: String,
    },
    passwordError: {
      type: [String, Boolean],
    },
    hidePassword: {
      type: Boolean,
      default: false,
    },
    currentToken: {
      type: [Object, null],
      default: null,
    },
    fee: {
      type: Object,
      default: () => ({}),
    },
    iostFee: {
      type: Number,
      default: 0,
    },
    adding: {
      type: Object,
      default: () => ({}),
    },
    memo: {
      type: String,
      default: '',
    },
  },
  emits: ['update:password', 'submitSend', 'select-fee'],
  setup() {
    const inputError = inject('inputError');

    return { inputError };
  },
};
</script>

<style lang="scss" scoped>
.action-modal-content {
  padding-top: 15px;
  display: flex;
  width: 100%;
  flex-direction: column;
  &__total-amount {
    border-top: 1px solid $lightsteelblue;
    padding-top: 22px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__fees {
    margin-top: 4px;
    margin-bottom: 24px;
  }
  &__total-amount-title {
    font-size: 18px;
    line-height: 22px;
    font-family: 'Panton_Bold';
  }
  &__total-amount-wrapper,
  &__total-amount,
  &__total-wrapper {
    display: flex;
    align-items: center;
  }
  &__total-amount-amount,
  &__total-amount-currency,
  &__total-amount-value,
  &__total-amount-line,
  &__total-amount-fee {
    font-size: 18px;
    line-height: 22px;
    color: $gray;
  }
  &__total-amount-amount,
  &__total-amount-value,
  &__total-amount-line,
  &__total-amount-fee {
    color: $red;
    font-family: 'Panton_Bold' !important;
    margin-right: 3px;
  }
  &__password-input {
    height: 68px;
    margin-top: 19px;
  }

  &__token-amount-wrapper {
    font-size: 18px;
  }
  &__token-amount-amount {
    color: $dark-blue;
    font-weight: 700;
  }
  &__token-amount-code {
    color: $fieldName;
  }
  &__token-divider {
    color: $mid-gray;
  }
  &__token-fee {
    color: $red;
    font-weight: 700;
  }
  &__token-fee-code {
    color: $fieldName;
  }
  &__total-amount-value {
    color: $dark-blue;
  }
  &__total-amount-line {
    color: $mid-gray;
    margin: 0 9px 0 9px;
  }
}
</style>
