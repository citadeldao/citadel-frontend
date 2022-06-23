<template>
  <router-link
    :to="to"
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
    </div>
    <div class="address-item__info">
      <span class="address-item__name">{{ walletName }}</span>
      <span class="address-item__balance">
        <span
          v-pretty-number="{
            value: wallet.balance.calculatedBalance,
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

export default {
  name: 'AddressItem',
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
    import(`@/assets/icons/token/${props.wallet.net}.svg`).then((val) => {
      icon.value = markRaw(val.default);
    });

    const metamaskConnector = computed(
      () => store.getters['metamask/metamaskConnector']
    );

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

    const to = computed(() => {
      if (props.wallet.hasSubtoken) {
        return {
          name: 'WalletAssets',
          params: { net: props.wallet.net, address: props.wallet.address },
        };
      }

      if (props.wallet.hasStake) {
        return {
          name: 'WalletStake',
          params: { net: props.wallet.net, address: props.wallet.address },
        };
      }

      return {
        name: 'WalletSend',
        params: { net: props.wallet.net, address: props.wallet.address },
      };
    });
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

    return { icon, type, to, walletName, isActive };
  },
};
</script>

<style lang="scss" scoped>
.address-item {
  display: flex;
  margin-bottom: 33px;
  text-decoration: none;
  user-select: text;
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
    }
  }
  &:last-child {
    margin-bottom: 0;
  }
  @include md {
    margin-bottom: 17px;
  }
  &__icon {
    width: 40px;
    height: 40px;
    background: #8496c0;
    border-radius: $round;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
    position: relative;
    & svg {
      fill: $white;
    }
    @include md {
      width: 32px;
      height: 32px;
      margin-right: 7px;
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
    max-width: 145px;
    @include md {
      max-width: 110px;
    }
  }
  &__name {
    font-size: 14px;
    line-height: 17px;
    color: $slategray;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  &__balance {
    font-size: 18px;
    line-height: 22px;
    font-family: 'Panton_Bold';
    margin-top: 5px;
    color: $mid-blue;
    @include md {
      font-size: 14px;
      line-height: 17px;
    }
  }
  &__currency {
    font-family: 'Panton_Regular';
    color: $slategray;
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
  &__icon {
    margin: 0;
  }
  &__info {
    display: none;
  }
}
</style>
