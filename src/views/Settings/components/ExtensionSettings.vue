<template>
  <div class="extension-settings-card" :class="visibleClass">
    <h5 class="extension-settings-card__title">
      {{ $t('settings.extensionSettings.title') }}
    </h5>
    <span class="extension-settings-card__description">
      {{ $t(`settings.extensionSettings.${currentDescKey}`) }}
    </span>

    <PrimaryButton disabled="true" class="extension-settings-card__button">
      {{ $t('settings.extensionSettings.button') }}
    </PrimaryButton>
  </div>
</template>

<script>
import PrimaryButton from '@/components/UI/PrimaryButton';
export default {
  name: 'ExtensionSettings',
  components: { PrimaryButton },
  props: {
    visibleClass: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    let currentDescKey = 'description';
    if (props.visibleClass == 'comingSoon') {
      currentDescKey = 'comingSoon';
    }
    return {
      currentDescKey,
    };
  },
};
</script>

<style lang="scss" scoped>
.extension-settings-card {
  @include settings-card-default;
  align-items: flex-start;
  height: auto;
  position: relative;
  z-index: 1;
  @include laptop {
    align-items: center;
  }
  &__button {
    box-shadow: 0px 0px 25px rgba(106, 75, 255, 0.3);
    @include laptop {
      margin-top: 8px;
      align-self: center;
    }
  }
}
</style>
