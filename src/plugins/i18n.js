import { createI18n } from 'vue-i18n';
import { getStorage } from '../utils/storage';

const getProp = (object, path) => {
  if (path.length === 1) return object[path[0]];
  else if (path.length === 0) return;
  else {
    if (object[path[0]]) return getProp(object[path[0]], path.slice(1));
    else {
      object[path[0]] = {};
      return getProp(object[path[0]], path.slice(1));
    }
  }
};

function messageResolver(obj, path) {
  const nestedPath = path.split('.');
  const msg = getProp(obj, nestedPath);
  if (typeof msg === 'string' && msg !== '') return msg;
  return undefined;
}

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: getStorage('lang') || 'en',
  fallbackLocale: ['en'],
  messageResolver,
  messages: {
    en: require('./langs/en.json'),
    ru: require('./langs/ru.json'),
    ch: require('./langs/ch.json'),
    fr: require('./langs/fr.json'),
    jp: require('./langs/jp.json'),
  },
});
