<template>
  <div v-if="isShown && !isClosed" class="notification-banner">
    <div class="notification-banner__header">
      <div class="notification-banner__header-line"></div>
    </div>
    <div class="notification-banner__content">
      <button class="notification-banner__close" @click="closeBanner">
        <closeIcon />
      </button>
      <div class="notification-banner__main">
        <div class="notification-banner__title">IMPORTANT!</div>
        <div class="notification-banner__text">
          Our platform will be permanently shutting down on February 27, 2026.
          After that date, the app won't be available anymore.
        </div>
        <PrimaryButton
          v-if="!isExpanded"
          class="notification-banner__learn-more"
          @click="toggleExpand"
        >
          Learn more
        </PrimaryButton>
      </div>
      <div v-if="isExpanded" class="notification-banner__expanded">
        <div class="notification-banner__expanded-text">
          To make sure you can keep using your wallets elsewhere, please take a
          moment to back them up if you haven't already.
        </div>
        <div class="notification-banner__links">
          <a
            href="https://medium.com/citadel-one/backup-file-easy-way-to-restore-your-wallets-605d14fef05f"
            target="_blank"
            rel="noopener noreferrer"
            class="notification-banner__link"
          >
            Here's a guide for you
          </a>
          <a
            href="https://t.me/citadelofficial"
            target="_blank"
            rel="noopener noreferrer"
            class="notification-banner__link"
          >
            For any questions please contact us here
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import closeIcon from '@/assets/icons/close-icon.svg';
import PrimaryButton from '@/components/UI/PrimaryButton';

export default {
  name: 'NotificationBanner',
  components: {
    closeIcon,
    PrimaryButton,
  },
  setup() {
    const isShown = ref(false);
    const isClosed = ref(false);
    const isExpanded = ref(false);

    let showTimeoutId = null;

    onMounted(() => {
      showTimeoutId = window.setTimeout(() => {
        isShown.value = true;
      }, 3000);
    });

    onBeforeUnmount(() => {
      if (showTimeoutId !== null) {
        clearTimeout(showTimeoutId);
      }
    });

    const closeBanner = () => {
      isClosed.value = true;
    };

    const toggleExpand = () => {
      isExpanded.value = !isExpanded.value;
    };

    return {
      isShown,
      isClosed,
      isExpanded,
      closeBanner,
      toggleExpand,
    };
  },
};
</script>

<style lang="scss" scoped>
.notification-banner {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  max-width: 480px;
  background: $white;
  border: 1px solid $ligth-gray;
  border-radius: 16px;
  box-shadow: 15px 15px 15px rgba(63, 54, 137, 0.2);
  overflow: hidden;
  animation: slideIn 0.3s ease-out;

  @include md {
    max-width: calc(100% - 40px);
    top: 10px;
    right: 20px;
    left: 20px;
  }

  &__header {
    height: 16px;
    background: $dark-blue;
    border-radius: 16px 16px 0px 0px;
  }

  &__content {
    position: relative;
    padding: 24px 40px 32px 40px;

    @include md {
      padding: 20px 24px 24px 24px;
    }
  }

  &__close {
    position: absolute;
    right: 20px;
    top: 20px;
    cursor: pointer;
    width: 16px;
    height: 16px;
    background: none;
    border: none;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.2s;

    @include md {
      right: 16px;
      top: 16px;
    }

    &:hover {
      opacity: 0.7;
    }

    svg {
      width: 16px;
      height: 16px;
      fill: $mid-gray;
    }
  }

  &__main {
    margin-top: 8px;
  }

  &__title {
    font-family: 'Panton_Bold';
    font-size: 18px;
    line-height: 24px;
    color: $red;
    margin-bottom: 12px;

    @include md {
      font-size: 16px;
      line-height: 22px;
    }
  }

  &__text {
    font-family: 'Panton_Regular';
    font-size: 16px;
    line-height: 20px;
    color: $darkslategray;
    margin-bottom: 16px;

    @include md {
      font-size: 13px;
      line-height: 18px;
    }
  }

  &__learn-more {
    margin-top: 8px;
  }

  &__expanded {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px dashed $ligth-gray;
    animation: expand 0.3s ease-out;
  }

  &__expanded-text {
    font-family: 'Panton_Regular';
    font-size: 16px;
    line-height: 20px;
    color: $darkslategray;
    margin-bottom: 16px;

    @include md {
      font-size: 13px;
      line-height: 18px;
    }
  }

  &__links {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__link {
    font-family: 'Panton_Bold';
    font-size: 14px;
    line-height: 20px;
    color: $blue;
    text-decoration: underline;
    transition: color 0.2s;

    @include md {
      font-size: 13px;
      line-height: 18px;
    }

    &:hover {
      color: $dark-blue;
    }
  }
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes expand {
  from {
    max-height: 0;
    opacity: 0;
  }
  to {
    max-height: 500px;
    opacity: 1;
  }
}

body.dark {
  .notification-banner {
    box-shadow: none;
    background-color: #26273b;
    border-color: #393b53;

    &__title {
      color: $red;
    }

    &__text,
    &__expanded-text {
      color: $white;
    }

    &__expanded {
      border-top-color: #393b53;
    }

    &__link {
      color: $ligth-blue;

      &:hover {
        color: $turquoise;
      }
    }

    &__close {
      svg {
        fill: #fff;
      }
    }

    &__learn-more {
      :deep(button) {
        color: #00a3ff !important;

        &:hover {
          color: $ligth-blue !important;
        }
      }
    }
  }
}
</style>
