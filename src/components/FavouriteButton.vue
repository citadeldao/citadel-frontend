<template>
  <div
    class="favourite-button"
    :class="{ 'favourite-button--hover': isHovered }"
    @mouseover="mouseOverHandler"
    @mouseleave="mouseLeaveHandler"
    @click="clickHandler"
  >
    <keep-alive>
      <component :is="icon" />
    </keep-alive>
  </div>
</template>

<script>
import favorite from '@/assets/icons/favorite.svg';
import favoriteEmpty from '@/assets/icons/favorite-empty.svg';
import { ref, markRaw, watch } from 'vue';

export default {
  name: 'FavouriteButton',
  components: { favorite, favoriteEmpty },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['value', 'change'],
  setup(props, { emit }) {
    const icon = ref();
    const isHovered = ref(false);

    watch(
      () => props.value,
      (val) => {
        icon.value = markRaw(val ? favorite : favoriteEmpty);
      },
      { immediate: true }
    );

    const mouseOverHandler = () => {
      isHovered.value = true;
      icon.value = markRaw(favorite);
    };

    const mouseLeaveHandler = () => {
      isHovered.value = false;
      icon.value = markRaw(props.value ? favorite : favoriteEmpty);
    };

    const clickHandler = () => {
      emit('change', !props.value);
    };

    return {
      icon,
      isHovered,
      mouseOverHandler,
      mouseLeaveHandler,
      clickHandler,
    };
  },
};
</script>

<style lang="scss" scoped>
.favourite-button {
  width: 22px;
  height: 21px;
  margin-right: 16px;
  cursor: pointer;
  transition: none;
  flex-shrink: 0;

  svg {
    fill: $dark-blue;
  }

  &--hover {
    svg {
      fill: $blue;
    }
  }

  @include md {
    width: 18px;
    height: 18px;
    margin-right: 12px;
  }
}
</style>
