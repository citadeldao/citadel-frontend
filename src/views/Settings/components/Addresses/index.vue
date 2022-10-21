<template>
  <div class="addresses">
    <h5 class="addresses__title">
      {{ $t('settings.addresses.title') }}
    </h5>
    <div class="addresses__description">
      <p>
        {{ $t('settings.addresses.description') }}
      </p>
      <p @click="showDeleteAddressesModal = true">Delete addresses</p>
    </div>
    <div class="addresses__content">
      <Dropdown
        v-for="group in groupWalletsByNet"
        :key="group.net"
        :data="group"
        :hidden-wallets="hiddenWallets"
        @deleteSeedModal="onDeleteSeed"
        @toggle-hidden="toggleWalletHidden"
        @exportWallet="exportWallet"
      />
    </div>
    <DeleteSeedModal
      v-if="showSeedModal"
      @confirm="removeSeed"
      @close="showSeedModal = false"
    />
    <DeleteAddressesModal
      v-show="showDeleteAddressesModal"
      @delete="showConfirmDeleteModal = true"
      @getSelectedItemsList="deleteAddreses"
    />
    <DeleteAddressModal
      :text="text"
      v-click-away="closeDeleteModal"
      :show="showConfirmDeleteModal"
      @confirm="deleteAddreses"
      @close="closeDeleteModal"
    />
  </div>
</template>

<script>
import { computed, ref, inject } from 'vue';
import { useStore } from 'vuex';
import Dropdown from './components/Dropdown';
import useWallets from '@/compositions/useWallets';
import DeleteSeedModal from './components/Dropdown/components/DeleteSeedModal';
import DeleteAddressesModal from './components/Dropdown/components/DeleteAddressesModal.vue';
import { WALLET_TYPES } from '@/config/walletType';
import { sortByAlphabet } from '@/helpers';
import DeleteAddressModal from './components/Dropdown/components/DeleteAddressModal.vue';
import { useI18n } from 'vue-i18n';

export default {
  name: 'Addresses',
  components: {
    Dropdown,
    DeleteSeedModal,
    DeleteAddressesModal,
    DeleteAddressModal,
  },
  props: {},
  emits: ['exportWallet'],
  setup(props, { emit }) {
    const { t } = useI18n();
    const test = inject('selectedItems');
    const text = t('settings.addresses.deleteModalTitle');
    const store = useStore();
    const { wallets } = useWallets();
    const showSeedModal = ref(false);
    const showConfirmDeleteModal = ref(false);
    const showDeleteAddressesModal = ref(true);
    const hiddenWallets = computed(
      () => store.getters['wallets/hiddenWallets']
    );

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

      return sortByAlphabet(Object.values(resultObj), 'net');
    });

    const exportWallet = (val) => {
      emit('exportWallet', val);
    };

    const removeSeed = () => {
      const hasPrivateWallets = wallets.value.filter((w) =>
        [WALLET_TYPES.ONE_SEED, WALLET_TYPES.PRIVATE_KEY].includes(w.type)
      );

      store.commit('crypto/setUserMnemonic', null);

      if (!hasPrivateWallets.length) {
        store.commit('crypto/setPasswordHash', null);
      }

      showSeedModal.value = false;
    };

    const toggleWalletHidden = (wallet) => {
      store.dispatch('wallets/toggleHiddenWallet', wallet);
    };
    const closeDeleteModal = () => {
      showConfirmDeleteModal.value = false;
    };
    const removeWallet = async (wallet) => {
      await store.dispatch('wallets/removeWallet', {
        wallet: wallet,
        walletId: wallet.id,
      });

      await store.dispatch('wallets/getCustomWalletsList');

      // isLoading.value = false;

      // if (
      //   currentList.value !== 'all' &&
      //   !customWalletsList.value.find((item) => item.name === currentList.value)
      // ) {
      //   store.commit('wallets/SET_ACTIVE_LIST', 'all');
      // }
    };
    const deleteAddreses = (selectedWallets) => {
      console.log(wallets, selectedWallets);
      console.log(wallets.value.filter((e) => selectedWallets.has(e.id)));
      wallets.value.filter((e) => selectedWallets.has(e.id)).length >= 2
        ? t('settings.addresses.deleteAddresses')
        : t('settings.addresses.deleteModalTitle');
      removeWallet;
    };
    return {
      onDeleteSeed,
      showConfirmDeleteModal,
      showDeleteAddressesModal,
      showSeedModal,
      groupWalletsByNet,
      hiddenWallets,
      toggleWalletHidden,
      exportWallet,
      removeSeed,
      deleteAddreses,
      closeDeleteModal,
      test,
      text,
    };
  },
};
</script>

<style lang="scss" scoped>
.addresses {
  @include settings-card-default;
  min-height: 200px;
  min-width: 150px;

  &__content {
    overflow-y: auto;
  }
  &__description {
    display: flex;
    justify-content: space-between;
  }
}
</style>
