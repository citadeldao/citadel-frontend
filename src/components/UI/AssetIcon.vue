<template>
  <div class="asset-icon" :style="cssVars">
    <keep-alive v-if="isNativeToken">
      <component :is="icon" />
    </keep-alive>
    <div
      v-if="showIconPlaceholder && !isNativeToken"
      class="asset-icon__placeholder"
    >
      <span>{{ iconPlaceholder[0] }}</span>
      <span>{{ iconPlaceholder[1] }}</span>
    </div>
    <img
      v-show="!showIconPlaceholder && !isNativeToken"
      :key="code"
      :src="getTokenIcon(code?.toLowerCase())"
      alt=""
      @error="showIconPlaceholder = true"
      @load="showIconPlaceholder = false"
    />
  </div>
</template>

<script>
import { getTokenIcon, tokenIconPlaceholder } from '@/helpers';
import { computed, markRaw, ref, watch } from 'vue';

export default {
  name: 'AssetIcon',
  props: {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: '#6B93C0',
    },
    isNativeToken: {
      type: Boolean,
      default: false,
    },
    net: {
      type: String,
    },
  },
  setup(props) {
    const showIconPlaceholder = ref(false);
    const iconPlaceholder = computed(() => tokenIconPlaceholder(props.name));
    const icon = ref();

    const cssVars = computed(() => ({
      '--color': props.color,
    }));

    if (props.isNativeToken) {
      import(`@/assets/icons/networks/${props.net}.svg`).then((val) => {
        icon.value = markRaw(val.default);
      });
    }

    watch(
      () => props.net,
      (newVal) => {
        if (props.isNativeToken) {
          import(`@/assets/icons/networks/${newVal}.svg`).then((val) => {
            icon.value = markRaw(val.default);
          });
        }
      },
      { deep: true }
    );

    return {
      cssVars,
      showIconPlaceholder,
      iconPlaceholder,
      getTokenIcon,
      icon,
    };
  },
};
</script>

<style lang="scss" scoped>
.asset-icon {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  background: var(--color);
  box-shadow: 0 15px 50px rgba(80, 100, 124, 0.1),
    0 10px 15px rgba(80, 100, 124, 0.16);
  border-radius: 4px;
  flex-shrink: 0;
  & svg {
    max-width: 18px;
    max-height: 18px;
    fill: $white;
  }
  & img {
    max-width: 18px;
    max-height: 18px;
    filter: brightness(0) invert(1);
  }

  &__placeholder {
    position: relative;
    width: 100%;
    height: 100%;

    & span {
      font-size: 14px;
      line-height: 17px;
      color: $white !important;
      font-family: 'Panton_Bold';
      position: absolute;
      top: 7px;
      left: 6px;

      @include md {
        font-size: 12px;
        left: 8px;
      }

      &:last-child {
        top: 13px;
        left: 19px;
        right: 7px;
      }
    }
  }
}
</style>
