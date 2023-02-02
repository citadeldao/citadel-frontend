<template>
  <div class="change-email-modal">
    <Letter />

    <div class="change-email-modal__info timer">
      <p>{{ $t(`settings.changeEmail.${stepKey}`) }}</p>
      <span v-html="$t(`settings.changeEmail.${stepKey}Description`)"></span>
    </div>

    <PrimaryButton
      v-if="!alreadyChanged"
      :loading="loading"
      :disabled="!resendActive || loading"
      class="change-email__button"
      data-qa="settings__email-button"
      @click="resend"
    >
      {{ $t('settings.changeEmail.resend') }}
    </PrimaryButton>
    <p class="count-down">{{ counter }}</p>
  </div>
</template>
<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import Letter from '@/assets/icons/settings/changeEmail/letter.svg';
import PrimaryButton from '@/components/UI/PrimaryButton';

export default {
  name: 'ChangeEmail',
  components: { PrimaryButton, Letter },
  props: {
    counter: {},
    stepKey: {},
  },
  setup(props, { emit }) {
    const TIMER_STAGE = 'timer';
    const CHANGE_STAGE = 'change';
    const currentStage = ref(CHANGE_STAGE);

    const store = useStore();

    const alreadyChanged = ref(false);

    const newEmail = ref('');

    const resendActive = ref(false);

    const loading = ref(false);
    const showError = ref(false);

    const showChange = ref(false);
    const showTimer = ref(false);

    // Translation key for showing information about timer

    // Checking the timer status to display the "timer" or "change" modal window

    // const timer = computed(() => store.getters['profile/changeEmailTimer']);

    const currentEmail = computed(() => store.getters['profile/info'].login);

    const toggleModal = async (target, state = false) => {
      // if (state) await checkTimer();

      switch (target) {
        case CHANGE_STAGE:
          showChange.value = state;
          break;

        case TIMER_STAGE:
          showTimer.value = state;
          break;

        default:
          break;
      }
    };

    const onKeyPressInput = () => {
      showError.value = false;
    };

    const checkMail = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail.value);

    const changeEmailRequest = async () => {
      if (!checkMail()) {
        return (showError.value = true);
      }

      return await store.dispatch('profile/changeEmail', newEmail.value);
    };

    // *** RESEND
    const resend = async () => {
      loading.value = true;

      const cachedValue = localStorage.getItem('new-email');

      if (!cachedValue) {
        resendActive.value = false;
        loading.value = false;
        toggleModal(TIMER_STAGE, false);
        toggleModal(CHANGE_STAGE, true);
        emit('setTimer', false);
        return emit('setChange', false);
      }

      newEmail.value = cachedValue;

      const { ok } = await changeEmailRequest();

      if (!ok) {
        resendActive.value = false;
        loading.value = false;
        newEmail.value = '';
        toggleModal(TIMER_STAGE, false);
        return emit('setTimer', false);
      }

      resendActive.value = false;
      loading.value = false;
    };
    return {
      showError,
      showChange,
      showTimer,
      loading,
      resendActive,

      toggleModal,
      onKeyPressInput,
      resend,

      currentEmail,
      newEmail,
      currentStage,
      alreadyChanged,
    };
  },
};
</script>
<style lang="scss" scoped>
.change-email-modal {
  position: relative;
  padding: 55px 0 65px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  &__info {
    text-align: center;

    p {
      font-size: $h5-size;
      font-family: 'Panton_Bold';
      margin: 40px 0 5px;
    }

    span {
      color: $red;
      font-size: $default-size;
      line-height: 1.75;
      max-width: 385px;
      display: inline-block;
    }

    &.timer > span {
      color: $mid-blue;
    }
  }

  .count-down {
    position: relative;
    color: $mid-blue;
    font-size: $h4-size;
    font-family: 'Panton_Bold';
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 72px;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    span {
      display: inline-block;
      width: 32px;
    }
  }
  .primary-button {
    margin: 25px auto 0;
  }
}
</style>
