<template>
  <ModalContent
    v-bind="props"
    :disabled="!!inputError || !!ivkInputError"
    v-click-away="closeHandler"
    @close="closeHandler"
    @buttonClick="confirmImportHandler"
  >
    <div v-if="loading" class="loader">
      <Loading />
    </div>
    <div class="vk-input">
      <Input
        id="importVkInput"
        v-model="ivk"
        :label="$t('viewingKey.viewingKey')"
        type="text"
        :hard-autocomplete-off="true"
        icon="key"
        :error="ivkInputError"
        @keyup.enter="confirmImportHandler"
      />
    </div>
  </ModalContent>
</template>
<script>
import { useI18n } from 'vue-i18n';
import { ref, watch, inject } from 'vue';
import ModalContent from '@/components/ModalContent';
import Loading from '@/components/Loading';
import Input from '@/components/UI/Input';
export default {
  name: 'ImportVkModal',
  components: { ModalContent, Loading, Input },
  props: {
    title: {
      type: String,
    },
    desc: {
      type: String,
    },
    buttonText: {
      type: String,
    },
    type: {
      type: String,
    },
    ivkInputError: {
      type: String,
    },
    loading: {
      type: Boolean,
    },
  },
  setup(props, { emit }) {
    const { t } = useI18n();
    const ivk = ref('');
    const ivkInputError = ref('');
    const inputError = inject('inputError');
    const confirmImportHandler = async () => {
      if (!ivk.value) {
        return (ivkInputError.value = t('viewingKey.incorrectKey'));
      }
      emit('buttonClick', ivk.value);
    };
    const closeHandler = async () => {
      emit('close');
    };
    watch(
      () => ivk.value,
      () => {
        ivkInputError.value = '';
      }
    );
    return {
      ivk,
      closeHandler,
      props,
      inputError,
      confirmImportHandler,
      //   ivk,
      //   confirmImportHandler,
    };
  },
};
</script>
<style lang="scss">
.vk-input {
  height: 68px;
  margin-top: 19px;
  width: 100%;
}
.loader {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background: white;
  z-index: 10;
}
</style>
