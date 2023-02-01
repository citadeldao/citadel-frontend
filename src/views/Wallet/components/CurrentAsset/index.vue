<template>
  <div
    class="current-asset"
    @click="redirectToAsset"
    @mouseover="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <img
      :src="require('@/assets/images/waves/red.png')"
      class="current-asset__wave"
    />

    <AssetIcon
      :is-native-token="isNativeToken"
      :net="currentWallet.net"
      :name="currentWallet.name"
      :code="currentWallet.code"
      color="#6A4BFF"
      class="current-asset__icon"
    />
    <div class="current-asset__info">
      <div class="current-asset__description">
        {{ $t('assetsModal.currentAsset') }}
      </div>
      <div class="current-asset__text">
        {{ currentWallet.name }}
      </div>
    </div>
    <span class="current-asset__arrow">
      <keep-alive>
        <component :is="icon" />
      </keep-alive>
    </span>

    <teleport v-if="showCreateVkModal" to="body">
      <CreateVkModal
        :address="currentWallet.address"
        :token="snip20Token"
        :token-fee="snip20TokenFee"
        :current-wallet="wallet"
        @close="closeCreateVkModal"
        @success="closeSelectAssetModal"
      />
    </teleport>
  </div>
</template>

<script>
import { ref, inject, markRaw } from 'vue';
import useWallets from '@/compositions/useWallets';
import AssetIcon from '@/components/UI/AssetIcon.vue';
import CreateVkModal from '@/views/Wallet/components/CreateVkModal/CreateVkModal.vue';
import redirectToWallet from '@/router/helpers/redirectToWallet';
import { useRoute } from 'vue-router';

export default {
  name: 'CurrentAsset',
  components: {
    AssetIcon,
    CreateVkModal,
  },
  props: {
    currentWallet: {
      type: Object,
      required: true,
    },
    isNativeToken: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const icon = ref();
    import(`@/assets/icons/arrow.svg`).then((val) => {
      icon.value = markRaw(val.default);
    });
    const { currentWallet: stateCurrentWallet } = useWallets();
    const showCreateVkModal = ref(false);
    const snip20TokenFee = ref(null);
    const snip20Token = ref(null);
    const mainIsLoading = inject('isLoading');
    const { currentWallet: wallet } = useWallets();
    const route = useRoute();
    const redirectToAsset = async () => {
      await redirectToWallet({
        wallet: route.params,
        token: { net: route.params.token },
        root: true,
      });
    };
    const closeCreateVkModal = () => {
      snip20Token.value = null;
      showCreateVkModal.value = false;
    };

    return {
      icon,
      stateCurrentWallet,
      showCreateVkModal,
      snip20TokenFee,
      snip20Token,
      mainIsLoading,
      wallet,
      redirectToAsset,
      closeCreateVkModal,
    };
  },
};
</script>

<style lang="scss" scoped>
.current-asset {
  position: relative;
  display: flex;
  height: 68px;
  padding: 15px 55px 15px 15px;
  border-radius: 8px;
  overflow: hidden;
  background: linear-gradient(
    90deg,
    rgba(250, 208, 196, 0.4) 0%,
    rgba(250, 208, 196, 0.4) 1%,
    rgba(255, 209, 255, 0.4) 100%
  );
  cursor: pointer;
  transition: initial;

  @include lg {
    border-radius: 8px;
  }

  &:hover {
    background: linear-gradient(
      90deg,
      rgba(#fad0c4, 0.6) 0%,
      rgba(#fad0c4, 0.6) 1%,
      rgba(#ffd1ff, 0.6) 100%
    );

    .current-asset__wave {
      opacity: 1;
    }
  }

  &:last-child {
    margin-right: 0;
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  &__wave {
    position: absolute;
    bottom: -64px;
    left: -50px;
    width: 105%;
    height: 214%;
    user-select: none;
    transform: rotate(5deg);
    opacity: 0.3;
    transition: initial;

    @include lg {
      left: -40px;
      width: 120%;
      transform: rotate(0deg);
    }

    @include md {
      left: -30px;
      width: 120%;
      transform: rotate(0deg);
    }
  }

  &__arrow {
    position: absolute;
    z-index: 1;
    right: -15px;
    bottom: -25px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(
      90deg,
      #ff9a9e7f 0%,
      #fad0c47f 99%,
      #fad0c47f 100%
    );
    svg {
      top: 14px;
      left: 17px;
      position: absolute;
    }
  }

  &__icon {
    position: relative;
    z-index: 1;
    width: 40px;
    height: 40px;
  }

  &__info {
    position: relative;
    z-index: 1;
    margin-left: 16px;

    @include lg {
      margin-left: 8px;
    }

    @include md {
      margin-left: 8px;
    }
  }

  &__description {
    margin-bottom: 5px;
    font-size: 14px;
    color: $slategray1;
    line-height: 1;

    @include lg {
      font-size: 12px;
    }

    @include md {
      font-size: 10px;
    }
  }

  &__text {
    display: flex;
    font-size: $h5-size;
    line-height: 1.1;
    font-family: 'Panton_SemiBold';
    width: max-content;

    @include lg {
      font-size: $default-size;
    }

    @include laptop-standard {
      font-size: $small-lg;
      min-width: 115px;
      max-width: 200px;
    }
  }
}
</style>
