<template>
  <div class="radio-button">
    <input
      :id="value"
      :value="value"
      type="radio"
      name="radio"
      :checked="checked"
    />
    <span class="radio-button__checkmark" />
    <label class="radio-button__label" :for="value">
      {{ label }}
      <slot />
    </label>
  </div>
</template>

<script>
import { computed } from '@vue/runtime-core';
export default {
  name: 'RadioButton',
  props: {
    label: {
      type: String,
    },
    value: {
      required: true,
    },
    currentValue: {
      required: true,
      type: String,
    },
  },
  setup(props) {
    const checked = computed(() => props.currentValue === props.value);

    return { checked };
  },
};
</script>

<style lang="scss" scoped>
.radio-button {
  display: flex;
  position: relative;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  &__label {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    font-size: 14px;
    line-height: 17px;
    font-family: 'Panton_SemiBold';
    text-transform: capitalize;
  }
  & input {
    position: absolute;
    opacity: 0;
    height: 100%;
    top: 0px;
    left: 0px;
    margin: 0;
    cursor: pointer;
  }
  &__checkmark {
    align-items: center;
    justify-content: center;
    height: 13px;
    width: 13px;
    border: 1px solid $too-ligth-blue;
    border-radius: $round;
    margin-right: 8px;
  }
  & input:checked ~ &__checkmark {
    display: flex;
  }

  &__checkmark:after {
    content: '';
    position: absolute;
    display: none;
  }

  & input:checked ~ &__checkmark:after {
    display: flex;
    background: $blue;
  }

  &__checkmark:after {
    width: 7px;
    height: 7px;
    border-radius: $round;
    background: white;
  }
}
</style>
