<template>
  <svg
    class="favorite-button"
    :class="{
      'favorite-button__active': value,
      'favorite-button__disabled': isDisabled,
    }"
    @click="clickHandler"
    width="23"
    height="22"
    viewBox="0 0 23 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      style="transition: all 0.2s ease"
      d="M10.4306 1.77358C10.768 0.742141 12.2333 0.742141 12.5696 1.77358L14.2778 7.00803C14.3513 7.23255 14.4942 7.42819 14.6861 7.56698C14.878 7.70576 15.109 7.78059 15.3461 7.78076H20.8734C21.9631 7.78076 22.4152 9.16945 21.5346 9.8078L17.0633 13.0421C16.8713 13.1811 16.7283 13.3772 16.655 13.6021C16.5817 13.827 16.5817 14.0693 16.6551 14.2941L18.3622 19.5286C18.6996 20.5612 17.5132 21.419 16.6326 20.7807L12.1614 17.5464C11.9692 17.4072 11.7377 17.3323 11.5001 17.3323C11.2625 17.3323 11.031 17.4072 10.8389 17.5464L6.36758 20.7807C5.48704 21.419 4.30062 20.56 4.63799 19.5286L6.34508 14.2941C6.41849 14.0693 6.41854 13.827 6.34521 13.6021C6.27187 13.3772 6.12893 13.1811 5.93687 13.0421L1.46558 9.8078C0.58392 9.16945 1.03825 7.78076 2.12683 7.78076H7.65296C7.89029 7.78083 8.12157 7.70611 8.31367 7.56731C8.50577 7.4285 8.64885 7.23274 8.72242 7.00803L10.4306 1.77358V1.77358Z"
      fill="none"
      stroke="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'FavoriteButton',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['value', 'change'],
  setup(props, { emit }) {
    const isDisabled = ref(false);

    const clickHandler = () => {
      if (isDisabled.value) return;
      isDisabled.value = true;
      emit('change', !props.value);
      setTimeout(() => (isDisabled.value = false), 1200);
    };

    return {
      isDisabled,
      clickHandler,
    };
  },
};
</script>

<style lang="scss" scoped>
.favorite-button {
  width: 23px;
  height: 22px;
  margin-right: 16px;
  cursor: pointer;
  transition: all 0.2s;

  path {
    stroke: $blue;
  }

  &__disabled path,
  &__disabled:hover path {
    cursor: not-allowed !important;
    fill: $gray !important;
    stroke: $dark-gray !important;
  }

  &__active path,
  &:hover path {
    fill: $blue;
  }

  @include md {
    width: 18px;
    height: 18px;
    margin-right: 12px;
  }
}
</style>
