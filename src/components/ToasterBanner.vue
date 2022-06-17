<template>
  <div class="toaster-banner" :class="`toaster-banner--${type}`">
    <div class="toaster-banner__icon">
      <component :is="type" />
    </div>
    <div class="toaster-banner__info">
      <closeIcon class="toaster-banner__close-icon" @click="closeBanner" />
      <h4 class="toaster-banner__info-title">Error</h4>
      <span class="toaster-banner__info-message">
        {{ message }}
      </span>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import closeIcon from '@/assets/icons/close-icon.svg';
import warning from '@/assets/icons/warningIcon.svg';
import success from '@/assets/icons/success.svg';

export default {
  name: 'ToasterBanner',
  components: { warning, success, closeIcon },
  props: {
    type: {
      type: String,
    },
    message: {
      type: [String],
    },
  },
  setup() {
    const store = useStore();
    const closeBanner = () => {
      store.commit('notifications/SET_NOTIFICATION', null);
    };

    return { closeBanner };
  },
};
</script>

<style lang="scss" scoped>
.toaster-banner {
  display: flex;
  position: absolute;
  margin: auto;
  top: 20px;
  right: 0px;
  left: 0px;
  width: 585px;
  height: 100px;
  z-index: 3;
  background: $white;
  box-shadow: 0px 15px 50px rgba(80, 100, 124, 0.1),
    0px 10px 15px rgba(80, 100, 124, 0.16);
  border-radius: 10px;
  &--warning {
    .toaster-banner__icon {
      background: $red;
    }
    .toaster-banner__info-title {
      color: $red;
    }
    .toaster-banner__close-icon {
      fill: $red;
    }
  }
  &--success {
    .toaster-banner__icon {
      background: $green;
    }
    .toaster-banner__info-title {
      color: $green;
    }
    .toaster-banner__close-icon {
      fill: $green;
    }
  }

  &__icon {
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px 0px 0px 10px;
    & svg {
      width: 50px;
      height: 50px;
      fill: $white;
    }
  }
  &__info {
    display: flex;
    flex-direction: column;
    padding: 13px 48px 17px 16px;
    position: relative;
  }
  &__info-title {
    font-size: 20px;
    line-height: 30px;
    margin: 0;
    font-family: 'Panton_Bold';
  }
  &__info-message {
    font-size: 14px;
    line-height: 20px;
    width: 421px;
  }
  &__close-icon {
    cursor: pointer;
    position: absolute;
    top: 19px;
    right: 21px;
    width: 12px;
    height: 18px;
    & :hover {
      fill: $black;
    }
  }
}
</style>
