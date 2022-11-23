<template>
  <div class="extension-settings-card">
    <h5 class="extension-settings-card__title">
      {{ $t('settings.extensionSettings.title') }}
    </h5>
    <div class="settings-wrap">
      <span class="extension-settings-card__description">
        {{ $t(`settings.extensionSettings.${currentDescKey}`) }}
      </span>

      <PrimaryButton
        class="extension-settings-card__button"
        @click="$router.push({ name: 'ExtensionsSettings' })"
      >
        {{ $t('settings.extensionSettings.button') }}
      </PrimaryButton>
    </div>
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
    .settings-wrap {
      flex-direction: column;
      span {
        width: 100%;
        text-align: center;
        margin: 5px 0 10px;
      }
    }
  }
  &__button {
    box-shadow: 0px 0px 25px rgba(106, 75, 255, 0.3);
    margin: auto 0 0 auto;
    @include laptop {
      margin: 10px auto 0;
      align-self: center;
    }
  }
}
</style>
