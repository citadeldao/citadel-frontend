import useApi from '@/api/useApi';
import { setStorage, types as lsTypes } from '@/utils/storage';
import notify from '@/plugins/notify';
import { getStorage } from '../../utils/storage';

const api = useApi('auth');
const types = {
  SET_USERNAME: 'SET_USERNAME',
  SET_IS_AUTHENTICATED: 'SET_IS_AUTHENTICATED',
};

const getIsAuthenticated = () => {
  return getStorage(lsTypes.IS_AUTHENTICATED) || false;
};

export default {
  namespaced: true,
  state: () => ({
    username: null,
    isAuthenticated: getIsAuthenticated(),
  }),

  getters: {
    username: (state) => state.username,
    isAuthenticated: (state) => state.isAuthenticated,
  },

  mutations: {
    [types.SET_USERNAME](state, username) {
      state.username = username;
    },
    [types.SET_IS_AUTHENTICATED](state, isAuthenticated) {
      state.isAuthenticated = isAuthenticated;
    },
  },

  actions: {
    async login({ commit }, { username }) {
      try {
        const { ok, error } = await api.login(username);

        if (ok) {
          commit(types.SET_USERNAME, username);

          return { data: ok, error: null };
        }

        notify({
          type: 'warning',
          text: error[Object.keys(error)[0]],
        });

        return { data: null, error: error };
      } catch (error) {
        return { data: null, error: error };
      }
    },
    async confirmCode(_, { code, username }) {
      try {
        const { ok, error } = await api.confirmCode({ code, username });

        if (ok) {
          return { data: ok, error: null };
        }

        return { data: null, error: error };
      } catch (error) {
        return {
          data: null,
          error: error.response && error.response.data.error,
        };
      }
    },
    async authWeb3(_, { address, net }) {
      try {
        const { ok, data, error } = await api.authWeb3({ address, net });

        if (ok) {
          return { data: ok, error: null, res: data };
        }

        return { data: null, error: error };
      } catch (error) {
        return {
          data: null,
          error: error.response && error.response.data.error,
        };
      }
    },
    async confirmWeb3(_, { address, sign, captchaResKey, pubKey, net }) {
      try {
        const { ok, error } = await api.confirmWeb3({
          address,
          sign,
          captchaResKey,
          pubKey,
          net,
        });

        if (ok) {
          return { data: ok, error: null };
        }

        return { data: null, error: error };
      } catch (error) {
        return {
          data: null,
          error: error.response && error.response.data.error,
        };
      }
    },
    loginSocial(_, { social }) {
      window.location.href = `${process.env.VUE_APP_BACKEND_URL}/profile/auth/${social}`;
    },
    setIsAuthenticated({ commit }, value) {
      setStorage(lsTypes.IS_AUTHENTICATED, value);
      commit(types.SET_IS_AUTHENTICATED, value);
    },
    async logout({ commit, dispatch }) {
      try {
        const { ok, error } = await api.logout();

        if (ok) {
          commit(types.SET_USERNAME, null);
          commit(types.SET_IS_AUTHENTICATED, false);

          dispatch('wallets/clearHiddenWallets', null, { root: true });

          return { data: ok, error: null };
        }

        return { data: null, error: error };
      } catch (error) {
        return { data: null, error: error };
      }
    },
    async deleteAccount({ commit }) {
      try {
        const { ok, error } = await api.deleteAccount();

        if (ok) {
          commit(types.SET_USERNAME, null);
          commit(types.SET_IS_AUTHENTICATED, false);
        } else {
          notify({
            type: 'warning',
            text: error,
          });
        }
      } catch (error) {
        notify({
          type: 'warning',
          text: 'error',
        });
      }
    },
  },
};
