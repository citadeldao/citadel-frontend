import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';

export default function useCreatePassword() {
  const { t } = useI18n();
  const password = ref('');
  const repeatPassword = ref('');
  const inputError = ref(false);

  const disabled = computed(() => {
    return password.value !== repeatPassword.value || password.value.length < 8;
  });

  const passwordError = computed(() => {
    if (!password.value && !repeatPassword.value) {
      return t('emptyPassword');
    }

    if (password.value !== repeatPassword.value) {
      return t('passwordsDontMatch');
    }

    if (password.value !== '' && repeatPassword.value !== '' && password.value.length < 8) {
      return t('passwordTooShort');
    }

    return '';
  });

  watch(
    [password, repeatPassword],
    () => {
      if (inputError.value) {
        inputError.value = false;
      }
    },
  );

  return {
    password,
    repeatPassword,
    disabled,
    passwordError,
    inputError,
  };
}
