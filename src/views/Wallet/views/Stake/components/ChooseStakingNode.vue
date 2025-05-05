<template>
  <div class="choose-staking-node">
    <div
      v-if="!selectedNode && !isWithoutDelegation"
      class="choose-staking-node__placeholder"
      data-qa="staking__node-list-button"
      @click="showNodesList"
    >
      <pointer />
      <span>{{ $t('stakePlaceholder.choseNodePlaceholderNote') }} </span>
    </div>
    <div
      v-if="selectedNode && !isWithoutDelegation"
      class="choose-staking-node__selected-node"
    >
      <StakeListItem
        title-max-width="230"
        :icon="currentWallet.net"
        :item="selectedNode"
        :current-wallet="currentWallet"
        :balance="currentWallet.balance"
        button-text="settings.changeEmail.button"
        @editClick="updateRedelegationDirection('from')"
      />
    </div>
    <div v-if="false" class="unstaking-period">Staking in progress...</div>
    <div v-if="true" class="choose-staking-node__tabs-wrapper">
      <div class="choose-staking-node__tabs">
        <span
          :class="{ 'choose-staking-node__active-tab': activeTab === 'stake' }"
          class="choose-staking-node__tabs-item"
          @click="setActiveTab('stake')"
        >
          {{ $t('stake') }}
        </span>
        <span
          v-if="
            currentWallet.net !== 'solana' ||
            (selectedNode && !selectedNode?.deactivationDate)
          "
          :class="{
            'choose-staking-node__active-tab': activeTab === 'unstake',
          }"
          class="choose-staking-node__tabs-item"
          @click="setActiveTab('unstake')"
        >
          {{
            !selectedNode?.activationDate &&
            !selectedNode?.deactivationDate &&
            selectedNode?.isInactive === 'Inactive'
              ? 'Withdraw'
              : $t('unstake')
          }}
        </span>
        <span
          v-if="currentWallet.hasRedelegation && !isWithoutDelegation"
          :class="{
            'choose-staking-node__active-tab': activeTab === 'redelegate',
          }"
          class="choose-staking-node__tabs-item"
          @click="setActiveTab('redelegate')"
        >
          {{ $t('redelegation.redelegate') }}
        </span>
      </div>
    </div>
    <div
      v-if="activeTab === 'redelegate' || mode === 'redelegate'"
      class="choose-staking-node__redelegation-block"
    >
      <span
        class="choose-staking-node__redelegation-block-subtitle"
        v-html="$t('redelegation.redelegationDesc')"
      />
      <div
        v-if="!selectedNodeForRedelegation"
        class="choose-staking-node__placeholder choose-staking-node__placeholder--lg-md"
        data-qa="staking__node-list-button"
        @click="showNodesList('to')"
      >
        <pointer />
        <span>{{ $t('redelegation.choseNodePlaceholderNote') }} </span>
      </div>
      <div v-else class="choose-staking-node__selected-node">
        <StakeListItem
          title-max-width="230"
          :icon="currentWallet.net"
          :item="selectedNodeForRedelegation"
          :current-wallet="currentWallet"
          :balance="currentWallet.balance"
          :redelegation-node-to="true"
          button-text="settings.changeEmail.button"
          @editClick="updateRedelegationDirection('to')"
        />
      </div>
    </div>
    <div v-if="showInput" class="choose-staking-node__amount-input">
      <Input
        :disabled="activeInput || disabledAmount"
        id="amount"
        :value="amount"
        :label="$t('amount')"
        :decimals="currentWallet?.config?.decimals"
        type="currency"
        :currency="currentWallet.code"
        :max="maxAmount"
        icon="coins"
        placeholder="0.0"
        :error="insufficientFunds"
        :show-set-max="!activeInput"
        data-qa="staking__amount-field"
        @input="updateAmount"
        @keyup.enter="$emit('nextStep')"
      />
      <div class="choose-staking-node__info-wrapper">
        <span v-if="showAmount" class="choose-staking-node__available-balance">
          {{
            currentWallet.net === 'stacks'
              ? 'Maximum required balance for stacking'
              : $t('balanceTooltipInfo.availableBalance')
          }}:
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
      <template v-if="currentWallet.net === 'stacks'">
        <Input
          id="rewardAddress"
          :value="btcRewardAddress"
          label="BTC Reward address"
          :max="maxAmount"
          type="text"
          :style="{ marginTop: '15px' }"
          placeholder="Enter your Bitcoin address"
          :show-error-text="!btcRewardAddress"
          :error="
            incorrectPassword && confirmPassword ? 'Incorrect password' : ''
          "
        />
        <span v-if="showAmount" class="choose-staking-node__available-balance"
          >This Bitcoin address will be used to receive BTC rewards at the end
          of each PoX cycle. You can change it if needed.</span
        >
      </template>
    </div>
  </div>
</template>

<script>
import { computed, inject, ref, onMounted } from 'vue';
import StakeListItem from './StakeListItem.vue';
import Input from '@/components/UI/Input';
import pointer from '@/assets/icons/pointer.svg';
export default {
  name: 'ChooseStakingNode',
  components: { pointer, Input, StakeListItem },
  props: {
    amount: {
      type: [Number, String],
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
    const getDelegationFee = inject('getDelegationFee');
    const editMode = inject('editMode');
    const isWithoutDelegation = inject('isWithoutDelegation');
    const selectedNode = inject('selectedNode');
    const updateShowChooseNode = inject('updateShowChooseNode');
    const updateShowNodesList = inject('updateShowNodesList');
    const updateRedelegationDirection = inject('updateRedelegationDirection');
    const selectedNodeForRedelegation = inject('selectedNodeForRedelegation');
    const btcRewardAddress = ref('');
    const mode = inject('mode');
    const showNodesList = (direction = '') => {
      if (insufficientFunds.value) return;
      updateRedelegationDirection(direction);
      updateShowChooseNode(false);
      updateShowNodesList(true);
    };

    const setActiveTab = async (value) => {
      emit('update:activeTab', value);
      updateAmount('');
      value !== 'redelegate' &&
        (await getDelegationFee(
          value,
          isWithoutDelegation.value ? '' : selectedNode.value
        ));
    };

    const maxAmount = inject('maxAmount');
    // updateAmount(maxAmount.value);
    const insufficientFunds = inject('insufficientFunds');

    const checkActiveTab = (targetTab) => {
      return mode.value === targetTab || props.activeTab === targetTab;
    };

    const showAmount = computed(() => {
      if (
        insufficientFunds.value ||
        checkActiveTab('unstake') ||
        checkActiveTab('redelegate')
      ) {
        return false;
      }

      return true;
    });
    const showInput = computed(() => {
      if (props.currentWallet.isSingleStake) {
        return false;
      }

      return true;
    });

    const activeInput = computed(() => {
      if (checkActiveTab('redelegate')) {
        return !selectedNodeForRedelegation.value;
      }
      return false;
    });

    const disabledAmount = ref(false);

    onMounted(() => {
      if (props.currentWallet.net === 'stacks') {
        btcRewardAddress.value = props.currentWallet.btcAddress;
      }
      if (props.currentWallet.net === 'solana') {
        if (props.activeTab === 'unstake') {
          // active
          if (
            selectedNode?.value?.isInactive === 'Active' &&
            !selectedNode?.value?.activationDate &&
            !selectedNode?.value?.deactivationDate
          ) {
            updateAmount(maxAmount.value);
            disabledAmount.value = true;
          }
        }
        // if (
        //   selectedNode?.value?.isInactive === 'Inactive' &&
        //   !selectedNode?.value?.activationDate &&
        //   !selectedNode?.value?.deactivationDate &&
        //   props.activeTab !== 'unstake'
        // ) {
        //   setTimeout(() => {
        //     setActiveTab('unstake');
        //   }, 500);
        // }
      }
    });

    return {
      selectedNode,
      showNodesList,
      setActiveTab,
      editMode,
      insufficientFunds,
      maxAmount,
      updateAmount,
      showAmount,
      showInput,
      mode,
      selectedNodeForRedelegation,
      updateRedelegationDirection,
      isWithoutDelegation,
      activeInput,
      disabledAmount,
      btcRewardAddress,
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

  .unstaking-period {
    font-size: 16px;
    text-align: center;
    color: #6b93c0;
    margin-top: 10px;
  }
  // margin-bottom: 19px;
  &__placeholder {
    height: 140px;
    border: 1px dashed $lightsteelblue;
    box-sizing: border-box;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-bottom: 10px;
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
  &__amount-input {
    height: 68px;
    position: relative;
    margin-bottom: 19px;
  }
  &__tabs-wrapper {
    height: 59px;
    border-bottom: 2px solid $too-ligth-gray;
    position: relative;
    margin-bottom: 24px;

    @include md {
      height: 52px;
    }
    @include laptop {
      height: 48px;
    }
  }
  &__tabs {
    width: 100%;
    display: flex;
    position: absolute;
    top: 8px;
  }
  &__tabs-item {
    width: 100%;
    display: flex;
    justify-content: center;
    cursor: pointer;
    font-size: $h5-size;
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

    @include md {
      font-size: $default-size;
      padding-bottom: 10px;
    }

    @include laptop {
      font-size: $small-lg;
      padding-bottom: 5px;
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
  &__info-wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  &__available-balance,
  &__available-balance-balance,
  &__available-balance-currency {
    font-size: 12px;
    line-height: 14px;
    color: $mid-blue;
  }
  &__available-balance {
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
    font-size: 14px;
    line-height: 17px;
    color: $blue;
    margin-top: 8px;
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
