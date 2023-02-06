import useApi from '@/api/useApi';
const extensionsApi = useApi('extensions');
import axios from 'axios';
// import { multisendLocalApp } from '@/views/Extensions/config';

const APP_DOMEN = process.env.VUE_APP_BACKEND_URL_APPS;

const types = {
  SET_CURRENT_APP_INFO: 'SET_CURRENT_APP_INFO',
  SET_TRANSACTION_FOR_SIGN: 'SET_TRANSACTION_FOR_SIGN',
  SET_MESSAGE_FOR_SIGN: 'SET_MESSAGE_FOR_SIGN',
  SET_EXTENSIONS_LIST: 'SET_EXTENSIONS_LIST',
  SET_DEV_APP_LIST: 'SET_DEV_APP_LIST',
  ADD_EXTENSION_TO_LIST: 'ADD_EXTENSION_TO_LIST',
  SET_DEV_ACCOUNT: 'SET_DEV_ACCOUNT',
};

export default {
  namespaced: true,
  state: () => ({
    currentAppInfo: null,
    extensionTransactionForSign: null,
    extensionMessageForSign: null,
    extensionsList: [],
    devAppsList: [],
    devAccount: [],
  }),
  getters: {
    currentAppInfo: (state) => state.currentAppInfo,
    extensionTransactionForSign: (state) => state.extensionTransactionForSign,
    extensionMessageForSign: (state) => state.extensionMessageForSign,
    extensionsList: (state) => state.extensionsList,
    devAppsList: (state) => state.devAppsList,
    devAccount: (state) => state.devAccount,
  },
  mutations: {
    [types.SET_DEV_ACCOUNT](state, value) {
      state.devAccount = value;
    },
    [types.SET_DEV_APP_LIST](state, value) {
      state.devAppsList = value;
    },
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
    [types.ADD_EXTENSION_TO_LIST](state, value) {
      state.extensionsList.push(value);
    },
  },
  actions: {
    async sendCustomMsg(_, { token, message, type, params = {} }) {
      // eslint-disable-next-line no-unused-vars
      const res = await axios({
        method: 'post',
        url: `${APP_DOMEN}/customMsg?token=${token}`,
        data: {
          to: 'app',
          from: 'main-front',
          params,
          type,
          toDeviceId: token,
          message,
        },
      });
    },
    async connectToDevCenter(_, { token }) {
      return await extensionsApi.connectToDevCenter({ token });
    },
    async disconnectAccount(_, { developer_id }) {
      return await extensionsApi.disconnectAccount({ developer_id });
    },
    async disconnectApp(_, { project_id }) {
      return await extensionsApi.disconnectApp({ project_id });
    },
    addExtensionToList({ commit }, value) {
      commit(types.ADD_EXTENSION_TO_LIST, value);
    },
    async connectDevApp(_, { token }) {
      return await extensionsApi.connectDevApp({ token });
    },
    async fetchDevAccount({ commit }) {
      const { ok, data } = await extensionsApi.getDevAccount();

      if (ok) {
        commit(types.SET_DEV_ACCOUNT, data);
      }
    },
    async fetchDevAppsList({ commit }) {
      const { ok, data } = await extensionsApi.getDevAppsList();

      if (ok) {
        commit(types.SET_DEV_APP_LIST, data);
      }
    },
    async fetchExtensionsList({ commit }) {
      const { ok, data } = await extensionsApi.getExtensionsList();

      if (ok) {
        // data.unshift(multisendLocalApp);
        commit(types.SET_EXTENSIONS_LIST, data);
      }
    },
    async fetchExtensionInfo({ commit }, { appId }) {
      const { ok, data } = await extensionsApi.getExtensionsInfo({ appId });

      if (ok) {
        commit(types.SET_CURRENT_APP_INFO, data);
      }
    },
    async putMempoolChangeStatus(_, { mempool_id, hash }) {
      await extensionsApi.putMempoolChangeStatus({
        mempool_id,
        hash,
      });
    },
  },
};
