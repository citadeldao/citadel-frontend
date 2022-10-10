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
          <span v-else ref="nameRef" class="alias__wallet-name">
            <!-- <resize-observer :show-trigger="true" @notify="handleNameResize" /> -->
            {{ currentWallet.title || currentWallet.address }}
          </span>
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
            @mouseenter="showAddressTooltip = true"
            @mouseleave="showAddressTooltip = false"
          >
            {{ currentWallet.address }}
          </span>
        </div>
      </div>
    </div>
    <div class="alias__actions">
      <EditButton @click="clickHandler">
        {{ editMode ? $t('save') : $t('edit') }}
      </EditButton>
      <div style="display: flex">
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
import { computed, nextTick, ref } from 'vue';
import { useStore } from 'vuex';
import { addressTextWidth } from '@/helpers';
import { findAddressWithNet } from '@/helpers';
import { WALLET_TYPES } from '@/config/walletType';
import { useRouter } from 'vue-router';
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
    const router = useRouter();

    const scannerLink = computed(() => props.currentWallet.getScannerLink());
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
        title: alias.value.trim(),
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

      if (
        !favouritesList.value.wallets?.length &&
        store.getters['wallets/activeList'] === 'Favourites'
      ) {
        router.push({ name: 'Overall' });
      }
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

    return {
      addressTextWidth,
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
      showAddressTooltip,
      currentWalletType,
      scannerLink,
    };
  },
};
</script>

<style lang="scss" scoped>
.alias {
  height: 150px;
  padding: 0 45px;
  align-items: center;
  justify-content: space-between;
  display: flex;
  background: $white;
  box-shadow: $card-shadow;
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
  }

  @include laptop {
    border-radius: 8px;
    padding: 0 20px;
  }
  &__actions {
    height: 68px;
    justify-content: space-between;
    display: flex;
    flex-direction: column;
  }
  &__info {
    display: flex;
    flex-direction: column;
    max-width: 80%;
    @media (max-width: 1496px) {
      max-width: 74%;
    }
  }

  &__edit {
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 100%;
  }

  &__first-line {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    width: fit-content;
    width: 100%;
    max-width: 100%;
  }

  &__wallet-name {
    position: relative;
    margin: 0;
    font-family: 'Panton_Bold';
    font-size: 20px;
    line-height: 30px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: calc(100% - 3vw);
    //max-width: 525px;
    width: fit-content;

    @include lg {
      max-width: calc(100% - 3vw);
    }
    @media (max-width: 1486px) {
      max-width: calc(100% - 5vw);
    }
    @include md {
      max-width: 390px;
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
    width: fit-content;
    width: 100%;
    max-width: 100%;
  }

  &__wallet-type {
    margin-right: 13px;
    @include md {
      margin-right: 8px;
    }
  }

  &__address-wrapper {
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__address {
    position: relative;
    font-size: 16px;
    line-height: 27px;
    color: $mid-blue;
    margin-right: 15px;
    white-space: nowrap;
    // overflow: hidden;
    // text-overflow: ellipsis;
    cursor: pointer;
    //max-width: 440px;
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    @include lg {
      // max-width: 335px;
    }
    @include md {
      font-size: 14px;
      line-height: 27px;
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
    margin-left: 20px;
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
@media (max-width: 1204px) {
  .alias {
    &__address {
      max-width: 333px;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    &__info {
      max-width: 80%;
    }
  }
}
@media (max-width: 1168px) {
  .alias__wallet-name {
    //max-width: 86%;
  }
}
@media (min-width: 1024px) and (max-width: 1167px) {
  .alias {
    &__edit {
      width: 100%;
    }
    &__wallet-name {
      max-width: calc(100% - 4vw);
    }
    &__first-line {
      width: 100%;
    }
    &__info {
      max-width: 35vw;
    }
  }
}
@media (min-width: 1024px) and (max-width: 1111px) {
  .alias__info {
    max-width: 30vw;
  }
}
</style>
