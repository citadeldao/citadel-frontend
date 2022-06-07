<template>
  <div
    v-if="isLoading"
    class="xct-calculator xct-calculator--loading"
  >
    <Loading />
  </div>
  <div
    v-else
    class="xct-calculator"
  >
    <div
      class="xct-calculator__toggle-info-icon"
      @click="showModal = true"
    >
      <toogleInfo />
    </div>
    <div class="xct-calculator__header">
      <div class="xct-calculator__header-header">
        <span class="xct-calculator__header-header-title">
          {{ $t("calculator.title", { coin: currentToken.code }) }}
        </span>
        <span class="xct-calculator__header-header-subtitle">
          {{ $t("calculator.subtitle") }}
        </span>
      </div>
      <div class="xct-calculator__header-yield">
        <span class="xct-calculator__header-yield-title">
          {{ $t("calculator.yearlyReturn") }}
        </span>
        <div class="xct-calculator__header-yield-procent">
          <span
            v-pretty-number="info.yieldPct"
            class="xct-calculator__header-yield-value"
          />
          <span class="xct-calculator__header-yield-currency"> % </span>
        </div>
      </div>
    </div>
    <div class="xct-calculator__slider">
      <el-slider
        v-model="value"
        :min="0"
        :max="max"
        :show-tooltip="false"
        @change="sliderChangeHandler"
      />
    </div>
    <div class="xct-calculator__footer">
      <div class="xct-calculator__footer-you-have">
        <span class="xct-calculator__footer-you-have-title">
          {{ $t("calculator.howManyYouHave") }}
        </span>
        <div
          v-if="showInput"
          class="xct-calculator__input"
        >
          <input
            ref="valueInput"
            :value="value"
            type="number"
            @input="inputHandler"
            @blur="showInput = false"
            @keyup.enter="showInput = false"
          >
          <span>{{ currentToken.code }}</span>
        </div>
        <div
          v-else
          class="xct-calculator__footer-you-have-amount"
          @click="toggleShowInput"
        >
          <span
            v-pretty-number="{ value, currency: currentToken.code }"
            class="xct-calculator__footer-you-have-value"
          />
          <span class="xct-calculator__footer-you-have-currency">
            {{ currentToken.code }}
          </span>
        </div>
      </div>
      <div class="xct-calculator__footer-yearly-reward">
        <span class="xct-calculator__footer-yearly-reward-title">
          {{ $t("calculator.yearlyReward") }}
        </span>
        <div class="xct-calculator__footer-yearly-reward-amount">
          <span
            v-pretty-number="{
              value: yearlyReward,
              currency: currentToken.code,
            }"
            class="xct-calculator__footer-yearly-reward-value"
          />
          <span class="xct-calculator__footer-yearly-reward-currency">
            {{ currentToken.code }}
          </span>
        </div>
      </div>
    </div>
  </div>
  <teleport
    v-if="showModal"
    to="body"
  >
    <Modal>
      <XCTCalculatorExpand
        v-click-away="modalCloseHandler"
        :current-token="currentToken"
        @close="modalCloseHandler"
      />
    </Modal>
  </teleport>
</template>

<script>
import Modal from '@/components/Modal';
import XCTCalculatorExpand from './XCTCalculatorExpand';
import { ref } from '@vue/reactivity';
import toogleInfo from '@/assets/icons/toggle-info.svg';
import Loading from '@/components/Loading';
import { computed, nextTick } from '@vue/runtime-core';
export default {
  name: 'XCTCalculator',
  components: { toogleInfo, Loading, XCTCalculatorExpand, Modal },
  props: {
    info: {
      type: Object,
      default: () => ({}),
    },
    isLoading: {
      type: Boolean,
      deafult: false,
    },
    currentToken: {
      type: [Object, null],
      default: null,
    },
  },
  setup(props) {
    const modalCloseHandler = () => (showModal.value = false);
    const showModal = ref(false);
    const max = ref(100000);
    const value = ref(10000);
    const yearlyReward = computed(
      () => (props.info.yieldPct / 100) * value.value,
    );
    const showInput = ref(false);
    const valueInput = ref(null);
    const toggleShowInput = () => {
      showInput.value = true;
      nextTick(() => valueInput.value.focus());
    };

    const inputHandler = (e) => {
      if (+e.target.value > 100000) {
        max.value = +e.target.value;
      }
      value.value = +e.target.value;
    };

    const sliderChangeHandler = () => {
      max.value = 100000;
    };

    return {
      value,
      yearlyReward,
      showInput,
      toggleShowInput,
      valueInput,
      inputHandler,
      showModal,
      modalCloseHandler,
      max,
      sliderChangeHandler,
    };
  },
};
</script>

<style lang="scss" scoped>
.xct-calculator {
  width: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 16px;
  padding: 25px 27px 25px 24px;
  background-image: url("~@/assets/images/calculatorbg.jpg");
  position: relative;
  display: flex;
  flex-direction: column;
  &--loading {
    justify-content: center;
    align-items: center;
  }
  @include lg {
    padding: 25px 24px 25px 24px;
  }
  @include md {
    height: 208px;
    padding: 17px 16px 18px 16px;
  }
  &::before {
    content: "";
    opacity: 0.15;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: linear-gradient(90deg, #4776e6 0%, #8e54e9 100%);
    position: absolute;
    border-radius: 16px;
  }
  &__toggle-info-icon {
    position: absolute;
    top: 24px;
    right: 27px;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    background: $white;
    border-radius: $round;
    justify-content: center;
    cursor: pointer;
    & svg {
      fill: $darkgray;
    }
    @include lg {
      top: 24px;
      right: 24px;
    }
    @include md {
      top: 17px;
      right: 12px;
    }
    &:hover {
      background: $too-dark-blue;
      color: $white;
      & svg {
        fill: $white;
      }
    }
  }
  &__header {
    display: flex;
    align-items: baseline;
    margin-bottom: 31px;
    @include lg {
      margin-bottom: 19px;
    }
    @include md {
      flex-direction: column;
      margin-bottom: 19px;
    }
  }
  &__header-header {
    display: flex;
    flex-direction: column;
    margin-right: 45px;
    @include lg {
      margin-right: 20px;
    }
    @include md {
      margin-right: 0;
      margin-bottom: 15px;
    }
  }
  &__header-header-title {
    font-size: 18px;
    line-height: 22px;
    font-family: "Panton_Bold";
    margin-bottom: 4px;
    @include lg {
      width: 127px;
      margin-bottom: 8px;
    }
    @include md {
      font-size: 16px;
      line-height: 19px;
    }
  }
  &__header-header-subtitle {
    font-size: 14px;
    line-height: 17px;
    color: $too-dark-blue;

    @include md {
      font-size: 12px;
      line-height: 14px;
    }
  }
  &__header-yield {
    display: flex;
    flex-direction: column;
    align-items: center;

    @include lg {
      margin-right: 10px;
    }
    @include md {
      width: 100%;
      flex-direction: row;
      justify-content: space-between;
      margin-right: 10px;
    }
  }
  &__header-yield-title {
    font-size: 14px;
    line-height: 17px;
    margin-bottom: 8px;
    @include md {
      font-size: 12px;
      line-height: 14px;
      margin-bottom: 0;
    }
  }
  &__header-yield-procent {
    display: flex;
    align-items: baseline;
  }
  &__header-yield-value {
    font-size: 24px;
    line-height: 29px;
    color: $slategray;
    font-family: "Panton_Bold" !important;
    @include md {
      font-size: 16px;
      line-height: 19px;
    }
  }
  &__header-yield-currency {
    font-size: 16px;
    line-height: 19px;
    @include md {
      font-size: 12px;
      line-height: 14px;
    }
  }
  &__slider {
    margin-bottom: 33px;
    @include md {
      margin-bottom: 22px;
    }
  }
  &__footer {
    display: flex;
    justify-content: space-between;
  }
  &__footer-you-have,
  &__footer-yearly-reward {
    display: flex;
    flex-direction: column;
  }
  &__footer-you-have {
    align-items: flex-start;
    z-index: 1;

    @include lg {
      width: 95px;
    }

    @include md {
      width: 95px;
    }
  }
  &__footer-yearly-reward {
    align-items: flex-end;

    @include lg {
      width: 120px;
    }

    @include md {
      width: 120px;
    }
  }
  &__footer-you-have-title,
  &__footer-yearly-reward-title {
    font-size: 14px;
    line-height: 17px;
    @include md {
      font-size: 12px;
      line-height: 14px;
    }
  }
  &__footer-you-have-title {
    @include md {
      text-align: left;
    }
  }
  &__footer-yearly-reward-title {
    text-align: right;

    @include md {
      text-align: right;
    }
  }
  &__footer-you-have-amount,
  &__footer-yearly-reward-amount {
    display: flex;
    align-items: baseline;
    margin-top: 8px;
    @include md {
      font-size: 12px;
      line-height: 14px;
      margin-top: 12px;
    }
  }
  &__footer-you-have-value,
  &__footer-yearly-reward-value {
    font-size: 24px;
    line-height: 29px;
    color: $blue;
    font-family: "Panton_Bold" !important;
    margin-right: 3px;
    @include md {
      font-size: 16px;
      line-height: 17px;
    }
  }
  &__footer-you-have-currency,
  &__footer-yearly-reward-currency {
    font-size: 16px;
    line-height: 19px;
    @include md {
      font-size: 12px;
      line-height: 17px;
    }
  }
  &__footer-yearly-reward-value {
    color: $dark-blue;
  }
  &__input {
    position: relative;
    width: 146px;
    height: 33px;
    margin-top: 7px;
    @include md {
      width: 97px;
      margin-top: 4px;
    }
    & span {
      position: absolute;
      font-size: 16px;
      line-height: 19px;
      color: $slategray;
      top: 7px;
      right: 9px;
      @include lg {
        font-size: 14px;
      }
      @include md {
        font-size: 14px;
      }
    }
    & input {
      width: 100%;
      height: 100%;
      border: 1px solid $too-ligth-blue;
      border-radius: 4px;
      padding: 7px 39px 7px 9px;
      font-size: 16px;
      line-height: 19px;
      font-family: "Panton_SemiBold";
      text-indent: 2px;
      background: transparent;
      @include lg {
        font-size: 14px;
        padding: 4px 35px 4px 5px;
      }
      @include md {
        font-size: 14px;
      }
      &[type="number"]::-webkit-outer-spin-button,
      &[type="number"]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      &[type="number"] {
        -moz-appearance: textfield;
      }
      &:focus {
        border: 1px solid $blue;
      }
    }
  }
}
</style>