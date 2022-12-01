import store from '@/store';
import { i18n } from '@/plugins/i18n';
import customErrors from '@/helpers/customErrors';

const { t } = i18n.global;

const getCustomMessage = (error) => {
  let message = error;

  for (const key in customErrors) {
    if (
      error.message &&
      customErrors[key].find((check) => error.message.includes(check))
    ) {
      message = t(key);
      return message;
    }
  }
  return message;
};

export default (params = {}) => {
  const defaultParams = {
    warning: {
      title: t('error'),
    },
    info: {
      title: t('info'),
    },
    success: {
      title: t('success'),
    },
  };

  const getParams = (params) => {
    const type = params.type || 'warning';
    const title = params.title || defaultParams[type].title;
    const text = getCustomMessage(params.text);
    const hash = params.hash || '';
    const duration = params.duration || 3000;

    return {
      id: (+new Date()).toString(36),
      type,
      title,
      text,
      hash,
      duration,
    };
  };

  store.dispatch('toasts/addToast', getParams(params));
};
