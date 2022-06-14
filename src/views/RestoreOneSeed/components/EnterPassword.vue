<template>
  <div class="enter-password">
    <div class="enter-password__info-banner">
      <InfoBanner icon="protection" :content="$t('enterPasswordNote')" />
    </div>
    <form @submit.prevent="submitHandler">
      <div class="enter-password__password-input">
        <Input
          id="password"
          v-model="password"
          :label="$t('enterPassword')"
          type="password"
          icon="key"
          :placeholder="$t('password')"
          :error="inputError"
        />
      </div>
      <PrimaryButton :disabled="!!inputError">
        {{ $t('next') }}
      </PrimaryButton>
    </form>
  </div>
</template>

<script>
import Input from '@/components/UI/Input';
import PrimaryButton from '@/components/UI/PrimaryButton';
import InfoBanner from '@/components/InfoBanner';
import { inject } from 'vue';
import useCheckPassword from '@/compositions/useCheckPassword';
import { useStore } from 'vuex';

export default {
  name: 'EnterPassword',
  components: {
    InfoBanner,
    Input,
    PrimaryButton,
  },
  emits: ['passwordConfirmed'],
  setup(props, { emit }) {
    const store = useStore();
    const { password, passwordIncorrect, passwordError, inputError } =
      useCheckPassword();

    const nextStep = inject('nextStep');
    const submitHandler = () => {
      if (passwordError.value) {
        inputError.value = passwordError.value;

        return;
      }

      emit('passwordConfirmed', password.value);
      nextStep();
    };

    // migration auto set password block and go to input mnemonic
    if (store.getters['crypto/migrationPassword']) {
      password.value = store.getters['crypto/migrationPassword'];
      store.commit('crypto/setMigrationPassword', null);
      submitHandler();
    }

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
  padding-top: 80px;
  padding-left: 45px;
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
