<template>
  <div class="addresses">
    <h5 class="addresses__title">
      {{ $t('settings.addresses.title') }}
    </h5>
    <div class="addresses__description">
      <p>
        {{ $t('settings.addresses.description') }}
      </p>
      <p @click="showDeleteAddressesModal = true" class="addresses-delete">
        {{ $t('settings.addresses.modalTitle') }}
      </p>
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
      @delete="openConfirmDeleteModal"
      @close="closeAddressesModal"
    />
    <DeleteAddressModal
      :isLoading="isLoading"
      :text="text"
      :show="showConfirmDeleteModal"
      @confirm="deleteAddreses"
      @close="closeDeleteModal"
    />
  </div>
</template>

<script>
import { computed, ref, provide } from 'vue';
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
    const store = useStore();
    const { wallets } = useWallets();
    const text = t('settings.addresses.deleteModalTitle');
    const isLoading = ref(false);
    const showSeedModal = ref(false);
    const showConfirmDeleteModal = ref(false);
    const showDeleteAddressesModal = ref(false);
    const selectedWallets = ref([]);
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
    const closeAddressesModal = () => {
      showConfirmDeleteModal.value
        ? null
        : (showDeleteAddressesModal.value = false);
    };
    const removeWallet = async (wallet) => {
      await store.dispatch('wallets/removeWallet', {
        wallet: wallet,
        walletId: wallet.id,
      });

      await store.dispatch('wallets/getCustomWalletsList');
    };
    const deleteAddreses = () => {
      isLoading.value = true;
      Promise.all(selectedWallets.value.map((e) => removeWallet(e)))
        .then(() => {
          isLoading.value = false;
          showConfirmDeleteModal.value = false;
          showDeleteAddressesModal.value = false;
          if (!wallets.value.length) {
            showSeedModal.value = true;
          }
        })
        .catch((e) => {
          console.error(e);
        });
    };
    const openConfirmDeleteModal = () => {
      showConfirmDeleteModal.value = true;
    };
    const updateSelectedWallets = ({ wallet, isCheck }) => {
      if (isCheck) selectedWallets.value.push(wallet);
      else
        selectedWallets.value.splice(
          selectedWallets.value.findIndex((e) => e.id === wallet.id),
          1
        );
    };
    provide('selectedWallets', selectedWallets);
    provide('updateSelectedWallets', updateSelectedWallets);
    return {
      onDeleteSeed,
      showConfirmDeleteModal,
      showDeleteAddressesModal,
      showSeedModal,
      groupWalletsByNet,
      hiddenWallets,
      text,
      isLoading,
      updateSelectedWallets,
      toggleWalletHidden,
      exportWallet,
      removeSeed,
      deleteAddreses,
      closeDeleteModal,
      closeAddressesModal,
      openConfirmDeleteModal,
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
    margin: 14px 0;
    @media (max-width: 1819px) {
      font-size: 1rem;
    }
    flex-wrap: wrap;
    p {
      margin: 0;
    }
  }
  &-delete {
    cursor: pointer;
    color: #fa3b33;
    border-bottom: 1px dashed #fa3b33;
  }
}
</style>
