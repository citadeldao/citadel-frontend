<template>
  <div v-if="place === 'singleStake'" class="send-direction">
    <div class="send-direction__line">
      <span class="send-direction__line-title">{{ $t('address') }}: </span>
      <span class="send-direction__line-from">
        {{ wallet?.address }}
      </span>
    </div>
    <div class="send-direction__line">
      <span class="send-direction__line-title">
        {{ $t('singleStake.undelegateFrom') }}:
      </span>
      <span class="send-direction__line-undelegate-from">
        {{ delegation.from }}
      </span>
    </div>
    <div class="send-direction__line">
      <span class="send-direction__line-title">
        {{ $t('singleStake.delegateTo') }}:
      </span>
      <span
        class="send-direction__line-delegate-to"
        :style="{
          color:
            (activeTab === 'redelegate' || mode === 'redelegate') && '#00a3ff',
        }"
      >
        {{ delegation.to }}
      </span>
    </div>
    <div class="send-direction__line">
      <span class="send-direction__line-title">
        {{ $t(titles.amountTitle) }}:
      </span>
      <div>
        <span
          v-pretty-number="{ value: amount, currency: wallet?.code }"
          class="send-direction__line-amount"
        />
        <span class="send-direction__line-currency"> {{ wallet?.code }} </span>
      </div>
    </div>
    <div class="send-direction__line">
      <span class="send-direction__line-title"> {{ $t('fee') }}: </span>
      <div>
        <span
          v-pretty-number="{ value: fee || 0, currency: wallet?.code }"
          class="send-direction__line-fee-amount"
        />
        <span class="send-direction__line-currency"> {{ wallet?.code }} </span>
      </div>
    </div>
    <span class="send-direction__line-title">
      <a
        v-for="item in txUrl"
        :key="item"
        :href="item"
        class="send-direction__line"
        target="_blank"
      >
        {{ $t('viewTranscasction')
        }}<linkIcon class="send-direction__link-icon"
      /></a>
    </span>
  </div>
  <div v-else class="send-direction">
    <div v-if="titles.title1" class="send-direction__line">
      <span class="send-direction__line-title">{{ $t(titles.title1) }}: </span>
      <span class="send-direction__line-from">
        {{ wallet?.address }}
      </span>
    </div>
    <div v-if="to && !currentToken" class="send-direction__line">
      <span class="send-direction__line-title"> {{ $t(titles.title2) }}: </span>
      <span class="send-direction__line-to">
        {{ to }}
      </span>
    </div>
    <div class="send-direction__line">
      <span class="send-direction__line-title">
        {{ $t(titles.amountTitle) }}:
      </span>
      <div>
        <span
          v-pretty-number="{ value: amount, currency: wallet?.code }"
          class="send-direction__line-amount"
        />
        <span class="send-direction__line-currency"> {{ wallet?.code }} </span>
      </div>
    </div>
    <div class="send-direction__line">
      <span class="send-direction__line-title"> {{ $t('fee') }}: </span>
      <div v-if="wallet.hasResource">
        <template v-for="item in adding" :key="item.name">
          <span
            v-pretty-number="item.value"
            class="send-direction__line-fee-amount"
          />
          <span class="send-direction__line-currency">
            {{ item.nameForUser }}
          </span>
          &nbsp;&nbsp;
        </template>
      </div>
      <div v-else>
        <span
          v-pretty-number="{ value: fee || 0, currency: wallet?.code }"
          class="send-direction__line-fee-amount"
        />
        <span class="send-direction__line-currency">
          {{ currentToken ? currentToken.parentCoin.code : wallet?.code }}
        </span>
      </div>
    </div>
    <span class="send-direction__line-title">
      <div v-for="item in txUrl" :key="item" class="send-direction__line">
        {{ $t('viewTranscasction')
        }}<a :href="item" target="_blank">
          <linkIcon class="send-direction__link-icon"
        /></a>
      </div>
    </span>
  </div>
</template>

<script>
import linkIcon from '@/assets/icons/link.svg';
import { computed, inject } from 'vue';

export default {
  name: 'SendDirection',
  components: { linkIcon },
  props: {
    to: {
      type: String,
    },
    amount: {
      type: [String, Number],
    },
    wallet: {
      type: Object,
    },
    txHash: {
      type: Array,
      default: () => [],
    },
    fee: {},
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
  },

  setup(props) {
    const txUrl = computed(() => {
      const data = [];

      if (props.txHash) {
        const filteredData = props.txHash?.filter((item) => item);

        for (const item of filteredData) {
          data.push(props.wallet?.getTxUrl(props.wallet.id, item));
        }
      }

      return data;
    });
    const activeTab = inject('activeTab');
    const mode = inject('mode');

    const titles = computed(() => {
      if (mode.value === 'unstake' || activeTab.value === 'unstake') {
        return {
          title1: 'unstaking.unstakeTo',
          title2: 'unstaking.unstakeFrom',
          amountTitle: 'unstaking.amountToUnstake',
        };
      } else if (mode.value === 'stake' || activeTab.value === 'stake') {
        return {
          title1: 'staking.stakeFrom',
          title2: 'staking.stakeOn',
          amountTitle: 'staking.amountToStake',
        };
      } else if (
        activeTab.value === 'pledge' ||
        activeTab.value === 'unpledge'
      ) {
        return {
          amountTitle: 'amount',
        };
      } else if (
        activeTab.value === 'redelegate' ||
        activeTab.value === 'redelegate'
      ) {
        return {
          title1: 'address',
          amountTitle: 'amount',
        };
      }

      return {
        title2: 'claim.claimTo',
        amountTitle: 'claim.amountToClaim',
      };
    });

    return { txUrl, titles, activeTab, mode };
  },
};
</script>

<style lang="scss" scoped>
.send-direction {
  display: flex;
  flex-direction: column;
  &__line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 8px;
    text-decoration: none;
    color: inherit;
    a {
      line-height: initial;
    }
    & svg {
      margin-left: 10px;
    }
    &:first-child {
      margin-top: 0;
    }
  }

  &__line-title {
    font-size: 14px;
    line-height: 30px;
    color: $gray;
    display: flex;
    align-items: center;
  }
  &__link-icon {
    width: 17px;
    height: 15px;
  }
  &__line-from,
  &__line-to {
    font-size: 14px;
    line-height: 30px;
  }

  &__line-amount,
  &__line-fee-amount {
    font-family: 'Panton_Bold' !important;
    font-size: 16px;
    line-height: 19px;
    color: $blue;
  }

  &__line-currency {
    font-size: 14px;
    line-height: 17px;
    color: $mid-gray;
  }
  &__line-to,
  &__line-undelegate-from,
  &__line-delegate-to {
    font-size: 14px;
    line-height: 30px;
    font-family: 'Panton_Bold';
    color: $dark-blue;
  }
  &__line-delegate-to,
  &__line-fee-amount {
    color: $red;
  }
}
</style>
