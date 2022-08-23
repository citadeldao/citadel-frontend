<template>
  <div class="verification">
    <span class="verification__title">
      {{ $t('login.verification') }}
    </span>
    <span class="verification__info">
      {{ $t('login.verificationInfo') }}
    </span>
    <div class="verification__input">
      <div class="verification__input-input">
        <VerificationInput
          v-if="renderComponent"
          v-model:code="code"
          :loading="false"
          :error="error"
          @paste="pasteHandler"
          @keypress.enter="submitHandler"
        />
      </div>
      <button
        :disabled="timerMode"
        data-qa="login-verification__resend-code"
        @click="sendCode"
      >
        <span v-if="timerMode" class="verification__timer">
          {{ time }}s
          <span>{{ $t('login.resend') }}</span>
        </span>
        <span v-if="showResendCode">
          {{ $t('login.resendCode') }}
        </span>
        <span v-if="!timerMode && !showResendCode">
          {{ $t('login.sendCode') }}
        </span>
      </button>
    </div>
    <span class="verification__note">
      {{ $t('login.verificationNote') }}
    </span>
    <PrimaryButton
      @click="submitHandler"
      id="codeSubmitButton"
      formId="verificationForm"
      data-qa="login-verification__confirm-button"
      :disabled="code.length < 6"
    >
      {{ $t('confirm') }}
    </PrimaryButton>
    <div class="verification__back-link">
      <TextButton data-qa="login-verification__back-button" @click="back">
        {{ $t('backBtn') }}
      </TextButton>
    </div>
  </div>
</template>

<script>
import { ref, inject, watch, nextTick, onMounted } from 'vue';
import TextButton from '@/components/UI/TextButton';
import PrimaryButton from '@/components/UI/PrimaryButton';
import VerificationInput from '@/components/UI/VerificationInput.vue';

export default {
  name: 'Verification',
  components: { PrimaryButton, TextButton, VerificationInput },
  props: {
    error: {
      type: String,
      default: '',
    },
  },
  emits: ['verification', 'sendVerificationCode', 'change'],
  setup(props, { emit }) {
    const previousStep = inject('previousStep');
    const code = ref('');
    const time = ref(60);
    const timerMode = ref(false);
    const showResendCode = ref(false);

    const back = () => {
      emit('cancelVerification');
      previousStep();
    };
    const sendCode = () => {
      if (showResendCode.value) {
        emit('sendVerificationCode');
        timerMode.value = true;
        const interval = setInterval(() => {
          if (time.value <= 0) {
            clearInterval(interval);
            time.value = 60;
            timerMode.value = false;
          } else {
            time.value -= 1;
          }
        }, 1000);
      } else {
        timerMode.value = true;
        const interval = setInterval(() => {
          if (time.value <= 0) {
            clearInterval(interval);
            time.value = 60;
            timerMode.value = false;
          } else {
            time.value -= 1;
          }
        }, 1000);
      }
    };
    sendCode();
    onMounted(() => {
      nextTick(() => {
        document.getElementById('codeSubmitButton').focus();
      });
    });
    watch(
      () => timerMode.value,
      (value) => {
        if (value) {
          showResendCode.value = false;
        } else {
          showResendCode.value = true;
        }
      },
      { immediate: true }
    );

    watch(code, (value) => {
      emit('change', value);
      if (value.length === 6 && timerMode.value) {
        nextTick(() => {
          document.getElementById('codeSubmitButton').focus();
        });
      }
    });

    const submitHandler = () => {
      if (code.value.length === 6) {
        emit('verification', code.value);
      }
    };
    const renderComponent = ref(true);
    const pasteHandler = async () => {
      const text = await navigator.clipboard.readText();
      code.value = text.trim();
      renderComponent.value = false;
      nextTick(() => {
        renderComponent.value = true;
      });
    };

    return {
      submitHandler,
      back,
      time,
      sendCode,
      timerMode,
      showResendCode,
      code,
      pasteHandler,
      renderComponent,
    };
  },
};
</script>

<style lang="scss" scoped>
.verification {
  width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 55px 60px 60px 60px;
  background: $white;
  // box-shadow: -10px 4px 50px rgba(0, 0, 0, 0.1);
  border-radius: 25px;
  margin-bottom: 46px;
  @include lg {
    margin-bottom: 30px;
  }
  @include md {
    padding: 36px 36px 42px 36px;
    width: 552px;
    margin-bottom: 30px;
  }

  &__title {
    font-family: 'Panton_Bold';
    font-size: 35px;
    line-height: 42px;
    margin-bottom: 16px;
    text-align: center;
    @include md {
      font-size: 25px;
      line-height: 30px;
      margin-bottom: 5px;
    }
  }

  &__info {
    font-size: 16px;
    line-height: 27px;
    color: $mid-blue;
    margin-bottom: 22px;
    text-align: center;
    @include md {
      margin-bottom: 18px;
    }
  }

  &__input {
    width: 100%;
    height: 68px;
    margin-bottom: 24px;
    display: flex;

    & button {
      width: 120px;
      height: 100%;
      background: $ligth-blue;
      border-radius: 8px;
      color: $white;

      & span {
        font-size: 16px;
        line-height: 19px;
        font-family: 'Panton_Bold';
      }

      &:disabled,
      & [disabled] {
        background: $too-ligth-gray;
        border-radius: 8px;
      }
    }
  }

  &__input-input {
    flex-grow: 1;
    height: 68px;
    margin-right: 8px;
  }

  &__timer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: $darkgray;

    & span {
      color: $too-ligth-blue;
    }
  }

  &__note {
    font-size: 12px;
    line-height: 27px;
    color: $darkgray;
    margin-bottom: 26px;
    align-self: flex-start;
  }

  &__back-link {
    margin-top: 21px;
  }
}
</style>
