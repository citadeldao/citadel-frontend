<template>
  <div
    class="verification-input"
    :class="{ 'verification-input--error': error }"
  >
    <input
      v-for="(v, index) in values"
      :key="`${id}-${index}`"
      :ref="inputRefs"
      :type="type === 'number' ? 'tel' : type"
      :pattern="type === 'number' ? '[0-9]' : null"
      :autofocus="autoFocus && index === autoFocusIndex"
      :data-id="index"
      :data-qa="`login-verification__code--${index}`"
      :value="v"
      :disabled="disabled"
      :required="required"
      spellcheck="false"
      @input="onValueChange"
      @focus="onFocus"
      @keydown="onKeyDown"
    />
    <div class="verification-input__error">
      {{ error }}
    </div>
  </div>
</template>

<script>
const KEY_CODE = {
  backspace: 8,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
};
export default {
  name: 'VerificationInput',
  props: {
    type: {
      type: String,
      default: 'number',
    },
    fields: {
      type: Number,
      default: 6,
    },
    autoFocus: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    code: {
      type: String,
    },
    error: {
      type: String,
      default: '',
    },
  },
  emits: ['update:code', 'change', 'complete', 'paste'],
  data() {
    const { fields, code } = this;
    let vals;
    let autoFocusIndex = 0;

    if (code && code.length) {
      vals = [];

      for (let i = 0; i < fields; i++) {
        vals.push(code[i] || '');
      }

      autoFocusIndex = code.length >= fields ? 0 : code.length;
    } else {
      vals = Array(fields).fill('');
    }

    this.id = +new Date();

    return { values: vals, autoFocusIndex, iRefs: [] };
  },
  beforeUpdate() {
    this.iRefs = [];
  },
  methods: {
    inputRefs(node) {
      if (node) this.iRefs.push(node);
    },
    onFocus(e) {
      e.target.select(e);
    },
    onValueChange(e) {
      const index = parseInt(e.target.dataset.id);
      const { type } = this;

      if (type === 'number') {
        e.target.value = e.target.value.replace(/[^\d]/gi, '');
      }

      let next;
      const { value } = e.target;
      let { values } = this;
      values = Object.assign([], values);
      if (value.length > 1) {
        if (index !== 5) next = this.iRefs[index + 1];
        values[index] = value.charAt(value.length - 1);
      } else {
        next = this.iRefs[index + 1];
        values[index] = value;
      }
      this.values = values;

      if (next) {
        const element = next;
        element.focus();
        element.select();
      }

      this.triggerChange(values);
    },
    onKeyDown(e) {
      const index = parseInt(e.target.dataset.id);
      const prevIndex = index - 1;
      const nextIndex = index + 1;
      const prev = this.iRefs[prevIndex];
      const next = this.iRefs[nextIndex];

      switch (e.keyCode) {
        case KEY_CODE.backspace: {
          e.preventDefault();
          const vals = [...this.values];

          if (this.values[index]) {
            vals[index] = '';
            this.values = vals;
            this.triggerChange(vals);
          } else if (prev) {
            vals[prevIndex] = '';
            prev.focus();
            this.values = vals;
            this.triggerChange(vals);
          }

          break;
        }
        case KEY_CODE.left:
          e.preventDefault();

          if (prev) {
            prev.focus();
          }

          break;
        case KEY_CODE.right:
          e.preventDefault();

          if (next) {
            next.focus();
          }

          break;
        case KEY_CODE.up:
        case KEY_CODE.down:
          e.preventDefault();
          break;
        default:
          break;
      }
    },
    triggerChange(values = this.values) {
      const { fields } = this;
      const val = values.join('');
      this.$emit('update:code', val);

      if (val.length >= fields) {
        this.$emit('complete', val);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.verification-input {
  display: flex;
  justify-content: space-between;
  height: 100%;
  position: relative;

  & input {
    @include input;
    width: 52px;
    padding: inherit;
    font-size: 30px;
    line-height: 36px;
    text-align: center;

    &:focus {
      border-color: $blue;
    }
  }

  &--error {
    input {
      border-color: $red;
    }

    & .verification-input__error {
      display: flex;
    }
  }

  &__error {
    display: none;
    align-items: center;
    position: absolute;
    left: 0;
    bottom: -32px;
    font-size: 14px;
    font-weight: 600;
    line-height: 30px;
    color: $red;
  }
}
</style>
