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
      @delete="deleteAddreses"
    />
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import Dropdown from './components/Dropdown';
import useWallets from '@/compositions/useWallets';
import DeleteSeedModal from './components/Dropdown/components/DeleteSeedModal';
import DeleteAddressesModal from './components/Dropdown/components/DeleteAddressesModal.vue';
import { WALLET_TYPES } from '@/config/walletType';
import { sortByAlphabet } from '@/helpers';

export default {
  name: 'Addresses',
  components: { Dropdown, DeleteSeedModal, DeleteAddressesModal },
  props: {},
  emits: ['exportWallet'],
  setup(props, { emit }) {
    const store = useStore();
    const { wallets } = useWallets();
    const showSeedModal = ref(false);
    // const confirmModalDelete = ref(false)
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

    const deleteAddreses = () => {};
    return {
      onDeleteSeed,
      showDeleteAddressesModal,
      showSeedModal,
      groupWalletsByNet,
      hiddenWallets,
      toggleWalletHidden,
      exportWallet,
      removeSeed,
      deleteAddreses,
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
