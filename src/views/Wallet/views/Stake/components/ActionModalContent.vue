<template>
  <div class="action-modal-content">
    <div
      v-if="!currentToken && (activeTab === 'unstake' || mode === 'unstake')"
      class="action-modal-content__info"
    >
      <exclamation class="action-modal-content__info-icon" />
      <span
        class="action-modal-content__info-text"
        v-html="
          $t('unstaking.unstakeNote', {
            unstakeingPerioud: wallet.unstakeingPerioud,
          })
        "
      >
      </span>
    </div>
    <NominatedNodes
      v-if="isMultiple"
      class="action-modal-content__nominated-nodes"
      :selected-node="finalNodesList"
    />
    <SendDirection
      :current-token="currentToken"
      :to="to"
      :amount="stakingAmount"
      :wallet="wallet"
      :fee="stakingFee"
      :place="place"
      :delegation="delegation"
      :adding="adding"
    />
    <div class="action-modal-content__total">
      <span class="action-modal-content__total-title">
        {{ $t('totalAmount') }}:
      </span>
      <div class="action-modal-content__total-amount">
        <div class="action-modal-content__total-wrapper">
          <span
            v-pretty-number="{ value: stakingAmount, currency: wallet?.code }"
            class="action-modal-content__total-amount-value"
          />
          <span class="action-modal-content__total-amount-currency">
            {{ wallet?.code }}
          </span>
        </div>
        <!-- hide separator when fee receive 0 -->
        <span
          v-if="wallet.hasResource || (!wallet.hasResource && stakingFee)"
          class="action-modal-content__total-amount-line"
          >/</span
        >
        <div
          v-if="wallet.hasResource"
          class="action-modal-content__total-wrapper"
        >
          <template v-for="item in adding" :key="item.name">
            <span
              v-pretty-number="item.value"
              class="action-modal-content__total-amount-fee"
            />
            <span class="action-modal-content__total-amount-currency">
              {{ item.nameForUser }}
            </span>
            &nbsp;&nbsp;
          </template>
        </div>
        <!-- hide when fee receive 0 -->
        <div
          v-if="!wallet.hasResource && stakingFee"
          class="action-modal-content__total-wrapper"
        >
          <span
            v-pretty-number="{
              value: stakingFee || 0,
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
    </div>
    <div v-if="!hidePassword" class="action-modal-content__password-input">
      <Input
        id="password"
        v-model="password"
        :label="$t('enterSendPassword')"
        type="password"
        icon="key"
        :hard-autocomplete-off="true"
        :placeholder="$t('password')"
        :error="inputError"
        data-qa="staking-confirm__password-field"
        @keyup.enter="$emit('submitSend')"
      />
    </div>
  </div>
</template>

<script>
import exclamation from '@/assets/icons/exclamation.svg';
import SendDirection from './SendDirection.vue';
import NominatedNodes from './NominatedNodes.vue';
import Input from '@/components/UI/Input';
import { computed, inject, watch } from 'vue';

export default {
  name: 'ActionModalContent',
  components: { Input, SendDirection, exclamation, NominatedNodes },
  props: {
    to: {
      type: String,
    },
    wallet: {
      type: Object,
      default: () => ({}),
    },
    hidePassword: {
      type: Boolean,
      default: false,
    },
    stakingFee: {},
    stakingAmount: {},
    place: {
      type: String,
      default: '',
    },
    delegation: {
      type: Object,
      default: () => ({}),
    },
    currentToken: {
      type: [Object, null],
      default: null,
    },
    adding: {
      type: Object,
      default: () => ({}),
    },
    selectedNode: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['submitSend'],
  setup(props) {
    const password = inject('password');
    const inputError = inject('inputError');
    const updatePassword = inject('updatePassword');
    const selectedNodeForRedelegation = inject('selectedNodeForRedelegation');
    const isMultiple = inject('isMultiple');
    watch(
      () => password.value,
      (newVal) => {
        updatePassword(newVal);
      }
    );

    const activeTab = inject('activeTab');
    const mode = inject('mode');
    const finalNodesList = computed(
      () => selectedNodeForRedelegation.value || props.selectedNode
    );

    return {
      password,
      inputError,
      activeTab,
      mode,
      finalNodesList,
      isMultiple,
    };
  },
};
</script>

<style lang="scss" scoped>
.action-modal-content {
  padding-top: 15px;
  display: flex;
  width: 100%;
  flex-direction: column;
  &__info {
    background: $ligth-red;
    border-radius: 10px;
    display: flex;
    align-items: center;
    width: 100%;
    height: 100px;
    padding: 0 28px 0 29px;
    margin-bottom: 24px;
  }
  &__info-icon {
    width: 59px;
    height: 59px;
    margin-right: 18px;
  }
  &__info-text {
    width: 386px;
    font-size: 14px;
    line-height: 20px;
    color: $red;
    font-family: 'Panton_SemiBold';
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
  &__nominated-nodes {
    margin-bottom: 12px;
  }
}
</style>
