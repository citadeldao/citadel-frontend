<template>
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
        :error="showError ? $t('settings.changeEmail.validFormatError') : ''"
        @keypress="onKeyPressInput"
      />
    </div>
    <PrimaryButton :loading="loading" :disabled="loading" type="submit">
      {{ $t('settings.changeEmail.button') }}
    </PrimaryButton>
  </form>
</template>
<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import Input from '@/components/UI/Input';
import PrimaryButton from '@/components/UI/PrimaryButton';
export default {
  name: 'ChangeEmail',
  components: { Input, PrimaryButton },
  setup(props, { emit }) {
    const store = useStore();
    const loading = ref(false);
    const showError = ref(false);
    const checkMail = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail.value);
    const currentEmail = computed(() => store.getters['profile/info'].login);
    const newEmail = ref('');

    const changeEmailRequest = async () => {
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
        return emit('errorChangeModal');
      }
      localStorage.setItem('new-email', newEmail.value);
      loading.value = false;

      return emit('successChangeModal');
    };

    const onKeyPressInput = () => {
      showError.value = false;
    };
    return {
      loading,
      showError,
      newEmail,
      changeEmail,
      currentEmail,
      onKeyPressInput,
    };
  },
};
</script>
<style lang="scss" scoped>
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
</style>
