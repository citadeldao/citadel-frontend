<template>
  <div class="large-stake-list-item">
    <div class="large-stake-list-item__upper">
      <div class="large-stake-list-item__left">
        <div
          class="large-stake-list-item__icon-wrapper"
        >
          <div class="large-stake-list-item__icon">
            <keep-alive :style="{ fill: '#FF5722' }">
              <component :is="currentIcon" />
            </keep-alive>
          </div>
          <div class="large-stake-list-item__ring">
            <div
              class="large-stake-list-item__ring-left"
              :style="{ borderColor: '#FF5722' }"
            />
            <div
              class="large-stake-list-item__ring-right"
              :style="{ borderColor: '#FF5722' }"
            />
          </div>
        </div>
        <div class="large-stake-list-item__title">
          {{ title }}
        </div>
      </div>
      <div class="large-stake-list-item__right">
        <div class="large-stake-list-item__amount">
          <span
            v-pretty-number="amount"
            class="large-stake-list-item__amount-value"
          />
          {{ currentWallet.code }}
        </div>
        <div class="large-stake-list-item__stake-share">
          <div class="large-stake-list-item__stake-share-text">
            {{ $t('stakeShare') }}
          </div>
          &nbsp;
          &nbsp;
          <div
            v-pretty-number="stakeShare"
            class="large-stake-list-item__stake-share-value"
          />
          &nbsp;
          <div class="large-stake-list-item__stake-share-percent">
            %
          </div>
        </div>
      </div>
    </div>
    <div class="large-stake-list-item__divider" />
    <div class="large-stake-list-item__lower">
      <div
        v-for="(item, index) in validators"
        :key="index"
        class="lower-item"
      >
        <div class="lower-item__title">
          {{ item.name }} {{ item.address }}
        </div>
        <div class="lower-item__info">
          {{ $t('fee') }}: <span class="lower-item__red">{{ item.fee }}</span>
          <span class="lower-item__black">%</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { markRaw, ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import BigNumber from 'bignumber.js';

export default {
  name: 'LargeStaleListItem',
  props: {
    validators: {
      type: Array,
      default: () => ([]),
    },
    icon: {
      type: String,
      default: '',
    },
    currentWallet: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const { t } = useI18n();
    const currentIcon = ref();
    props.icon &&
    import(`@/assets/icons/token/${props.icon}.svg`).then((val) => {
      currentIcon.value = markRaw(val.default);
    });

    const title = computed(() => {
      return t('stakingAmount');
    });
    const amount = computed(() => {

      return props.currentWallet?.balance?.stake;
    });

    const stakeShare = computed(() => {
      const sum = BigNumber(props.currentWallet.balance.mainBalance)
        .plus(props.currentWallet.balance.frozenBalance)
        .plus(props.currentWallet.balance.delegatedBalance).toNumber();

      return BigNumber(props.currentWallet.balance.stake).dividedBy(sum).multipliedBy(100).toNumber();
    });

    return {
      currentIcon,
      title,
      computed,
      amount,
      stakeShare,
    };
  },
};
</script>
<style lang="scss" scoped>
.large-stake-list-item {
  width: 100%;
  flex-basis: 100%;
  border: 1px solid $too-ligth-blue;
  border-radius: 8px;
  padding: 9px 17px;

  &__upper {
    display: flex;
    justify-content: space-between;
  }
  &__left {
    display: flex;
    align-items: center;
  }
  &__right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  &__amount {
    font-weight: 600;
    font-size: 17px;
  }
  &__amount-value {
    color: $dark-blue;
    font-size: 17px;
    font-weight: bold;
  }
  &__stake-share {
    display: flex;
    font-size: 12px;
    margin-top: 11px;
  }
  &__stake-share-text {
    color: $mid-gray;
  }
  &__stake-share-value {
    color: $ligth-blue;
    font-weight: bold;
  }
  &__stake-share-percent {
    color: $black;
    font-weight: 300;
  }
  &__title {
    font-size: 17px;
    line-height: 20px;
    font-family: "Panton_Bold";
    margin-bottom: 7px;
    max-width: 268px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    @include md {
      max-width: 200px;
      font-size: 14px;
    }
  }
  &__icon-wrapper {
    font-size: 48px;
    height: 48px;
    width: 48px;
    float: left;
    position: relative;
    margin-right: 3px;

    @include md {
      width: 36px;
      height: 36px;
      margin-right: 5px;
    }
  }
  &__icon {
    border-radius: 50%;
    top: 7px;
    right: 7px;
    width: 34px;
    height: 34px;
    cursor: default;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $white;
    z-index: 1;
    box-shadow: 0 15px 50px rgba(80, 100, 124, 0.1),
      0 10px 15px rgba(80, 100, 124, 0.16);

    @include md {
      top: 4px;
      right: 4px;
      width: 28px;
      height: 28px;
    }

    & svg {
      max-width: 21px;
      max-height: 21px;
      fill: #3498db;
    }
  }
  &__ring {
    width: 48px;
    height: 48px;
    clip: rect(auto, auto, auto, auto);
    left: 0;
    position: absolute;
    top: 0;

    @include md {
      width: 36px;
      height: 36px;
    }
  }
  &__ring-left,
  &__ring-right {
    transform: rotate(326deg);
    border: 8px solid #3498db;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    clip: rect(0, 0.5em, 1em, 0);
    left: 0;
    position: absolute;
    top: 0;

    @include md {
      width: 36px;
      height: 36px;
    }
  }
  &__ring-right {
    transform: rotate(371deg);
  }

  &__divider {
    height: 1px;
    border-top: 1px dashed $mid-gray;
    margin: 17px 0 8px;
  }

  &__lower {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    border-radius: 8px;
    gap: 20px;
  }
  .lower-item {
     display: flex;
    flex-direction: column;
    background: $ultralightblue;
    border-left: 3px solid $blue;
    padding: 7px 10px;
    margin-bottom: 8px;
    width: 30%;
    overflow: hidden;
    &:last-child {
      margin-bottom: 0px;
    }
    // height: 50px;

    &__title {
      font-size: 14px;
      font-weight: 400;
      color: $blue;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    &__info {
      font-weight: 400;
      font-size: 12px;
      color: $mid-gray;
      margin-top: 4px;
    }
    &__red {
      font-weight: 700;
      color: $red;
    }
    &__black{
      color: $black;
    }
  }
}
</style>
