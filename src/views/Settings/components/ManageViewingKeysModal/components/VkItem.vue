<template>
  <div class="vk-item">
    <div class="vk-item__icon-wrapper">
      <div v-if="showIconPlaceholder" class="vk-item__logo-icon-placeholder">
        <span>{{ iconPlaceholder[0] }}</span>
        <span>{{ iconPlaceholder[1] }}</span>
      </div>
      <img
        v-else
        :src="getTokenIcon(vk.code?.toLowerCase())"
        alt=""
        @error="showIconPlaceholder = true"
      />
    </div>
    <div class="vk-item__name">
      {{ vk.name }}
    </div>
    <span class="vk-item__vk" :class="{ 'vk-item__vk--hide': isHidden }">
      <span>
        {{ viewingKeyParsed }}
      </span>
    </span>
    <div class="vk-item__buttons">
      <div
        class="vk-item__btn"
        :class="{ 'vk-item__btn--active': !isHidden }"
        @click="toggleIsHidden"
        title="Show / Hide viewing key"
      >
        <vision class="vk-item__vision-svg" />
      </div>
      <div class="vk-item__btn" @click="copyValue" title="Copy viewing key">
        <transition name="fade1">
          <span v-if="isCopied" class="tooltip">
            {{ $t('copiedToClipboard') }}
          </span>
        </transition>
        <copyIcon />
      </div>
      <div class="vk-item__btn" @click="change" title="Change viewing key">
        <lockRefresh />
      </div>
    </div>
  </div>
</template>
<script>
import { ref, computed, inject } from 'vue';
import { getTokenIcon, tokenIconPlaceholder } from '@/helpers';
import vision from '@/assets/icons/input/vision.svg';
import copyIcon from '@/assets/icons/copyIcon.svg';
import lockRefresh from '@/assets/icons/lock-refresh.svg';
import copyToClipboard from '@/helpers/copyToClipboard';
export default {
  name: 'VkItem',
  components: {
    vision,
    copyIcon,
    lockRefresh,
  },
  props: {
    vk: {
      type: [Object, null],
      default: null,
    },
  },
  setup(props) {
    const isHidden = ref(true);
    const isCopied = ref(false);
    const viewingKeyParsed = computed(() =>
      isHidden.value
        ? props.vk?.savedViewingKey.viewingKey.replace(/[\d\D]/g, '*')
        : props.vk?.savedViewingKey.viewingKey
    );
    const toggleIsHidden = () => {
      isHidden.value = !isHidden.value;
    };
    const copyValue = () => {
      copyToClipboard(props.vk.savedViewingKey.viewingKey);
      isCopied.value = true;
      setTimeout(() => {
        isCopied.value = false;
      }, 1500);
    };

    const changeVk = inject('changeVk');
    const change = () => {
      changeVk.value = props.vk;
    };

    const showIconPlaceholder = ref(false);
    const iconPlaceholder = computed(() => tokenIconPlaceholder(props.vk.name));

    return {
      isHidden,
      viewingKeyParsed,
      isCopied,
      toggleIsHidden,
      copyValue,
      change,
      showIconPlaceholder,
      iconPlaceholder,
      getTokenIcon,
    };
  },
};
</script>
<style lang="scss" scoped>
.vk-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid $too-ligth-blue;
  &__icon-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    & img {
      max-width: 25px;
      max-height: 25px;
      filter: brightness(0) invert(1);
    }
    flex-basis: 40px;
    flex-grow: 0;
    flex-shrink: 0;
    height: 40px;
    border-radius: 50%;
    background-color: $darkgray;
    margin-right: 8px;
  }
  &__logo-icon-placeholder {
    position: relative;
    width: 100%;
    height: 100%;
    & span {
      font-size: 14px;
      line-height: 17px;
      color: $white;
      font-family: 'Panton_Bold';
      position: absolute;
      top: 7px;
      left: 6px;
      &:last-child {
        top: 13px;
        left: 19px;
        right: 7px;
      }
    }
  }
  &__name {
    font-weight: bold;
    font-size: 16px;
    color: $mid-blue;
    flex-basis: 130px;
    flex-grow: 0;
    flex-shrink: 0;
  }
  &__vk {
    max-width: 400px;
    flex-basis: 400px;
    flex-grow: 0;
    flex-shrink: 0;
    // display: flex;
    // justify-content: center;
    font-weight: 600;
    font-size: 14px;
    color: $royalblue1;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: 0s;
    &:hover {
      overflow: visible;
      background-color: $white;
      position: relative;
      z-index: 3;
      & span {
        background-color: $white;
      }
    }
    &--hide {
      font-size: 18px;
      font-weight: bold;
      color: $mid-gray;
      text-overflow: initial;
      &:hover {
        overflow: hidden;
      }
    }
  }
  &__buttons {
    flex-basis: 136px;
    flex-grow: 0;
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    // margin-left: 16px;
    margin-left: auto;
    svg {
      pointer-events: none;
    }
  }
  &__btn {
    position: relative;
    width: 40px;
    height: 40px;
    background-color: $too-ligth-gray;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    &--active {
      background-color: $royalblue1;
      svg {
        fill: $white;
      }
    }
  }
  &__vision-svg {
    width: 20px;
    height: 20px;
    fill: $royalblue1;
  }
}
.tooltip {
  background-color: $too-ligth-gray;
  text-align: center;
  border-radius: 6px;
  padding: 8px 9px;
  position: absolute;
  white-space: nowrap;
  z-index: 1;
  top: 110%;
  left: 50%;
  margin-left: -60px;
  box-shadow: 0px 4px 10px rgba(63, 54, 137, 0.25);
  border-radius: 6px;
  font-size: 12px;
  line-height: 16px;
  color: $too-dark-blue;
  &::after {
    content: '';
    position: absolute;
    bottom: 98%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-radius: 2px;
    border-style: solid;
    border-color: transparent transparent $too-ligth-gray transparent;
  }
}
</style>
