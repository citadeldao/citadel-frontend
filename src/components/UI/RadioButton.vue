<template>
  <label class="radio-button">
    <input
      type="radio"
      :checked="modelValue === value"
      @change="$emit('update:modelValue', value)"
      class="radio-button__input"
    />
    <span class="radio-button__control"></span>
    <span class="radio-button__label">
      <slot></slot>
    </span>
  </label>
</template>

<script>
export default {
  name: 'RadioButton',
  props: {
    modelValue: {
      required: true,
    },
    value: {
      required: true,
    },
  },
  emits: ['update:modelValue'],
};
</script>

<style scoped>
.radio-button {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  margin-right: 12px;
}

.radio-button__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.radio-button__control {
  position: relative;
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 8px;
  border: 1px solid #6b7280;
  border-radius: 50%;
  transition: all 0.2s;
}

.radio-button__input:checked + .radio-button__control {
  border-color: #c3ceeb;
}

.radio-button__input:checked + .radio-button__control::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #6a4bff;
}

.radio-button__input:focus + .radio-button__control {
  /* box-shadow: 0 0 0 2px #bfdbfe; */
}

.radio-button__label {
  font-size: 16px;
  color: #374151;
}

body.dark {
  .radio-button__label {
    color: #c3ceeb;
  }
}
</style>
