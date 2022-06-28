<template>
  <div
    class="current-asset"
    @click="openSelectAssetModal"
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
    <span class="current-asset__arrow" />

    <teleport to="body">
      <Modal v-if="isSelectAssetModalOpened">
        <ModalContent
          :title="$t('assetsModal.title')"
          :desc="$t('assetsModal.description')"
          @close="closeSelectAssetModal"
        >
          <template #default>
            <AssetsListModal
              :current-wallet="currentWallet"
              @click="goToAsset"
            />
          </template>
        </ModalContent>
      </Modal>
    </teleport>

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
import { ref, computed, inject } from 'vue';
import { useStore } from 'vuex';
import useWallets from '@/compositions/useWallets';
import Modal from '@/components/Modal';
import ModalContent from '@/components/ModalContent';
import AssetIcon from '@/components/UI/AssetIcon.vue';
import CreateVkModal from '@/views/Wallet/components/CreateVkModal.vue';
import AssetsListModal from './SelectAssetModal/AssetsListModal';
import redirectToWallet from '@/router/helpers/redirectToWallet';
import { TOKEN_STANDARDS } from '@/config/walletType';

export default {
  name: 'CurrentAsset',
  components: {
    Modal,
    ModalContent,
    AssetIcon,
    AssetsListModal,
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
    const store = useStore();
    const isSelectAssetModalOpened = ref(false);
    const showCreateVkModal = ref(false);
    const snip20TokenFee = ref(null);
    const snip20Token = ref(null);
    const mainIsLoading = inject('isLoading');
    const { currentWallet: wallet } = useWallets();

    const isNotLinkedSnip20 = (token) => {
      const isSnip20 = computed(
        () => token.config.standard === TOKEN_STANDARDS.SNIP_20
      );

      return isSnip20.value && !token.linked;
    };

    const openSelectAssetModal = () => {
      isSelectAssetModalOpened.value = true;
    };

    const closeSelectAssetModal = () => {
      isSelectAssetModalOpened.value = false;
    };

    const closeCreateVkModal = () => {
      snip20Token.value = null;
      showCreateVkModal.value = false;
    };

    const goToAsset = async (asset) => {
      if (isNotLinkedSnip20(asset)) {
        mainIsLoading.value = true;
        snip20TokenFee.value =
          (await asset.getFees(asset.id, asset.net))?.data?.low?.fee || 0.2;
        mainIsLoading.value = false;
        showCreateVkModal.value = true;
        snip20Token.value = asset;
      } else {
        await store.dispatch('subtokens/setCurrentToken', asset);

        closeSelectAssetModal();

        redirectToWallet({
          wallet: wallet.value,
          token: asset,
          root: true,
        });
      }
    };

    return {
      isSelectAssetModalOpened,
      showCreateVkModal,
      snip20TokenFee,
      snip20Token,
      mainIsLoading,
      wallet,
      openSelectAssetModal,
      closeSelectAssetModal,
      closeCreateVkModal,
      goToAsset,
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

    &:before {
      content: '⭢';
      position: absolute;
      top: 1px;
      left: 14px;
      font-size: 24px;
      font-family: 'Panton_Bold';
      color: $dark-blue;
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
    font-size: 20px;
    line-height: 1.1;
    font-family: 'Panton_SemiBold';

    @include lg {
      font-size: 17px;
    }

    @include md {
      font-size: 14px;
    }
  }
}
</style>
