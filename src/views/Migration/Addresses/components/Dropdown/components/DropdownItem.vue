<template>
  <div :class="{ exists: wallet.existWallet }" class="dropdown-item">
    <div class="dropdown-item__icon">
      <component :is="currentIcon" />
    </div>
    <div class="dropdown-item__address">
      {{
        hidden
          ? Array(wallet.address.length).fill('*').join('')
          : wallet.address
      }}
    </div>
    <div
      v-if="
        [
          WALLET_TYPES.ONE_SEED,
          WALLET_TYPES.PRIVATE_KEY,
          WALLET_TYPES.SEED_PHRASE,
        ].includes(wallet.type) && true
      "
      class="dropdown-item__btn dropdown-item__btn--export"
      @click="exportWallet"
    >
      <keyIcon />
    </div>
  </div>
</template>

<script>
import { ref, markRaw } from 'vue';
import removeIcon from '@/assets/icons/settings/remove.svg';
import { WALLET_TYPES } from '@/config/walletType';
import keyIcon from '@/assets/icons/settings/key.svg';
import notificationIcon from '@/assets/icons/settings/notification.svg';

export default {
  name: 'DropdownItem',
  components: {
    keyIcon,
    notificationIcon,
    removeIcon,
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
  },
  emits: ['exportWallet', 'toggle-hidden'],
  setup(props, { emit }) {
    import(`@/assets/icons/types/${props.wallet.type}.svg`).then((val) => {
      currentIcon.value = markRaw(val.default);
    });
    const currentIcon = ref();
    const notification = ref(false);

    const toggleNotification = () => {
      notification.value = !notification.value;
    };

    const exportWallet = () => {
      emit('exportWallet', props.wallet);
    };

    return {
      currentIcon,
      notification,
      toggleNotification,
      WALLET_TYPES,
      exportWallet,
    };
  },
};
</script>

<style lang="scss" scoped>
.dropdown-item {
  display: flex;
  align-items: center;
  height: 68px;
  width: 100%;
  margin-bottom: 8px;
  border-radius: 8px;
  border: 1px solid $too-ligth-gray;
  padding: 0 10px;

  &.exists {
    opacity: 0.2;
  }

  &__icon {
    width: 50px;
    height: 50px;
    padding: 13px 0;
    border-radius: 8px;
    background: $mid-gray;
    text-align: center;

    & svg {
      fill: white;
      height: 24px;
    }
  }

  &__address {
    flex: 1 1 auto;
    margin-left: 9px;
    font-size: 14px;
    font-weight: 600;
    text-align: left;
  }

  &__btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    background: $too-ligth-gray;
    border-radius: 8px;
    text-align: center;
    margin-left: 8px;
    cursor: pointer;

    &:hover {
      background: $too-dark-blue;

      & svg {
        fill: $white;
      }
    }

    &--key {
      opacity: 0.5;

      & svg {
        fill: $blue;
        height: 23px;
      }
    }

    &--notification {
      opacity: 0.5;

      & svg {
        height: 25px;
      }

      &--on {
        & svg {
          fill: $orange;
        }
      }

      &--off {
        & svg {
          fill: $blue;
        }
      }
    }

    &--export {
      opacity: 0.5;

      & svg {
        fill: $ligth-blue;
        height: 27px;
      }
    }

    &--vision {
      & svg {
        fill: $ligth-blue;
        width: 20px;
      }
    }
  }
}
</style>
