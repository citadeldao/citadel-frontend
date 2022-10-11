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
        class="change-email__button"
        data-qa="settings__email-button"
        @click="toggleModal('change', true)"
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
        <PrimaryButton :loading="loading" :disabled="loading" type="submit">
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
          <p>{{ $t('settings.changeEmail.lastStep') }}</p>
          <span v-html="$t('settings.changeEmail.lastStepDescription')"></span>
        </div>
        <PrimaryButton
          :loading="loading"
          :disabled="!resendActive || loading"
          class="change-email__button"
          data-qa="settings__email-button"
          @click="resend"
        >
          {{ $t('settings.changeEmail.resend') }}
        </PrimaryButton>

        <p v-if="countDown > 0" class="count-down">00:{{ countDown }}</p>
      </div>
    </ModalContent>
  </Modal>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

import PrimaryButton from '@/components/UI/PrimaryButton';
import Modal from '@/components/Modal';
import ModalContent from '@/components/ModalContent';
import Input from '@/components/UI/Input';

import Letter from '@/assets/icons/settings/changeEmail/letter.svg';

export default {
  name: 'ChangeEmail',
  components: { PrimaryButton, Modal, ModalContent, Input, Letter },
  setup() {
    const MINUTE = 60;

    const store = useStore();
    const currentEmail = computed(() => store.getters['profile/info'].login);
    const newEmail = ref('');

    const countDown = ref(MINUTE);
    const resendActive = ref(false);

    const loading = ref(false);
    const showError = ref(false);

    const showChange = ref(false);
    const showTimer = ref(false);

    const toggleModal = (target, state = false) => {
      switch (target) {
        case 'change':
          showChange.value = state;
          break;
        case 'timer':
          showTimer.value = state;
          if (state) countDownTimer();
          break;
        default:
          break;
      }
    };

    const onKeyPressInput = () => {
      showError.value = false;
    };

    const changeEmailRequest = async () => {
      const checkMail = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail.value);

      if (!checkMail()) {
        return (showError.value = true);
      }

      return await store.dispatch('profile/changeEmail', newEmail.value);
    };

    const changeEmail = async () => {
      loading.value = true;
      showError.value = false;

      const { ok } = await changeEmailRequest();

      if (!ok) {
        loading.value = false;
        newEmail.value = '';
        return toggleModal('change', false);
      }

      loading.value = false;
      toggleModal('change', false);
      toggleModal('timer', true);
    };

    const countDownTimer = () => {
      if (countDown.value < 10) countDown.value = `0${countDown.value}`;

      if (countDown.value > 0) {
        return setTimeout(() => {
          countDown.value -= 1;
          countDownTimer();
        }, 1000);
      }

      resendActive.value = true;
    };

    const resend = async () => {
      loading.value = true;
      const { ok } = await changeEmailRequest();

      if (!ok) {
        resendActive.value = false;
        loading.value = false;
        newEmail.value = '';
        return toggleModal('timer', false);
      }

      countDown.value = MINUTE;

      resendActive.value = false;
      loading.value = false;

      countDownTimer();
    };

    return {
      showError,
      showChange,
      showTimer,
      loading,
      countDown,
      resendActive,

      toggleModal,
      changeEmail,
      onKeyPressInput,
      countDownTimer,
      resend,

      currentEmail,
      newEmail,
    };
  },
};
</script>

<style lang="scss" scoped>
.change-email {
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
    color: $mid-blue;
    font-size: $h4-size;
    font-family: 'Panton_Bold';
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
  .primary-button {
    margin: 25px auto 0;
  }
}
</style>
