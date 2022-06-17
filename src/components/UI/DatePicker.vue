<template>
  <label class="date-picker" :class="{ disabled: disabled, expand }">
    Select a period
    <el-date-picker
      v-model="value"
      format="DD.MM.YYYY"
      type="daterange"
      range-separator="__"
      start-placeholder="Start date"
      end-placeholder="End date"
      :disabled="disabled"
      @change="changeHandler"
    />
    <calendar class="date-picker__icon" />
  </label>
</template>

<script>
import calendar from '@/assets/icons/input/calendar.svg';
import { ref } from '@vue/reactivity';

export default {
  name: 'DatePicker',
  components: { calendar },
  props: {
    date: {},
    disabled: {
      type: Boolean,
      default: false,
    },
    expand: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:date'],
  setup(props, { emit }) {
    const value = ref(props.date);
    const changeHandler = (val) => {
      emit('update:date', val);
    };

    return { changeHandler, value };
  },
};
</script>

<style lang="scss" scoped>
.date-picker {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  line-height: 17px;
  color: $mid-gray;
  width: 100%;
  min-width: 220px;
  height: 100%;
  display: flex;
  border: 1px solid $too-ligth-blue;
  border-radius: 8px;
  position: relative;
  padding: 12px 15px 0 15px;
  cursor: pointer;
  &__icon {
    position: absolute;
    bottom: 15px;
    left: 16px;
  }
}
.disabled {
  background-color: $too-ligth-gray;
  .date-picker__icon {
    fill: $mid-blue;
  }
}
.expand {
  width: 220px;
  height: 68px;
  @include md {
    height: 56px;
    padding: 11px 17px 0 13px;
    font-size: 12px;
    line-height: 14px;
  }
  .date-picker__icon {
    @include md {
      left: 14px;
      bottom: 8px;
    }
  }
}
</style>
