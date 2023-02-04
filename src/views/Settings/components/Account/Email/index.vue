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
  <DynamicModal :modal-items="modalsConfiguration">
    <ChangeModal
      v-if="modalsConfiguration[0].showFlag()"
      @successChangeModal="successChangeModal"
    ></ChangeModal>
    <TimerModal
      :counter="counter"
      v-if="modalsConfiguration[1].showFlag()"
      :stepKey="stepKey"
    ></TimerModal>
  </DynamicModal>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import moment from 'moment';
import DynamicModal from '@/components/DynamicModal';
import PrimaryButton from '@/components/UI/PrimaryButton';
import ChangeModal from './Modals/ChangeModal.vue';
import TimerModal from './Modals/TimerModal.vue';
//compose
import useModalsExtensions from './Modals/useModals';
export default {
  name: 'ChangeEmail',
  components: { PrimaryButton, ChangeModal, TimerModal, DynamicModal },
  setup() {
    const successChangeModal = async function () {
      changeModalFlag.value = false;
      await checkTimer();
      timerModalFlag.value = true;
    };
    const store = useStore();
    const { changeModalFlag, timerModalFlag, modalsConfiguration } =
      useModalsExtensions();
    const TIMER_STAGE = 'timer';
    const CHANGE_STAGE = 'change';
    const currentStage = ref(CHANGE_STAGE);
    const stepKey = ref('lastStep');
    const alreadyChanged = ref(false);
    const MINUTE = 60;
    const countDown = ref(MINUTE);
    const resendActive = ref(false);
    const showChange = ref(false);
    const showTimer = ref(false);
    const counter = ref('60:00');

    const checkTimer = async () => {
      const {
        attemptsLeft = 0,
        timer = 0,
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

    const timer = computed(() => store.getters['profile/changeEmailTimer']);

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
    onMounted(async () => await checkTimer());

    const toggleModal = (target, state = false) => {
      switch (target) {
        case 'change':
          changeModalFlag.value = state;
          break;
        case 'timer':
          timerModalFlag.value = state;

          if (state && countDown.value === MINUTE) {
            countDownTimer();
          }

          break;
        default:
          break;
      }
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
    return {
      modalsConfiguration,
      showChange,
      showTimer,
      resendActive,
      toggleModal,
      currentStage,
      counter,
      alreadyChanged,
      stepKey,
      successChangeModal,
    };
  },
};
</script>

<style lang="scss" scoped>
.change-email {
  height: 100%;
  @include settings-card-default;
  margin-bottom: $card-margin;
}
</style>
