<template>
  <div class="change-password-card" :class="visibleClass">
    <h5 class="change-password-card__title">
      {{ $t('settings.changePassword.title') }}
      <Tooltip :text="$t('settings.changePassword.tooltip')">
        <Info></Info>
      </Tooltip>
    </h5>
    <span class="change-password-card__description">
      {{ $t(`settings.changePassword.${currentDescKey}`) }}
    </span>

    <PrimaryButton
      :disabled="true"
      class="change-password-card__button"
      data-qa="settings__email-button"
    >
      {{ $t('settings.changePassword.button') }}
    </PrimaryButton>
  </div>
</template>

<script>
import PrimaryButton from '@/components/UI/PrimaryButton';
import Tooltip from '@/components/UI/Tooltip';
import Info from '@/assets/icons/info.svg';

export default {
  name: 'ChangePassword',
  components: { PrimaryButton, Tooltip, Info },
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
.change-password-card {
  @include settings-card-default;
  &__title {
    display: flex;
    align-items: center;
  }
}
</style>
