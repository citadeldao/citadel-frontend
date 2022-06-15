<template>
  <div
    class="label"
    :class="`label--type--${type}`"
    :style="cssVars"
    @click="$emit('click')"
  >
    <div v-if="type === types.TAG" class="label__icon">
      <component :is="currentIcon" />
    </div>
    <div class="label__text">
      <slot />
    </div>
  </div>
</template>

<script>
import { markRaw, ref } from 'vue';
import { computed } from '@vue/runtime-core';

const types = {
  LABEL: 'label',
  TAG: 'tag',
};

export default {
  name: 'Label',
  props: {
    type: {
      type: String,
      default: types.LABEL,
    },
    color: {
      type: String,
      default: '#6A4BFF', // $dark-blue
    },
    icon: {
      type: String,
      default: 'tag',
    },
  },
  emits: ['click'],
  setup(props) {
    const currentIcon = ref();
    import(`@/assets/icons/${props.icon}.svg`).then((val) => {
      currentIcon.value = markRaw(val.default);
    });

    const cssVars = computed(() => ({
      '--color': props.color,
      '--tagColor': `${props.color}33`,
      '--iconColor': `${props.color}4C`,
    }));

    return {
      currentIcon,
      cssVars,
      types,
    };
  },
};
</script>

<style lang="scss" scoped>
.label {
  display: inline-flex;
  height: 14px;
  border-radius: 10px;
  background-color: var(--tagColor);
  color: var(--color);
  font-size: 9px;
  margin-left: 10px;
  overflow: hidden;

  &__icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 19px;
    background-color: var(--iconColor);

    svg {
      width: 10px;
      fill: var(--color);
    }
  }

  &__text {
    padding: 3px 7px;
    font-family: 'Panton_Bold';
    line-height: 1;
  }

  &--type {
    &--tag {
      height: 19px;
      border-radius: 3px;
      font-size: 11px;

      .label {
        &__text {
          padding: 4px;
          font-family: 'Panton_SemiBold';
        }
      }
    }
  }
}
</style>
