<template>
  <div v-click-away="onClickAway" class="autocomplete" :class="{ error }">
    <label :for="id">{{ label }}</label>
    <transition name="fade">
      <keep-alive>
        <component :is="currentIcon" class="autocomplete__icon" />
      </keep-alive>
    </transition>
    <input
      :id="id"
      type="text"
      :value="value"
      :placeholder="placeholder"
      autocomplete="off"
      spellcheck="false"
      :data-qa="dataQa"
      @keydown.delete="deletePressHandler"
      @input="onChange"
      @focus="focusHandler"
      @blur="blurHandler"
    />
    <div v-if="error && showErrorText" class="autocomplete__error">
      <error class="autocomplete__error-icon" />
      <span class="autocomplete__error-text">{{ error }}</span>
    </div>
    <transition name="fade">
      <ul v-show="isOpen && results.length > 0" class="autocomplete__results">
        <AutocompleteItem
          v-for="result in results"
          :key="result.id"
          :split-value="splitValue"
          :result="result"
          @setResult="setResult"
          @updateCurrentIcon="updateCurrentIcon"
        />
      </ul>
    </transition>
  </div>
</template>

<script>
import AutocompleteItem from './components/AutocompleteItem';
import { ref, markRaw, watch, computed } from 'vue';
import useCurrentIcon from '@/compositions/useCurrentIcon';
import error from '@/assets/icons/networks/error.svg';

export default {
  name: 'Autocomplete',
  components: { AutocompleteItem, error },
  props: {
    value: {
      type: String,
    },
    items: {
      type: Array,
    },
    id: {
      type: String,
    },
    label: {
      type: String,
    },
    placeholder: {
      type: String,
      default: '',
    },
    initialIcon: {
      type: String,
    },
    error: {
      type: [String, Boolean],
    },
    showErrorText: {
      type: Boolean,
      default: true,
    },
    dataQa: {
      type: [String, null],
      default: null,
    },
    splitValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const currentIcon = ref();
    const { inputIcon, updateCurrentIcon } = useCurrentIcon(props.initialIcon);

    const isOpen = ref(false);

    import(`@/assets/icons/networks/${inputIcon.value}.svg`).then((val) => {
      currentIcon.value = markRaw(val.default);
    });

    const focusHandler = () => {
      if (props.value) {
        isOpen.value = true;
        updateCurrentIcon(inputIcon.value);
      } else {
        isOpen.value = true;
        updateCurrentIcon('loop');
      }
    };

    const blurHandler = () => {
      if (!props.value) {
        updateCurrentIcon(props.initialIcon || 'citadel');
      }
    };
    watch(
      () => inputIcon.value,
      (count) => {
        import(`@/assets/icons/networks/${count}.svg`).then((val) => {
          currentIcon.value = markRaw(val.default);
        });
      }
    );
    watch(
      () => props.value,
      (count) => {
        if (!count) {
          updateCurrentIcon('loop');
        }
      }
    );

    const results = computed(() => {
      if (!props.value) {
        return props.items;
      }

      return props.items.filter((item) =>
        item.title.toLowerCase().includes(props.value.toLowerCase())
      );
    });

    const onChange = (e) => {
      emit('update:value', e.target.value);
      isOpen.value = true;
    };

    const setResult = (result) => {
      emit('update:value', result);
      isOpen.value = false;
    };

    const onClickAway = () => {
      isOpen.value = false;
    };

    const deletePressHandler = () => {
      const hasInResults = results.value.find(
        (res) => res.title === props.value
      );

      if (results.value.length === 1 && hasInResults) {
        emit('update:value', '');
      }
    };

    return {
      onChange,
      results,
      isOpen,
      setResult,
      onClickAway,
      currentIcon,
      focusHandler,
      blurHandler,
      deletePressHandler,
      updateCurrentIcon,
    };
  },
};
</script>

<style lang="scss" scoped>
.autocomplete {
  width: 100%;
  height: 100%;
  display: flex;

  & svg {
    position: absolute;
    fill: $blue;
  }

  & label {
    font-size: 14px;
    line-height: 17px;
    color: $mid-gray;
    position: absolute;
    top: 12px;
    left: 15px;
    z-index: 4;
  }
  & input {
    @include input;
    z-index: 3;
    padding: 28px 50px 10px 42px;
    ::placeholder,
    :-ms-input-placeholder,
    ::-ms-input-placeholder {
      font-size: 14px;
      line-height: 17px;
      color: $mid-blue;
    }
    &:focus {
      border: 1px solid $blue;
    }
  }
  &__icon {
    max-width: 20px;
    left: 17px;
    bottom: 19px;
    z-index: 4;
    height: 14px;
  }
  &__results {
    position: absolute;
    top: 48px;
    border: 1px solid $too-ligth-blue;
    width: 100%;
    border-radius: 0px 0px 8px 8px;
    border-top: none;
    padding-left: 0;
    padding-top: 24px;
    z-index: 2;
    background: $white;
    max-height: 300px;
    overflow-y: auto;
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
      fill: white;
    }
  }
}

.error {
  & input {
    border: 1px solid $red;
    &:focus {
      border: 1px solid $blue;
    }
  }
}

input:focus + .autocomplete__error {
  display: none;
}

body.dark {
  .autocomplete {
    input {
      color: $white;
    }

    &__results {
      background: #26273b;
      border: 1px solid #4b4c63;
    }
  }
  .autocomplete input {
    background: transparent;
    border: 1px solid #4b4c63;
  }
}
</style>
