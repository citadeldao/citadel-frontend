<template>
  <div class="balance">
    <div
      v-if="$store.getters['wallets/currentWallet'].hasSubtoken"
      class="balance__current-asset"
    >
      <CurrentAsset
        :current-wallet="currentWallet"
        :isNativeToken="!isCurrentToken"
      />
    </div>

    <div class="balance__header">
      <div class="balance__title">
        <h4>{{ $t('balance') }}</h4>
        <el-tooltip
          v-if="currentWallet?.hasStake || currentWallet?.hasResource"
          placement="bottom"
          effect="rewards-list-tooltip"
        >
          <info />
          <template #content>
            <BalanceTooltipInfo :current-wallet="currentWallet" />
          </template>
        </el-tooltip>
      </div>
      <div class="balance__tab-current" @click="showTabs">
        <NetworkTab
          v-model:currentTab="currentTab"
          :is-current-token="isCurrentToken"
          :current-token="currentWallet"
          :value="balanceTabs[currentTab].value"
          :icon="balanceTabs[currentTab].icon"
          :data-qa="balanceTabs[currentTab].dataQA"
        />
        <ArrowDown :class="`${isOpened}`" />
      </div>
      <div class="balance__tabs" :class="dropdownClass">
        <div class="balance__tab">
          <NetworkTab
            :id="1"
            v-model:currentTab="currentTab"
            :is-current-token="isCurrentToken"
            :current-token="currentWallet"
            :value="currentWallet.code"
            :icon="currentWallet.net"
            :data-qa="`wallet__balance--${currentWallet.code.toLowerCase()}`"
            @click="onClickNetworkTab"
          />
        </div>
        <div class="balance__tab">
          <NetworkTab
            :id="2"
            v-model:currentTab="currentTab"
            value="USD"
            icon="USD"
            data-qa="wallet__balance--usd"
            @click="onClickNetworkTab"
          />
        </div>
        <div v-if="currentWallet.net !== 'btc'" class="balance__tab">
          <NetworkTab
            :id="3"
            v-model:currentTab="currentTab"
            value="BTC"
            icon="btc"
            data-qa="wallet__balance--btc"
            @click="onClickNetworkTab"
          />
        </div>
      </div>
    </div>
    <span class="balance__balance">
      <span
        v-pretty-number="{ value: mainBalance, currency: currentTab }"
        data-qa="available-balance-value"
      />
      <span class="balance__currency"> {{ currentTab }}</span>
    </span>
    <div v-if="currentWallet.hasStake" class="balance__info">
      <div class="balance__info-line">
        <span class="balance__info-title"> {{ $t('staked') }} </span>
        <div class="balance__info-white-space" />
        <span class="balance__info-value">
          <span
            v-pretty-number="{ value: balance.stake, currency: currentTab }"
          />
          <span class="balance__info-currency">
            {{ currentTab }}
          </span>
        </span>
      </div>
      <div class="balance__info-line">
        <span class="balance__info-title"> {{ $t('available') }} </span>
        <div class="balance__info-white-space" />
        <span class="balance__info-value">
          <span
            v-pretty-number="{
              value: balance.mainBalance,
              currency: currentTab,
            }"
            data-qa="available-balance-value"
          />
          <span class="balance__info-currency">
            {{ currentTab }}
          </span>
        </span>
      </div>
      <div v-if="currentWallet.unstakeingPerioud" class="balance__info-line">
        <span class="balance__info-title">
          <span class="balance__info-title__text">{{ $t('frozen') }}</span>
          <Tooltip v-if="balance.frozen?.length">
            <clock />
            <template #content>
              <div class="frozen-tooltip">
                {{ $t('balanceTooltipInfo.frozenBalanceTooltipTitle') }}:
                <div
                  v-for="(item, index) of balance.frozen"
                  :key="`${index}_${item.date}`"
                >
                  <span class="frozen-tooltip__amount">
                    <span v-pretty-number="item.amount" />
                  </span>
                  {{ currentWallet.code }}
                  <span> - </span>
                  <span
                    class="frozen-tooltip__date"
                    v-html="getFrozenTime(item.date)"
                  />
                </div>
              </div>
            </template>
          </Tooltip>
        </span>
        <div class="balance__info-white-space" />
        <span class="balance__info-value">
          <span
            v-pretty-number="{
              value: balance.frozenBalance,
              currency: currentTab,
            }"
          />
          <span class="balance__info-currency">
            {{ currentTab }}
          </span>
        </span>
      </div>
    </div>
    <div v-if="currentWallet.hasPledged" class="balance__pledged-balance">
      <div
        v-if="currentWallet?.type === WALLET_TYPES.PUBLIC_KEY"
        class="balance__pledged-balance-lock"
      >
        <claimBlockLock />
      </div>
      <div class="balance__pledged-balance-title">
        <span class="balance__pledged-balance-title-title">
          {{ $t('pledgedBalance') }}
        </span>
        <el-tooltip placement="bottom" effect="rewards-list-tooltip">
          <info />
          <template #content>
            <span class="balance__pledged-balance-tooltip-info">
              {{ $t('pledgeDescription.part1') }}
              <span class="balance__pledged-balance-tooltip-info-gas">{{
                $t('pledgeDescription.part2')
              }}</span>
              {{ $t('pledgeDescription.part3') }}
              <span class="balance__pledged-balance-tooltip-info-day">{{
                $t('pledgeDescription.part4')
              }}</span
              >{{ $t('pledgeDescription.part5') }}
            </span>
          </template>
        </el-tooltip>
      </div>
      <span class="balance__info-value">
        <span
          v-pretty-number="{
            value: pledgedBalance,
            currency: currentWallet.code,
          }"
        />
        <span class="balance__info-currency"> {{ currentWallet.code }} </span>
      </span>
      <RoundArrowButton
        v-if="currentWallet?.type !== WALLET_TYPES.PUBLIC_KEY"
        @click="openPledgeModal"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import BigNumber from 'bignumber.js';
import BalanceTooltipInfo from './BalanceTooltipInfo';
import CurrentAsset from './CurrentAsset';
import Tooltip from '@/components/UI/Tooltip';
import NetworkTab from '@/components/UI/NetworkTab';
import RoundArrowButton from '@/components/UI/RoundArrowButton';
import { WALLET_TYPES } from '@/config/walletType';
import info from '@/assets/icons/info.svg';
import clock from '@/assets/icons/clock2.svg';
import claimBlockLock from '@/assets/icons/claim-block-lock.svg';
import ArrowDown from '@/assets/icons/arrow-down.svg';

export default {
  name: 'Balance',
  components: {
    NetworkTab,
    info,
    clock,
    Tooltip,
    BalanceTooltipInfo,
    RoundArrowButton,
    claimBlockLock,
    CurrentAsset,
    ArrowDown,
  },
  props: {
    currentWallet: {
      type: Object,
      default: () => ({}),
    },
    currency: {
      type: Object,
      default: () => ({}),
    },
    isCurrentToken: {
      type: Boolean,
      default: false,
    },
    pledgedBalance: {},
  },
  setup(props) {
    const { t } = useI18n();
    const openPledgeModal = inject('openPledgeModal');
    const currentTab = ref(props.currentWallet.code);
    const currentCurrency = computed(() => {
      if (props.isCurrentToken) {
        return props.currentWallet?.tokenBalance?.price[currentTab.value];
      }

      return props.currency[currentTab.value];
    });
    const currentKtAddress = inject('currentKtAddress');
    const balance = computed(() => {
      const { stake, mainBalance, frozenBalance, frozen } = props.isCurrentToken
        ? props.currentWallet?.tokenBalance
        : currentKtAddress.value
        ? currentKtAddress.value.balance
        : props.currentWallet.balance;

      if (currentTab.value === props.currentWallet.code) {
        return {
          stake,
          mainBalance,
          frozenBalance,
          frozen,
        };
      }

      return {
        stake: BigNumber(currentCurrency.value).times(stake).toNumber(),
        mainBalance: BigNumber(currentCurrency.value)
          .times(mainBalance)
          .toNumber(),
        frozenBalance: BigNumber(currentCurrency.value)
          .times(frozenBalance)
          .toNumber(),
      };
    });

    const mainBalance = computed(() => {
      const balance = props.isCurrentToken
        ? props.currentWallet?.tokenBalance.calculatedBalance
        : currentKtAddress.value
        ? currentKtAddress?.value?.balance.calculatedBalance
        : props.currentWallet.balance.calculatedBalance;

      if (balance === 0) {
        return balance;
      }

      if (currentTab.value === props.currentWallet.code) {
        return BigNumber(balance).toNumber();
      }

      return BigNumber(currentCurrency.value).times(balance).toNumber();
    });

    const getFrozenTime = (timestamp) => {
      const SECS_IN_DAY = 60 * 60 * 24;
      const SECS_IN_HOUR = 60 * 60;
      const SECS_IN_MINUTE = 60;
      const frozenTime = Math.abs(new Date(timestamp) - new Date()) / 1000;
      const frozenDays = Math.floor(frozenTime / SECS_IN_DAY);
      const frozenHours = Math.floor(
        (frozenTime - frozenDays * SECS_IN_DAY) / SECS_IN_HOUR
      );
      const frozenMinutes = Math.floor(
        (frozenTime - frozenDays * SECS_IN_DAY - frozenHours * SECS_IN_HOUR) /
          SECS_IN_MINUTE
      );

      return `
        ${frozenDays ? `<span>${frozenDays}</span> ${t('days')}` : ''}
        ${frozenHours ? `<span>${frozenHours}</span> ${t('hours')}` : ''}
        ${frozenMinutes ? `<span>${frozenMinutes}</span> ${t('minutes')}` : ''}
      `;
    };

    watch(
      () => props.currentWallet,
      () => {
        currentTab.value = props.currentWallet.code;
        balanceTabs[props.currentWallet.code] = {
          icon: props.currentWallet.net,
          value: props.currentWallet.code,
          dataQA: `wallet__balance--${props.currentWallet.code.toLowerCase()}`,
        };
      }
    );

    const balanceTabs = {
      BTC: {
        value: 'BTC',
        icon: 'btc',
        dataQA: 'wallet__balance--btc',
      },
      USD: {
        value: 'USD',
        icon: 'USD',
        dataQA: 'wallet__balance--usd',
      },
    };

    balanceTabs[props.currentWallet.code] = {
      icon: props.currentWallet.net,
      value: props.currentWallet.code,
      dataQA: `wallet__balance--${props.currentWallet.code.toLowerCase()}`,
    };

    const dropdownClass = ref('');
    const isOpened = ref(false);
    const showTabs = () => {
      dropdownClass.value = dropdownClass.value == '' ? 'active' : '';
      isOpened.value = !isOpened.value;
    };

    const onClickNetworkTab = () => {
      dropdownClass.value = '';
      isOpened.value = false;
    };
    return {
      currentTab,
      balance,
      mainBalance,
      getFrozenTime,
      openPledgeModal,
      WALLET_TYPES,
      balanceTabs,
      dropdownClass,
      showTabs,
      isOpened,
      onClickNetworkTab,
    };
  },
};
</script>

<style lang="scss" scoped>
.balance {
  width: 100%;
  padding: 24px 27px 22px 25px;
  display: flex;
  flex-direction: column;
  background: $white;
  border-radius: 16px;
  @include lg {
    padding: 30px 27px 21px 26px;
  }
  @include md {
    padding: 16px 16px 23px 17px;
  }

  @include laptop {
    padding: 20px;
    border-radius: 8px;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    @include md {
      margin-bottom: 8px;
    }
  }

  &__title {
    display: flex;
    align-items: center;

    & svg {
      &:hover {
        fill: $too-dark-blue;
      }
    }

    & h4 {
      font-size: 20px;
      line-height: 30px;
      margin: 0;
      font-family: 'Panton_Bold';
      margin-right: 5px;
      text-transform: capitalize;
      @include laptop-standard {
        font-size: $default-size;
        line-height: 19px;
      }
    }
    .tooltip {
      height: 14px;
    }
  }

  &__tabs {
    display: flex;
  }

  &__tab {
    margin-right: 8px;

    &:last-child {
      margin-right: 0;
    }
  }

  &__balance {
    font-size: 28px;
    line-height: 34px;
    color: $blue;
    font-family: 'Panton_Bold';
    margin-bottom: 17px;
    @include lg {
      font-size: 24px;
      line-height: 29px;
      margin-bottom: 15px;
    }
    @include md {
      font-size: 22px;
      line-height: 26px;
      margin-bottom: 10px;
    }
  }

  &__currency {
    font-family: 'Panton_Regular';
    color: $black;
  }

  &__info {
    display: flex;
    flex-direction: column;
  }

  &__info-line {
    display: flex;
    width: 100%;
    margin-bottom: 11px;
    align-items: baseline;

    &:last-child {
      margin-bottom: 0;
    }

    @include md {
      margin-bottom: 7px;
    }
  }

  &__info-title {
    font-size: 16px;
    line-height: 19px;
    font-family: 'Panton_Bold';
    white-space: nowrap;
    display: flex;
    align-items: center;

    @include md {
      font-size: 14px;
      line-height: 17px;
    }

    &__text {
      padding-right: 5px;
      font-family: inherit;
    }
  }

  &__info-white-space {
    flex-grow: 1;
    border-bottom: 1px dashed $gainsboro;
  }

  &__info-value {
    font-size: 16px;
    line-height: 19px;
    font-family: 'Panton_Bold';
    color: $ligth-blue;
    @include md {
      font-size: 14px;
      line-height: 17px;
    }
  }

  &__info-currency {
    font-family: 'Panton_Light';
    color: $black;
  }

  &__pledged-balance {
    position: relative;
    border-top: 1px dashed $gainsboro;
    padding-top: 16px;
    margin-top: 14px;
    display: none;
    flex-direction: column;

    & button {
      position: absolute;
      bottom: 0;
      right: 0;
    }

    @include md {
      display: flex;
    }
  }

  &__pledged-balance-title {
    display: flex;
    align-items: center;
    margin-bottom: 3px;

    & svg {
      &:hover {
        fill: $too-dark-blue;
      }
    }
  }

  &__pledged-balance-title-title {
    font-size: 14px;
    line-height: 17px;
    font-family: 'Panton_SemiBold';
    color: $too-dark-blue;
    margin-right: 5px;
  }

  &__pledged-balance-tooltip-info {
    font-family: 'Panton_Light';
    font-size: 12px;
    line-height: 16px;
    color: $mid-blue;
    max-width: 195px;
    display: block;
  }

  &__pledged-balance-tooltip-info-gas {
    color: $ligth-blue;
    font-family: 'Panton_SemiBold';
  }

  &__pledged-balance-tooltip-info-day {
    color: $too-dark-blue;
    font-family: 'Panton_SemiBold';
  }

  &__pledged-balance-lock {
    position: absolute;
    bottom: 0;
    right: 0;

    & svg {
      width: 22px;
      height: 43px;
      fill: $turquoise;
    }
  }

  &__current-asset {
    margin-bottom: 16px;
    @include laptop {
      display: none;
    }
  }
}
</style>

<style lang="scss">
.frozen-tooltip {
  font-size: 12px;
  line-height: 1.5;
  color: $black;
  font-family: 'Panton_SemiBold';

  &__amount {
    font-family: 'Panton_Bold';
    color: $blue;
  }

  &__date {
    span {
      font-family: 'Panton_Regular';
      color: $blue;
    }
  }
}

.balance {
  &__header {
    position: relative;
  }

  &__tabs {
    @include laptop {
      flex-direction: column;
      align-items: center;

      position: absolute;
      right: 0;
      top: 30px;
      width: 48px;
      background-color: $white;
      border: 1px solid $too-ligth-blue;
      border-radius: 2px;
      opacity: 0;
      z-index: -5;
      transform: translateY(-10%);

      &.active {
        opacity: 1;
        z-index: 3;
        transform: translateY(0);
      }

      .network-tab {
        width: 100%;
        background-color: transparent;
        &:hover {
          background: transparent !important;
        }
        img {
          filter: invert(56%) sepia(52%) saturate(311%) hue-rotate(171deg)
            brightness(91%) contrast(95%) !important;
        }
        & span {
          color: $mid-blue !important;
        }
      }
      & svg {
        height: 14px;
        fill: $mid-blue !important;
      }

      .balance__tab {
        margin: 0;
        transition: 0.2s;
        width: 48px;
        cursor: pointer;
        &:hover {
          background-color: $too-dark-blue;
          svg {
            fill: $white !important;
          }

          img {
            filter: brightness(0) invert(1) !important;
          }

          span {
            color: $white !important;
          }
        }
        &-active {
          background-color: $dark-blue;
          & svg {
            fill: $white;
          }
        }
        .network-tab__logo-icon-placeholder span {
          left: 16px;
        }
        .network-tab__logo-icon-placeholder span:last-child {
          left: 24px;
        }
      }
    }
  }

  &__tab-current {
    display: none;
    align-items: center;
    justify-content: space-around;
    border: 1px solid $too-ligth-blue;
    border-radius: 2px;
    width: 48px;
    cursor: pointer;
    & > svg {
      height: 8px;
      fill: $too-ligth-blue;
      &.true {
        transform: rotate(180deg);
      }
    }

    .network-tab-active,
    .network-tab-active:hover {
      background: transparent;
      svg {
        fill: $dark-blue;
      }
      img {
        filter: invert(56%) sepia(52%) saturate(311%) hue-rotate(171deg)
          brightness(91%) contrast(95%) !important;
      }
      & span {
        color: $dark-blue !important;
      }
    }

    @include laptop {
      display: flex;
    }
  }
}
</style>
