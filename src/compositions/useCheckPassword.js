import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { sha3_256 } from 'js-sha3';
import { useI18n } from 'vue-i18n';

export default function useCheckPassword(oldHash) {
  const { t } = useI18n();
  const store = useStore();
  const password = ref('');
  const hash = oldHash || store.getters['crypto/passwordHash'];

  const passwordIncorrect = computed(() => {
    return sha3_256(password.value) !== hash;
  });
  const passwordError = computed(() => passwordIncorrect.value && t('incorrectPassword'));
  const inputError = ref(false);

  watch(
    () => password.value,
    () => {
      if (inputError.value) {
        inputError.value = false;
      }
    },
  );

  return {
    password,
    passwordIncorrect,
    passwordError,
    inputError,
  };
}
