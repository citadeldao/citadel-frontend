<template>
  <label class="date-picker" :class="{ disabled: disabled, expand }">
    Select a period

    <div class="date-picker__row">
      <CalendarIcon class="date-picker__icon" />
      <el-date-picker
        v-model="value"
        format="DD.MM.YYYY"
        type="daterange"
        range-separator="__"
        start-placeholder="Start date"
        end-placeholder="End date"
        :shortcuts="shortcuts"
        :disabled-date="disabledDate"
        :disabled="disabled"
        @change="(val) => $emit('update:date', val)"
      />
    </div>
  </label>
</template>

<script>
import CalendarIcon from '@/assets/icons/input/calendar.svg';
import { ref } from '@vue/reactivity';

export default {
  name: 'DatePicker',
  components: { CalendarIcon },
  props: {
    date: {
      type: Array,
      default: () => [],
    },
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
  setup(props) {
    const value = ref(props.date);

    const shortcuts = [
      {
        text: 'Last week',
        value: () => {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
          return [start, end];
        },
      },
      {
        text: 'Last month',
        value: () => {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
          return [start, end];
        },
      },
      {
        text: 'Last 3 months',
        value: () => {
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
          return [start, end];
        },
      },
    ];

    const disabledDate = (time) => time.getTime() > Date.now();

    return {
      disabledDate,
      value,
      shortcuts,
    };
  },
};
</script>

<style lang="scss" scoped>
.date-picker {
  position: relative;

  display: flex;
  flex-direction: column;

  font-size: $small-lg;
  line-height: 17px;

  color: $mid-gray;

  height: 100%;
  width: 100%;
  min-width: 220px;

  border: 1px solid $too-ligth-blue;
  border-radius: 16px;

  padding: 12px 15px 0 15px;

  cursor: pointer;

  @include laptop {
    font-weight: 600;
    font-size: $small-x;
    line-height: 14px;

    border-radius: 8px;
    height: 56px;
  }

  &__icon {
    width: 15px;
    margin-right: 8px;
  }

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-top: 7px;
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

  @include laptop {
    height: 56px;
    font-size: 12px;
    line-height: 14px;
  }
}
</style>
