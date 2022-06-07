<template>
  <button
    :disabled="disabled"
    class="social-button"
    @click.prevent="$emit('click')"
  >
    <keep-alive>
      <component :is="currentIcon" />
    </keep-alive>
  </button>
</template>

<script>
import { markRaw, ref } from 'vue';
export default {
  name: 'SocialButton',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
    },
  },
  emits: ['click'],
  setup(props) {
    const currentIcon = ref();

    if (props.icon) {
      import(`@/assets/icons/social/${props.icon}.svg`).then((val) => {
        currentIcon.value = markRaw(val.default);
      });
    }

    return { currentIcon };
  },
};
</script>

<style lang="scss" scoped>
.social-button {
  width: 114px;
  height: 60px;
  background: $white;
  border: 1px solid $too-ligth-blue;
  border-radius: 8px;
  &:hover {
    border-color: transparent;
    box-shadow: 0px 15px 50px rgba(80, 100, 124, 0.1),
      0px 10px 15px rgba(80, 100, 124, 0.16);
    & svg {
      fill: $black;
    }
  }
}
</style>
