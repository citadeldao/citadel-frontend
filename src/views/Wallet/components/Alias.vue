<template>
  <div class="alias">
    <div class="alias__info">
      <div class="alias__lines">
        <div class="alias__first-line">
          <FavoriteButton
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
            <p v-else ref="nameRef" class="alias__wallet-name">
              {{ currentWallet.title || currentWallet.address }}
            </p>
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
import FavoriteButton from '@/components/FavoriteButton';
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
    FavoriteButton,
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
  width: 100%;
  &-xl {
    @include xl {
      width: calc(100% - 360px);
    }
  }

  @include md {
    height: 98px;
    padding: 0 24px;
    border-radius: 16px;
  }

  @include laptop {
    border-radius: 8px;
    padding: 0 20px;
  }

  &__lines {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 490px;
    @include laptop-l {
      max-width: 400px;
    }
    @include laptop-standard {
      max-width: 350px;
    }
  }
  &__actions {
    height: 68px;
    justify-content: space-between;
    display: flex;
    flex-direction: column;
    margin-left: 5px;
  }
  &__info {
    display: flex;
    max-width: 655px;
    width: 100%;
  }

  &__edit {
    align-items: center;
    width: calc(100% - 46px);
  }

  &__first-line {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    height: 30px;
  }

  &__wallet-name {
    position: relative;
    margin: 0;
    font-family: 'Panton_Bold';
    font-size: 20px;
    line-height: 30px;
    text-overflow: ellipsis;
    overflow: hidden;
    @include md {
      max-width: 390px;
      font-size: 16px;
      line-height: 19px;
    }
    @include laptop {
      max-width: 280px !important;
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
    align-items: center;
    width: calc(100% - 113px);
  }

  &__address {
    position: relative;
    font-size: 16px;
    line-height: 27px;
    color: $mid-blue;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    @include md {
      font-size: 14px;
      line-height: 27px;
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
</style>
