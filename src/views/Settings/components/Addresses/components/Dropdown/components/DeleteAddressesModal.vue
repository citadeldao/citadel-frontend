<template>
  <Modal>
    <ModalContent :submit-button="false" @close="close">
      <div v-if="isLoading" class="delete-address-modal__loader">
        <Loading />
      </div>

      <h4 class="delete-address-modal__title">
        {{ $t('settings.addresses.modalTitle') }}
      </h4>
      <h5 class="delete-address-modal__subtitle">
        {{ $t('settings.addresses.modalSubtitle') }}
      </h5>
      <dottedLine class="line" />
      <InfoBanner
        small
        icon="exclamation"
        :content="$t('settings.addresses.bannerContent')"
      />
      <div class="select__actions">
        <span class="select" @click="selectAll">{{
          $t('settings.addresses.selectAll')
        }}</span>
        <div class="unselect" @click="unselectAll">
          <span>{{ $t('settings.addresses.unselectAll') }} </span>
          <close />
        </div>
      </div>
      <div class="addresses__content">
        <Dropdown
          ref="dropdown"
          selectable
          preopened
          v-for="(group, i) in groupWalletsByNet"
          :key="i"
          :data="group"
          :hidden-wallets="hiddenWallets"
          @toggle-hidden="toggleWalletHidden"
        />
      </div>
      <p
        class="selected__addresses"
        v-html="
          $t('settings.addresses.selectedWalletsLength', {
            selectedWalletsLength: selectedWallets.length,
          })
        "
      />
      <PrimaryButton
        color="#FFFFFF"
        bg-color="#6A4BFF"
        hover-bg-color="#1A53F0"
        box-shadow="0px 0px 25px rgba(106, 75, 255, 0.3)"
        class="delete-address-modal__primary-button"
        data-qa="Delete"
        @click="$emit('delete', selectedWallets)"
        :disabled="!selectedWallets.length"
      >
        {{ $t('settings.addresses.delete') }}
      </PrimaryButton>
    </ModalContent>
  </Modal>
</template>

<script>
import { ref, computed, inject } from 'vue';
import useWallets from '@/compositions/useWallets';
import { useStore } from 'vuex';
import Modal from '@/components/Modal.vue';
import ModalContent from '@/components/ModalContent.vue';
import PrimaryButton from '@/components/UI/PrimaryButton.vue';
import Loading from '@/components/Loading';
import dottedLine from '@/assets/icons/dotted-line.svg';
import InfoBanner from '@/components/InfoBanner';
import Dropdown from '@/views/Settings/components/Addresses/components/Dropdown';
import close from '@/assets/icons/close.svg';
import { sortByAlphabet } from '@/helpers';

export default {
  name: 'DeleteAddressesModal',
  components: {
    Modal,
    ModalContent,
    PrimaryButton,
    dottedLine,
    Loading,
    InfoBanner,
    Dropdown,
    close,
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
  emits: ['confirm', 'close', 'delete'],
  setup(props, { emit }) {
    const store = useStore();
    const { wallets } = useWallets();
    const selectedWallets = inject('selectedWallets');
    const dropdown = ref(null);
    const hiddenWallets = computed(
      () => store.getters['wallets/hiddenWallets']
    );
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

    const toggleWalletHidden = (wallet) => {
      store.dispatch('wallets/toggleHiddenWallet', wallet);
    };
    const setCheckboxesValue = (value) => {
      for (const dropList of dropdown.value) {
        for (const dropItem of dropList.dropdownItem) {
          dropItem.isItemChecked = value;
        }
      }
    };
    const selectAll = () => {
      selectedWallets.value = wallets.value;
      setCheckboxesValue(true);
    };

    const unselectAll = () => {
      selectedWallets.value = [];
      setCheckboxesValue(false);
    };
    const close = () => {
      emit('close');
    };
    return {
      selectedWallets,
      dropdown,
      groupWalletsByNet,
      hiddenWallets,
      toggleWalletHidden,
      selectAll,
      unselectAll,
      close,
    };
  },
};
</script>

<style lang="scss" scoped>
.selected__addresses {
  font-size: 14px;
  color: #6b93c0;
}
.line {
  margin: 23px 0;
  height: 6px;
}
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
    cursor: pointer;
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
  &:deep * {
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
    cursor: pointer;
  }
  .select {
    color: #00a3ff;
    border-bottom: 1px dashed #00a3ff;
  }
  .unselect {
    display: flex;
    gap: 8px;
    & span {
      color: #fa3b33;
      border-bottom: 1px dashed #fa3b33;
    }
  }
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
    max-height: 86vh;
  }
}
</style>
