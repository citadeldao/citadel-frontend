<template>
  <div class="rewards-block">
    <div class="rewards-block__toggle-info-icon" @click="showModal = true">
      <toogleInfo />
    </div>
    <div class="rewards-block__header">
      <span class="rewards-block__header-title">
        {{ $t('xct.rewardsBlockTitle') }}
      </span>
      <span class="rewards-block__header-subtitle">
        {{ $t('xct.rewardsBlockSubtitle') }}
      </span>
    </div>
    <table class="rewards-block__table">
      <tr>
        <th class="rewards-block__table-header" />
        <th class="rewards-block__table-header">XCT</th>
        <th class="rewards-block__table-header">
          {{ $t('otherAssets') }}
        </th>
      </tr>
      <tr>
        <td class="rewards-block__table-title">
          {{ $t('xct.stakedOnCitadel') }}
          <Tooltip>
            <template #content>
              <span :style="{ maxWidth: '200px', display: 'flex' }">
                {{ $t('netInfoGeneral.apyTooltip') }}
              </span>
            </template>
            <template #default>
              <info />
            </template>
          </Tooltip>
        </td>
        <td class="rewards-block__table-cell-other">
          <span
            v-pretty-number="{
              value: showBalance
                ? tableData.stakedCitadel.xct
                : HIDE_BALANCE_MASK,
              currency: 'XCT',
            }"
            class="rewards-block__table-cell-other-amount"
          />
          <span class="rewards-block__table-cell-other-currency">XCT</span>
        </td>
        <td class="rewards-block__table-cell-xct">
          <span class="rewards-block__table-cell-xct-currency">$</span>
          <span
            v-pretty-number="{
              value: showBalance
                ? tableData.stakedCitadel.other
                : HIDE_BALANCE_MASK,
              currency: '$',
            }"
            class="rewards-block__table-cell-xct-amount"
          />
        </td>
      </tr>
      <tr>
        <td class="rewards-block__table-title">
          {{ $t('rewardsPage.totalRewards') }}
        </td>
        <td class="rewards-block__table-cell-other">
          <span
            v-pretty-number="{
              value: showBalance ? tableData.total.xct : HIDE_BALANCE_MASK,
              currency: 'XCT',
            }"
            class="rewards-block__table-cell-other-amount"
          />
          <span class="rewards-block__table-cell-other-currency">XCT</span>
        </td>
        <td class="rewards-block__table-cell-xct">
          <span
            v-pretty-number="{
              value: showBalance ? tableData.total.other : HIDE_BALANCE_MASK,
              currency: 'XCT',
            }"
            class="rewards-block__table-cell-xct-amount"
          />
          <span class="rewards-block__table-cell-xct-currency">XCT</span>
        </td>
      </tr>
    </table>
  </div>
  <teleport v-if="showModal" to="body">
    <Modal>
      <RewardsBlockExpand
        v-click-away="modalCloseHandler"
        :table-data="tableData"
        :current-wallet="currentWallet"
        @close="modalCloseHandler"
      />
    </Modal>
  </teleport>
</template>

<script>
import RewardsBlockExpand from './RewardsBlockExpand.vue';
import Modal from '@/components/Modal';
import info from '@/assets/icons/info.svg';
import Tooltip from '@/components/UI/Tooltip';
import toogleInfo from '@/assets/icons/toggle-info.svg';
import { computed, ref } from '@vue/reactivity';
import BigNumber from 'bignumber.js';
import { useStore } from 'vuex';
import { HIDE_BALANCE_MASK } from '@/helpers/prettyNumber';

export default {
  name: 'RewardsBlock',
  components: { toogleInfo, Tooltip, info, Modal, RewardsBlockExpand },
  props: {
    holderInfo: {
      type: Object,
      default: () => ({}),
    },
    xctMarketCap: {
      type: Object,
      default: () => ({}),
    },
    currentWallet: {
      type: Object,
      default: () => ({}),
    },
    totalClaimedRewardsXCT: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const store = useStore();
    const showModal = ref(false);
    const modalCloseHandler = () => {
      showModal.value = false;
    };
    const showBalance = computed(() => store.getters['balance/showBalance']);
    const tableData = computed(() => {
      const stakedOnOtherAssets = props.holderInfo.wallets.reduce(
        (accum, item) => {
          const price = BigNumber(item.usdt)
            .dividedBy(item.amount)
            .multipliedBy(item.totalStaked)
            .toNumber();
          const adding = isNaN(price) ? 0 : price;

          return BigNumber(accum).plus(adding).toNumber();
        },
        0
      );

      return {
        xctStaking: {
          other: '-',
          xct: BigNumber(props.currentWallet.tokenBalance?.rewards)
            .times(props.xctMarketCap.priceUsd)
            .toNumber(),
        },
        stakedCitadel: {
          other: BigNumber(props.holderInfo.holder.totalUsdt).toNumber(),
          xct: BigNumber(props.currentWallet.tokenBalance?.stake).toNumber(),
        },
        total: {
          other: BigNumber(props.holderInfo.holder.claimed).toNumber(),
          xct: BigNumber(props.totalClaimedRewardsXCT).toNumber(),
        },
        stakedOnOtherAssets,
      };
    });

    return {
      tableData,
      showModal,
      HIDE_BALANCE_MASK,
      showBalance,
      modalCloseHandler,
    };
  },
};
</script>

<style lang="scss" scoped>
.rewards-block {
  width: 625px;
  height: 325px;
  border-radius: 16px;
  padding: 33px 0 0 24px;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url('~@/assets/images/xctRewardsBg.jpg');
  display: flex;
  flex-direction: column;
  position: relative;
  @include lg {
    background-image: url('~@/assets/images/xctRewardsBglg.jpg');
    padding: 25px 0 0 24px;
    width: 574px;
    height: 234px;
  }
  @include md {
    background-image: url('~@/assets/images/xctRewardsBgmd.jpg');
    padding: 25px 16px 0 24px;
    width: 469px;
    height: 211px;
  }
  &__toggle-info-icon {
    position: absolute;
    top: 36px;
    right: 32px;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    background: $white;
    border-radius: $round;
    justify-content: center;
    cursor: pointer;
    @include lg {
      background: $lavander-dark;
    }
    @include md {
      background: $lavander-dark;
    }
    & svg {
      fill: $darkgray;
    }
    @include lg {
      top: 28px;
      right: 24px;
    }
    @include md {
      top: 24px;
      right: 16px;
    }
    &:hover {
      background: $too-dark-blue;
      color: $white;
      & svg {
        fill: $white;
      }
    }
  }
  &__header {
    margin-bottom: 61px;
    display: flex;
    flex-direction: column;
    @include lg {
      margin-bottom: 31px;
    }
    @include md {
      margin-bottom: 15px;
    }
  }
  &__header-title {
    font-size: 18px;
    line-height: 22px;
    font-family: 'Panton_Bold';
    margin-bottom: 4px;
  }
  &__header-subtitle {
    font-size: 14px;
    line-height: 17px;
    color: $too-dark-blue;
  }
  &__table {
  }
  &__table-header {
    font-size: 18px;
    line-height: 30px;
    font-family: 'Panton_SemiBold';
    padding: 0;
    text-align: left;
    @include md {
      font-size: 14px;
    }
  }
  &__table-title {
    text-align: left;
    font-size: 16px;
    line-height: 45px;
    padding: 0;
    & svg {
      &:hover {
        fill: $too-dark-blue;
      }
    }
    @include lg {
      line-height: 35px;
    }
    @include md {
      font-size: 14px;
      line-height: 30px;
    }
  }
  &__table-cell-other,
  &__table-cell-xct {
    text-align: left;
    padding: 0;
  }
  &__table-cell-other-currency,
  &__table-cell-xct-currency {
    font-size: 16px;
    line-height: 45px;
    color: $slategray1;
    margin-right: 5px;
    @include lg {
      line-height: 35px;
    }
    @include md {
      line-height: 30px;
    }
  }
  &__table-cell-other-amount,
  &__table-cell-xct-amount {
    font-size: 20px;
    line-height: 45px;
    color: $dark-blue;
    font-family: 'Panton_Bold' !important;
    @include lg {
      line-height: 35px;
    }
    @include md {
      line-height: 30px;
    }
  }
  &__table-cell-other-amount {
    color: $midnightblue;
  }
}
</style>
