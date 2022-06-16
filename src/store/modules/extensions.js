import useApi from '@/api/useApi';
const extensionsApi = useApi('extensions');
import axios from 'axios';

const APP_DOMEN =
  'https://api-extensions-service.apps.citadel.okd.3ahtim54r.ru';

const types = {
  SET_CURRENT_APP_INFO: 'SET_CURRENT_APP_INFO',
  SET_TRANSACTION_FOR_SIGN: 'SET_TRANSACTION_FOR_SIGN',
  SET_MESSAGE_FOR_SIGN: 'SET_MESSAGE_FOR_SIGN',
  SET_EXTENSIONS_LIST: 'SET_EXTENSIONS_LIST',
};

export default {
  namespaced: true,
  state: () => ({
    currentAppInfo: null,
    extensionTransactionForSign: null,
    extensionMessageForSign: null,
    extensionsList: [],
  }),
  getters: {
    currentAppInfo: (state) => state.currentAppInfo,
    extensionTransactionForSign: (state) => state.extensionTransactionForSign,
    extensionMessageForSign: (state) => state.extensionMessageForSign,
    extensionsList: (state) => state.extensionsList,
  },
  mutations: {
    [types.SET_CURRENT_APP_INFO](state, value) {
      state.currentAppInfo = value;
    },
    [types.SET_TRANSACTION_FOR_SIGN](state, value) {
      state.extensionTransactionForSign = value;
    },
    [types.SET_MESSAGE_FOR_SIGN](state, value) {
      state.extensionMessageForSign = value;
    },
    [types.SET_EXTENSIONS_LIST](state, value) {
      state.extensionsList = value;
    },
  },
  actions: {
    async sendCustomMsg(_, { token, message, type }) {
      // eslint-disable-next-line no-unused-vars
      const res = await axios({
        method: 'post',
        url: `${APP_DOMEN}/customMsg?token=${token}`,
        data: {
          to: 'app',
          from: 'main-front',
          type,
          toDeviceId: token,
          message,
        },
      });
    },
    async fetchExtensionsList({ commit }) {
      const { ok, data } = await extensionsApi.getExtensionsList();

      if (ok) {
        commit(types.SET_EXTENSIONS_LIST, data);
      }
    },
    async fetchExtensionInfo({ commit }, { appId }) {
      const { ok, data } = await extensionsApi.getExtensionsInfo({ appId });

      if (ok) {
        commit(types.SET_CURRENT_APP_INFO, data);
      }
    },
  },
};
