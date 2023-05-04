import useApi from '@/api/useApi';
import { prettyNumber } from '@/helpers/prettyNumber';
import { getStorage } from '@/utils/storage';
import citadel from '@citadeldao/lib-citadel';
import notify from '@/plugins/notify';

function compareArrays(arr1, arr2, key1, key2, key3) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    const match = arr2.find(
      (obj) =>
        obj[key1] === arr1[i][key1] &&
        obj[key2] === arr1[i][key2] &&
        obj[key3] === arr1[i][key3]
    );
    if (!match) {
      return false;
    }
    for (const key in arr1[i]) {
      if (key !== key1 && key !== key2 && key !== key3) {
        if (arr1[i][key] !== match[key]) {
          return false;
        }
      }
    }
  }

  return true;
}

const api = useApi('auth');

const types = {
  SET_INFO: 'SET_INFO',
  SET_SUBSCRIBE_REWARDS: 'SET_SUBSCRIBE_REWARDS',
  SET_MARKETCAPS: 'SET_MARKETCAPS',
  SET_RATES: 'SET_RATES',
  SET_CURRENT_WALLET_MARKETCAP: 'SET_CURRENT_WALLET_MARKETCAP',
  SET_CHANGE_EMAIL_TIMER: 'SET_CHANGE_EMAIL_TIMER',
  SET_REMEMBER_PASSWORD: 'SET_REMEMBER_PASSWORD',
};

export default {
  namespaced: true,
  state: {
    rememberPassword: false,
    info: {
      info: null,
      marketcaps: {},
      rates: {},
      currentWalletMarketcap: {},
    },
    changeEmailTimer: null,
  },
  getters: {
    rememberPassword: (state) => state.rememberPassword,
    info: (state) => state.info,
    formatYeldByNet: (state) => (net) =>
      prettyNumber(state.marketcaps?.[net]?.yield),
    marketcaps: (state) => state.marketcaps,
    rates: (state) => state.rates,
    currentWalletMarketcap: (state) => state.currentWalletMarketcap,
    changeEmailTimer: (state) => state.changeEmailTimer,
  },
  mutations: {
    [types.SET_REMEMBER_PASSWORD](state, value) {
      state.rememberPassword = value;
    },
    [types.SET_INFO](state, info) {
      state.info = info;
    },
    [types.SET_SUBSCRIBE_REWARDS](state, value) {
      state.info.subscribe_rewards = value;
    },
    [types.SET_MARKETCAPS](state, value) {
      state.marketcaps = value;
    },
    [types.SET_RATES](state, value) {
      state.rates = value;
    },
    [types.SET_CURRENT_WALLET_MARKETCAP](state, value) {
      state.currentWalletMarketcap = value;
    },
    [types.SET_CHANGE_EMAIL_TIMER](state, value) {
      state.changeEmailTimer = value;
    },
  },
  actions: {
    async getInfo({ commit, dispatch, rootGetters }) {
      const { data, error } = await citadel.init({
        backendUrl: process.env.VUE_APP_BACKEND_URL,
        publicBackendUrl: process.env.VUE_APP_PUBLIC_BACKEND_URL,
        debug: JSON.parse(process.env.VUE_APP_DEBUG_LIB),
        appURL: process.env.VUE_APP_BACKEND_URL_APPS,
        socketURL: process.env.VUE_APP_BACKEND_WS_URL,
        backendApiVersion: process.env.VUE_APP_API_VERSION,
      });

      // for tests
      if (JSON.parse(process.env.VUE_APP_DEBUG_LIB)) {
        window.citadelLib = citadel;
      }

      if (!error) {
        await dispatch('getMarketcaps');
        await dispatch('getRates');
        dispatch('auth/setIsAuthenticated', true, { root: true });
        const info = {
          ...data.user,
        };
        commit(types.SET_INFO, info);
        commit('crypto/setUserId', info.id, { root: true });
        citadel.addEventListener('storageChangedExternally', async () => {
          //sync wallet list between browser tabs

          await dispatch('wallets/getNewWallets', 'lazy', { root: true });
          const userId = rootGetters['profile/info'].id;
          // get current wallet list from ls
          const currentWalletList =
            JSON.parse(getStorage(`user_${userId}`))?.wallets?.wallets || [];
          // get current wallet list from citadel.lib
          const libWalletList =
            JSON.parse(getStorage(`lib-wallets-${userId}`)) || {};
          const libCurrentWalletListArray = Object.values(libWalletList);
          //filter ls list with citadel.lib list
          const filteredCurrentWalletList = currentWalletList.filter((item) => {
            return libCurrentWalletListArray.some(
              (wallet) => item.id === wallet.id
            );
          });
          if (
            currentWalletList.length &&
            !compareArrays(
              filteredCurrentWalletList,
              libCurrentWalletListArray,
              'net',
              'address',
              'type'
            )
          ) {
            Promise.all(
              currentWalletList.map((item) => {
                return dispatch(
                  'crypto/createNewWalletInstance',
                  { walletOpts: item },
                  { root: true }
                );
              })
            ).then((values) => {
              // pushing them in vuex
              dispatch(
                'wallets/pushWallets',
                { wallets: values },
                { root: true }
              );
              // remove new added wallets from ls
              // removeStorage(syncWalletsLsKey)
            });
          }

          // update walletList in case of deleted wallets in another tab
          // await dispatch('wallets/getNewWallets', 'lazy', { root: true });
          // const userId = rootGetters['profile/info'].id;
          // const cryptoData = JSON.parse(getStorage(`user_${userId}`)).crypto
          // // update encoded mnemonic and passwordhash
          // if(cryptoData){
          //   const vuexMnemonic = rootGetters['crypto/encodeUserMnemonic']
          //   const vuexPasswordHash = rootGetters['crypto/passwordHash']
          //   const lsMnemonic = cryptoData.mnemonic
          //   const lsPasswordHash = cryptoData.passwordHash
          //   console.log('qaaaaaqqq1111', vuexMnemonic, lsMnemonic, vuexMnemonic === lsMnemonic);
          //   console.log('qaaaaaqqq2222', vuexPasswordHash, lsPasswordHash, vuexPasswordHash === lsPasswordHash);
          //   if(vuexMnemonic !== lsMnemonic)commit('crypto/setUserMnemonic', lsMnemonic, { root: true })
          //   if(vuexPasswordHash !== lsPasswordHash)commit('crypto/setPasswordHash', lsPasswordHash, { root: true })
          // }
          // // get new addedWallets from ls
          // const syncWalletsLsKey = `user_${userId}_syncWallets`;
          // let syncWallets = JSON.parse(getStorage(syncWalletsLsKey))

          // // get current wallet list from citadel.lib for fltering missing(deleted) wallets
          // const libCurrentWalletList = JSON.parse(getStorage(`lib-wallets-${userId}`)) || {}
          // const libCurrentWalletListArray = Object.values(libCurrentWalletList)
          // const currentStoreList = rootGetters['wallets/wallets']

          // console.log('qaaaaqqq', syncWallets);
          // if(syncWallets){
          //   // detecting if changes have been made in another tab(comparing the lengths of citadel.lib wallet list and vuex list)
          //   let isAnotherTab = !currentStoreList.length || currentStoreList.length !== libCurrentWalletListArray.length
          //   // in case if previous condition is false, we also check the structure of that two lists
          //   if (!isAnotherTab) {
          //     isAnotherTab = currentStoreList.some(wallet => {
          //       return !libCurrentWalletListArray.find(w =>
          //         w.type === wallet.type && w.net === wallet.net &&
          //         w.address.toLowerCase() === wallet.address.toLowerCase()
          //       )
          //     })
          //   }
          //   // check if there are new added wallets and is changes have been made in another tab
          //   if(isAnotherTab && syncWallets && Array.isArray(syncWallets)){
          //     //filter added wallets with citadel.lib wallets
          //     syncWallets = syncWallets.filter((item) =>{
          //       console.log('test999');
          //         return libCurrentWalletListArray.some(
          //         (wallet) => item.id === wallet.id
          //       )
          //       });
          //     // if there are new wallets,create new instances
          //     Promise.all(syncWallets.map(item => {
          //       return dispatch('crypto/createNewWalletInstance', { walletOpts: item }, { root: true })
          //     })).then((values) => {
          //       // pushing them in vuex
          //       dispatch('wallets/pushWallets', { wallets: values }, { root: true })
          //       // remove new added wallets from ls
          //       removeStorage(syncWalletsLsKey)
          //     });
          //   };
          // }

          // const syncWalletsLsKey = `user_${userId}_syncWallets`;
          // // get new addedWallets from ls
          // const syncWallets = JSON.parse(localStorage.getItem(syncWalletsLsKey));
          // // get current wallet list from citadel.lib
          // const libCurrentWalletList = JSON.parse(localStorage.getItem(`lib-wallets-${userId}`)) || {};
          // // make list from ids
          // const libWalletIds = Object.keys(libCurrentWalletList);

          // await dispatch('wallets/getNewWallets', 'lazy', { root: true });

          // const currentStoreList = rootGetters['wallets/wallets'];
          // // make list from ids
          // const currentWalletIds = currentStoreList.map(wallet => wallet.id);
          // // detecting if changes have been made in another tab(comparing the lengths of citadel.lib wallet list and vuex list, and structure)
          // const isAnotherTab = !currentWalletIds.length || currentWalletIds.length !== libWalletIds.length ||
          //   currentWalletIds.some(id => !libWalletIds.includes(id));

          // if (isAnotherTab && syncWallets && Array.isArray(syncWallets)) {
          //   Promise.all(syncWallets.map(item => {
          //     return dispatch('crypto/createNewWalletInstance', { walletOpts: item }, { root: true })
          //   })).then((values) => {
          //     // pushing them in vuex
          //     dispatch('wallets/pushWallets', { wallets: values }, { root: true })
          //     // remove new added wallets from ls
          //     removeStorage(syncWalletsLsKey)
          //   });
          // }
        });
        return { error };
      }

      dispatch('auth/setIsAuthenticated', false, { root: true });
      // router.push({ name: 'Login' });

      return { error };
    },

    async getMarketcaps({ commit }) {
      const { data, error } = await citadel.getAllMarketcaps();
      if (!error) {
        commit(types.SET_MARKETCAPS, data);
      }
    },

    async getRates({ commit }) {
      const { data, error } = await citadel.getAllRates();
      if (!error) {
        commit(types.SET_RATES, data);
      }
    },

    async updateMarketcap({ commit, state }, data) {
      const isSubtoken = data.net.includes('_');
      if (!isSubtoken) {
        const formatedData = {
          ...state.marketcaps,
          [data.net]: data.marketCap.marketCapInfo,
        };
        commit(types.SET_MARKETCAPS, formatedData);
      }
    },

    async updateRates({ commit, state }, data) {
      const isSubtoken = data.net.includes('_');
      if (!isSubtoken) {
        const formatedData = {
          ...state.rates,
          [data.net]: data.marketCap.rates,
        };
        commit(types.SET_RATES, formatedData);
      }
    },

    async setCurrentWalletMarketcap({ commit }, data) {
      commit(types.SET_CURRENT_WALLET_MARKETCAP, data);
    },

    async updateCurrentWalletMarketcap({ commit, state }, data) {
      if (
        data.net.toLowerCase() ===
        state.currentWalletMarketcap?.net?.toLowerCase()
      ) {
        commit(types.SET_CURRENT_WALLET_MARKETCAP, {
          ...data.marketCap.marketCapInfo,
          net: data.net,
        });
      }
    },

    async changeSubscribeRewards({ commit }, newValue) {
      const res = await citadel.subscribeRewards(newValue);

      if (!res.error) {
        commit(types.SET_SUBSCRIBE_REWARDS, newValue);

        return { ok: true, error: res.error };
      }

      return { ok: false, error: res.error };
    },

    async changeEmail(_, newEmail) {
      try {
        const { ok, error } = await api.changeEmail({ newEmail });

        if (ok) {
          return { ok: true };
        }

        notify({
          type: 'warning',
          text: error,
        });

        return { ok: false };
      } catch (error) {
        return { ok: false, error };
      }
    },

    async changeEmailInfo() {
      try {
        const { ok, data, error } = await api.getChangeEmailInfo();

        if (ok) {
          return data;
        }

        notify({
          type: 'warning',
          text: error,
        });
      } catch (error) {
        return { ok: false, error };
      }
    },
    setRememberPassword({ commit }, value) {
      commit(types.SET_REMEMBER_PASSWORD, value);
    },
  },
};
