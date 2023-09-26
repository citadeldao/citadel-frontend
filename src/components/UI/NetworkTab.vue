<template>
  <div
    class="network-tab"
    :class="{ 'network-tab-active': active }"
    @click="clickHandler"
  >
    <div v-if="isCurrentToken" class="network-tab__logo">
      <div
        v-if="showIconPlaceholder"
        class="network-tab__logo-icon-placeholder"
      >
        <span>{{ iconPlaceholder[0] }}</span>
        <span>{{ iconPlaceholder[1] }}</span>
      </div>
      <img
        v-else
        :src="getTokenIcon(currentToken?.code.toLowerCase())"
        alt=""
        @error="showIconPlaceholder = true"
      />
    </div>
    <keep-alive v-if="icon && !isCurrentToken">
      <component :is="currentIcon" />
    </keep-alive>
    <span class="network-tab__abbr">{{ value }}</span>
  </div>
</template>

<script>
import { computed, markRaw, ref, watch } from 'vue';
import { getTokenIcon, tokenIconPlaceholder } from '@/helpers';
export default {
  name: 'NetworkTab',
  props: {
    value: {
      type: String,
    },
    currentTab: {},
    icon: {
      type: String,
    },
    id: {
      type: Number,
    },
    currentToken: {
      type: [Object, null],
      default: null,
    },
    isCurrentToken: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:currentTab'],
  setup(props, { emit }) {
    const currentIcon = ref();
    const setIcon = (icon) => {
      props.icon &&
        !props.isCurrentToken &&
        import(`@/assets/icons/networks/${icon}.svg`).then((val) => {
          currentIcon.value = markRaw(val.default);
        });
    };

    setIcon(props.icon);

    watch(
      () => props.icon,
      (newVal) => {
        showIconPlaceholder.value = false;
        setIcon(newVal);
      }
    );

    const active = computed(() => props.value === props.currentTab);
    const clickHandler = () => {
      emit('update:currentTab', props.value);
    };

    const showIconPlaceholder = ref(false);
    const iconPlaceholder = computed(() =>
      tokenIconPlaceholder(props.currentToken?.name)
    );

    return {
      active,
      clickHandler,
      currentIcon,
      showIconPlaceholder,
      iconPlaceholder,
      getTokenIcon,
    };
  },
};
</script>

<style lang="scss" scoped>
.network-tab {
  background: $too-ligth-gray;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 30px;
  color: $slategray1;
  border-radius: 6px;
  font-size: 12px;
  line-height: 28px;
  &__logo {
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    display: none;
    @include md {
      display: flex;
    }
    &:hover {
      .network-tab__logo-icon-placeholder {
        & span {
          color: $white;
        }
      }
      & img {
        filter: brightness(0) invert(1);
      }
    }
    & img {
      max-width: 14px;
      max-height: 14px;
      filter: invert(56%) sepia(52%) saturate(311%) hue-rotate(171deg)
        brightness(91%) contrast(95%);
    }
  }
  &__logo-icon-placeholder {
    position: relative;
    width: 100%;
    height: 100%;
    & span {
      position: absolute;
      color: $mid-blue;
      font-family: 'Panton_Bold';
      font-size: 10px;
      line-height: 12px;
      top: 5px;
      left: 4px;
      &:last-child {
        top: 9px;
        left: 12px;
      }
    }
  }
  &__abbr {
    font-family: 'Panton_SemiBold';
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 80%;
    text-align: center;

    @include md {
      display: none;
    }
  }
  & svg {
    display: none;
    fill: $mid-blue;
    max-width: 18px;
    max-height: 14px;
    @include md {
      display: initial;
    }
  }
  @include md {
    width: 24px;
    height: 24px;
  }
  &:hover {
    background: $too-dark-blue;
    color: $white;
    & svg {
      fill: $white;
    }
  }
}
.network-tab-active {
  background: $dark-blue;
  color: $white;
  .network-tab__logo {
    & img {
      filter: brightness(0) invert(1);
    }
  }
  .network-tab__logo-icon-placeholder {
    & span {
      color: $white;
    }
  }
  & svg {
    fill: $white;
  }
  &:hover {
    background: $dark-blue;
    color: $white;
    & svg {
      fill: $white;
    }
  }
}
</style>
