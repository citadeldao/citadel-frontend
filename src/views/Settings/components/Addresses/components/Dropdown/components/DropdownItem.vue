<template>
  <div
    class="dropdown-item"
    @click.stop="change(!isItemChecked)"
    :class="{
      'dropdown-item--selectable': selectable,
      'dropdown-item--checked': isItemChecked,
    }"
  >
    <div class="dropdown-item__info_wrapper">
      <Checkbox
        v-if="selectable"
        :id="wallet.id"
        :value="isItemChecked"
        @change="change"
      />
      <div
        class="dropdown-item__icon"
        :class="{ 'dropdown-item__icon--selectable': selectable }"
      >
        <component :is="currentIcon" />
      </div>
      <div class="dropdown-item__info">
        <Tooltip :max-width="450">
          <template #content>{{ wallet.title || wallet.address }} </template>
          <template #default>
            <span
              class="dropdown-item__title"
              @mouseenter="showAddressTooltip = true"
              @mouseleave="showAddressTooltip = false"
              >{{ wallet.title || wallet.address }}</span
            >
          </template>
        </Tooltip>
        <span
          class="dropdown-item__address"
          :style="{ maxWidth: `${maxWidth}px` }"
          id="address"
          ref="addressRef"
        >
          {{
            hidden
              ? Array(wallet.address.length).fill('*').join('')
              : formattedAddress
          }}
        </span>
      </div>
    </div>
    <div class="dropdown-item__btn_group" v-if="!selectable">
      <div
        v-if="isSnip20"
        class="dropdown-item__btn dropdown-item__btn--key"
        @click="openViewingKeyManager"
      >
        <visionIcon />
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
        v-if="
          [WALLET_TYPES.ONE_SEED, WALLET_TYPES.PRIVATE_KEY].includes(
            wallet.type
          )
        "
        class="dropdown-item__btn dropdown-item__btn--export"
        data-qa="settings__address__export-button"
        @click="exportWallet"
      >
        <keyIcon />
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
import { ref, markRaw, computed, inject, watch, nextTick } from 'vue';
import { useStore } from 'vuex';
import useWallets from '@/compositions/useWallets';
import { WALLET_TYPES, SNIP20_PARENT_NET } from '@/config/walletType';
import Tooltip from '@/components/UI/Tooltip';
import Checkbox from '@/components/UI/Checkbox';
import DeleteAddressModal from './DeleteAddressModal.vue';
import removeIcon from '@/assets/icons/settings/remove.svg';
import keyIcon from '@/assets/icons/settings/key.svg';
import notificationIcon from '@/assets/icons/settings/notification.svg';
import exportIcon from '@/assets/icons/settings/export.svg';
import visionIcon from '@/assets/icons/input/vision.svg';
import { addressTextWidth, formattedWalletAddress } from '@/helpers';
import { useWindowSize } from 'vue-window-size';
import { screenWidths } from '@/config/sreenWidthThresholds';
export default {
  name: 'DropdownItem',
  components: {
    Tooltip,
    Checkbox,
    DeleteAddressModal,
    keyIcon,
    notificationIcon,
    exportIcon,
    removeIcon,
    visionIcon,
  },
  props: {
    isOpen: {
      type: Boolean,
      required: false,
    },
    wallet: {
      type: Object,
      required: true,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    selectable: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['exportWallet', 'toggle-hidden', 'deleteSeedModal', 'changeItem'],
  setup(props, { emit }) {
    const store = useStore();
    const { wallets } = useWallets();
    const { width } = useWindowSize();
    const manageVkWallets = inject('manageVkWallets');
    const currentIcon = ref();
    const notification = ref(false);
    const isShowDeleteModal = ref(false);
    const isLoading = ref(false);
    const isItemChecked = ref(false);
    const showAddressTooltip = ref(false);
    // const isLastWallet = computed(() => store.getters['wallets/wallets'].length === 0);
    const isSnip20 = computed(
      () =>
        props.wallet.net === SNIP20_PARENT_NET &&
        props.wallet.subtokensList.filter((item) => item.standard === 'snip20')
          .length
    );
    const updateSelectedWallets = inject('updateSelectedWallets');
    const change = (e) => {
      if (props.selectable) {
        isItemChecked.value = e;
        updateSelectedWallets({
          wallet: props.wallet,
          isCheck: isItemChecked.value ? true : false,
        });
      }
    };
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

    window.addEventListener('resize', () => {
      windowSize.value = window.innerWidth;
    });

    window.removeEventListener('resize', () => {
      windowSize.value = window.innerWidth;
    });

    const addressRef = ref(null);
    const wrapperWidth = ref();
    const handleResize = ({ width }) => {
      wrapperWidth.value = width;
    };
    const fontSizes = computed(() => {
      return width.value < screenWidths.lg
        ? { name: 14, address: 12 }
        : { name: 14, address: 12 };
    });

    const maxWidth = computed(() =>
      addressTextWidth(
        props.wallet?.address,
        'Panton_Regular',
        fontSizes.value.address
      )
    );
    const maxNameWidth = computed(() =>
      addressTextWidth(
        props.wallet?.title || props.wallet?.address,
        'Panton_Regular',
        fontSizes.value.name
      )
    );
    const formattedAddress = computed(() => {
      if (props.isOpen)
        return formattedWalletAddress(
          props.wallet?.address,
          +wrapperWidth.value,
          'Panton_Regular',
          fontSizes.value.address
        );
      return props.wallet?.address;
    });
    watch(
      () => props.isOpen,
      (value) => {
        nextTick(() => {
          if (value) wrapperWidth.value = addressRef.value.offsetWidth;
        });
      }
    );
    return {
      addressRef,
      formattedAddress,
      maxWidth,
      maxNameWidth,
      handleResize,
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
      isItemChecked,
      change,
      showAddressTooltip,
    };
  },
};
</script>

<style lang="scss" scoped>
.dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: no-wrap;
  height: 48px;
  margin-bottom: 8px;
  border-radius: 8px;
  border: 1px solid $too-ligth-gray;
  padding: 0 10px;
  &--selectable:not(&--checked) {
    cursor: pointer;
    & svg {
      height: 18px;
    }
    .dropdown-item__address {
      color: #756aa8;
    }
  }
  &--checked:has(&--selectable) {
    font-weight: 600;
    color: #000000;
  }
  &__icon {
    min-width: 36px;
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
    &--selectable {
      zoom: 0.67;
    }
  }

  &__info {
    max-width: 65%;
    color: #4b4c63;
    display: flex;
    flex-direction: column;
    &_wrapper {
      display: flex;
      gap: 7px;
      align-items: center;
      width: 65%;
      flex: 1;
    }
  }
  &__title {
    font-weight: 700;
    font-size: 14px;
    width: fit-content;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    cursor: pointer;
  }
  &__address {
    flex: 1;
    position: relative;
    width: 100%;
    text-align: left;
    margin-right: auto;
    color: $fieldName;
    font-size: 12px;
  }

  &__btn_group {
    max-width: 35%;
    width: fit-content;
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
.alias__address-tooltip {
  background-color: $too-ligth-gray;
  text-align: center;
  border-radius: 6px;
  padding: 8px 9px;
  position: absolute;
  white-space: nowrap;
  z-index: 1;
  left: 25%;
  margin-left: -60px;
  box-shadow: 0px 4px 25px rgba(63, 54, 137, 0.25);
  border-radius: 6px;
  font-size: 12px;
  line-height: 16px;
  color: $too-dark-blue;
  max-width: 50% !important;
  &::-webkit-scrollbar {
    max-width: 368px !important;
    height: 4px; /* width of the entire scrollbar */
    border-radius: 20px;
    scrollbar-width: thin;
  }
  &::-webkit-scrollbar-track {
    margin: 4px;
  }
  &::after {
    content: '';
    position: absolute;
    bottom: 98%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-radius: 2px;
    border-style: solid;
    border-color: transparent transparent $too-ligth-gray transparent;
  }
}
</style>
