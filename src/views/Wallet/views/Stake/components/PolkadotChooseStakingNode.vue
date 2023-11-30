<template>
  <div class="choose-staking-node">
    <MinBalanceWarning
      class="choose-staking-node__min-balance-note"
      icon="exclamation"
      :content="
        $t('minBalanceNote', {
          amount: `<span style='font-weight: 800;font-family: Panton_ExtraBold;'>${currentWallet.minBalance} ${currentWallet.code}</span>`,
        })
      "
    />
    <div
      v-if="!selectedNode && mode === 'stake' && list.length < 16"
      class="choose-staking-node__placeholder"
      data-qa="staking__node-list-button"
      @click="showNodesList"
    >
      <pointer />
      <span>{{ $t('stakePlaceholder.choseNodePlaceholderNote') }} </span>
    </div>
    <div
      v-else-if="selectedNode && mode === 'stake'"
      class="choose-staking-node__selected-node"
    >
      <PolkadotStakeListItems
        :current-wallet="currentWallet"
        title-max-width="230"
        :icon="currentWallet.net"
        :items="selectedNode"
        button-text="settings.changeEmail.button"
        @showNodesList="showNodesList"
      />
    </div>
    <span
      v-if="mode === 'stake' && list.length"
      class="choose-staking-node__staking-note"
    >
      {{ $t('stakingNote') }}
    </span>
    <div class="choose-staking-node__tabs-wrapper">
      <div class="choose-staking-node__tabs">
        <div
          class="choose-staking-node__tabs-item"
          :class="{ 'choose-staking-node__active-tab': mode === 'stake' }"
          @click="changeMode('stake')"
        >
          {{ $t('staking.Stake') }}
        </div>
        <div
          v-if="list.length"
          class="choose-staking-node__tabs-item"
          :class="{ 'choose-staking-node__active-tab': mode === 'unstake' }"
          @click="changeMode('unstake')"
        >
          {{ $t('unstaking.unstake') }}
        </div>
        <span
          v-if="currentWallet.hasRedelegation && list.length"
          :class="{
            'choose-staking-node__active-tab': mode === 'redelegate',
          }"
          class="choose-staking-node__tabs-item"
          @click="changeMode('redelegate')"
        >
          {{ $t('redelegation.redelegate') }}
        </span>
      </div>
    </div>

    <div
      v-if="list.length && (mode === 'unstake' || mode === 'redelegate')"
      class="choose-staking-node__unstake-nodes-list"
    >
      <PolkadotUnstakeListItems
        :list="finalNodesList"
        :current-wallet="currentWallet"
        :show-edit-button="!showInput"
        @showNodesList="showNodesList"
      />
    </div>

    <span
      v-if="!showInput && !selectedNodeForRedelegation"
      class="choose-staking-node__validators-note"
    >
      {{ $t('redelegateNote') }}
    </span>

    <div v-if="showInput" class="choose-staking-node__amount-input">
      <Input
        id="amount"
        :value="amount"
        :label="$t('amount')"
        type="currency"
        :decimals="currentWallet?.config?.decimals"
        :currency="currentWallet.code"
        :max="maxAmount"
        icon="coins"
        placeholder="0.0"
        :error="insufficientFunds"
        show-set-max
        data-qa="staking__amount-field"
        @input="updateAmount"
        @keyup.enter="$emit('nextStep')"
      />
      <span v-if="showAmount" class="choose-staking-node__available-balance">
        {{ $t('balanceTooltipInfo.availableBalance') }}:
        <span
          v-pretty-number="{ value: maxAmount, currency: currentWallet.code }"
          class="choose-staking-node__available-balance-balance"
        />
        <span class="choose-staking-node__available-balance-currency">
          {{ currentWallet.code }}
        </span>
      </span>
      <span
        v-if="!insufficientFunds && currentWallet.hasPledged"
        class="choose-staking-node__input-note"
      >
        {{ $t('staking.inputNote') }}
      </span>
    </div>
    <div class="choose-staking-node__additional-fee">
      <Input
        id="additional-fee"
        :value="additionalFee"
        :label="$t('additionalFee')"
        type="currency"
        :decimals="currentWallet?.config?.decimals"
        :currency="currentWallet.code"
        :max="maxAdditionalFee"
        icon="coins"
        placeholder="0.0"
        :error="insufficientAdditionalFee"
        data-qa="staking__amount-field"
        @input="updateAdditionalFee"
        @keyup.enter="$emit('nextStep')"
      />
    </div>
    <div
      v-if="mode === 'stake'"
      class="choose-staking-node__reward-destination-option"
    >
      <Select
        :model-value="rewardDestinationOption"
        :label="$t('rewardDestination')"
        icon="curve-arrow"
        :options="polkadotRewardDestinationOptions"
        value-key="key"
        @change="rewardDestinationOptionChangeHandler"
      />
    </div>
    <div
      v-show="rewardDestinationOption === 2"
      class="choose-staking-node__select-reward-dest-address"
    >
      <Input
        id="select-reward-dest-address"
        :label="$t('selectAddress')"
        icon="curve-arrow"
        :value="rewardDestinationAddress"
        @input="updateRewardDestinationAddress"
      />
    </div>
  </div>
</template>

<script>
import { computed, inject } from 'vue';
import PolkadotStakeListItems from './PolkadotStakeListItems.vue';
import Input from '@/components/UI/Input';
import pointer from '@/assets/icons/pointer.svg';
import Select from '@/components/UI/Select';
import { polkadotRewardDestinationOptions } from './config';
import PolkadotUnstakeListItems from './PolkadotUnstakeListItems.vue';
import MinBalanceWarning from '@/views/Wallet/views/Stake/components/MinBalanceWarning';
export default {
  name: 'PolkadotChooseStakingNode',
  components: {
    Select,
    pointer,
    Input,
    PolkadotStakeListItems,
    PolkadotUnstakeListItems,
    MinBalanceWarning,
  },
  props: {
    amount: {
      type: [Number, String],
      default: 0,
    },
    additionalFee: {
      type: [Number, String],
    },
    rewardDestinationOption: {
      type: [String, Number],
      default: 0,
    },
    rewardDestinationAddress: {
      type: String,
      default: '',
    },
    currentWallet: {
      type: Object,
      default: () => ({}),
    },
    activeTab: {},
    list: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['update:activeTab', 'nextStep'],
  setup(props, { emit }) {
    const updateAmount = inject('updateAmount');
    const updateAdditionalFee = inject('updateAdditionalFee');
    const updateRewardDestinationAddress = inject(
      'updateRewardDestinationAddress'
    );
    const updateRewardDestinationOption = inject(
      'updateRewardDestinationOption'
    );
    const getDelegationFee = inject('getDelegationFee');
    const editMode = inject('editMode');
    const selectedNode = inject('selectedNode');
    const updateSelectedNode = inject('updateSelectedNode');
    const updateShowChooseNode = inject('updateShowChooseNode');
    const updateShowNodesList = inject('updateShowNodesList');
    const updateRedelegationDirection = inject('updateRedelegationDirection');
    const selectedNodeForRedelegation = inject('selectedNodeForRedelegation');
    const resMaxAmount = inject('resMaxAmount');
    const mode = inject('mode');

    const finalNodesList = computed(
      () => selectedNodeForRedelegation.value || props.list
    );

    const rewardDestinationOptionChangeHandler = (value) => {
      updateRewardDestinationOption(value);
    };
    const showNodesList = () => {
      updateShowChooseNode(false);
      updateShowNodesList(true);
    };
    const setActiveTab = async (value) => {
      emit('update:activeTab', value);
      updateAmount('');
      updateAdditionalFee('');
      value !== 'redelegate' &&
        (await getDelegationFee(value, selectedNode.value.address));
    };
    const maxAmount = inject('maxAmount');
    const maxAdditionalFee = inject('maxAdditionalFee');
    const insufficientFunds = inject('insufficientFunds');
    const insufficientAdditionalFee = inject('insufficientAdditionalFee');

    const showAmount = computed(() => {
      if (
        insufficientFunds.value ||
        mode.value === 'unstake' ||
        props.activeTab === 'unstake' ||
        mode.value === 'redelegate' ||
        props.activeTab === 'redelegate'
      ) {
        return false;
      }

      return true;
    });
    const showInput = computed(
      () => !(mode.value === 'redelegate' || props.activeTab === 'redelegate')
    );

    const changeMode = async (val) => {
      updateAmount('');
      updateAdditionalFee('');
      updateRewardDestinationAddress('');
      updateRewardDestinationOption(0);
      updateSelectedNode('');
      resMaxAmount.value = '';
      emit('update:activeTab', val);
      mode.value = val;

      if (val === 'unstake' || val === 'redelegate') {
        await updateSelectedNode(props.list);
      }

      if (val === 'stake') {
        await getDelegationFee(val, props.list);
      }
    };

    return {
      selectedNode,
      showNodesList,
      setActiveTab,
      editMode,
      insufficientFunds,
      insufficientAdditionalFee,
      maxAmount,
      maxAdditionalFee,
      updateAmount,
      updateAdditionalFee,
      showAmount,
      showInput,
      mode,
      selectedNodeForRedelegation,
      updateRedelegationDirection,
      updateRewardDestinationAddress,
      rewardDestinationOptionChangeHandler,
      polkadotRewardDestinationOptions,
      changeMode,
      finalNodesList,
    };
  },
};
</script>

<style lang="scss" scoped>
.choose-staking-node {
  padding-top: 16px;
  display: flex;
  width: 100%;
  flex-direction: column;
  // margin-bottom: 19px;
  &__min-balance-note {
    margin-bottom: 25px;
  }
  &__placeholder {
    height: 150px;
    border: 1px dashed $lightsteelblue;
    box-sizing: border-box;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-bottom: 24px;
    cursor: pointer;
    & span {
      font-size: 16px;
      line-height: 24px;
      color: $mid-gray;
      margin-top: 7px;
      font-family: 'Panton_SemiBold';
    }
    &--lg-md {
      & span {
        @include lg {
          width: 155px;
          margin-top: 0;
          margin-left: 17px;
        }
        @include md {
          width: 155px;
          margin-top: 0;
          margin-left: 17px;
        }
      }
      @include lg {
        height: 100px;
        flex-direction: row;
      }
      @include md {
        height: 100px;
        flex-direction: row;
      }
    }
  }
  &__selected-node {
    margin-bottom: 16px;
  }
  &__validators-note,
  &__staking-note {
    font-size: 14px;
    line-height: 22px;
    text-align: center;
    color: $mid-blue;
  }
  &__staking-note {
    text-align: left;
  }
  &__amount-input {
    height: 68px;
    position: relative;
    margin-bottom: 19px;
  }
  &__additional-fee {
    height: 68px;
    position: relative;
    margin-top: 13px;
    margin-bottom: 16px;
  }
  &__reward-destination-option {
    height: 68px;
    margin-top: 16px;
    position: relative;
  }
  &__select-reward-dest-address {
    margin-top: 16px;
    height: 68px;
    transition: 0.3s;
  }
  &__tabs-wrapper {
    height: 59px;
    border-bottom: 2px solid $too-ligth-gray;
    position: relative;
    margin-bottom: 24px;
  }
  &__tabs {
    display: flex;
    position: absolute;
    top: 8px;
  }
  &__tabs-item {
    cursor: pointer;
    font-size: 20px;
    line-height: 30px;
    text-transform: uppercase;
    color: $mid-gray;
    border-bottom: 6px solid transparent;
    margin-right: 37px;
    padding-bottom: 17px;
    font-family: 'Panton_Bold';
    &:last-child {
      margin-right: 0;
    }
  }
  &__active-tab {
    border-color: $too-dark-blue;
    color: $too-dark-blue;
  }

  &__redelegation-block {
    display: flex;
    flex-direction: column;
  }
  &__redelegation-block-subtitle {
    font-size: 14px;
    line-height: 22px;
    color: $mid-blue;
    margin-bottom: 22px;
  }
  &__available-balance,
  &__available-balance-balance,
  &__available-balance-currency {
    font-size: 12px;
    line-height: 14px;
    color: $mid-blue;
  }
  &__available-balance {
    position: absolute;
    display: flex;
    align-items: center;
    margin-top: 8px;
  }
  &__available-balance-balance {
    color: $ligth-blue;
    font-family: 'Panton_Bold' !important;
    margin-left: 6px;
    margin-right: 3px;
  }
  &__available-balance-currency {
  }
  &__input-note {
    position: absolute;
    font-size: 14px;
    line-height: 17px;
    color: $blue;
    right: 0;
    margin-top: 6px;
  }
}
.tabs {
  display: flex;
  font-size: 20px;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 24px;
  padding-bottom: 19px;
  border-bottom: 2px solid $too-ligth-gray;
  color: $mid-gray;
  &__item {
    cursor: pointer;
    &:last-child {
      margin-left: 41px;
    }
    &--active {
      color: $too-dark-blue;
      // border-bottom: 6px solid $too-dark-blue;
      // padding-bottom: 20px;
      position: relative;
      &::after {
        content: '';
        width: 100%;
        height: 6px;
        background: $too-dark-blue;
        position: absolute;
        bottom: -23px;
        right: 50%;
        transform: translateX(50%);
      }
    }
  }
}

body.dark {
  .choose-staking-node__tabs-item {
    &.choose-staking-node__active-tab {
      color: $white;
      border-bottom: 6px solid $dark-blue;
    }
  }
}
</style>
