<template>
  <form class="login-form" @submit.prevent="submitHandler">
    <span class="login-form__title">
      {{ $t('login.login') }} / {{ $t('login.signup') }}
    </span>
    <span class="login-form__info">
      {{ $t('login.formInfo') }}
    </span>
    <div class="login-form__input">
      <Input
        id="email"
        v-model.trim="email"
        :label="$t('yourE-mail')"
        type="text"
        icon="mail"
        :disabled="disabled"
        :placeholder="$t('login.inputPlaceholder')"
        :error="emailError"
        data-qa="login__email"
        @blur="blurHandler"
      />
    </div>
    <PrimaryButton :disabled="disabled" data-qa="login__sign-in-button">
      {{ $t('login.signIn') }}
    </PrimaryButton>

    <div class="login-form-social">
      <div class="login-form-social__description">
        <span>
          {{ $t('login.withSocial') }}
        </span>
      </div>
      <div class="login-form-social__buttons">
        <SocialButton
          v-for="item in socialButtons"
          :key="item.icon"
          :icon="item.icon"
          :disabled="item.disabled"
          @click="$emit('socialClick', item.icon)"
        />
      </div>
    </div>
  </form>
</template>

<script>
import { ref } from 'vue';
import Input from '@/components/UI/Input';
import SocialButton from '@/components/UI/SocialButton';
import PrimaryButton from '@/components/UI/PrimaryButton';
import { useI18n } from 'vue-i18n';
import { validateEmail } from '@/helpers/validators';

const socialButtons = [
  {
    icon: 'facebook',
    disabled: true,
  },
  {
    icon: 'apple',
  },
  {
    icon: 'google',
  },
  {
    icon: 'linkedin',
  },
];
export default {
  name: 'LoginForm',
  components: { Input, SocialButton, PrimaryButton },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emit: ['formSubmit', 'socialClick', 'sendVerificationCode'],
  setup(props, { emit }) {
    const { t } = useI18n();
    const email = ref('');
    const emailError = ref(null);
    const checkEmailError = (email, checkEmpty = true) => {
      if (checkEmpty && !email) {
        return t('login.enterEmail');
      }

      if (email && !validateEmail(email)) {
        return t('login.incorrectEmail');
      }

      return null;
    };

    const blurHandler = () => {
      emailError.value = checkEmailError(email.value, false);
    };

    const submitHandler = () => {
      emailError.value = checkEmailError(email.value);

      if (emailError.value) {
        return;
      }

      emit('formSubmit', email.value);
      // setTimeout(() => {
      //   emit('sendVerificationCode');
      // }, 500);
    };

    return { email, socialButtons, submitHandler, emailError, blurHandler };
  },
};
</script>

<style lang="scss" scoped>
.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 55px 60px 10px 60px;
  background: $white;
  box-shadow: -10px 4px 50px rgba(0, 0, 0, 0.1);
  border-radius: 25px;
  margin-bottom: 15px;
  @include lg {
    margin-bottom: 15px;
  }
  @include md {
    padding: 36px 36px 42px 36px;
    margin-bottom: 15px;
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
    margin-bottom: 26px;
    @include md {
      margin-bottom: 18px;
    }
  }

  &__input {
    width: 100%;
    height: 68px;
    margin-bottom: 24px;
  }

  &-social {
    width: 100%;

    &__description {
      position: relative;
      display: flex;
      justify-content: center;
      margin: 31px 0 20px;

      span {
        color: $mid-blue;
        font-size: 16px;
        line-height: 27px;
        padding: 0 10px;
        background-color: $white;
        z-index: 1;

        &::before,
        &::after {
          content: '';
          position: absolute;
          height: 1px;
          top: 50%;
          left: 0;
          right: 72%;
          border-top: 1px solid $too-ligth-blue;
        }

        &::after {
          left: 72%;
          right: 0;
        }
      }
    }

    &__buttons {
      display: flex;
      justify-content: space-between;

      button {
        display: block;

        &:not(:last-child) {
          margin-right: 8px;
        }
      }
    }
  }
}
</style>
