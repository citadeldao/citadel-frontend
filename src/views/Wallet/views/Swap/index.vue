<template>
  <div class="swap">
    <div class="swap__select-chain z1000">
      <div class="autocomplete">
        <Autocomplete
          id="chains"
          v-model:value="searchNetworkFrom"
          :items="allNetworks"
          initial-icon="curve-arrow"
          :label="$t('swapView.swapFromNetwork')"
          :placeholder="$t('swapView.selectChain')"
          @update:value="selectNetworkFrom"
        />
      </div>
      <div class="autocomplete ml10">
        <Autocomplete
          id="chains"
          v-model:value="searchNetworkTo"
          :items="allNetworks"
          initial-icon="curve-arrow"
          :label="$t('swapView.swapToNetwork')"
          :placeholder="$t('swapView.selectChain')"
          @update:value="selectNetworkTo"
        />
      </div>
    </div>
    <!-- contracts -->
    <div class="swap__select-chain mt10">
      <div class="autocomplete">
        <Autocomplete
          id="chainTokenFrom"
          v-model:value="searchFromToken"
          :items="chainTokensFrom"
          initial-icon="curve-arrow"
          :label="$t('swapView.fromToken')"
          :placeholder="$t('swapView.selectContract')"
          @update:value="selectFromToken"
        />
      </div>
      <div class="autocomplete ml10">
        <Autocomplete
          id="chainTokenTo"
          v-model:value="searchToToken"
          :items="chainTokensTo"
          initial-icon="curve-arrow"
          :label="$t('swapView.toToken')"
          :placeholder="$t('swapView.selectContract')"
          @update:value="selectToToken"
        />
      </div>
    </div>
    <div class="swap__contracts">
      <div v-if="searchTokenFromComputed?.address">
        {{ searchTokenFromComputed.address }}
      </div>
      <div v-if="searchTokenToComputed?.address" class="ml10">
        {{ searchTokenToComputed.address }}
      </div>
    </div>
    <div
      class="swap__addresses"
      v-if="searchTokenFromComputed && searchTokenToComputed"
    >
      <div class="swap__input">
        <Input
          id="fromTokenAddr"
          v-model="addressFrom"
          disabled
          :label="$t('swapView.fromAddressLabel')"
          :placeholder="$t('swapView.addressPlaceholder')"
          type="text"
        />
      </div>
      <div class="swap__input mt10">
        <Input
          id="toTokenAddr"
          v-model="addressTo"
          :label="$t('swapView.toAddressLabel')"
          :placeholder="$t('swapView.addressPlaceholder')"
          type="text"
        />
      </div>
      <div class="swap__input mt10">
        <Input
          id="amount"
          v-model="amount"
          :decimals="currentWallet?.config?.decimals"
          type="currency"
          :currency="searchTokenFromComputed?.symbol"
          :label="$t('amount')"
          placeholder="0.0"
          icon="coins"
        />
      </div>
    </div>
    <PrimaryButton
      class="swap__submit-swap"
      :loading="isLoading"
      @click="getRoute"
      >{{ $t('swap') }}</PrimaryButton
    >
  </div>
</template>
<script>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import Autocomplete from '@/components/UI/Autocomplete';
import PrimaryButton from '@/components/UI/PrimaryButton';
import Input from '@/components/UI/Input';
import useWallets from '@/compositions/useWallets';
import notify from '@/plugins/notify';

export default {
  components: {
    PrimaryButton,
    Autocomplete,
    Input,
  },
  setup() {
    const isLoading = ref(false);
    const store = useStore();
    const { currentWallet } = useWallets();
    const amount = ref('');

    const fromTokenAddrInput = ref('');
    const toTokenAddrInput = ref('');

    const searchNetworkFrom = ref('');
    const searchNetworkTo = ref('');

    const searchFromToken = ref('');
    const searchToToken = ref('');

    const chainTokensFrom = ref([]);
    const chainTokensTo = ref([]);

    const addressFrom = ref('');
    const addressTo = ref('');

    const squidChains = computed(() => store.getters['squid/chains']);
    const allTokens = computed(() => store.getters['squid/tokens']);
    console.log('squidChains', squidChains);

    onMounted(async () => {
      addressFrom.value = currentWallet.value.address;

      await store.dispatch('squid/fetchChains');
      await store.dispatch('squid/fetchTokens');
    });

    const allNetworks = computed(() =>
      [].concat(squidChains.value).map((w) => ({
        id: w.chainName,
        title: `${w.chainName}:${w.chainId}`,
        key: w.chainName,
        chainId: w.chainId,
        iconLink: w.chainIconURI,
        icon: 'curve-arrow',
      }))
    );

    const selectNetworkFrom = (network) => {
      searchFromToken.value = '';
      const selectChain = network.split(':')[0];

      if (!selectChain) {
        chainTokensFrom.value = [];
        return;
      }

      searchNetworkFrom.value = selectChain;
      const currentChain = squidChains.value.find(
        (n) =>
          n.chainName.toLocaleLowerCase() === selectChain.toLocaleLowerCase()
      );
      const tokens = allTokens.value.filter(
        (t) => t.chainId === currentChain?.chainId
      );

      console.log('chain from', searchNetworkFrom.value);
      console.log('chain from tokens', tokens);
      chainTokensFrom.value = tokens;
    };

    const selectNetworkTo = (network) => {
      searchToToken.value = '';
      const selectChain = network.split(':')[0];

      if (!selectChain) {
        chainTokensTo.value = [];
        return;
      }

      searchNetworkTo.value = selectChain;
      const currentChain = squidChains.value.find(
        (n) =>
          n.chainName.toLocaleLowerCase() === selectChain.toLocaleLowerCase()
      );
      const tokens = allTokens.value.filter(
        (t) => t.chainId === currentChain?.chainId
      );

      console.log('chain to', searchNetworkFrom.value);
      console.log('chain to tokens', tokens);
      chainTokensTo.value = tokens;
    };

    const searchTokenFromComputed = computed(() => {
      return chainTokensFrom.value.find(
        (t) => t.name === searchFromToken.value
      );
    });

    const searchTokenToComputed = computed(() => {
      return chainTokensTo.value.find((t) => t.name === searchToToken.value);
    });

    const selectFromToken = (token) => {
      searchFromToken.value = token;
      console.log('token from', token);
      console.log('token from obj', searchTokenFromComputed.value);
    };

    const selectToToken = (token) => {
      searchToToken.value = token;
      console.log('token to', token);
      console.log('token to obj', searchTokenToComputed.value);
    };

    const getRoute = async () => {
      const fromChain = allNetworks.value.find(
        (item) => item.key === searchNetworkFrom.value
      )?.chainId;
      const toChain = allNetworks.value.find(
        (item) => item.key === searchNetworkTo.value
      )?.chainId;
      const fromToken = searchTokenFromComputed.value.address;
      const toToken = searchTokenToComputed.value.address;
      const fromAmount = 100000000;
      const fromAddress = addressFrom.value;
      const toAddress = addressTo.value;

      isLoading.value = true;
      try {
        await store.dispatch('squid/getRoute', {
          fromChain,
          toChain,
          fromToken,
          toToken,
          fromAmount,
          fromAddress,
          toAddress,
        });
      } catch (err) {
        notify({
          type: 'warning',
          text: err?.response?.data?.errors[0]?.message,
        });
        isLoading.value = false;
      }
      isLoading.value = false;
    };

    return {
      isLoading,
      amount,
      currentWallet,
      allNetworks,

      searchNetworkFrom,
      searchNetworkTo,

      searchFromToken,
      searchToToken,

      chainTokensFrom,
      chainTokensTo,

      fromTokenAddrInput,
      toTokenAddrInput,

      searchTokenFromComputed,
      searchTokenToComputed,

      addressFrom,
      addressTo,

      selectNetworkFrom,
      selectNetworkTo,

      selectFromToken,
      selectToToken,

      getRoute,
    };
  },
};
</script>
<style lang="scss" scoped>
.swap {
  padding: 20px 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  &__select-chain {
    width: 100%;
    display: flex;
    align-items: center;

    &.z1000 {
      z-index: 1000;
    }
  }

  &__submit-swap {
    margin-top: 20px;
  }

  &__contracts {
    margin-top: 10px;
    width: 100%;
    display: flex;

    div {
      width: 50%;
      min-width: 50%;
      font-size: 11px;
      text-align: left;
      color: #00a3ff;
      word-wrap: break-word;
    }
  }

  &__addresses {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  &__input {
    width: 100%;
    height: 68px;
  }
}

.autocomplete {
  width: 100%;
  height: 68px;
  position: relative;
  @include md {
    width: 483px;
  }
}

.ml10 {
  margin-left: 10px;
}

.mt10 {
  margin-top: 10px;
}
</style>
