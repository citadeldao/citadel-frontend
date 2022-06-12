<template>
  <div class="approve-export">
    <div class="approve-export__input">
      <Input
        id="address"
        v-model="address"
        :label="$t('address')"
        type="text"
        :icon="currentExportWallet.net"
        :disabled="true"
        :placeholder="$t('password')"
        data-qa="settings__export__address-field"
      />
    </div>
    <div class="approve-export__password-input">
      <Input
        id="password"
        v-model="password"
        :label="$t('enterYourCitadelPassword')"
        type="password"
        icon="key"
        :placeholder="$t('password')"
        :error="inputError"
        data-qa="settings__export__password-field"
        @keyup.enter="$emit('approveExport')"
      />
    </div>
  </div>
</template>

<script>
import Input from '@/components/UI/Input';
import { inject, ref, watch } from '@vue/runtime-core';
export default {
  name: 'ApproveExport',
  components: { Input },
  props: {
    currentExportWallet: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['approveExport'],
  setup(props) {
    const address = ref(props.currentExportWallet.address);
    const password = inject('password');
    const inputError = inject('inputError');
    const updatePassword = inject('updatePassword');
    watch(
      () => password.value,
      (newVal) => {
        updatePassword(newVal);
      },
    );

    return { password, inputError, address };
  },
};
</script>
<style lang="scss" scoped>
.approve-export {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 23px;
  &__input,
  &__password-input {
    height: 68px;
  }
  &__input {
    margin-bottom: 24px;
  }
}
</style>