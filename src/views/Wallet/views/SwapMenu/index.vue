<template>
  <div class="swap-menu">
    <Info
      v-if="
        currentWallet.type === WALLET_TYPES.PUBLIC_KEY &&
        currentWalletType !== WALLET_TYPES.METAMASK
      "
      title="wallet.info.title"
      data-qa="send__info"
    />
    <template v-else>
      <div v-if="isLoadingData" class="load">
        <Loading />
      </div>
      <div v-else class="swap-menu__section">
        <EmptyList v-if="!methods.length" :title="errorMessage || appError" />
        <div v-else class="swap-menu__choose-method">
          <SelectCard
            v-for="method in methods"
            :key="method.title"
            :method="method"
            :auto-height="true"
            type="simple"
            @click="clickHandler(method.routeName)"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import SelectCard from '@/components/SelectCard';
import { useRouter } from 'vue-router';
import useWallets from '@/compositions/useWallets';
import { onMounted, ref, computed } from 'vue';
import { useStore } from 'vuex';
import Loading from '@/components/Loading';
import Info from '@/components/Info';
import { WALLET_TYPES } from '@/config/walletType';
import { swapNoAccess } from '@/config/availableNets';
import EmptyList from '@/components/EmptyList';
import { useI18n } from 'vue-i18n';

export default {
  name: 'MetamaskKeplr',
  components: { SelectCard, Loading, Info, EmptyList },
  setup() {
    const { t } = useI18n();
    const store = useStore();
    const router = useRouter();
    const { currentWallet } = useWallets();
    const hasSwapSquid = ref(null);
    const hasSwapSkip = ref(null);
    const isLoadingData = ref(false);
    const appError = ref(t('swapView.notAvailableRegion'));

    const clickHandler = (name) => {
      router.push({ name: `${name}` });
    };

    const errorMessage = computed(() => store.getters['squid/errorMessage']);

    const metamaskConnector = computed(
      () => store.getters['metamask/metamaskConnector']
    );

    const currentWalletType = computed(() => {
      const metamaskNet = metamaskConnector.value.network;
      const metamaskAddress =
        metamaskConnector.value.accounts[0] &&
        metamaskConnector.value.accounts[0].toLowerCase();
      const { address, net, type } = currentWallet.value;

      if (
        address.toLowerCase() === metamaskAddress &&
        net.includes(metamaskNet) &&
        type === WALLET_TYPES.PUBLIC_KEY
      ) {
        return WALLET_TYPES.METAMASK;
      }

      return currentWallet.value.type;
    });

    const squidChains = computed(() => store.getters['squid/chains']);
    const skipChains = computed(() => store.getters['skip/chains']);

    const jupTokens = computed(() => store.getters['jupiter/tokens']);

    // const currentToken = computed(
    //   () => store.getters['subtokens/currentToken']
    // );

    const squidData = {
      title: 'SQUID',
      info: t('swapView.squidDescription'),
      icon: store.getters['app/theme'] === 'dark' ? 'squid-dark' : 'squid',
      hoveredIcon:
        store.getters['app/theme'] === 'dark'
          ? 'squid-dark-hover'
          : 'squid-hovered',
      routeName: 'WalletSwap',
    };

    const skipData = {
      title: 'SKIP',
      info: t('swapView.skipDescription'),
      icon: store.getters['app/theme'] === 'dark' ? 'skip-dark' : 'skip',
      hoveredIcon:
        store.getters['app/theme'] === 'dark'
          ? 'skip-dark-hover'
          : 'skip-hovered',
      routeName: 'WalletSwapSkip',
    };

    const jupiterData = {
      title: 'JUPITER',
      info: t('swapView.jupiterDescription'),
      icon: store.getters['app/theme'] === 'dark' ? 'jupiter-dark' : 'jupiter',
      hoveredIcon:
        store.getters['app/theme'] === 'dark'
          ? 'jupiter-dark-hover'
          : 'jupiter-hovered',
      routeName: 'WalletSwapJupiter',
    };

    const methods = ref([]);

    onMounted(async () => {
      if (swapNoAccess.includes(currentWallet.value.net)) {
        router.push({ name: 'WalletSend' });
        return;
      }

      isLoadingData.value = true;

      if (currentWallet.value.net === 'solana') {
        await store.dispatch('jupiter/fetchTokens');
        methods.value.push(jupiterData);
        isLoadingData.value = false;
        console.log(jupTokens.value);
        return;
      }

      try {
        if (!squidChains.value.length) {
          await store.dispatch('squid/fetchChains');
          await store.dispatch('squid/fetchTokens');
        }
      } catch (err) {
        console.log(err);
      }

      hasSwapSquid.value = squidChains.value.find(
        (ch) =>
          ch.nativeCurrency.symbol.toLowerCase() ===
          currentWallet.value.code.toLowerCase()
      );

      if (currentWallet.value.net === 'arbitrum') {
        hasSwapSquid.value = squidChains.value.find(
          (ch) => ch.chainName === 'Arbitrum'
        );
      }
      if (currentWallet.value.net === 'optimism') {
        hasSwapSquid.value = squidChains.value.find(
          (ch) => ch.chainName === 'optimism'
        );
      }

      if (currentWallet.value.net === 'coreum') {
        hasSwapSquid.value = squidChains.value.find(
          (ch) => ch.chainName === 'coreum'
        );
      }

      if (hasSwapSquid.value) {
        methods.value.push(squidData);
      }

      try {
        if (!skipChains.value.length) {
          await store.dispatch('skip/fetchChains');
        }
      } catch (err) {
        console.log(err);
      }
      const chainFrom = skipChains.value.find((ch) => {
        return ch.chain_id === currentWallet.value.config.chainId;
      });

      hasSwapSkip.value = !!chainFrom;

      if (hasSwapSkip.value && currentWallet.value?.net === 'osmosis') {
        methods.value.push(skipData);
      }
      isLoadingData.value = false;
    });

    return {
      clickHandler,
      WALLET_TYPES,
      methods,
      currentWallet,
      currentWalletType,
      isLoadingData,
      appError,
      errorMessage,
    };
  },
};
</script>

<style lang="scss" scoped>
.swap-menu {
  display: flex;
  flex-direction: column;
  background: $white;
  border-radius: 25px;
  padding: 0 44px 40px;
  // flex-grow: 1;
  min-height: 272px;

  .load {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 272px;
  }

  &__section {
    display: flex;
    justify-content: center;
    flex-grow: 1;
  }
  &__choose-method {
    display: flex;
    width: 100%;
    padding-top: 48px;
    justify-content: center;
    @include lg {
      padding-top: 31px 40px;
    }
    @include md {
      padding-top: 24px 40px;
    }
  }
}

body.dark {
  .swap-menu {
    background: $dark-panel-bg;
  }
}
</style>
