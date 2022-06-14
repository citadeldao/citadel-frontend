<template>
  <div
    class="select"
    tabindex="0"
    :data-qa="dataQa"
    @click="toggleVisibleOptions"
    @blur="closeOptions"
  >
    <div class="select__body">
      <div class="select__label">
        {{ label }}
      </div>
      <div class="select__value">
        <keep-alive v-if="icon">
          <component
            :is="currentIcon"
            class="select__icon"
            :class="{ 'input__icon--disabled': disabled }"
          />
        </keep-alive>

        {{ selected.label }}
      </div>

      <div
        v-if="!disabled"
        class="select__arrow"
        @click.stop="toggleVisibleOptions"
      >
        <arrow-up v-if="isOptionsVisible" />
        <arrow-down v-else />
      </div>
    </div>
    <transition name="fade">
      <div
        v-show="isOptionsVisible"
        class="select__options"
      >
        <div
          v-for="(option, index) of options"
          :key="index"
          class="select__option"
          :class="{ 'select__option--selected': option[valueKey] === selected[valueKey] }"
          :data-qa="dataQa && `${dataQa}--${option[valueKey]}`"
          @click.stop="handleChangeValue(option[valueKey])"
        >
          {{ option.label }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { computed, markRaw, ref } from 'vue';
import arrowUp from '@/assets/icons/arrow-up.svg';
import arrowDown from '@/assets/icons/arrow-down.svg';

export default {
  name: 'Select',
  components: { arrowUp, arrowDown },
  props: {
    label: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      default: () => [],
    },
    modelValue: {
      type: [String, Number],
      default: '',
    },
    valueKey: {
      type: String,
      default: 'prop',
    },
    dataQa: {
      type: [String, null],
      default: null,
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit } ) {
    const currentIcon = ref();
    const isOptionsVisible = ref(false);
    const selected = computed(() => {
      return props.options.find(option => option[props.valueKey] === props.modelValue);
    });

    if (props.icon) {
      import(`@/assets/icons/input/${props.icon}.svg`).then((val) => {
        currentIcon.value = markRaw(val.default);
      });
    }

    const closeOptions = () => {
      isOptionsVisible.value = false;
    };

    const openOptions = () => {
      isOptionsVisible.value = true;
    };

    const toggleVisibleOptions = () => {
      if (props.disabled) {
        return;
      }

      isOptionsVisible.value = !isOptionsVisible.value;
    };

    const handleChangeValue = (val) => {
      if (props.disabled) {
        return;
      }

      closeOptions();

      if (val === selected.value[props.valueKey]) {
        return;
      }

      emit('update:modelValue', val);
      emit('change', val);
    };

    return {
      isOptionsVisible,
      currentIcon,
      selected,
      openOptions,
      closeOptions,
      toggleVisibleOptions,
      handleChangeValue,
    };
  },
};
</script>

<style lang="scss" scoped>
.select {
  position: relative;
  user-select: none;
  cursor: pointer;
  z-index: 2;

  &__body {
    position: relative;
    padding: 12px 18px 13px 15px;
    border-radius: 8px;
    border: 1px solid $too-ligth-blue;
    background-color: $white;
    z-index: 1;
  }

  &__label {
    margin-bottom: 7px;
    font-family: "Panton_SemiBold";
    font-size: 14px;
    line-height: 17px;
    color: $mid-gray;
  }

  &__value {
    display: flex;
    align-items: center;
    font-family: "Panton_SemiBold";
    font-size: 14px;
    padding-right: 20px;
  }

  &__arrow {
    position: absolute;
    right: 20px;
    top: 35px;
    width: 14px;
    fill: $too-ligth-blue;
  }

  &__icon {
    max-width: 14px;
    max-height: 16px;
    margin-right: 7px;

    &--disabled {
      fill: $mid-blue !important;
    }
  }

  &__options {
    position: absolute;
    top: calc(100% - 8px);
    left: 0;
    right: 0;
    padding: 23px 15px 15px;
    border: 1px solid $too-ligth-blue;
    border-top: 0;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    background-color: $white;
    max-height: 200px;
    overflow: auto;
  }

  &__option {
    font-size: 14px;
    font-family: "Panton_SemiBold";
    line-height: 36px;
    padding-left: 21px; // future: area for icons

    &:not(.select__option--selected):hover {
      color: $blue;
    }

    &--selected {
      color: $ligth-blue;
    }
  }
}
</style>
