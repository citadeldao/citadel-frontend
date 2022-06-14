<template>
  <div
    class="input"
    :class="{
      empty: type ==='empty',
      error,
      'input--type--currency': isTypeCurrency,
    }"
  >
    <label :for="id">
      {{ label }}
      <info
        v-if="labelInfo"
        class="input__label-info"
      />
    </label>
    <input
      :id="id"
      ref="inputRef"
      v-model="valueRef"
      :type="inputType"
      :placeholder="dynamicPlaceholder"
      :autocomplete="autocomplete ? 'on' : 'off'"
      :disabled="disabled"
      spellcheck="false"
      :style="{ background }"
      :readonly="hardAutocompleteOff"
      onfocus="this.removeAttribute('readonly')"
      :data-qa="dataQa"
      @input="inputHandler"
      @focus="onFocusHandler"
      @blur="onBlurHandler"
    >
    <span
      v-if="type === 'number' && text"
      class="input__text"
    >{{ text }}</span>
    <div
      v-if="error && showErrorText"
      class="input__error"
    >
      <error class="input__error-icon" />
      <span class="input__error-text">{{ error }}</span>
    </div>
    <keep-alive v-if="icon">
      <component
        :is="currentIcon"
        class="input__icon"
        :class="{ 'input__icon--disabled': disabled }"
        @click="$emit('iconClick')"
      />
    </keep-alive>
    <div
      v-if="type === 'password'"
      :data-qa="dataQa && `${dataQa}__visible-button`"
      @click="hide = !hide"
    >
      <transition name="fade">
        <hide
          v-if="hide"
          class="input__visibility-icon"
        />
        <vision
          v-else
          class="input__visibility-icon"
        />
      </transition>
    </div>

    <transition name="fade">
      <div
        v-if="clearable && valueRef"
        class="input__clear-icon"
        @click="clearInput"
      >
        <closeIcon />
      </div>
    </transition>

    <div
      v-if="withCopy && valueRef"
      class="input__copy"
    >
      <copy
        :data-qa="dataQa && `${dataQa}__copy-button`"
        @click="copyValue"
      />
      <transition name="fade1">
        <span
          v-if="isCopied"
          class="input__tooltip"
        >
          {{ $t('copiedToClipboard') }}
        </span>
      </transition>
    </div>

    <div
      v-if="showSetMax"
      class="input__max"
      :data-qa="dataQa && `${dataQa}__max-button`"
      @click="setMax"
    >
      {{ $t('max') }}
    </div>

    <span
      v-if="currency"
      class="input__currency"
      :style="{ left: `${currencyOffset}px` }"
    >
      {{ currency }}
    </span>

    <!-- for get value width in px -->
    <span
      ref="currencyTextRef"
      class="input__hidden-value"
    >{{ valueRef || dynamicPlaceholder }}</span>
  </div>
</template>

<script>
import closeIcon from '@/assets/icons/close-icon.svg';
import copy from '@/assets/icons/copy.svg';
import info from '@/assets/icons/input/info.svg';
import vision from '@/assets/icons/input/vision.svg';
import hide from '@/assets/icons/input/hide.svg';
import mail from '@/assets/icons/input/mail.svg';
import error from '@/assets/icons/input/error.svg';
import { computed, ref, markRaw, watch, nextTick, onMounted } from 'vue';
import copyToClipboard from '@/helpers/copyToClipboard';

export default {
  name: 'Input',
  components: { vision, hide, copy, info, mail, error, closeIcon },
  props: {
    autofocus: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'text',
    },
    id: {
      type: String,
      required: true,
    },
    modelValue: {
      type: [String, Number],
      default: '',
    },
    value: {
      type: [String, Number],
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    labelInfo: {
      type: Boolean,
    },
    placeholder: {
      type: String,
      default: '',
    },
    autocomplete: {
      type: Boolean,
      default: false,
    },
    hardAutocompleteOff: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
    },
    max: {
      type: [Number, String],
      default: Infinity,
    },
    min: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: '',
    },
    showSetMax: {
      type: Boolean,
      default: false,
    },
    showErrorText: {
      type: Boolean,
      default: true,
    },
    error: {
      type: [String, Boolean],
      default: '',
    },
    icon: {
      type: [String],
    },
    withCopy: {
      type: Boolean,
    },
    text: {
      type: String,
      default: '',
    },
    background: {
      type: String,
      default: '',
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    dataQa: {
      type: [String, null],
      default: null,
    },
  },
  emits: ['update:modelValue', 'focus', 'blur', 'input', 'clear', 'iconClick'],
  setup(props, { emit }) {
    const valueRef = ref('');
    const currentIcon = ref();
    const focusFlag = ref(false);
    const hide = ref(false);
    const isCopied = ref(false);
    const isTypeCurrency = computed(() => props.type === 'currency');
    const currencyOffset = ref(0);

    // DOM
    const currencyTextRef = ref(null);
    const inputRef = ref(null);
    const textWidth = ref(0);
    const inputPaddingLeft = ref(0);
    const inputWidth = ref(0);

    if (props.icon) {
      import(`@/assets/icons/input/${props.icon}.svg`).then((val) => {
        currentIcon.value = markRaw(val.default);
      });
    }

    const inputType = computed(() => {
      if (props.type === 'password') {
        return hide.value ? 'text' : 'password';
      } else if (props.type === 'currency') {
        return 'text';
      }

      return props.type;
    });

    // when focus, placeholder = ''
    const dynamicPlaceholder = computed(() =>
      focusFlag.value ? '' : props.placeholder,
    );

    const placeholderShown = computed(() => {
      return !focusFlag.value &&
        !!dynamicPlaceholder.value &&
        !valueRef.value;
    });

    watch(valueRef, (val) => {
      valueRef.value = prepareRealValue(val);

      emit('update:modelValue', prepareModelValue(valueRef.value));
      setCurrencyOffset();
    });

    // update value from modelValue changed outside
    watch(() => props.modelValue, (val) => {
      valueRef.value = prepareRealValue(val);
    });

    // update value from :value prop
    watch(() => props.value, (val) => {
      valueRef.value = prepareRealValue(val);
    });

    watch(placeholderShown, () => {
      setCurrencyOffset();
    });

    const prepareRealValue = (value) => {
      if (isTypeCurrency.value) {
        return value
          .toString()
          // remove spaces
          .replace(/\s+/g, '')
          .replace(/[БбЮю]/, '.')
          .replace(',', '.')
          // only number
          .replace(/[^.\d]+/g, '')
          // remove extra 0 before decimal
          .replace(/^0+/, '0')
          // remove extra dots
          // eslint-disable-next-line no-useless-escape
          .replace(/^([^\.]*\.)|\./g, '$1');
      }

      return value;
    };

    const prepareModelValue = (value) => {
      if (isTypeCurrency.value) {
        return value.replace(/\.$/gm, '');
      }

      return value;
    };

    const setCurrencyOffset = () => {
      nextTick(() => {
        textWidth.value = currencyTextRef.value.clientWidth;
        currencyOffset.value = inputPaddingLeft.value +
          (textWidth.value >= inputWidth.value ? inputWidth.value : textWidth.value);
      });
    };

    onMounted(() => {
      valueRef.value = prepareRealValue(props.value || props.modelValue);

      const inputComputedStyles = window.getComputedStyle(inputRef.value);

      inputPaddingLeft.value = parseInt(inputComputedStyles.paddingLeft);
      inputWidth.value = inputRef.value.clientWidth -
        inputPaddingLeft.value -
        parseInt(inputComputedStyles.paddingRight);

      setCurrencyOffset();

      if (props.autofocus) {
        inputRef.value.focus();
      }
    });

    const inputHandler = () => {
      emit('input', prepareModelValue(valueRef.value));
    };

    const onFocusHandler = (e) => {
      focusFlag.value = true;
      emit('focus', e);
    };

    const onBlurHandler = (e) => {
      focusFlag.value = false;
      emit('blur', e);
    };

    const copyValue = () => {
      copyToClipboard(props.modelValue);
      isCopied.value = true;

      setTimeout(() => {
        isCopied.value = false;
      }, 1500);
    };

    const clearInput = () => {
      valueRef.value = '';
      emit('input', prepareModelValue(valueRef.value));
      emit('clear', prepareModelValue(valueRef.value));
    };

    const setMax = () => {
      valueRef.value = props.max.toString();
      emit('input', prepareModelValue(valueRef.value));

      nextTick(() => {
        inputRef.value.focus();
      });
    };

    return {
      currencyTextRef,
      inputRef,
      valueRef,
      hide,
      isCopied,
      currentIcon,
      dynamicPlaceholder,
      placeholderShown,
      focusFlag,
      inputType,
      isTypeCurrency,
      currencyOffset,
      inputPaddingLeft,
      textWidth,
      inputWidth,
      inputHandler,
      onFocusHandler,
      onBlurHandler,
      setMax,
      copyValue,
      clearInput,
    };
  },
};
</script>

<style lang="scss" scoped>
.input {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  // & svg {
  //   position: absolute;
  // }
  & label {
    font-size: 14px;
    line-height: 17px;
    color: $mid-gray;
    position: absolute;
    top: 12px;
    left: 15px;
    z-index: 1;
    font-family: "Panton_SemiBold";
  }

  &__label-info {
    position: absolute;
    margin-left: 9px;

    &:hover {
      fill: $too-dark-blue;
    }
  }

  & input {
    @include input;
    text-indent: 2px;

    &.input__currency {
      padding-right: 15px;
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

    &:disabled {
      background: $too-ligth-gray;
      color: $mid-blue;
    }
  }

  &--type {
    &--currency {
      & input {
        padding-right: 90px; // 50px + currency (4 chars)
      }
    }
  }

  &__icon {
    max-width: 14px;
    max-height: 16px;
    left: 17px;
    bottom: 20px;
    position: absolute;

    &--disabled {
      fill: $mid-blue !important;
    }
  }

  &__visibility-icon,
  &__clear-icon,
  &__copy {
    right: 17px;
    bottom: 14px;
    width: 20px;
    height: 20px;
    cursor: pointer;
    position: absolute;

    &:hover {
      fill: $blue;
    }
  }

  &__clear-icon {
    width: 16px;
    height: 16px;
    bottom: 17px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: $round;
    background: $mid-blue;

    &:hover {
      background: $red;
    }

    & svg {
      position: absolute;
      bottom: 3px !important;
      width: 9px;
      height: 9px;
      fill: $white;
    }
  }

  &__copy {
    width: 14px;
    height: 15px;
  }

  &__text {
    position: absolute;
    right: 17px;
    bottom: 14px;
    font-size: 14px;
    line-height: 30px;
    font-family: "Panton_Bold";
    text-transform: uppercase;
  }

  &__error {
    display: flex;
    align-items: center;
    position: absolute;
    left: 0;
    bottom: -32px;
    font-size: 14px;
    font-weight: 600;
    line-height: 30px;
    color: $red;

    & svg {
      position: relative;
      margin-right: 8px;
    }
  }

  &__tooltip {
    background-color: $too-ligth-gray;
    text-align: center;
    border-radius: 6px;
    padding: 8px 9px;
    position: absolute;
    white-space: nowrap;
    z-index: 1;
    top: 100%;
    left: 50%;
    transform: translate(-50%, 7px);
    box-shadow: 0 4px 25px rgba(63, 54, 137, 0.25);
    font-size: 12px;
    line-height: 16px;
    color: $too-dark-blue;

    &::after {
      content: "";
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

  &__max {
    right: 16px;
    bottom: 9px;
    position: absolute;
    cursor: pointer;
    font-size: 14px;
    line-height: 30px;
    font-family: "Panton_Bold";
  }

  &__currency {
    position: absolute;
    bottom: 16px;
    padding-left: 5px;
    font-family: "Panton_SemiBold";
    font-size: 14px;
    line-height: 17px;
    color: $dark-blue;
    transition: left 0.1ms;
  }

  &__hidden-value {
    position: absolute;
    opacity: 0;
    z-index: -100;
    font-size: 14px;
    font-family: "Panton_SemiBold";
    text-indent: 2px;
  }
}

.error {
  & input {
    border: 1px solid $red !important;

    &:focus {
      border: 1px solid $blue;
    }
  }
}
.empty{
   & input {
    border-radius: 0;
    border: none;
    padding: 2px 20px 8px 31px;
    border-bottom: 1px solid $too-ligth-blue;

    &:focus {
      border-radius: 0;
      border: none;
      border-bottom: 1px solid $blue;
    }
  }
  .input__icon{
    left: 0;
    bottom: 6px;
    max-width: 20px;
    max-height: 20px;
    fill: $too-dark-blue;
    @include md{
      max-width: 16px;
      max-height: 16px;
      cursor: pointer;
    }
  }
  .input__clear-icon{
    right: 0;
    bottom: 11px;
  }
}

// .input input:focus + .input__error {
//   display: none;
// }
</style>
