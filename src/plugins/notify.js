import store from '@/store';
import { i18n } from '@/plugins/i18n';
const { t } = i18n.global;

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
    const type =  params.type || 'warning';
    const title = params.title || defaultParams[type].title;
    const text = params.text || defaultParams[type].text;
    const hash = params.hash || '';
    const duration = params.duration || 3000;

    return {
      id: (+new Date).toString(36),
      type,
      title,
      text,
      hash,
      duration,
    };
  };

  store.dispatch('toasts/addToast', getParams(params));
};
