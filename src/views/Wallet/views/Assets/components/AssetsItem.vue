<template>
  <div
    class="assets-item"
    :class="{
      'assets-item--not-linked': isNotLinked,
      'assets-item--active': isActive,
    }"
  >
    <div class="assets-item__cell">
      <AssetIcon
        :is-native-token="isNativeToken"
        :name="item.name"
        :code="item.code"
        :net="item.net"
        class="assets-item__icon"
      />
      <span class="assets-item__name">{{
        item.nativeTokenName || item?.name
      }}</span>
    </div>
    <div
      v-if="isNotLinked"
      class="assets-item__cell"
      :class="{ 'assets-item__cell--not-linked': isNotLinked }"
    >
      <span class="assets-item__hint">
        {{ $t('viewBalance') }}
      </span>
    </div>
    <template v-else>
      <div class="assets-item__cell">
        <span
          v-pretty-number="{
            value: showBalance ? balance?.calculatedBalance : HIDE_BALANCE_MASK,
            currency: item.code,
          }"
          class="assets-item__value"
        />
        <span class="assets-item__currency assets-item__currency--left">{{
          item.code
        }}</span>
      </div>
      <div class="assets-item__cell">
        <span class="assets-item__currency assets-item__currency--right"
          >$</span
        >
        <span
          v-pretty-number="{
            value: showBalance ? item.balanceUSD : HIDE_BALANCE_MASK,
            currency: 'USD',
          }"
          class="assets-item__value"
        />
      </div>
      <div class="assets-item__cell">
        <span class="assets-item__currency assets-item__currency--right"
          >$</span
        >
        <span
          v-pretty-number="{
            value: price,
            currency: 'USD',
          }"
          class="assets-item__value"
        />
        <div
          @click.stop="send"
          :class="{ noSwap: !hasSwap }"
          class="assets-item__send"
        >
          <SendAssetIcon />
          <div
            style="position: absolute; color: transparent"
            v-pretty-number="{
              value: 'Send',
            }"
          />
        </div>
        <div v-if="hasSwap" @click.stop="swap" class="assets-item__send swap">
          <SwapAssetIcon />
          <div
            style="position: absolute; color: transparent"
            v-pretty-number="{
              value: 'Swap',
            }"
          />
        </div>
        <!-- <div v-if="hasSwap" class="assets-item__swap" @click.stop="showAction">
          Action
        </div>
        <div v-if="showActionMenu" class="assets-item__action">
          <div class="assets-item__action-item" @click.stop="send">Send</div>
          <div class="assets-item__action-item" @click.stop="swap">Swap</div>
        </div> -->
      </div>
    </template>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { tokenIconPlaceholder } from '@/helpers';
import AssetIcon from '@/components/UI/AssetIcon.vue';
import { useStore } from 'vuex';
import { HIDE_BALANCE_MASK } from '@/helpers/prettyNumber';
import { useRouter } from 'vue-router';
import SendAssetIcon from '@/assets/icons/sendasset.svg';
import SwapAssetIcon from '@/assets/icons/swapasset.svg';

export default {
  name: 'AssetsItem',
  components: { AssetIcon, SendAssetIcon, SwapAssetIcon },
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    balance: {
      type: [Object],
      default: () => ({}),
    },
    isNativeToken: {
      type: Boolean,
      default: false,
    },
    isNotLinked: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    hasSwap: {
      type: Boolean,
      default: false,
    },
    stateCurrentWallet: {
      type: Object,
      required: false,
    },
    showActionMenu: {
      type: Boolean,
      default: false,
    },
    index: {
      type: [String, Number],
    },
  },
  setup(props, { emit }) {
    const showIconPlaceholder = ref(false);
    const iconPlaceholder = computed(() =>
      tokenIconPlaceholder(props.item.name)
    );
    const router = useRouter();
    const store = useStore();
    const showBalance = computed(() => store.getters['balance/showBalance']);
    const price = computed(() => {
      if (props.isNativeToken) {
        return store.getters['profile/rates'][props.item.net].USD;
      }
      return props.item.tokenBalance.price.USD;
    });

    const showAction = () => {
      emit('showAction', props.index);
    };

    const send = () => {
      emit('click');
      setTimeout(() => {
        if (props.item.parentCoin) {
          router.push({
            name: 'WalletSend',
            params: {
              token: props.item.net,
              net: props.item.parentCoin.net,
              address: props.item.address,
            },
          });
          return;
        }
        router.push({ name: 'WalletSend' });
      }, 100);
    };

    const swap = () => {
      localStorage.setItem(
        'swapContract',
        `${props.item.net.split('_')[1] || props.item.net}:${props.item.code}`
      );
      router.push({ name: 'WalletSwap' });
    };

    return {
      swap,
      send,
      showIconPlaceholder,
      iconPlaceholder,
      price,
      showBalance,
      HIDE_BALANCE_MASK,
      showAction,
    };
  },
};
</script>

<style lang="scss" scoped>
@mixin hover {
  .assets-item {
    &__icon {
      background: $dark-blue;
    }

    &__name {
      color: $black;
    }

    &__value {
      color: $dark-blue;
    }

    &__currency {
      color: $black;
    }
  }
}

.assets-item {
  display: flex;
  width: 100%;
  background: #f1f4ff;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;

  @include laptop {
    height: 48px;
  }

  &:hover {
    background: #f4e9fc;
    @include hover;

    .assets-item__icon {
      background: $dark-blue;
      box-shadow: 0 15px 50px rgba(26, 83, 240, 0.1),
        0 10px 15px rgba(26, 83, 240, 0.16);
    }
  }

  &__action {
    border: 1px solid #6b93c0;
    position: absolute;
    right: -5px;
    bottom: -10px;
    display: flex;
    flex-direction: column;
    width: 75px;
    background: #f1f4ff;
    border-radius: 8px;
    box-sizing: border-box;
  }

  &__action-item {
    padding: 10px;
    font-size: 13px;
    text-align: left;
    color: #756aa8;

    &:hover {
      color: #6b93c0;
      cursor: pointer;
    }

    &:first-child {
      border-bottom: 1px dashed #6b93c0;
    }
  }

  &__send {
    width: 32px;
    height: 32px;
    position: absolute;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    right: 50px;
    border-radius: 4px;

    &.swap {
      right: 10px;
    }

    &.noSwap {
      right: 10px;
    }
  }

  &__swap {
    position: absolute;
    right: 10px;
    width: 45px;
    height: 26px;
    line-height: 26px;
    color: #6b93c0;
    background: transparent;
    border: 1px solid #756aa8;
    text-align: center;
    border-radius: 6px;
    font-size: 12px;

    &:hover {
      border: 1px solid $dark-blue;
    }
  }

  &__cell {
    display: flex;
    align-items: center;
    padding: 16px 5px 16px 0;
    font-size: 18px;
    position: relative;

    @include lg {
      padding: 10px 5px 10px 0;
      font-size: 16px;
    }

    @include md {
      padding: 8px 5px 8px 0;
      font-size: 14px;
    }

    &:nth-child(1) {
      flex: 1;
    }

    &:nth-child(2),
    &:nth-child(3),
    &:nth-child(4) {
      width: 20%;

      @include lg {
        width: 22%;
      }

      @include md {
        width: 22%;
      }

      @include laptop {
        width: 18%;
      }
    }

    &:first-child {
      padding-left: 16px;

      @include lg {
        padding-left: 10px;
      }

      @include md {
        padding-left: 8px;
      }
    }

    &--not-linked {
      width: 60% !important;

      @include lg {
        width: 63% !important;
      }

      @include md {
        width: 66% !important;
      }
    }
  }

  &__icon {
    margin-right: 16px;

    @include md {
      margin-right: 8px;
    }
  }

  &__name {
    font-family: 'Panton_SemiBold';
    color: $slategray;
  }

  &__value {
    color: $mid-blue;
    font-family: 'Panton_Bold' !important;
  }

  &__currency {
    font-family: 'Panton_Regular';
    color: $slategray;

    &--left {
      padding-left: 5px;
    }

    &--right {
      padding-right: 5px;
    }
  }

  &__hint {
    font-family: 'Panton_SemiBold';
    color: $red;
  }

  &--native {
    background: linear-gradient(
      90deg,
      #fad0c466 0%,
      #fad0c466 1%,
      #ffd1ff66 100%
    );
    cursor: pointer;
    @include hover;

    &:hover {
      background: linear-gradient(
        90deg,
        #fad0c466 0%,
        #fad0c466 1%,
        #ffd1ff66 100%
      );
    }
  }

  &--not-linked {
    background: linear-gradient(
      90deg,
      rgba($red, 0.1) 0%,
      rgba($red, 0.2) 1%,
      rgba($red, 0.1) 100%
    );
    cursor: pointer;

    &:hover {
      background: linear-gradient(
        90deg,
        rgba($red, 0.15) 0%,
        rgba($red, 0.3) 1%,
        rgba($red, 0.15) 100%
      );
    }

    .assets-item {
      &__name {
        color: $black;
      }

      &__icon {
        background: $red;
        box-shadow: 0 15px 50px rgba($red, 0.1), 0 10px 15px rgba($red, 0.16);
      }
    }

    &:hover {
      .assets-item__icon {
        background: $red;
        box-shadow: 0 15px 50px rgba($red, 0.1), 0 10px 15px rgba($red, 0.16);
      }
    }
  }
  &--active {
    background: linear-gradient(
      90deg,
      #fad0c466 0%,
      #fad0c466 1%,
      #ffd1ff66 100%
    );
    transition: none;
    cursor: pointer;
    .assets-item__icon {
      background: $dark-blue;
      box-shadow: 0 15px 50px rgba(26, 83, 240, 0.1),
        0 10px 15px rgba(26, 83, 240, 0.16);
    }
  }
}

body.dark {
  .assets-item {
    background: rgb(28, 29, 46);

    .assets-item__value {
      color: #c3ceeb;
    }

    &__send {
      background: #2d2e42;
    }

    &__action {
      border: 1px solid #6b93c0;
      background: #313354;
    }

    &__action-item {
      color: #756aa8;

      &:hover {
        color: #6b93c0;
      }

      &:first-child {
        border-bottom: 1px dashed #6b93c0;
      }
    }

    &__swap {
      position: absolute;
      right: 10px;
      width: 45px;
      height: 26px;
      line-height: 26px;
      color: #fff;
      background: transparent;
      border: 1px solid $dark-blue;
      text-align: center;
      border-radius: 6px;
      font-size: 12px;

      &:hover {
        border: 1px solid $blue;
      }
    }

    .assets-item__currency.assets-item__currency--left,
    .assets-item__currency.assets-item__currency--right,
    .item__currency {
      color: #6b758e;
    }

    &__name {
      color: #c3ceeb;
    }

    &:hover {
      background: #101120;

      .assets-item__name {
        color: $white;
      }

      .assets-item__currency {
        color: $dark-blue;
      }

      .item__currency {
        color: $white;
      }

      .assets-item__value {
        color: $dark-blue;
      }

      .assets-item__currency.assets-item__currency--left,
      .assets-item__currency.assets-item__currency--right {
        color: $white;
      }
    }
  }
}
</style>
