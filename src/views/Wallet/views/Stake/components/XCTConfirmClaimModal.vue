<template>
  <div class="xct-confirm-claim-modal">
    <div class="xct-confirm-claim-modal__claim-to">
      <span class="xct-confirm-claim-modal__claim-to-title">
        {{ $t('claim.claimTo') }}:
      </span>
      <span class="xct-confirm-claim-modal__claim-to-address">
        {{ currentToken.address }}
      </span>
    </div>
    <div class="xct-confirm-claim-modal__checkbox">
      <div class="xct-confirm-claim-modal__checkbox-checkbox">
        <Checkbox
          id="xctRewards"
          :disabled="!xctRewards"
          :value="claimOptions.xctRewards"
          :label="$t('xct.XCTStakingRewards')"
          @input="updateOptions($event, 'xctRewards')"
        />
      </div>
      <div class="xct-confirm-claim-modal__checkbox-value">
        <span
          v-pretty-number="{ value: xctRewards, currency: currentToken.code }"
          class="xct-confirm-claim-modal__checkbox-value-amount"
          :class="{
            'xct-confirm-claim-modal__checkbox-value-amount--unchecked':
              !claimOptions.xctRewards || !xctRewards,
          }"
        />
        <span class="xct-confirm-claim-modal__checkbox-value-currency">
          {{ currentToken.code }}
        </span>
      </div>
    </div>
    <div class="xct-confirm-claim-modal__checkbox">
      <div class="xct-confirm-claim-modal__checkbox-checkbox">
        <Checkbox
          id="daoRewards"
          :disabled="!daoRewards"
          :value="claimOptions.daoRewards"
          :label="$t('xct.claimRewardsCheckbox2Label')"
          @input="updateOptions($event, 'daoRewards')"
        />
      </div>
      <div class="xct-confirm-claim-modal__checkbox-value">
        <span
          v-pretty-number="{ value: daoRewards, currency: currentToken.code }"
          class="xct-confirm-claim-modal__checkbox-value-amount"
          :class="{
            'xct-confirm-claim-modal__checkbox-value-amount--unchecked':
              !claimOptions.daoRewards || !daoRewards,
          }"
        />
        <span class="xct-confirm-claim-modal__checkbox-value-currency">
          {{ currentToken.code }}
        </span>
      </div>
    </div>
    <div class="xct-confirm-claim-modal__fee">
      <span class="xct-confirm-claim-modal__fee-title"> {{ $t('fee') }}: </span>
      <div class="xct-confirm-claim-modal__fee-value">
        <span
          v-pretty-number="{
            value: fee,
            currency: currentToken.parentCoin.code,
          }"
          class="xct-confirm-claim-modal__fee-value-amount"
        />
        <span class="xct-confirm-claim-modal__fee-value-currency">
          {{ currentToken.parentCoin.code }}
        </span>
      </div>
    </div>
    <div class="xct-confirm-claim-modal__total">
      <span class="xct-confirm-claim-modal__total-title">
        {{ $t('totalAmount') }}:
      </span>
      <div class="xct-confirm-claim-modal__total-amount">
        <div class="xct-confirm-claim-modal__total-wrapper">
          <span
            v-pretty-number="totalAmount"
            class="xct-confirm-claim-modal__total-amount-value"
          />
          <span class="xct-confirm-claim-modal__total-amount-currency">
            {{ currentToken?.code }}
          </span>
        </div>
        <span class="xct-confirm-claim-modal__total-amount-line">/</span>
        <div class="xct-confirm-claim-modal__total-wrapper">
          <span
            v-pretty-number="fee || 0"
            class="xct-confirm-claim-modal__total-amount-fee"
          />
          <span class="xct-confirm-claim-modal__total-amount-currency">
            {{ currentToken.parentCoin.code }}
          </span>
        </div>
      </div>
    </div>
    <div v-if="!hidePassword" class="xct-confirm-claim-modal__password-input">
      <Input
        id="password"
        data-qa="password"
        v-model="password"
        :label="$t('enterSendPassword')"
        type="password"
        icon="key"
        :placeholder="$t('password')"
        :error="inputError"
        @keyup.enter="$emit('submitSend')"
      />
    </div>
  </div>
</template>

<script>
import Checkbox from '@/components/UI/Checkbox';
import Input from '@/components/UI/Input';
import { inject, watch } from 'vue';

export default {
  name: 'XCTConfirmClaimModal',
  components: { Input, Checkbox },
  props: {
    hidePassword: {
      type: Boolean,
      default: false,
    },
    currentToken: {
      type: [Object, null],
      default: null,
    },
    claimOptions: {
      type: Object,
      default: () => ({}),
    },
    xctRewards: {
      type: Number,
      default: 0,
    },
    daoRewards: {
      type: Number,
      default: 0,
    },
    fee: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
  },
  emits: ['submitSend', 'update:options'],
  setup(props, { emit }) {
    const password = inject('password');
    const inputError = inject('inputError');
    const updatePassword = inject('updatePassword');
    const updateOptions = (event, option) => {
      emit('update:options', {
        ...props.claimOptions,
        [option]: event.target.value !== 'true',
      });
    };
    watch(
      () => password.value,
      (newVal) => {
        updatePassword(newVal);
      }
    );

    return { password, inputError, updateOptions };
  },
};
</script>

<style lang="scss" scoped>
.xct-confirm-claim-modal {
  padding-top: 15px;
  display: flex;
  width: 100%;
  flex-direction: column;
  &__claim-to,
  &__fee {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__claim-to {
    margin-bottom: 14px;
  }
  &__claim-to-title,
  &__claim-to-address,
  &__fee-title {
    font-size: 14px;
    line-height: 30px;
  }
  &__claim-to-title,
  &__fee-title {
    color: $gray;
  }
  &__checkbox {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &:last-child {
      margin-bottom: 0px;
    }
  }
  &__checkbox-checkbox {
  }
  &__checkbox-value,
  &__fee-value {
    display: flex;
    align-items: center;
  }
  &__checkbox-value-amount,
  &__checkbox-value-currency,
  &__fee-value-currency,
  &__fee-value-amount {
    font-size: 14px;
    line-height: 30px;
    color: $gray;
  }
  &__checkbox-value-amount,
  &__fee-value-amount {
    margin-right: 3px;
    font-family: 'Panton_Bold' !important;
    color: $blue;
    &--unchecked {
      color: $darkgray;
    }
  }
  &__fee-value-amount {
    color: $red;
  }
  &__total {
    padding-top: 22px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid $lightsteelblue;
    margin-top: 15px;
  }
  &__total-wrapper {
    display: flex;
    align-items: center;
  }
  &__total-title {
    font-size: 18px;
    line-height: 22px;
    font-family: 'Panton_Bold';
  }
  &__total-amount {
    display: flex;
  }
  &__total-amount-value,
  &__total-amount-fee,
  &__total-amount-line {
    margin-right: 3px;
    font-size: 18px;
    line-height: 22px;
    color: $dark-blue;
    font-family: 'Panton_Bold' !important;
  }
  &__total-amount-line {
    color: $mid-gray;
    margin: 0 9px 0 9px;
  }
  &__total-amount-fee {
    color: $red;
  }
  &__total-amount-currency {
    color: $mid-gray;
  }
  &__password-input {
    height: 68px;
    margin-top: 19px;
  }
}
</style>
