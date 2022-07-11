<template>
  <div class="dropdown-item">
    <div class="dropdown-item__icon">
      <component :is="currentIcon" />
    </div>
    <div class="dropdown-item__address">{{ currentAddress }}</div>
    <div class="dropdown-item__btn_group">
      <div
        v-if="isSnip20"
        class="dropdown-item__btn dropdown-item__btn--key"
        @click="openViewingKeyManager"
      >
        <keyIcon />
      </div>
      <div
        v-if="false"
        class="dropdown-item__btn dropdown-item__btn--notification"
        :class="`dropdown-item__btn--notification--${notification}`"
        @click="toggleNotification"
      >
        <notificationIcon />
      </div>
      <div
        v-if="hasVisibleButton"
        class="dropdown-item__btn dropdown-item__btn--vision"
        data-qa="settings__address__vision-button"
        @click="$emit('toggle-hidden', wallet.address)"
      >
        <visionIcon />
      </div>
      <div
        v-if="
          [WALLET_TYPES.ONE_SEED, WALLET_TYPES.PRIVATE_KEY].includes(
            wallet.type
          )
        "
        class="dropdown-item__btn dropdown-item__btn--export"
        data-qa="settings__address__export-button"
        @click="exportWallet"
      >
        <exportIcon />
      </div>
      <div
        class="dropdown-item__btn dropdown-item__btn--remove"
        data-qa="settings__address__remove-button"
        @click="showDeleteModal"
      >
        <removeIcon />
      </div>
    </div>
    <teleport to="body">
      <DeleteAddressModal
        v-click-away="closeDeleteModal"
        :show="isShowDeleteModal"
        :is-loading="isLoading"
        @confirm="removeWallet"
        @close="closeDeleteModal"
      />
    </teleport>
  </div>
</template>

<script>
import { ref, markRaw, computed, inject, watch } from 'vue';
import { useStore } from 'vuex';
import useWallets from '@/compositions/useWallets';
import { WALLET_TYPES, SNIP20_PARENT_NET } from '@/config/walletType';

import DeleteAddressModal from './DeleteAddressModal.vue';
import removeIcon from '@/assets/icons/settings/remove.svg';
import keyIcon from '@/assets/icons/settings/key.svg';
import notificationIcon from '@/assets/icons/settings/notification.svg';
import exportIcon from '@/assets/icons/settings/export.svg';
import visionIcon from '@/assets/icons/input/vision.svg';

export default {
  name: 'DropdownItem',
  components: {
    DeleteAddressModal,
    keyIcon,
    notificationIcon,
    exportIcon,
    removeIcon,
    visionIcon,
  },
  props: {
    wallet: {
      type: Object,
      required: true,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    hasVisibleButton: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['exportWallet', 'toggle-hidden', 'deleteSeedModal'],
  setup(props, { emit }) {
    const store = useStore();
    const { wallets } = useWallets();
    const manageVkWallets = inject('manageVkWallets');
    const currentIcon = ref();
    const notification = ref(false);
    const isShowDeleteModal = ref(false);
    const isLoading = ref(false);
    // const isLastWallet = computed(() => store.getters['wallets/wallets'].length === 0);
    const isSnip20 = computed(
      () =>
        props.wallet.net === SNIP20_PARENT_NET &&
        props.wallet.subtokensList.filter((item) => item.standard === 'snip20')
          .length
      // store.getters['snip20Subtokens/availableSnip20TokenList'][props.wallet.address]?.length,
    );

    import(`@/assets/icons/types/${props.wallet.type}.svg`).then((val) => {
      currentIcon.value = markRaw(val.default);
    });

    const toggleNotification = () => {
      notification.value = !notification.value;
    };
    const customWalletsList = computed(
      () => store.getters['wallets/customWalletsList']
    );
    const currentList = computed(() => store.getters['wallets/activeList']);
    // const wallets = computed(() => store.getters['wallets/wallets']);

    const removeWallet = async () => {
      isLoading.value = true;
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

      // await store.dispatch('wallets/getNewWallets','lazy');
      await store.dispatch('wallets/getCustomWalletsList');

      isLoading.value = false;

      if (
        currentList.value !== 'all' &&
        !customWalletsList.value.find((item) => item.name === currentList.value)
      ) {
        store.commit('wallets/SET_ACTIVE_LIST', 'all');
      }
    };

    const exportWallet = () => {
      emit('exportWallet', props.wallet);
    };

    const openViewingKeyManager = () => {
      manageVkWallets.value = props.wallet;
    };

    const showDeleteModal = () => {
      isShowDeleteModal.value = true;
    };

    const closeDeleteModal = () => {
      isShowDeleteModal.value = false;
    };

    const windowSize = ref(window.innerWidth);
    let currentAddress = ref(props.wallet.address);

    currentAddress.value = props.hidden
      ? Array(props.wallet.address.length).fill('*').join('')
      : props.wallet.address;

    window.addEventListener('resize', () => {
      windowSize.value = window.innerWidth;
    });

    window.removeEventListener('resize', () => {
      windowSize.value = window.innerWidth;
    });

    watch(() => {
      console.log(windowSize.value);
      if (windowSize.value <= 1440) {
        currentAddress.value = `${currentAddress.value.slice(
          0,
          6
        )}***${currentAddress.value.slice(
          currentAddress.value.length - 6,
          currentAddress.value.length
        )}`;
        console.log(currentAddress);
      }
    });
    return {
      currentIcon,
      notification,
      isSnip20,
      WALLET_TYPES,
      isShowDeleteModal,
      isLoading,
      showDeleteModal,
      closeDeleteModal,
      toggleNotification,
      removeWallet,
      exportWallet,
      openViewingKeyManager,
      currentAddress,
    };
  },
};
</script>

<style lang="scss" scoped>
.dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  height: 65px;
  margin-bottom: 8px;
  border-radius: 8px;
  border: 1px solid $too-ligth-gray;
  padding: 0 10px;
  &__icon {
    width: 36px;
    height: 36px;
    border-radius: 4px;
    background: $mid-gray;
    display: flex;
    align-items: center;
    justify-content: center;
    & svg {
      fill: white;
      height: 22px;
      width: fit-content;
    }
  }

  &__address {
    text-align: left;
    @include text-default;
    width: 50%;
    margin-left: 15px;
    margin-right: auto;
  }
  &__btn_group {
    width: 35%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  &__btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    background: $too-ligth-gray;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;

    &:not(:first-child) {
      margin-left: 3px;
    }
    &:hover {
      background: $too-dark-blue;

      & svg {
        fill: $white;
      }
    }

    &--key {
      &:hover {
        background-color: $blue;
      }

      & svg {
        fill: $blue;
        height: 16px;
      }
    }

    &--notification {
      opacity: 0.5;

      & svg {
        height: 16px;
      }

      &--on {
        & svg {
          fill: $orange;
          height: 16px;
        }
      }

      &--off {
        & svg {
          fill: $blue;
          height: 16px;
        }
      }
    }

    &--export {
      & svg {
        fill: $ligth-blue;
        height: 16px;
      }
    }

    &--remove {
      & svg {
        fill: $red;
        height: 16px;
      }
    }

    &--vision {
      & svg {
        fill: $ligth-blue;
        height: 16px;
      }
    }
  }
}
</style>
