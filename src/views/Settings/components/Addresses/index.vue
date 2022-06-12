<template>
  <div class="addresses">
    <div class="addresses__info">
      <span class="addresses__title">
        {{ $t('settings.addresses.title') }}
      </span>
      <span class="addresses__desc">
        {{ $t('settings.addresses.description') }}
      </span>
      <div class="addresses__content">
        <Dropdown
          v-for="group in groupWalletsByNet"
          :key="group.net"
          :data="group"
          :hidden-wallets="hiddenWallets"
          :has-visible-button="hasVisibleButton(group)"
          @deleteSeedModal="onDeleteSeed"
          @toggle-hidden="toggleWalletHidden"
          @exportWallet="exportWallet"
        />
      </div>
    </div>
    <DeleteSeedModal
      v-if="showSeedModal"
      @confirm="removeSeed"
      @close="showSeedModal = false"
    />
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import Dropdown from './components/Dropdown';
import useWallets from '@/compositions/useWallets';
import DeleteSeedModal from './components/Dropdown/components/DeleteSeedModal';
import { WALLET_TYPES } from '@/config/walletType';
const netsWithVisibleButton = ['Secret'];

export default {
  name: 'Addresses',
  components: { Dropdown, DeleteSeedModal },
  props: {},
  emits: ['exportWallet'],
  setup(props, { emit }) {
    const store = useStore();
    const { wallets } = useWallets();
    const showSeedModal = ref(false);
    const hiddenWallets = computed(() => store.getters['wallets/hiddenWallets']);

    const onDeleteSeed = () => {
      showSeedModal.value = true;
    };

    const groupWalletsByNet = computed(() => {
      const resultObj = {};

      wallets.value.map((wallet) => {
        if (!resultObj[wallet.net]) {
          resultObj[wallet.net] = {
            net: wallet.name,
            icon: wallet.net,
            wallets: [wallet],
          };
        } else {
          resultObj[wallet.net].wallets.push(wallet);
        }
      });

      return Object.values(resultObj);
    });

    const exportWallet = (val) => {
      emit('exportWallet', val);
    };

    const removeSeed = () => {
      const hasPrivateWallets = wallets.value.filter(w => [WALLET_TYPES.ONE_SEED, WALLET_TYPES.PRIVATE_KEY].includes(w.type));

      store.commit('crypto/setUserMnemonic', null);

      if (!hasPrivateWallets.length) {
        store.commit('crypto/setPasswordHash', null);
      }

      showSeedModal.value = false;
    };

    const toggleWalletHidden = (wallet) => {
      store.dispatch('wallets/toggleHiddenWallet', wallet);
    };
    const hasVisibleButton = (group) => netsWithVisibleButton.includes(group.net);

    return {
      onDeleteSeed,
      showSeedModal,
      groupWalletsByNet,
      hiddenWallets,
      toggleWalletHidden,
      exportWallet,
      hasVisibleButton,
      removeSeed,
    };
  },
};
</script>

<style lang="scss" scoped>
.addresses {
  flex: 1;
  min-height: 200px;
  min-width: 150px;
  padding: 40px 45px;
  background: $white;
  box-shadow: -10px 4px 27px rgba(0, 0, 0, 0.1);
  border-radius: 25px;
  @include lg {
    padding: 30px 40px;
  }
  @include md {
    box-shadow: -10px 4px 24px rgba(0, 0, 0, 0.1);
  }

  &__info {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  &__title {
    font-size: 20px;
    line-height: 30px;
    font-family: "Panton_Bold";
    @include md {
      margin-bottom: 4px;
    }
  }

  &__desc {
    font-size: 16px;
    line-height: 27px;
    margin-bottom: 14px;
    color: $mid-blue;
    @include lg {
      font-size: 14px;
      line-height: 24px;
    }
    @include md {
      font-size: 14px;
      line-height: 24px;
    }

    &-text {
      margin-bottom: 27px;
    }
  }
}
</style>
