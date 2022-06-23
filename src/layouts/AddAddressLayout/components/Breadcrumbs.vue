<template>
  <div class="breadcrumbs">
    <div
      class="breadcrumbs-item breadcrumbs-item--menu"
      data-qa="breadcrumbs-menu"
      @click.self="goToOverall"
    >
      {{ currentListName }}
      <div class="breadcrumbs-item__menu">
        <CustomLists />
      </div>
    </div>
    <div
      v-if="isCurrentWalletSelected"
      class="breadcrumbs-item"
      @click="goToAddress"
    >
      {{ currentWalletName }}
    </div>
    <div v-if="currentWalletToken" class="breadcrumbs-item">
      {{ currentWalletToken }}
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import useWallets from '@/compositions/useWallets';

import CustomLists from './CutomLists';
import { useI18n } from 'vue-i18n';
import redirectToWallet from '@/router/helpers/redirectToWallet';

const MAX_LIST_NAME_LENGTH = 30;
const MAX_WALLET_NAME_LENGTH = 25;
const WALLET_NAME_MASK_LENGTH = 7;

export default {
  name: 'Breadcrumbs',
  components: {
    CustomLists,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const { t } = useI18n();

    const isInWallet = computed(() => route.path.includes('wallet'));
    const currentList = computed(() => store.getters['wallets/activeList']);
    const currentListName = computed(() => {
      const name =
        currentList.value === 'all'
          ? t('overallTitle')
          : t(currentList.value.toLowerCase());

      return name.length > MAX_LIST_NAME_LENGTH
        ? `${name.slice(0, MAX_WALLET_NAME_LENGTH)}...`
        : name;
    });
    const { currentWallet } = useWallets();
    const isCurrentWalletSelected = computed(() => {
      return (
        Object.keys(currentWallet?.value || {}).length && route.params.address
      );
    });
    const currentWalletName = computed(() => {
      const walletName =
        currentWallet.value.title || currentWallet.value.address;

      return walletName?.length > MAX_WALLET_NAME_LENGTH
        ? `
            ${walletName.slice(0, WALLET_NAME_MASK_LENGTH)}
            ...
            ${walletName.slice(-WALLET_NAME_MASK_LENGTH)}
          `
        : walletName;
    });
    const currentWalletToken = computed(
      () => store.getters['subtokens/currentToken']?.code
    );

    const goToAddress = () => {
      redirectToWallet({
        wallet: currentWallet?.value,
        root: true,
      });
    };

    const goToOverall = () => {
      if (isInWallet.value) {
        router.push({ name: 'Overall' });
      }
    };

    return {
      currentListName,
      isCurrentWalletSelected,
      currentWalletToken,
      currentWalletName,
      goToOverall,
      goToAddress,
    };
  },
};
</script>

<style lang="scss" scoped>
.breadcrumbs {
  display: flex;
  align-items: center;
}

.breadcrumbs-item {
  position: relative;
  margin-right: 40px;
  color: $too-dark-blue;
  font-size: 25px;
  line-height: 30px;
  font-family: 'Panton_Bold';

  &:not(:last-child) {
    cursor: pointer;
  }

  @include lg {
    margin-right: 30px;
    font-size: 25px;
  }

  @include md {
    margin-right: 20px;
    font-size: 16px;
    line-height: 20px;
  }

  &:last-child {
    margin-right: 0;
    cursor: default;

    &::after {
      content: none;
    }
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    right: -35px;
    display: inline-block;
    width: 30px;
    height: 2px;
    transform: rotate(105deg);
    background: $too-ligth-blue;
    pointer-events: none;

    @include md {
      right: -30px;
    }

    @include md {
      top: 40%;
      right: -20px;
      width: 20px;
    }
  }

  &:hover:not(:last-child) {
    color: $blue;

    &::before {
      border-bottom-color: $blue;
    }
  }

  &__menu {
    display: none;

    position: absolute;
    left: 0;
    top: 100%;
    padding-top: 10px;
    transform: translateX(-15%);
  }

  &--menu {
    z-index: 2;
    text-decoration: none;
    cursor: pointer;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 1px;
      border-bottom: 1px dashed $too-dark-blue;
    }

    &:hover {
      .breadcrumbs-item__menu {
        display: block;
      }
    }
  }
}
</style>
