<template>
  <div class="change-email">
    <h5 class="change-email__title">
      {{ $t('settings.changeEmail.title') }}
    </h5>
    <div class="settings-wrap">
      <span class="change-email__description">
        {{ $t(`settings.changeEmail.description`) }}
      </span>

      <PrimaryButton
        width="120px"
        class="change-email__button"
        data-qa="settings__email-button"
        @click="toggleModal(currentStage, true)"
      >
        {{ $t('settings.changeEmail.button') }}
      </PrimaryButton>
    </div>
  </div>

  <Modal v-if="showChange">
    <ModalContent
      class="change-email__modal-content"
      v-click-away="() => toggleModal('change', false)"
      @close="toggleModal('change', false)"
      :title="$t('settings.changeEmail.changeModalTitle')"
      :desc="$t('settings.changeEmail.changeModalDescription')"
    >
      <form @submit.prevent="changeEmail">
        <div class="input-wrapper">
          <Input
            id="old-email"
            :disabled="true"
            v-model="currentEmail"
            :label="$t('settings.changeEmail.oldEmail')"
            :placeholder="$t('settings.changeEmail.emailPlaceholder')"
            type="email"
            icon="mail"
            :value="currentEmail"
          />
        </div>
        <div class="input-wrapper">
          <Input
            id="new-email"
            v-model="newEmail"
            :label="$t('settings.changeEmail.newEmail')"
            :placeholder="$t('settings.changeEmail.emailPlaceholder')"
            type="email"
            icon="mail"
            :show-error-text="true"
            :error="
              showError ? $t('settings.changeEmail.validFormatError') : ''
            "
            @keypress="onKeyPressInput"
          />
        </div>
        <PrimaryButton
          :loading="loading"
          :disabled="loading || !newEmail.length"
          type="submit"
        >
          {{ $t('settings.changeEmail.button') }}
        </PrimaryButton>
      </form>
    </ModalContent>
  </Modal>

  <!-- TIMER MODAL -->
  <Modal v-if="showTimer">
    <ModalContent
      v-click-away="() => toggleModal('timer', false)"
      @close="toggleModal('timer', false)"
    >
      <div class="change-email-modal">
        <Letter />

        <div class="change-email-modal__info timer">
          <p>{{ $t(`settings.changeEmail.${stepKey}`) }}</p>
          <span
            v-html="$t(`settings.changeEmail.${stepKey}Description`)"
          ></span>
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
    </ModalContent>
  </Modal>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

import moment from 'moment';

import PrimaryButton from '@/components/UI/PrimaryButton';
import Modal from '@/components/Modal';
import ModalContent from '@/components/ModalContent';
import Input from '@/components/UI/Input';

import Letter from '@/assets/icons/settings/changeEmail/letter.svg';

export default {
  name: 'ChangeEmail',
  components: { PrimaryButton, Modal, ModalContent, Input, Letter },
  setup() {
    const TIMER_STAGE = 'timer';
    const CHANGE_STAGE = 'change';

    const currentStage = ref(CHANGE_STAGE);

    const store = useStore();

    const alreadyChanged = ref(false);

    const newEmail = ref('');
    const counter = ref('60:00');

    const resendActive = ref(false);

    const loading = ref(false);
    const showError = ref(false);

    const showChange = ref(false);
    const showTimer = ref(false);

    // Translation key for showing information about timer
    const stepKey = ref('lastStep');

    // Checking the timer status to display the "timer" or "change" modal window
    const checkTimer = async () => {
      const {
        attemptsLeft,
        timer,
        wasChanged = false,
      } = await store.dispatch('profile/changeEmailInfo');

      if (timer) {
        currentStage.value = TIMER_STAGE;

        stepKey.value = wasChanged ? 'tryAgainLater' : 'lastStep';

        alreadyChanged.value = wasChanged;

        timerState(timer, attemptsLeft);
        return;
      }

      currentStage.value = CHANGE_STAGE;
    };

    onMounted(async () => await checkTimer());

    const timer = computed(() => store.getters['profile/changeEmailTimer']);

    const currentEmail = computed(() => store.getters['profile/info'].login);

    const toggleModal = async (target, state = false) => {
      if (state) await checkTimer();

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

    // *** CHANGE EMAIL REQUEST
    const changeEmail = async () => {
      loading.value = true;
      showError.value = false;

      const { ok } = await changeEmailRequest();

      if (!ok) {
        loading.value = false;
        newEmail.value = '';
        toggleModal(CHANGE_STAGE, false);
        return;
      }

      localStorage.setItem('new-email', newEmail.value);
      loading.value = false;

      currentStage.value = TIMER_STAGE;

      toggleModal(CHANGE_STAGE, false);
      toggleModal(TIMER_STAGE, true);
      timerState();
    };

    // *** TIMER
    const timerState = (time = 60, attempts) => {
      clearInterval(timer.value);
      const ONE_SEC = 1000;

      let duration = moment.duration(time, 'minutes');

      const countDownStart = setInterval(() => {
        if (duration.asSeconds() <= 1) {
          resendActive.value = attempts > 0 ?? true;
          return;
        }

        duration = moment.duration(
          duration.asMilliseconds() - ONE_SEC,
          'milliseconds'
        );

        counter.value = moment(duration.asMilliseconds()).format('mm:ss');
      }, ONE_SEC);

      store.commit('profile/SET_CHANGE_EMAIL_TIMER', countDownStart);
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
        return;
      }

      newEmail.value = cachedValue;

      const { ok } = await changeEmailRequest();

      if (!ok) {
        resendActive.value = false;
        loading.value = false;
        newEmail.value = '';

        return toggleModal(TIMER_STAGE, false);
      }

      resendActive.value = false;
      loading.value = false;

      return await checkTimer();
    };

    return {
      showError,
      showChange,
      showTimer,
      loading,
      resendActive,

      toggleModal,
      changeEmail,
      onKeyPressInput,
      resend,

      currentEmail,
      newEmail,
      currentStage,
      counter,
      alreadyChanged,
      stepKey,
    };
  },
};
</script>

<style lang="scss" scoped>
.change-email {
  height: 100%;
  @include settings-card-default;
  margin-bottom: $card-margin;

  &__modal-content {
    form {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .input-wrapper {
      width: 100%;
      height: 70px;
      margin-top: 25px;
    }
    .primary-button {
      margin: 45px auto 0;
    }
  }
}

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
