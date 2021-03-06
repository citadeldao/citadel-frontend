<template>
  <div class="asset-item">
    <div class="asset-item__icon">
      <div v-if="showIconPlaceholder" class="asset-item__placeholder">
        <span>{{ iconPlaceholder[0] }}</span>
        <span>{{ iconPlaceholder[1] }}</span>
      </div>
      <img
        v-else
        :src="getTokenIcon(asset.code.toLowerCase())"
        alt=""
        @error="showIconPlaceholder = true"
      />
    </div>
    <div class="asset-item__info">
      <div class="asset-item__line">
        <span class="asset-item__title">
          {{ asset.name }}
        </span>
        <span class="asset-item__balance">
          <span
            v-pretty-number="{
              value: asset.tokenBalance.mainBalance,
              currency: asset.code,
            }"
            class="asset-item__amount"
          />
          <span class="asset-item__currency">
            {{ asset.code }}
          </span>
        </span>
      </div>

      <div class="asset-item__line">
        <span class="asset-item__description">
          {{ asset.config.standard.toUpperCase() }}
        </span>
        <div class="asset-item__balance asset-item__balance--usd">
          <span class="asset-item__currency">$</span>
          <span
            v-pretty-number="{ value: asset.balanceUSD }"
            class="asset-item__amount"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { tokenIconPlaceholder, getTokenIcon } from '@/helpers';

export default {
  name: 'AddressItem',
  props: {
    asset: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const showIconPlaceholder = ref(false);

    const iconPlaceholder = computed(() =>
      tokenIconPlaceholder(props.asset.code)
    );

    return {
      getTokenIcon,
      showIconPlaceholder,
      iconPlaceholder,
    };
  },
};
</script>

<style lang="scss" scoped>
.asset-item {
  width: 100%;
  display: flex;
  align-items: center;
  height: 72px;
  border-bottom: 1px solid $too-ligth-blue;
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    .asset-item {
      &__icon {
        background: $dark-blue;
      }

      &__title {
        color: $black;
      }

      &__description {
        color: $dark-blue;
      }

      &__amount {
        color: $dark-blue;
      }

      &__balance--usd {
        .asset-item__amount {
          color: $ligth-blue;
        }
      }
    }
  }

  &__icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: $round;
    background: $darkgray;
    margin-right: 8px;

    & img {
      filter: brightness(0) invert(1);
      max-width: 22px;
      max-height: 22px;
    }
  }

  &__placeholder {
    position: relative;
    width: 100%;
    height: 100%;

    & span {
      font-size: 14px;
      line-height: 17px;
      color: $white;
      font-family: 'Panton_Bold';
      position: absolute;
      top: 8px;
      left: 9px;

      &:last-child {
        top: 14px;
        left: 23px;
      }
    }
  }

  &__info {
    width: calc(100% - 48px);
  }

  &__line {
    display: flex;
    justify-content: space-between;
    align-content: center;
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__title {
    font-size: 16px;
    line-height: 19px;
    color: $mid-blue;
    font-family: 'Panton_Bold';
  }

  &__balance {
    display: inline;
    font-size: 16px;

    &--usd {
      font-size: 12px;

      .asset-item {
        &__amount {
          color: $darkgray;
        }

        &__currency {
        }
      }
    }
  }

  &__amount {
    font-family: 'Panton_Bold' !important;
    line-height: 19px;
    color: $mid-blue;
  }

  &__currency {
    font-family: 'Panton_Regular';
    line-height: 16px;
    color: $mid-gray;
  }

  &__description {
    font-size: 12px;
    line-height: 14px;
    color: $mid-gray;
    font-family: 'Panton_Regular';
  }
}
</style>
