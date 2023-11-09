<template>
  <div class="min-balance-warning" :class="[`_${variant}`]">
    <closeIcon
      v-if="hasClose"
      class="min-balance-warning__close-icon"
      @click.stop="$emit('closeBanner')"
    />
    <keep-alive>
      <component :is="currentIcon" class="min-balance-warning__icon" />
    </keep-alive>
    <span class="min-balance-warning__content" v-html="content"> </span>
  </div>
</template>

<script>
import closeIcon from '@/assets/icons/close-icon.svg';
import { markRaw, ref } from '@vue/reactivity';
export default {
  name: 'MinBalanceWarning',
  props: {
    icon: {
      type: String,
    },
    content: {
      type: String,
    },
    variant: {
      type: String,
      default: 'warning',
    },
    hasClose: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['closeBanner'],
  components: {
    closeIcon,
  },
  setup(props) {
    const currentIcon = ref();

    import(`@/assets/icons/${props.icon}.svg`).then((val) => {
      currentIcon.value = markRaw(val.default);
    });
    return { currentIcon };
  },
};
</script>

<style lang="scss" scoped>
.min-balance-warning {
  border-radius: 10px;
  padding: 16px;
  display: flex;
  align-items: center;
  position: relative;
  &._warning {
    background: $ligth-red;
    .min-balance-warning__content {
      color: $red;
    }
  }
  &._info {
    background: #e8f7ff;
    .min-balance-warning__content {
      color: $ligth-blue !important;
    }
    .min-balance-warning__icon,
    .min-balance-warning__close-icon {
      fill: $ligth-blue;
    }
  }
  &__icon {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    margin: 9px;
  }
  &__content {
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
  }
  &__close-icon {
    position: absolute;
    right: 6px;
    top: 6px;
    cursor: pointer;
    width: 10px;
    height: 10px;
    &:hover {
      fill: $dark-blue !important;
    }
  }
}

body.dark {
  .min-balance-warning {
    &__content {
      color: $white;
    }

    &._info {
      background: #1b1c31;
    }
  }
}
</style>
