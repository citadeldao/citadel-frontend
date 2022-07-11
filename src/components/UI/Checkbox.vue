<template>
  <div class="checkbox">
    <input
      :id="id"
      type="checkbox"
      :value="value"
      :checked="value"
      :disabled="disabled"
      :data-qa="dataQa"
      @change="changeHandler"
    />
    <label :for="id">
      <span class="checkbox__checkmark">
        <template v-if="value">
          <checkmarkDisabled v-if="disabled" />
          <checkmark v-else />
        </template>
      </span>
      <span class="checkbox__label">
        {{ label }}
      </span>
    </label>
    <Tooltip v-if="info" :text="info">
      <info />
    </Tooltip>
  </div>
</template>

<script>
import Tooltip from '@/components/UI/Tooltip';
import checkmark from '@/assets/icons/input/checkmark.svg';
import checkmarkDisabled from '@/assets/icons/input/checkmark-disabled.svg';
import info from '@/assets/icons/info.svg';

export default {
  name: 'Checkbox',
  components: {
    Tooltip,
    checkmark,
    checkmarkDisabled,
    info,
  },
  props: {
    label: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      default: 'checkbox',
    },
    value: {
      type: Boolean,
      required: true,
    },
    info: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    dataQa: {
      type: [String, null],
      default: null,
    },
  },
  emits: ['update:value', 'change'],
  setup(props, { emit }) {
    const changeHandler = () => {
      emit('update:value', !props.value);
      emit('change', !props.value);
    };

    return { changeHandler };
  },
};
</script>

<style lang="scss" scoped>
input[type='checkbox'] {
  display: none;

  & + label {
    display: inline-flex;
    align-items: center;
    font-size: 16px;
    line-height: 19px;
    color: $mid-gray;
    cursor: pointer;

    @include md {
      font-size: 14px;
      line-height: 17px;
    }
  }

  &:checked + label {
    .checkbox {
      &__checkmark {
        transition: all 0.3s ease-in-out;
        background: $too-dark-blue;
        border: none;
        &:hover,
        &__label {
          background: $blue;
        }
      }

      &__label {
        color: $too-dark-blue;
      }
    }
  }

  &:disabled {
    & + label {
      cursor: not-allowed;

      .checkbox {
        &__checkmark {
          background: transparent;
          border: 1px solid $too-ligth-blue;
        }

        &__label {
          color: $too-ligth-blue;
        }
      }
    }
  }
}

.checkbox {
  display: inline-flex;
  align-items: center;
  cursor: pointer;

  &__checkmark {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: 1px solid $too-ligth-blue;
    border-radius: 4px;
    margin-right: 14px;
    transition: all 0.2s;

    & svg {
      width: 11px;
      height: 9px;
    }
  }

  &__label {
    display: flex;
    @include text-default;
    font-size: 1rem !important;
    @include xs-lg {
      width: 120px;
    }
    @include laptop {
      font-size: 0.875rem !important;
    }
  }

  &__tooltip {
    height: 100%;
  }
}
</style>
