<template>
  <div class="approve-assign-with-password">
    <div class="approve-assign-with-password__password-input">
      <Input
        id="password"
        v-model="password"
        :label="$t('enterYourPassword')"
        type="password"
        icon="key"
        :placeholder="$t('password')"
        :error="inputError"
        @keyup.enter="$emit('approveAssign')"
      />
    </div>
  </div>
</template>

<script>
import Input from '@/components/UI/Input';
import { inject, watch } from '@vue/runtime-core';
export default {
  name: 'ApproveAssignWithPassword',
  components: { Input },
  emits: ['approveAssign'],
  setup() {
    const password = inject('password');
    const inputError = inject('inputError');
    const updatePassword = inject('updatePassword');
    watch(
      () => password.value,
      (newVal) => {
        updatePassword(newVal);
      }
    );

    return { password, inputError };
  },
};
</script>

<style lang="scss" scoped>
.approve-assign-with-password {
  padding: 23px 0 0 0;
  width: 100%;
  &__password-input {
    height: 68px;
  }
}
</style>
