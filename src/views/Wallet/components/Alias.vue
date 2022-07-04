<template>
  <div class="alias">
    <div class="alias__info">
      <div class="alias__first-line">
        <FavouriteButton
          :value="isFavorite"
          data-qa="wallet__favourite"
          @change="toggleFavorite"
        />
        <div v-click-away="onClickAway" class="alias__edit">
          <input
            v-if="editMode"
            ref="titleInput"
            v-model="alias"
            type="text"
            class="alias__input"
            spellcheck="false"
            @focus="focus = true"
            @blur="focus = false"
            @keyup.enter="setAlias()"
          />
          <h4
            v-else
            ref="nameRef"
            :style="maxNameWidth"
            class="alias__wallet-name"
          >
            <resize-observer :show-trigger="true" @notify="handleNameResize" />
            {{ currentWallet.title || formattedWalletName }}
          </h4>
          <EditButton @click="clickHandler">
            {{ editMode ? $t('save') : $t('edit') }}
          </EditButton>
        </div>
      </div>
      <div class="alias__second-line">
        <div class="alias__wallet-type">
          <WalletTypeCard
            :type="currentWalletType"
            data-qa="wallet__adding-type"
          />
        </div>
        <div class="alias__address-wrapper">
          <span
            id="address"
            ref="addressRef"
            class="alias__address"
            :style="{ maxWidth: `${maxWidth}px` }"
            @mouseenter="showAddressTooltip = true"
            @mouseleave="showAddressTooltip = false"
          >
            <resize-observer :show-trigger="true" @notify="handleResize" />
            {{ formattedAddress }}
          </span>
          <div
            class="alias__copy-icon"
            data-qa="wallet__copy-address-button"
            @click="copyAddress(currentWallet.address)"
          >
            <transition name="fade1">
              <span v-if="isCopied" class="alias__tooltip">
                {{ $t('copiedToClipboard') }}
              </span>
            </transition>
            <copy />
          </div>
          <div class="alias__scanner-icon">
            <a :title="scannerLink" :href="scannerLink" target="_blank">
              <linkIcon />
            </a>
          </div>
        </div>
      </div>
    </div>
    <div
      class="alias__qr"
      data-qa="wallet__qr-button"
      @click="$emit('qrClick')"
    >
      <qr />
    </div>
    <span
      v-if="showAddressTooltip"
      class="alias__address-tooltip"
      @mouseenter="showAddressTooltip = true"
      @mouseleave="showAddressTooltip = false"
    >
      {{ currentWallet.address }}
    </span>
  </div>
</template>

<script>
import linkIcon from '@/assets/icons/link.svg';
import qr from '@/assets/icons/qr.svg';
import copy from '@/assets/icons/copy.svg';
import WalletTypeCard from '@/components/WalletTypeCard';
import EditButton from '@/components/UI/EditButton';
import FavouriteButton from '@/components/FavouriteButton';
import copyToClipboard from '@/helpers/copyToClipboard';
import { computed, nextTick, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { addressTextWidth, formattedWalletAddress } from '@/helpers';
import { findAddressWithNet } from '@/helpers';
import { useWindowSize } from 'vue-window-size';
import { screenWidths } from '@/config/sreenWidthThresholds';
import { WALLET_TYPES } from '@/config/walletType';

export default {
  name: 'Alias',
  components: {
    EditButton,
    FavouriteButton,
    WalletTypeCard,
    copy,
    qr,
    linkIcon,
  },
  props: {
    currentWallet: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['qrClick'],
  setup(props) {
    const { width } = useWindowSize();
    const addressRef = ref(null);
    const nameRef = ref(null);
    const wrapperWidth = ref();
    const wrapperNameWidth = ref();

    const scannerLink = computed(() => props.currentWallet.getScannerLink());

    const handleResize = ({ width }) => {
      wrapperWidth.value = width;
    };
    const handleNameResize = ({ width }) => {
      wrapperNameWidth.value = width;
    };

    const fontSizes = computed(() => {
      return width.value < screenWidths.lg
        ? { name: 16, address: 14 }
        : { name: 20, address: 16 };
    });

    const maxWidth = computed(() =>
      addressTextWidth(
        props.currentWallet?.address,
        'Panton_Regular',
        fontSizes.value.address
      )
    );
    const maxNameWidth = computed(() => {
      return {
        maxWidth: `${addressTextWidth(
          props.currentWallet?.title || props.currentWallet?.address,
          'Panton_Bold',
          fontSizes.value.name,
          'chehol'
        )}px`,
      };
    });

    const metamaskConnector = computed(
      () => store.getters['metamask/metamaskConnector']
    );

    const currentWalletType = computed(() => {
      const metamaskNet = metamaskConnector.value.network;
      const metamaskAddress =
        metamaskConnector.value.accounts[0] &&
        metamaskConnector.value.accounts[0].toLowerCase();
      const { address, net, type } = props.currentWallet;

      if (
        address.toLowerCase() === metamaskAddress &&
        net === metamaskNet &&
        type === WALLET_TYPES.PUBLIC_KEY
      ) {
        return WALLET_TYPES.METAMASK;
      }

      return props.currentWallet.type;
    });

    const formattedAddress = computed(() => {
      return formattedWalletAddress(
        props.currentWallet?.address,
        +wrapperWidth.value,
        'Panton_Regular',
        fontSizes.value.address
      );
    });

    const formattedWalletName = computed(() => {
      return formattedWalletAddress(
        props.currentWallet?.address,
        +wrapperNameWidth.value,
        'Panton_Bold',
        fontSizes.value.name
      );
    });

    const editMode = ref(false);
    const titleInput = ref(null);
    const alias = ref('');
    const focus = ref(false);
    const store = useStore();
    const setAlias = async () => {
      if (!alias.value) {
        editMode.value = false;
        alias.value = '';

        return;
      }

      await store.dispatch('wallets/renameWalletTitle', {
        walletId: props.currentWallet.id,
        title: alias.value,
      });
      // store.dispatch('wallets/getNewWallets','lazy');
      editMode.value = false;
      alias.value = '';
    };
    const clickHandler = () => {
      if (!editMode.value) {
        editMode.value = true;
        alias.value = props.currentWallet.title || ``;
        nextTick(() => titleInput.value.focus());
      } else {
        setAlias();
      }
    };

    const onClickAway = () => {
      if (!focus.value) {
        alias.value = props.currentWallet.title || ``;
        editMode.value = false;
      }
    };

    const isCopied = ref(false);
    const copyAddress = () => {
      isCopied.value = true;
      copyToClipboard(props.currentWallet.address);
      setTimeout(() => {
        isCopied.value = false;
      }, 1500);
    };

    const customWalletsList = computed(
      () => store.getters['wallets/customWalletsList']
    );
    const favouritesList = computed(
      () =>
        customWalletsList.value.length > 0 &&
        customWalletsList.value.find((list) => list.name === 'Favourites')
    );

    const isFavorite = computed(
      () =>
        favouritesList.value &&
        !!findAddressWithNet(favouritesList.value.wallets, props.currentWallet)
    );
    const toggleFavorite = async () => {
      if (isFavorite.value) {
        await removeFromFavorite();
      } else {
        await addToFavorite();
      }

      await store.dispatch('wallets/getCustomWalletsList');
    };
    const removeFromFavorite = async () => {
      await store.dispatch('wallets/editCustomWalletsList', {
        listId: favouritesList.value.id,
        name: 'Favourites',
        wallets: favouritesList.value.wallets.filter(
          ({ address, net }) =>
            !(
              address.toLowerCase() ===
                props.currentWallet.address.toLowerCase() &&
              net === props.currentWallet.net
            )
        ),
        needSetActiveList: false,
      });
    };
    const addToFavorite = async () => {
      if (!favouritesList.value) {
        await store.dispatch('wallets/createCustomWalletsList', {
          name: 'Favourites',
          wallets: [
            {
              net: props.currentWallet.net,
              address: props.currentWallet.address,
            },
          ],
          needSetActiveList: false,
        });

        return;
      }

      await store.dispatch('wallets/editCustomWalletsList', {
        listId: favouritesList.value.id,
        name: 'Favourites',
        wallets: [
          ...favouritesList.value.wallets,
          {
            net: props.currentWallet.net,
            address: props.currentWallet.address,
          },
        ],
        needSetActiveList: false,
      });
    };

    const showAddressTooltip = ref(false);

    // set wrapper width default
    onMounted(() => {
      wrapperWidth.value = addressRef.value.offsetWidth;
      wrapperNameWidth.value = nameRef.value.offsetWidth;
    });

    return {
      copyToClipboard,
      editMode,
      clickHandler,
      alias,
      titleInput,
      setAlias,
      copyAddress,
      isCopied,
      onClickAway,
      focus,
      isFavorite,
      toggleFavorite,
      formattedAddress,
      formattedWalletName,
      wrapperWidth,
      wrapperNameWidth,
      handleResize,
      handleNameResize,
      maxWidth,
      maxNameWidth,
      showAddressTooltip,
      currentWalletType,
      addressRef,
      nameRef,
      scannerLink,
    };
  },
};
</script>

<style lang="scss" scoped>
.alias {
  flex: 1;
  height: 150px;
  padding: 0 45px;
  align-items: center;
  justify-content: space-between;
  display: flex;
  background: $white;
  box-shadow: -10px 4px 27px rgba(0, 0, 0, 0.1);
  border-radius: 25px;
  position: relative;
  @include lg {
    width: 100%;
    height: 126px;
    padding: 0 24px 0 29px;
  }
  @include md {
    width: 100%;
    height: 98px;
    padding: 0 24px;
    border-radius: 16px;
    box-shadow: -10px 4px 27px rgba(0, 0, 0, 0.1);
  }

  &__info {
    display: flex;
    flex-direction: column;
    max-width: 86%;
    flex: 1;
    margin-right: 20px;
  }

  &__edit {
    display: flex;
    flex: 1;
    align-items: center;
  }

  &__first-line {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }

  &__wallet-name {
    position: relative;
    flex: 1;
    margin: 0;
    font-family: 'Panton_Bold';
    margin-right: 16px;
    font-size: 20px;
    line-height: 30px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 525px;

    @include lg {
      max-width: 396px;
    }

    @include md {
      max-width: 318px;
      font-size: 16px;
      line-height: 19px;
    }
  }

  &__input {
    margin-right: 16px;
    border: 1px solid $too-ligth-blue;
    border-radius: 4px;
    height: 30px;
    padding: 0 9px;
    font-family: 'Panton_SemiBold';

    &:focus {
      border: 1px solid $blue;
    }
  }

  &__second-line {
    display: flex;
    align-items: center;
  }

  &__wallet-type {
    margin-right: 13px;
    @include md {
      margin-right: 8px;
    }
  }

  &__address-wrapper {
    display: flex;
    flex: 1;
    align-items: center;
  }

  &__address {
    flex: 1;
    position: relative;
    font-size: 16px;
    line-height: 27px;
    color: $mid-blue;
    margin-right: 15px;
    // overflow: hidden;
    // white-space: nowrap;
    // text-overflow: ellipsis;
    cursor: pointer;
    // max-width: 495px;
    @include lg {
      // max-width: 335px;
    }
    @include md {
      font-size: 14px;
      line-height: 27px;
      margin-right: 10px;
      // max-width: 260px;
    }
  }

  &__qr {
    background: $blue;
    border-radius: 8px;
    width: 68px;
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;

    & svg {
      width: 43px;
      height: 43px;
    }

    &:hover {
      background: #0a2778;
    }

    @include md {
      width: 50px;
      height: 50px;
      border-radius: 4px;
      & svg {
        width: 30px;
        height: 30px;
      }
    }
  }

  &__copy-icon {
    position: relative;
    cursor: pointer;

    & svg {
      width: 20px;
      height: 22px;
      @include md {
        width: 18px;
        height: 20px;
      }
    }

    &:hover {
      & svg {
        fill: $too-dark-blue;
      }
    }
  }

  &__scanner-icon {
    & svg {
      width: 25px;
      height: 22px;
      margin-left: 16px;
    }
  }

  &__tooltip,
  &__address-tooltip {
    background-color: $too-ligth-gray;
    text-align: center;
    border-radius: 6px;
    padding: 8px 9px;
    position: absolute;
    white-space: nowrap;
    z-index: 1;
    top: 110%;
    left: 50%;
    margin-left: -60px;
    box-shadow: 0px 4px 25px rgba(63, 54, 137, 0.25);
    border-radius: 6px;
    font-size: 12px;
    line-height: 16px;
    color: $too-dark-blue;

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

  &__address-tooltip {
    top: 97px;
    left: 196px;
    @include md {
      top: 82px;
      left: 176px;
    }
  }
}
</style>
