<template>
  <Modal>
    <ModalContent :submit-button="false" @close="$emit('close')">
      <div v-if="isLoading" class="delete-address-modal__loader">
        <Loading />
      </div>

      <h4 class="delete-address-modal__title">
        {{ 'Delete addresses' }}
      </h4>
      <h5 class="delete-address-modal__subtitle">
        {{ 'Choose addresses that you want to delete' }}
      </h5>
      <dottedLine style="margin: 23px 0; height: 6px" />
      <InfoBanner
        icon="exclamation"
        content="Если вы уверены, что хотите удалить, то тут текст чтобы пользователь сохранил приватный ключ или мнемоническую фрауз если импортировал через такой вид"
      />
      <div class="select__actions">
        <span>Select all</span>
        <span>Unselect all</span>
      </div>
      <div class="addresses__content">
        <Dropdown
          selectable
          preopened
          v-for="group in groupWalletsByNet"
          :key="group.net"
          :data="group"
          :hidden-wallets="hiddenWallets"
          @deleteSeedModal="onDeleteSeed"
          @toggle-hidden="toggleWalletHidden"
          @exportWallet="exportWallet"
          @selectItem="selectItem"
        />
      </div>
      <p>You select {{ selectedItems.size }} addresses</p>
      <PrimaryButton
        color="#FFFFFF"
        bg-color="#6A4BFF"
        hover-bg-color="#1A53F0"
        box-shadow="0px 0px 25px rgba(106, 75, 255, 0.3)"
        class="delete-address-modal__primary-button"
        data-qa="Delete"
        @click="
          $emit('delete');
          isShowDeleteModal = true;
        "
      >
        {{ 'Delete' }}
      </PrimaryButton>
      <teleport to="body">
        <DeleteAddressModal
          v-click-away="closeDeleteModal"
          :show="isShowDeleteModal"
          :is-loading="isLoading"
          @confirm="removeWallet"
          @close="closeDeleteModal"
        />
      </teleport>
    </ModalContent>
  </Modal>
</template>

<script>
import { computed, reactive, ref } from 'vue';
import useWallets from '@/compositions/useWallets';
import { useStore } from 'vuex';
import Modal from '@/components/Modal.vue';
import ModalContent from '@/components/ModalContent.vue';
import PrimaryButton from '@/components/UI/PrimaryButton.vue';
import Loading from '@/components/Loading';
import dottedLine from '@/assets/icons/dotted-line.svg';
import InfoBanner from '@/components/InfoBanner';
import Dropdown from '@/views/Settings/components/Addresses/components/Dropdown';
import { sortByAlphabet } from '@/helpers';
import { WALLET_TYPES } from '@/config/walletType';

export default {
  name: 'DeleteAddressModal',
  components: {
    Modal,
    ModalContent,
    PrimaryButton,
    dottedLine,
    Loading,
    InfoBanner,
    Dropdown,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['confirm', 'close'],
  setup(props, { emit }) {
    const store = useStore();
    const { wallets } = useWallets();
    const selectedItems = reactive(new Set());
    const hiddenWallets = computed(
      () => store.getters['wallets/hiddenWallets']
    );
    const isShowDeleteModal = ref(false);
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
    const onDeleteSeed = () => {
      // showSeedModal.value = true;
    };
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

      // showSeedModal.value = false;
    };
    const removeWallet = async () => {
      // isLoading.value = true;
      const hasOneSeedWallet = wallets.value.filter(
        (w) => w.type === WALLET_TYPES.ONE_SEED
      );
      const showSeedModal =
        hasOneSeedWallet.length === 1 &&
        props.wallet.type === WALLET_TYPES.ONE_SEED;

      if (showSeedModal) {
        emit('deleteSeedModal');
      }

      await store.dispatch('wallets/removeWallet', {
        wallet: props.wallet,
        walletId: props.wallet.id,
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
    const toggleWalletHidden = (wallet) => {
      store.dispatch('wallets/toggleHiddenWallet', wallet);
    };
    const selectItem = (selectedItem) => {
      if (selectedItem.isCheck) selectedItems.add(selectedItem.id);
      else selectedItems.delete(selectedItem.id);
      // emit('selectItem', selectedItem ? props.wallet : null);
    };
    return {
      onDeleteSeed,
      groupWalletsByNet,
      hiddenWallets,
      toggleWalletHidden,
      exportWallet,
      removeSeed,
      selectItem,
      selectedItems,
      isShowDeleteModal,
      removeWallet,
    };
  },
};
</script>

<style lang="scss" scoped>
.delete-address-modal {
  &__title {
    margin: 0;
    font-family: 'Panton_Bold';
    font-weight: 700;
    font-size: 20px;
    line-height: 30px;
    align-self: baseline;
  }
  &__subtitle {
    margin: 0;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    color: #6b93c0;
    align-self: baseline;
  }
  &__primary-button {
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    margin-bottom: 24px;
  }
  &__loader {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba($black, 0.2);
  }
}
.select__actions {
  margin: 32px 0 23px 0;
  display: flex;
  width: 100%;
  justify-content: space-between;
  font-size: 14px;
}
.addresses__content {
  width: 100%;
  overflow: auto;
  .dropdown__item {
    height: 48px;
  }
}
.modal_content {
  &:deep &__content {
    height: 86vh;
  }
}
</style>
