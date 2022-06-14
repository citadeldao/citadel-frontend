<template>
  <div class="calculator-list-item">
    <keep-alive>
      <component
        :is="currentIcon"
        class="calculator-list-item__icon"
      />
    </keep-alive>
    <div class="calculator-list-item__main">
      <span class="calculator-list-item__main-title">
        {{ data.name }}
      </span>
      <div
        v-if="data.net !== OUR_TOKEN"
        class="calculator-list-item__slider"
      >
        <el-slider
          v-model="value"
          :min="0"
          :max="+data.totalTokens"
          :show-tooltip="false"
          :step="0.0001"
        />
      </div>
      <div class="calculator-list-item__info-line">
        <div class="calculator-list-item__info-line-block">
          <span
            class="calculator-list-item__info-line-block-title"
            v-html="$t('rewardDetails.stakedOnCitadel')"
          />
          <div
            v-if="showInput"
            class="calculator-list-item__input"
          >
            <input
              ref="valueInput"
              :value="value"
              type="number"
              @input="inputHandler"
              @blur="showInput=false"
            >
          </div>
          <div
            v-else
            class="calculator-list-item__info-line-block-amount"
            @click.stop="toggleShowInput"
          >
            <span
              v-pretty-number="{ value: value, currency: data.code }"
              class="calculator-list-item__info-line-block-value"
            />
            <span class="calculator-list-item__info-line-block-title-currency">
              {{ data.code }}
            </span>
          </div>
        </div>
        <div class="calculator-list-item__info-line-block calculator-list-item__info-line-block--total-staked">
          <span class="calculator-list-item__info-line-block-title">
            {{ $t('rewardDetails.totalStaked') }}
          </span>
          <div class="calculator-list-item__info-line-block-amount">
            <span
              v-pretty-number="{ value: +data.totalTokens, currency: data.code }"
              class="calculator-list-item__info-line-block-value calculator-list-item__info-line-block-value--total"
            />
            <span class="calculator-list-item__info-line-block-title-currency">
              {{ data.code }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="calculator-list-item__vertical-lne" />
    <div class="calculator-list-item__right-section">
      <hotSale class="calculator-list-item__right-section-icon" />
      <div class="calculator-list-item__right-section-info">
        <span class="calculator-list-item__right-section-info-title">
          {{ $t('rewards') }}
        </span>
        <div class="calculator-list-item__right-section-info-amount">
          <span
            v-pretty-number="{ value: reward, currency: 'XCT' }"
            class="calculator-list-item__right-section-info-value calculator-list-item__right-section-info-value--rewards"
          />
          <span class="calculator-list-item__right-section-info-currency">
            XCT
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import hotSale from '@/assets/icons/hot-sale.svg';
import { computed, markRaw, ref } from '@vue/reactivity';
import BigNumber from 'bignumber.js';
import { nextTick } from '@vue/runtime-core';
import { OUR_TOKEN } from '@/config/walletType';

export default {
  name: 'CalculatorListItem',
  components: { hotSale },
  props: {
    data: {
      type: Object,
      default: () => {
      },
    },
    currentTab: {
      type: Number,
      default: 0,
    },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const showInput = ref(false);
    const currentIcon = ref();
    import(`@/assets/icons/networks/${props.data.icon}.svg`).then((val) => {
      currentIcon.value = markRaw(val.default);
    });
    const value = ref(+props.data.activeTokens);
    const reward = computed(() => {
      const tokenRewardPerYear = props.data.net === OUR_TOKEN ? BigNumber(props.data.rewardsPerToken)
        .multipliedBy(value.value)
        .toNumber()
        : BigNumber(props.data.rewardsPerToken)
          .multipliedBy(value.value)
          .toNumber();
      let result;

      switch (props.currentTab) {
        case 7:
          result = BigNumber(tokenRewardPerYear).dividedBy(365).multipliedBy(7).toNumber();
          break;
        case 30:
          result = BigNumber(tokenRewardPerYear).dividedBy(12).toNumber();
          break;
        case 182:
          result = BigNumber(tokenRewardPerYear).dividedBy(2).toNumber();
          break;
        case 365:
          result = tokenRewardPerYear;
          break;
        default:
          result = tokenRewardPerYear;
      }

      emit('change', { value: result, net: props.data.net });

      return result;
    });
    const inputHandler = (e) => {
      if (+e.target.value > +props.data.totalTokens) {
        value.value = +props.data.totalTokens;
      } else {
        value.value = +e.target.value;
      }
    };
    const valueInput = ref(null);
    const toggleShowInput = () => {
      showInput.value = true;
      nextTick(() => valueInput.value.focus());
    };

    return {
      currentIcon,
      value,
      reward,
      showInput,
      inputHandler,
      toggleShowInput,
      valueInput,
      OUR_TOKEN,
    };
  },
};
</script>

<style lang="scss" scoped>
.calculator-list-item {
  display: flex;
  height: 150px;
  background: $too-ligth-gray;
  border-radius: 8px;
  position: relative;
  padding: 18px 27px 0 26px;

  &:not(:last-child) {
    margin-bottom: 8px;
  }

  @include md {
    height: 116px;
    padding: 13px 7px 0 16px;
  }

  &__icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 66px;
    height: 68px;
    fill: $too-ligth-blue;
    opacity: 0.2;
  }

  &__main {
    width: 509px;
    display: flex;
    flex-direction: column;
    position: relative;
    @include md {
      width: 349px;
    }
  }

  &__main-title {
    font-size: 20px;
    line-height: 30px;
    font-family: "Panton_Bold";
    margin-bottom: 30px;
    @include md {
      margin-bottom: 24px;
      font-size: 16px;
      line-height: 19px;
    }
  }

  &__slider {
    width: 509px;
    position: absolute;
    top: 40px;
    @include md {
      width: 349px;
      top: 27px;
    }
  }

  &__info-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__info-line-block {
    display: flex;
    flex-direction: column;

    &--total-staked {
      align-items: flex-end;
    }
  }

  &__info-line-block-title,
  &__right-section-info-title {
    font-size: 14px;
    line-height: 17px;
    color: $mid-blue;
    margin-bottom: 5px;
    @include md {
      margin-bottom: 3px;
    }
  }

  &__info-line-block-amount,
  &__right-section-info-amount {
    display: flex;
    align-items: baseline;
  }

  &__info-line-block-title-currency,
  &__right-section-info-currency {
    font-size: 16px;
    line-height: 19px;
    color: $mid-blue;
  }

  &__info-line-block-value,
  &__right-section-info-value {
    font-size: 20px;
    line-height: 24px;
    font-family: "Panton_Bold" !important;
    color: $dark-blue;
    margin-right: 3px;

    &--total {
      color: $too-dark-blue;
    }

    &--rewards {
      color: $ligth-blue;
    }
  }

  &__vertical-lne {
    height: 98px;
    margin: 6px 0 0 18px;
    border-right: 1px dashed $too-ligth-blue;
    @include md {
      height: 78px;
      margin: 6px 0 0 24px;
    }
  }

  &__right-section {
    display: flex;
    padding-bottom: 22px;
    align-items: flex-end;
    position: relative;
    flex: 1;
    @include md {
      padding-bottom: 33px;
    }
  }

  &__right-section-icon {
    fill: #0F69B2;
    margin-left: 64px;
    opacity: 0.07;
    width: 79px;
    height: 99px;
    @include md {
      margin-left: 71px;
      width: 51px;
      height: 64px;
    }
  }

  &__right-section-info {
    position: absolute;
    right: -5px;
    bottom: 25px;
    display: flex;
    flex-direction: column;
    @include md {
      right: 6px;
      bottom: 17px;
    }
  }

  &__right-section-info-title {
    font-family: "Panton_Bold";
    margin-bottom: 8px;
    text-align: right;
    @include md {
      margin-bottom: 3px;
    }
  }

  &__input {
    width: 80px;
    height: 33px;

    & input {
      width: 100%;
      height: 100%;
      border-radius: 6px;
      font-size: 16px;
      line-height: 19px;
      color: $mid-blue;
      text-indent: 2px;
      background: $white;
      border: none;

      &[type="number"]::-webkit-outer-spin-button,
      &[type="number"]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      &[type="number"] {
        -moz-appearance: textfield;
      }
    }
  }
}
</style>
