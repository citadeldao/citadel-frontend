<template>
  <div class="toast" :class="`toast--${type}`">
    <div class="toast__icon">
      <component :is="currentIcon" />
    </div>
    <div class="toast__content">
      <div :class="{ hash: !!hash }" class="toast__title">
        {{ txTitle }}
      </div>
      <div v-if="!hash" class="toast__text" v-html="text" />
      <div v-else class="hash-wrap">
        <a :href="hash" target="_blank">
          {{ $t('transactionsSocket.viewTitle') }}
          <linkIcon class="hash-link" />
        </a>
      </div>
    </div>
    <div class="toast__close" @click="$emit('close')">
      <close-icon />
    </div>
  </div>
</template>

<script>
import { markRaw, ref, computed } from 'vue';
import closeIcon from '@/assets/icons/close-icon.svg';
import linkIcon from '@/assets/icons/link.svg';
import { useI18n } from 'vue-i18n';

export default {
  name: 'Toast',
  components: { closeIcon, linkIcon },
  props: {
    type: {
      type: String,
      default: 'info',
    },
    title: {
      type: String,
      default: '',
    },
    text: {
      type: [String, Error],
      default: '',
    },
    hash: {
      type: String,
      default: '',
    },
  },
  emits: ['close'],
  setup(props) {
    const { t } = useI18n();
    const currentIcon = ref();
    import(`@/assets/icons/toasts/${props.type}.svg`).then((val) => {
      currentIcon.value = markRaw(val.default);
    });

    const txTitle = computed(() => {
      if (props.hash) {
        if (props.type === 'warning') {
          return t('transactionsSocket.failed');
        }

        if (props.type === 'success') {
          return t('transactionsSocket.completed');
        }

        return props.title;
      }

      return props.title;
    });

    return {
      currentIcon,
      txTitle,
    };
  },
};
</script>

<style lang="scss" scoped>
@mixin set-type-style($type, $color) {
  &--#{$type} {
    .toast {
      &__icon {
        background-color: $color;
      }

      &__title {
        color: $color;

        &.hash {
          color: $black;
        }
      }

      &__close {
        svg {
          fill: $color;
        }
      }
    }
  }
}

.toast {
  position: absolute;
  display: flex;
  width: 500px;
  border-radius: 10px;
  margin-bottom: 10px;
  background-color: $white;
  box-shadow: 0 15px 50px rgba(80, 100, 124, 0.1),
    0 10px 15px rgba(80, 100, 124, 0.16);
  overflow: hidden;
  right: 15px;
  top: 15px;

  .hash-wrap {
    color: $ligth-blue;
    display: flex;
    align-items: center;
    cursor: pointer;

    a {
      text-decoration: none;
      color: $ligth-blue;
    }

    svg {
      margin-left: 5px;
    }

    .hash-link {
      width: 17px;
      height: 15px;
    }
  }

  &:last-child {
    margin-bottom: 0;
  }

  @include set-type-style('info', $ligth-blue);
  @include set-type-style('success', $green);
  @include set-type-style('warning', $red);

  &__icon {
    width: 100px;
    min-height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 50px;
      height: 50px;
    }
  }

  &__content {
    padding: 13px 48px 17px 16px;
  }

  &__title {
    font-family: 'Panton_Bold';
    font-size: 20px;
    line-height: 30px;
  }

  &__text {
    font-size: 14px;
    line-height: 20px;
  }

  &__close {
    position: absolute;
    padding: 5px;
    top: 15px;
    right: 15px;
    cursor: pointer;

    &:hover svg {
      fill: $black;
    }

    svg {
      width: 12px;
      height: 18px;
    }
  }
}
</style>
