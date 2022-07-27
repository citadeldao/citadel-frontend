<template>
  <div class="change-email" :class="currentDescKey">
    <h5 class="change-email__title">
      {{ $t('settings.changeEmail.title') }}
    </h5>
    <div class="settings-wrap">
      <span class="change-email__description">
        {{ $t(`settings.changeEmail.${currentDescKey}`) }}
      </span>

      <PrimaryButton
        :disabled="true"
        class="change-email__button"
        data-qa="settings__email-button"
        @click="clickHandler"
      >
        {{ $t('settings.changeEmail.button') }}
      </PrimaryButton>
    </div>

    <!-- <div class="change-email__input"> -->
    <!-- <Input
          id="email"
          v-model="email"
          :label="$t('settings.changeEmail.inputLabel')"
          type="text"
          icon="mail"
          disabled
          :placeholder="$t('settings.changeEmail.inputPlaceHolder')"
          data-qa="settings__email-field"
        /> -->
    <!-- </div> -->
  </div>
</template>

<script>
import PrimaryButton from '@/components/UI/PrimaryButton';
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
export default {
  name: 'ChangeEmail',
  components: { PrimaryButton },
  props: {
    visibleClass: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const store = useStore();
    const currentEmail = computed(() => store.getters['profile/info'].login);
    const email = ref(currentEmail.value);
    const clickHandler = () => {};
    let currentDescKey = 'description';
    if (props.visibleClass == 'comingSoon') {
      currentDescKey = 'comingSoon';
    }
    return { clickHandler, email, currentDescKey };
  },
};
</script>

<style lang="scss" scoped>
.change-email {
  @include settings-card-default;
}
</style>
