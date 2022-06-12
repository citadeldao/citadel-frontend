<template>
  <div class="enter-password">
    <div class="enter-password__info-banner">
      <InfoBanner
        icon="protection"
        :content="$t('createPasswordNote')"
      />
    </div>
    <form @submit.prevent="submitHandler">
      <div class="enter-password__password-input">
        <Input
          id="password"
          v-model="password"
          :label="$t('createPassword')"
          :placeholder="$t('password')"
          type="password"
          icon="key"
          :error="inputError"
          :show-error-text="false"
        />
      </div>
      <div class="enter-password__repeat-password">
        <Input
          id="repeatPassword"
          v-model="repeatPassword"
          :label="$t('confirmPassword')"
          :placeholder="$t('repeatYourPassword')"
          type="password"
          icon="key"
          :error="inputError"
        />
      </div>
      <PrimaryButton
        :disabled="!!inputError"
        data-qa="enter-password__create-button__private-key"
      >
        {{ $t("create") }}
      </PrimaryButton>
    </form>
  </div>
</template>

<script>
import Input from '@/components/UI/Input';
import PrimaryButton from '@/components/UI/PrimaryButton';
import InfoBanner from '@/components/InfoBanner';
import { inject } from 'vue';
import useCreatePassword from '@/compositions/useCreatePassword';

export default {
  name: 'CreatePassword',
  components: {
    InfoBanner,
    Input,
    PrimaryButton,
  },
  emits: ['createPassword'],
  setup(props, { emit }) {
    const nextStep = inject('nextStep');

    const { password, repeatPassword, disabled, passwordError, inputError } = useCreatePassword();

    const submitHandler = () => {
      if (passwordError.value) {
        inputError.value = passwordError.value;

        return;
      }

      emit('createPassword', password.value);
      nextStep();
    };

    return { password, submitHandler, repeatPassword, disabled, passwordError, inputError };
  },
};
</script>

<style lang="scss" scoped>
.enter-password {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
  padding-top: 80px;
  padding-left: 45px;
  @include lg {
    padding-top: 32px;
  }
  @include md {
    padding-top: 24px;
    padding-left: 25px;
  }
  & form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  &__password-input,
  &__repeat-password {
    width: 570px;
    height: 68px;
    margin-top: 32px;
    margin-bottom: 32px;
    @include lg {
      margin-top: 24px;
      margin-bottom: 24px;
    }
    @include md {
      width: 483px;
      margin-top: 15px;
      margin-bottom: 16px;
    }
  }
  &__repeat-password {
    margin-top: 0;
    @include md {
      margin-bottom: 24px;
    }
  }
   &__info-banner {
    width: 570px;
    @include md {
      width: 483px;
    }
  }
}
</style>
