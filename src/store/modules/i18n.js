import { setStorage, getStorage } from '@/utils/storage.js';

const types = {
  SET_LOCALE: 'SET_LOCALE',
};

export default {
  state: () => ({
    locale: getStorage('lang') || 'en',
    locales: [
      { label: 'English', key: 'en' },
      { label: 'Русский (Russian)', key: 'ru' },
      { label: '中文 (Chinese)', key: 'ch' },
      { label: '日本 (Japanese)', key: 'jp' },
      { label: 'Français (French)', key: 'fr' },
    ],
  }),

  getters: {
    locale: (state) => state.locale,
    locales: (state) => state.locales,
  },

  actions: {
    init({ commit, state }) {
      commit(types.SET_LOCALE, state.locale);
    },
    setLocale({ commit }, locale) {
      commit(types.SET_LOCALE, locale);
    },
  },

  mutations: {
    [types.SET_LOCALE](state, value) {
      state.locale = value;
      setStorage('lang', value);
    },
  },
  namespaced: true,
};
