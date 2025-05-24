<template>
  <div class="mobile-app-modal">
    <div class="mobile-app-modal__header" />
    <div class="mobile-app-modal__main">
      <closeIcon
        v-if="false"
        class="mobile-app-modal__close-icon"
        @click.stop="$emit('close', $event)"
      />
      <img :src="downloadAppIcon" class="mobile-app-modal__icon" />
      <span class="mobile-app-modal__title">IMPORTANT NOTICE</span>
      <span class="mobile-app-modal__info">
        Citadel.one will discontinue support for
        <span class="net"
          >Archway, Bitsong, Comdex, Evmos, ICON, IRIS, Juno, Ki, Lum, Oasis,
          Quasar, Regen, Rizon, Sentinel, Sifchain, Stafi, Starname, Teritori,
          UX (ex Umee)</span
        >
        starting <span class="date">May 27.</span><br />
        Please ensure you secure your private key or seed phrase (available
        in<br />
        Settings) and transfer your assets to another wallet.<br />
        We apologize for any inconvenience.
      </span>
      <span class="mobile-app-modal__info">
        Need help? Our support team is here for you:
        <a
          href="https://t.me/citadelofficial"
          target="_blank"
          rel="noopener noreferrer"
          >@citadelofficial</a
        >
      </span>
      <PrimaryButton @click="clickHandler" class="mobile-app-modal__button"
        >OK</PrimaryButton
      >
    </div>
  </div>
</template>

<script>
import closeIcon from '@/assets/icons/close-icon.svg';
import PrimaryButton from '@/components/UI/PrimaryButton';
import downloadAppIcon from '@/assets/icons/networksdelete.png';
import { useStore } from 'vuex';

export default {
  name: 'MobileAppModal',
  components: { PrimaryButton, closeIcon },
  emits: ['close'],
  setup() {
    const store = useStore();

    const clickHandler = () => {
      store.dispatch('app/toggleShowWarningRemoveWallets', false);
    };

    return { clickHandler, downloadAppIcon };
  },
};
</script>

<style lang="scss" scoped>
.mobile-app-modal {
  width: 600px;
  height: 620px;
  background: $white;
  box-shadow: 15px 15px 15px rgba(63, 54, 137, 0.2);
  border-radius: 16px;
  margin: auto;

  &__button {
    width: 200px;
    height: 60px;
    margin-top: 20px;
  }

  &__header {
    height: 16px;
    background: $dark-blue;
    border-radius: 16px 16px 0px 0px;
  }
  &__main {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 39px 24px 38px 24px;
  }
  &__close-icon {
    position: absolute;
    top: 31px;
    right: 32px;
    width: 15px;
    height: 24px;
    cursor: pointer;
    &:hover {
      fill: $dark-blue;
    }
  }
  &__icon {
    margin-bottom: 5px;
  }
  &__title {
    font-size: 18px;
    line-height: 30px;
    font-family: 'Panton_Bold';
  }
  &__info {
    font-size: 14px;
    line-height: 26px;
    text-align: center;
    color: $mid-blue;
    margin-bottom: 13px;
    span {
      color: $blue;
      font-family: 'Panton_Bold';
    }

    a {
      color: $blue;
      font-family: 'Panton_Bold';
      text-decoration: none;
    }

    .net {
      color: #0a2778;
      font-size: 13px;
    }

    .date {
      color: #6b93c0;
      font-family: 'Panton_Bold';
    }
  }
  &__iost-button {
    margin-bottom: 16px;
  }
}

body.dark {
  .mobile-app-modal {
    box-shadow: none;

    .mobile-app-modal__info span {
      color: $dark-blue;
    }

    .mobile-app-modal__info {
      a {
        color: $dark-blue;
        font-family: 'Panton_Bold';
        text-decoration: none;
      }
    }

    .mobile-app-modal__info .net {
      color: #fff;
    }

    &__main {
      background: $dark-panel-bg;
    }

    &__title {
      color: $white;
    }

    &__close-icon {
      fill: $white;
    }
  }
}
</style>
