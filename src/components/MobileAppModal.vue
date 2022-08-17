<template>
  <div class="mobile-app-modal">
    <div class="mobile-app-modal__header" />
    <div class="mobile-app-modal__main">
      <closeIcon
        class="mobile-app-modal__close-icon"
        @click.stop="$emit('close', $event)"
      />
      <img :src="downloadAppIcon" class="mobile-app-modal__icon" />
      <span class="mobile-app-modal__title">
        {{ $t('mobileAppModal.title') }}
      </span>
      <span class="mobile-app-modal__info">
        {{ $t('mobileAppModal.info') }}
      </span>
      <div class="mobile-app-modal__iost-button">
        <PrimaryButton
          color="#FFFFFF"
          bg-color="#FF5722"
          box-shadow="0px 0px 25px rgba(255, 87, 34, 0.5)"
          @click="
            clickHandler(
              'https://apps.apple.com/us/app/citadel-one/id1546701475?ign-mpt=uo%3D2'
            )
          "
        >
          {{ $t('mobileAppModal.appStore') }}
        </PrimaryButton>
      </div>
      <PrimaryButton
        @click="
          clickHandler(
            'https://play.google.com/store/apps/details?id=one.citadel.mobile&gl=NL'
          )
        "
      >
        {{ $t('mobileAppModal.googlePlay') }}
      </PrimaryButton>
    </div>
  </div>
</template>

<script>
import closeIcon from '@/assets/icons/close-icon-round.svg';
import PrimaryButton from '@/components/UI/PrimaryButton';
import downloadAppIcon from '@/assets/icons/downloadApp.png';

export default {
  name: 'MobileAppModal',
  components: { PrimaryButton, closeIcon },
  emits: ['close'],
  setup() {
    const clickHandler = (link) => {
      window.location.href = link;
    };

    return { clickHandler, downloadAppIcon };
  },
};
</script>

<style lang="scss" scoped>
.mobile-app-modal {
  width: 320px;
  background: $white;
  box-shadow: 15px 15px 15px rgba(63, 54, 137, 0.2);
  border-radius: 16px;
  margin: auto;
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
    line-height: 24px;
    text-align: center;
    color: $mid-blue;
    margin-bottom: 13px;
  }
  &__iost-button {
    margin-bottom: 16px;
  }
}
</style>
