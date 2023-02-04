import { ref } from 'vue';

import { useI18n } from 'vue-i18n';
export default function useModalsExtensions() {
  const changeModalFlag = ref(false);
  const timerModalFlag = ref(false);

  const { t } = useI18n();
  const onSuccess = async () => {
    changeModalFlag.value = false;
  };

  const onClose = () => {
    changeModalFlag.value = false;
  };

  const onSuccess2 = () => {
    timerModalFlag.value = false;
  };

  const onClose2 = () => {
    timerModalFlag.value = false;
  };

  const showModal = () => changeModalFlag.value;
  const showModal2 = () => timerModalFlag.value;

  const modalsConfiguration = ref([
    {
      showFlag: showModal,
      title: t('settings.changeEmail.changeModalTitle'),
      desc: t('settings.changeEmail.changeModalDescription'),
      onClose: onClose,
      onSuccess: onSuccess,
    },
    {
      showFlag: showModal2,
      onClose: onClose2,
      onSuccess: onSuccess2,
    },
  ]);
  //here can be common functions

  return {
    onSuccess,
    changeModalFlag,
    timerModalFlag,
    modalsConfiguration,
  };
}
