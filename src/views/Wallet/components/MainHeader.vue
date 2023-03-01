<template>
  <div class="main-header">
    <div class="main-header__tabs">
      <router-link
        active-class="main-header__active"
        class="main-header__tabs-item"
        :to="{
          name: 'WalletAssets',
          params: { ...$route.params },
        }"
        data-qa="wallet__assets-tab-button"
      >
        {{ $t('assets') }}
      </router-link>
      <router-link
        v-if="currentToken ? currentToken.hasStake : currentWallet.hasStake"
        active-class="main-header__active"
        class="main-header__tabs-item"
        :to="{
          name: 'WalletStake',
          params: { ...$route.params },
        }"
        data-qa="wallet__stake-tab-button"
      >
        {{ $t('stake') }}
      </router-link>
      <router-link
        v-if="currentToken?.net === OUR_TOKEN"
        active-class="main-header__active"
        class="main-header__tabs-item"
        :to="{
          name: 'WalletRewards',
          params: { ...$route.params },
        }"
        data-qa="wallet__rewards-tab-button"
      >
        {{ $t('rewards') }}
      </router-link>
      <router-link
        active-class="main-header__active"
        class="main-header__tabs-item"
        :to="{
          name: 'WalletSend',
          params: { ...$route.params },
        }"
        data-qa="wallet__send-tab-button"
      >
        {{ $t('send') }}
      </router-link>
      <router-link
        active-class="main-header__active"
        class="main-header__tabs-item"
        :to="{
          name: /* !['oasis'].includes($route.params.net)
            ? */ 'WalletTransactions',
          /* : 'WalletTransactionsOld' */ params: { ...$route.params },
        }"
        data-qa="wallet__transactions-tab-button"
      >
        {{ $t('transactions') }}
      </router-link>
    </div>
  </div>
</template>

<script>
import { OUR_TOKEN } from '@/config/walletType';
export default {
  name: 'MainHeader',
  props: {
    currentWallet: {
      type: Object,
      default: () => ({}),
    },
    currentToken: {
      type: [Object, null],
      default: null,
    },
  },
  setup() {
    return { OUR_TOKEN };
  },
};
</script>

<style lang="scss" scoped>
.main-header {
  height: 97px;
  border-bottom: 2px solid $too-ligth-gray;
  position: relative;
  @include lg {
    height: 72px;
  }
  @include md {
    height: 64px;
  }
  &__tabs {
    display: flex;
    position: absolute;
    top: 37px;
    width: 100%;
    @include lg {
      top: 28px;
    }
    @include md {
      top: 21px;
    }
  }
  &__tabs-item {
    flex: 1 20%;
    text-decoration: none;
    font-size: 20px;
    line-height: 30px;
    text-transform: uppercase;
    color: $mid-gray;
    border-bottom: 6px solid transparent;
    padding-bottom: 25px;
    margin: 0 5px;
    font-family: 'Panton_Bold';
    text-align: center;
    @include lg {
      font-size: 17px;
      padding-bottom: 10px;
    }

    @include md {
      padding-bottom: 9px;
      font-size: 14px;
    }
  }
  &__active {
    border-color: $too-dark-blue;
    color: $too-dark-blue;
  }
}
</style>
