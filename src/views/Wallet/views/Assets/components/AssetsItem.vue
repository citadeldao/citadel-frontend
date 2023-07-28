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

export default {
  name: 'AssetsItem',
  components: { AssetIcon },
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
  },
  setup(props) {
    const showIconPlaceholder = ref(false);
    const iconPlaceholder = computed(() =>
      tokenIconPlaceholder(props.item.name)
    );
    const store = useStore();
    const showBalance = computed(() => store.getters['balance/showBalance']);
    const price = computed(() => {
      if (props.isNativeToken) {
        return store.getters['profile/rates'][props.item.net].USD;
      }
      return props.item.tokenBalance.price.USD;
    });
    return {
      showIconPlaceholder,
      iconPlaceholder,
      price,
      showBalance,
      HIDE_BALANCE_MASK,
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

  &__cell {
    display: flex;
    align-items: center;
    padding: 16px 5px 16px 0;
    font-size: 18px;

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
        width: 21%;
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
</style>
