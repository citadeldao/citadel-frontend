<template>
  <div class="textarea">
    <label :for="id">{{ label }} </label>
    <textarea
      :id="id"
      :value="value"
      :placeholder="!hasFocus ? placeholder : ''"
      :autocomplete="autocomplete"
      :disabled="disabled"
      :data-qa="dataQa"
      @focus="onFocus"
      @blur="onBlur"
      @input="inputHandler"
    />
    <keep-alive v-if="icon">
      <component :is="currentIcon" class="textarea__icon" />
    </keep-alive>
  </div>
</template>

<script>
import { ref, markRaw } from 'vue';
export default {
  name: 'Textarea',
  components: {},
  props: {
    label: {
      type: String,
    },
    value: {
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
    },
    placeholder: {
      type: String,
      default: '',
    },
    autocomplete: {
      type: String,
    },
    disabled: {
      type: Boolean,
    },
    dataQa: {
      type: [String, null],
      default: null,
    },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const hasFocus = ref(false);
    const currentIcon = ref();

    if (props.icon) {
      import(`@/assets/icons/input/${props.icon}.svg`).then((val) => {
        currentIcon.value = markRaw(val.default);
      });
    }

    const inputHandler = (e) => {
      emit('update:value', e.target.value);
    };

    const onFocus = () => {
      hasFocus.value = true;
    };

    const onBlur = () => {
      hasFocus.value = false;
    };

    return { inputHandler, currentIcon, onFocus, onBlur, hasFocus };
  },
};
</script>

<style lang="scss" scoped>
.textarea {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  & svg {
    position: absolute;
  }

  & label {
    font-size: 14px;
    line-height: 17px;
    color: $mid-gray;
    position: absolute;
    top: 12px;
    left: 15px;
    font-family: 'Panton_SemiBold';
  }

  & textarea {
    @include input;
    outline: none;
    resize: none;
    padding: 31px 10px 10px 34px;
    &:focus {
      border: 1px solid $blue;
    }
    &:disabled {
      background: $too-ligth-gray;
    }
  }
  &__icon {
    left: 17px;
    top: 34px;
  }
}
</style>
