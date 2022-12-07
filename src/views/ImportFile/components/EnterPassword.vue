<template>
  <div class="enter-password">
    <div class="enter-password__info-banner">
      <InfoBanner icon="protection" :content="$t('enterPasswordBackup')" />
    </div>
    <form
      @submit.prevent="submitHandler"
      :class="{ noPassword: !passwordHash }"
    >
      <div v-if="passwordHash" class="enter-password__password-input">
        <Input
          id="password"
          v-model="password"
          :label="$t('enterPasswordBackupLabel')"
          type="password"
          icon="key"
          :placeholder="$t('password')"
          :error="inputError"
        />
      </div>
      <PrimaryButton :disabled="!!inputError" data-qa="Next">
        {{ $t('next') }}
      </PrimaryButton>
    </form>
  </div>
</template>

<script>
import Input from '@/components/UI/Input';
import PrimaryButton from '@/components/UI/PrimaryButton';
import InfoBanner from '@/components/InfoBanner';
import useCheckPassword from '@/compositions/useCheckPassword';

export default {
  name: 'EnterPassword',
  components: {
    InfoBanner,
    Input,
    PrimaryButton,
  },
  props: {
    passwordHash: {
      type: String,
    },
  },
  emits: ['passwordConfirmed'],
  setup(props, { emit }) {
    const submitHandler = () => {
      if (props.passwordHash && passwordError.value) {
        inputError.value = passwordError.value;

        return;
      }

      emit('passwordConfirmed', password.value);
    };
    const { password, passwordIncorrect, passwordError, inputError } =
      useCheckPassword(props.passwordHash);

    return {
      password,
      submitHandler,
      passwordIncorrect,
      passwordError,
      inputError,
    };
  },
};
</script>

<style lang="scss" scoped>
.enter-password {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
  padding-top: 48px;
  padding-left: 45px;

  .noPassword {
    margin-top: 25px;
  }

  @include lg {
    padding-top: 32px;
  }
  @include md {
    padding-top: 24px;
    padding-left: 25px;
  }
  &__info-banner {
    width: 570px;
    @include md {
      width: 483px;
    }
  }
  & form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  &__password-input {
    width: 570px;
    height: 68px;
    margin-top: 32px;
    margin-bottom: 32px;
    @include md {
      width: 483px;
    }
  }
}
</style>
