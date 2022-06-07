<template>
  <button
    :style="cssVars"
    :disabled="disabled"
    class="icon-button"
    @click="$emit('click')"
  >
    <keep-alive>
      <component :is="currentIcon" />
    </keep-alive>
  </button>
</template>

<script>
import { markRaw, ref } from 'vue';

export default {
  name: 'IconButton',
  props: {
    icon: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    bgColor: {
      type: String,
      default: '#6A4BFF',
    },
  },
  emits: ['click'],
  setup(props) {
    const currentIcon = ref();

    import(`@/assets/icons/${props.icon}.svg`).then((val) => {
      currentIcon.value = markRaw(val.default);
    });

    return { currentIcon };
  },
  computed: {
    cssVars() {
      return {
        '--bgColor': this.bgColor,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.icon-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background: var(--bgColor);

  &:hover {
    background: $blue;
  }

  & svg {
    height: 50%;
    fill: $white;
  }
}
</style>