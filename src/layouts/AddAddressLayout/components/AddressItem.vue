<template>
  <router-link
    :to="{
      name: 'WalletAssets',
      params: { net: wallet.net, address: wallet.address },
    }"
    class="address-item"
    :class="{ 'active-link': isActive }"
    draggable="false"
    data-qa="address"
  >
    <div class="address-item__icon">
      <keep-alive>
        <component :is="icon" />
      </keep-alive>
      <div
        class="address-item__badge"
        :style="{ backgroundColor: type.color }"
      />
      <span
        v-pretty-number="{
          value: wallet.balance.calculatedBalance,
          currency: wallet.code,
          title: walletName,
        }"
        style="
          position: absolute;
          color: transparent;
          height: 32px;
          width: 32px;
        "
        class="address-item__laptop-tooltip"
      />
    </div>
    <div class="address-item__info">
      <span class="address-item__name">{{ walletName }}</span>
      <span class="address-item__balance">
        <span
          v-pretty-number="{
            value: !showBalance
              ? HIDE_BALANCE_MASK
              : wallet.balance.calculatedBalance,
            currency: wallet.code,
          }"
        />
        <span class="address-item__currency">{{ wallet.code }}</span>
      </span>
    </div>
  </router-link>
</template>

<script>
import { computed, getCurrentInstance, markRaw, nextTick, ref } from 'vue';
import { types } from '@/config/walletType';
import { useWindowSize } from 'vue-window-size';
import { screenWidths } from '@/config/sreenWidthThresholds';
import { useRoute } from 'vue-router';
import { WALLET_TYPES } from '@/config/walletType';
import { useStore } from 'vuex';
import { HIDE_BALANCE_MASK } from '@/helpers/prettyNumber';
import Tooltip from '@/components/UI/Tooltip';

export default {
  name: 'AddressItem',
  component: { Tooltip },
  props: {
    wallet: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const store = useStore();
    const { width } = useWindowSize();
    const route = useRoute();
    const icon = ref();
    import(`@/assets/icons/networks/${props.wallet.net}.svg`).then((val) => {
      icon.value = markRaw(val.default);
    });

    const metamaskConnector = computed(
      () => store.getters['metamask/metamaskConnector']
    );

    const showBalance = computed(() => store.getters['balance/showBalance']);

    const currentWalletType = computed(() => {
      const metamaskNet = metamaskConnector.value.network;
      const metamaskAddress =
        metamaskConnector.value.accounts[0] &&
        metamaskConnector.value.accounts[0].toLowerCase();
      const { address, net, type } = props.wallet;

      if (
        address.toLowerCase() === metamaskAddress &&
        net === metamaskNet &&
        type === WALLET_TYPES.PUBLIC_KEY
      ) {
        return WALLET_TYPES.METAMASK;
      }

      return props.wallet.type;
    });

    const type = computed(() => {
      return types[currentWalletType.value];
    });

    const wSize = computed(() => {
      if (width.value < screenWidths.lg) {
        return 'md';
      }

      if (width.value < screenWidths.xl) {
        return 'lg';
      }

      return 'xl';
    });
    const walletName = computed(() => {
      if (wSize.value === 'md') {
        return props.wallet.getShortAddress(
          13,
          props.wallet.title || props.wallet.address
        );
      }

      return props.wallet.getShortAddress(
        19,
        props.wallet.title || props.wallet.address
      );
    });

    // const to = computed(() => {
    //   if (props.wallet.hasSubtoken) {
    //     return {
    //       name: 'WalletAssets',
    //       params: { net: props.wallet.net, address: props.wallet.address },
    //     };
    //   }

    //   if (props.wallet.hasStake) {
    //     return {
    //       name: 'WalletStake',
    //       params: { net: props.wallet.net, address: props.wallet.address },
    //     };
    //   }

    //   return {
    //     name: 'WalletSend',
    //     params: { net: props.wallet.net, address: props.wallet.address },
    //   };
    // });
    const isActive = computed(
      () =>
        route.params.address?.toLowerCase() ===
          props.wallet.address.toLowerCase() &&
        route.params.net.toLowerCase() === props.wallet.net.toLowerCase()
    );

    const instance = getCurrentInstance();
    nextTick(() => {
      isActive.value && instance.proxy.$el.scrollIntoView();
    });

    return {
      showBalance,
      icon,
      type,
      // to,
      walletName,
      isActive,
      HIDE_BALANCE_MASK,
    };
  },
};
</script>

<style lang="scss" scoped>
.address-item {
  display: flex;
  text-decoration: none;
  user-select: text;
  margin-bottom: 20px;
  &:hover {
    .address-item__icon {
      background: $blue;
    }
    .address-item__name,
    .address-item__currency {
      color: $too-dark-blue;
    }
    .address-item__balance {
      color: $blue;
      display: flex;
    }
  }
  &__icon {
    border-radius: $round;
    background: #8496c0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
    position: relative;
    & svg {
      fill: $white;
      max-width: 18px;
      max-height: 20px;
    }
    @include md {
      width: 32px;
      height: 32px;
      margin-right: 10px;
    }
    &-info {
      display: none;
    }
  }
  &__badge {
    width: 11px;
    height: 11px;
    border-radius: $round;
    border: 2px solid $white;
    position: absolute;
    right: 0px;
    bottom: 0px;
  }
  &__info {
    display: flex;
    flex-direction: column;
    max-width: 135px;
    @include md {
      max-width: 110px;
    }
  }
  &__name {
    font-size: $sidebar-text-font-size;
    color: $slategray;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  &__balance {
    font-size: $sidebar-balance-font-size;
    font-family: 'Panton_Bold';
    margin-top: 5px;
    color: $mid-blue;
    display: flex;
    @include md {
      font-size: $sidebar-balance-font-size-md;
    }
    @include laptop {
      font-size: $sidebar-text-font-size-laptop;
    }
  }
  &__currency {
    margin-left: 5px;
    font-family: 'Panton_Regular';
    color: $slategray;
  }
  &__laptop-tooltip {
    display: none;
  }
  @include laptop {
    margin: 0;
    margin-bottom: 15px;

    &__laptop-tooltip {
      display: initial;
    }
  }
}
.active-link {
  &:hover {
    .address-item__icon {
      background: $dark-blue;
    }
    .address-item__name,
    .address-item__currency {
      color: $black;
    }
    .address-item__balance {
      color: $dark-blue;
    }
  }
  .address-item__icon {
    background: $dark-blue;
  }
  .address-item__name,
  .address-item__currency {
    color: $black;
  }
  .address-item__balance {
    color: $dark-blue;
  }
}

.compact .address-item {
  margin-bottom: 25px;
  justify-content: center;
  position: relative;
  &__icon {
    margin: 0;
  }
  &__info {
    opacity: 0;
    position: absolute;
    top: -20px;
    right: -7px;
    z-index: -999;
    & > div {
      position: fixed;
      background-color: $white;
      padding: 0 10px;
      height: 48px;
      width: 110px;
      box-shadow: 0px 4px 25px rgba(63, 54, 137, 0.25);
      border-radius: 6px;
    }
  }
  @include laptop {
    margin: 0;
    margin-bottom: 15px;
  }

  // &:hover {
  //   .address-item__info {
  //     opacity: 1;
  //   }
  // }
}

body.dark {
  .address-item {
    &__name,
    &__currency {
      color: #8496c0;
    }

    &__currency {
      font-family: 'Panton_Light';
    }

    &__icon {
      background: #393b53;
    }

    &:hover {
      .address-item__icon {
        background: $blue;
      }
      .address-item__name,
      .address-item__currency {
        color: $white;
      }
      .address-item__balance {
        color: #6b93c0;
        display: flex;
      }
    }
  }
}
</style>
