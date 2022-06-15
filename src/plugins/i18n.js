import { createI18n } from 'vue-i18n';
import { getStorage } from '../utils/storage';

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: getStorage('lang') || 'en',
  fallbackLocale: ['en'],
  messages: {
    en: require('./langs/en.json'),
    ru: require('./langs/ru.json'),
    ch: require('./langs/ch.json'),
  },
});
