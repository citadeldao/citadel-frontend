<template>
  <div
    v-if="type === 'stake' || button2 !== 'swap' || currentWallet.hasClaim"
    class="wallet-buttons-panel"
  >
    <button
      v-if="showRedelegationButton"
      class="wallet-buttons-panel__button wallet-buttons-panel__redelegate"
      @click.prevent="$emit('redelegationButtonClick', $event)"
    >
      <redelegate />
      {{ $t("redelegation.redelegate") }}
    </button>
    <button
      v-if="type === 'stake'"
      class="wallet-buttons-panel__button wallet-buttons-panel__button1"
      :data-qa="dataQa && `${dataQa}__${button1.toLowerCase()}-button`"
      @click.prevent="$emit('button1click', $event)"
    >
      <paperPlane />
      {{ $t(button1) }}
    </button>
    <button
      v-if="button2 !== 'swap'"
      :disabled="disabledSend || disableStake"
      class="wallet-buttons-panel__button wallet-buttons-panel__button2"
      :data-qa="dataQa && `${dataQa}__${button2.toLowerCase()}-button`"
      @click.prevent="$emit('button2click', $event)"
    >
      <paperPlane />
      {{ $t(button2) }}
    </button>
    <transition name="fade">
      <button
        v-if="currentWallet.hasClaim"
        class="
          wallet-buttons-panel__button wallet-buttons-panel__button-rewards
        "
        :data-qa="
          dataQa &&
            `${dataQa}__${currentWalletInfo?.stake ? 'rewards' : 'earn'}-button`
        "
        @click="claimButtonHandler"
      >
        <hotSale />
        <span
          v-if="!showRedelegationButton"
          class="wallet-buttons-panel__button-rewards-rewards"
        >
          {{ $t("rewards") }}
        </span>
        <div class="wallet-buttons-panel__button-rewards-count">
          <span class="wallet-buttons-panel__button-rewards-value">
            {{ prettyNumber(rewardCount) }}
          </span>
          <span class="wallet-buttons-panel__button-rewards-currency">
            {{ rewardCurrency }}
          </span>
          <span
            v-if="!currentWalletInfo?.claimableRewards"
            class="wallet-buttons-panel__button-rewards-apy"
          >
            APY
          </span>
        </div>
      </button>
    </transition>
  </div>
</template>

<script>
import redelegate from '@/assets/icons/redelegate.svg';
// import useWallets from '@/compositions/useWallets';
import hotSale from '@/assets/icons/hot-sale.svg';
import paperPlane from '@/assets/icons/paper-plane.svg';
import { computed, inject } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { prettyNumber } from '@/helpers/prettyNumber';

export default {
  name: 'WalletButtonsPanel',
  components: {
    hotSale,
    paperPlane,
    redelegate,
  },
  props: {
    disabledSend: {
      type: Boolean,
    },
    type: {
      type: String,
    },
    button1: {
      type: String,
    },
    button2: {
      type: String,
    },
    dataQa: {
      type: [String, null],
      default: null,
    },
    currentWallet: {
      type: Object,
      default: () => ({}),
    },
    currentToken: {
      type: [Object, null],
      default: null,
    },
    showRedelegationButton: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    'button2click',
    'button1click',
    'prepareClaim',
    'prepareXctClaim',
    'redelegationButtonClick',
  ],
  setup(props, { emit }) {
    // const { walletInfo } = useWallets();
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const apy = computed(() =>
      props.currentToken
        ? store.getters['subtokens/inflationInfoXCT'].yieldPct
        : store.getters['profile/formatYeldByNet'](props.currentWallet.net),
    );
    const currentWalletInfo = computed(() =>
      props.currentToken
        ? props.currentToken.tokenBalance
        : props.currentWallet.balance, // walletInfo.value.balance,
    );

    const rewardCount = computed(
      () => currentWalletInfo.value?.claimableRewards || apy.value,
    );

    const rewardCurrency = computed(() =>
      currentWalletInfo.value?.claimableRewards ? props.currentWallet.code : `%`,
    );


    const disableStake = computed(() => {
      // only for start staking button
      if (props.button2 === 'startStaking') {
        const canStake = inject('canStake');

        return !canStake.value;
      }

      return false;
    });


    const claimButtonHandler = () => {
      if (currentWalletInfo.value?.claimableRewards) {
        props.currentToken ? emit('prepareXctClaim') : emit('prepareClaim');
        emit('prepareClaim');
      } else {
        router.push({ name: 'WalletStake', params: { ...route.params } });
      }
    };

    return {
      currentWalletInfo,
      rewardCount,
      rewardCurrency,
      claimButtonHandler,
      prettyNumber,
      disableStake,
    };
  },
};
</script>

<style lang="scss" scoped>
.wallet-buttons-panel {
  display: none;
  padding: 12px 0 12px 0;
  height: 48px;
  background: $white;
  box-shadow: -10px 4px 50px rgba(0, 0, 0, 0.1);
  border-radius: 0px 0px 8px 8px;
  @include md {
    display: flex;
  }
  &__button {
    flex: 1 1 0px;
    background: $white;
    font-size: 14px;
    line-height: 17px;
    padding: 0 4px;
    font-family: "Panton_SemiBold";
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    &:not(:last-child) {
      border-right: 1px dashed $darkgray;
    }
  }
  &__button1,
  &__button2 {
    &:hover {
      color: $blue;
      & svg {
        fill: $blue;
      }
    }
    & svg {
      fill: $dark-blue;
      margin-right: 8px;
    }
    &:disabled {
      color: $gray;
      & svg {
        fill: $gray;
        margin-right: 8px;
      }
      cursor: auto;
    }
  }
  &__redelegate {
    color: $ligth-blue;
    & svg {
      width: 30px;
      height: 16px;
      margin-right: 7px;
    }
    &:hover {
      color: $blue;
      & svg {
        fill: $blue;
      }
    }
  }
  &__button1 {
    & svg {
      fill: $mid-blue;
    }
  }

  &__button-rewards {
    &:hover {
      .wallet-buttons-panel__button-rewards-value{
        color: $dark-blue;
      }
      & svg {
        fill: $dark-blue;
      }
    }
    & svg {
      width: 13px;
      height: 16px;
      fill: $ligth-blue;
      margin-right: 7px;
    }
  }
  &__button-rewards-count {
    display: flex;
    align-items: center;
  }
  &__button-rewards-value,
  &__button-rewards-currency,
  &__button-rewards-apy,
  &__button-rewards-rewards {
    font-size: 14px;
    line-height: 17px;
    font-family: "Panton_Regular";
  }
  &__button-rewards-rewards {
    font-family: "Panton_SemiBold";
    margin-right: 8px;
  }
  &__button-rewards-value {
    color: $ligth-blue;
    font-family: "Panton_Bold";
  }

  &__button-rewards-currency,
  &__button-rewards-apy {
    color: $black;
    margin-left: 3px;
  }
  &__button-rewards-apy {
    color: $darkgray;
  }
}
</style>
