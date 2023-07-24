//import models from '@/models';
import CryptoCoin from '@/models/CryptoCoin';
import { findWalletInArray } from '@/helpers';
import { sortByAlphabet } from '@/helpers';
import { getStorage, removeStorage, setStorage } from '@/utils/storage';
import notify from '@/plugins/notify';
import BigNumber from 'bignumber.js';
import citadel from '@citadeldao/lib-citadel';
import useWallets from '@/compositions/useWallets';
import { WALLET_TYPES } from '@/config/walletType';

const types = {
  SET_WALLETS: 'SET_WALLETS',
  SET_CURRENT_WALLET: 'SET_CURRENT_WALLET',
  SET_WALLETS_STRUCTURE: 'SET_WALLETS_STRUCTURE',
  SET_LOADED: 'SET_LOADED',
  SET_CUSTOM_WALLETS_LIST: 'SET_CUSTOM_WALLETS_LIST',
  SET_ACTIVE_LIST: 'SET_ACTIVE_LIST',
  SET_HIDDEN_WALLETS: 'SET_HIDDEN_WALLETS',
  ADD_WALLET_TO_HIDDEN: 'ADD_WALLET_TO_HIDDEN',
  REMOVE_WALLET_FROM_HIDDEN: 'REMOVE_WALLET_FROM_HIDDEN',
  SET_FAVOURITE_WALLET: 'SET_FAVOURITE_WALLET',
};
const LS_HIDDEN_WALLETS_KEY = 'hidden_wallets';

export default {
  namespaced: true,
  state: () => ({
    favouriteFlag: false,
    walletsStructure: null,
    wallets: [],
    currentWallet: null,
    loaded: false,
    customWalletsList: [],
    activeList: 'all',
    hiddenWallets: [],
  }),

  getters: {
    favouriteFlag: (state) => state.favouriteFlag,
    walletsStructure: (state) => state.walletsStructure,
    wallets: (state, getters, rootState, rootGetters) =>
      state.wallets.filter(({ net }) =>
        rootGetters['networks/networksList'].some(
          (network) => network.net === net
        )
      ),
    walletByAddress:
      (state) =>
      (wallet = {}) =>
        findWalletInArray(state.wallets, wallet),
    currentWallet: (state) => state.currentWallet,
    loaded: (state) => state.loaded,
    customWalletsList: (state) =>
      sortByAlphabet(state.customWalletsList, 'name'),
    customWalletsListByName: (state) => (listName) =>
      state.customWalletsList.find((list) => list.name === listName) || {
        wallets: [],
      },
    activeList: (state) => state.activeList,
    hiddenWallets: (state) => state.hiddenWallets,
    freePathIndex:
      (state) =>
      ({ net }) => {
        // looking for free path index in wallets with type oneSeed
        let pathIndex = 0;

        // 30 - max limit for wallets and loop
        while (pathIndex < 30) {
          // current derpath
          const { data: derivationPath } = citadel.getDerivationPathByIndex(
            net,
            'seed',
            pathIndex
          );
          // find current derpath among wallets
          const indexIsAlreadyTaken = state.wallets.find(
            (wallet) =>
              wallet.type === 'oneSeed' &&
              wallet.net === net &&
              wallet.derivationPath === derivationPath
          );

          if (indexIsAlreadyTaken) {
            pathIndex++;
          } else {
            return pathIndex;
          }
        }

        return pathIndex;
      },
  },

  mutations: {
    [types.SET_FAVOURITE_WALLET](state, value) {
      state.favouriteFlag = value;
    },
    removeWallet(state, { net, address }) {
      state.wallets = state.wallets.filter(
        (w) =>
          w.net !== net || w.address.toLowerCase() !== address.toLowerCase()
      );
    },
    addImportedToWallets(state, wallet) {
      state.wallets.push(wallet);
    },
    pushWallets(state, { wallets, root = false /* , rootGetters */ }) {
      const data = state.wallets;

      for (const wallet of wallets) {
        // search dublicate
        const searchIndex = data.findIndex(
          (w) =>
            w.net === wallet.net &&
            w.address.toLowerCase() === wallet.address.toLowerCase()
        );

        if (searchIndex > -1) {
          // for public key
          if (
            (wallet.type === WALLET_TYPES.PUBLIC_KEY &&
              // if dublikate IS NOT public key type, return
              data[searchIndex].type !== WALLET_TYPES.PUBLIC_KEY) ||
            // for keplr
            (wallet.type === WALLET_TYPES.KEPLR &&
              // if dublikate type type IS NOT keplr AND IS NOT public key, return
              // (
              data[searchIndex].type !== WALLET_TYPES.KEPLR &&
              data[searchIndex].type !== WALLET_TYPES.PUBLIC_KEY)
          ) {
            return;
          }

          data.splice(searchIndex, 1);
        }
        data.push(wallet);
      }

      if (root) {
        const filteredData = [];

        for (const wallet of data) {
          if (
            state.walletsStructure.some(
              (item) =>
                item.net.toLowerCase() === wallet.net.toLowerCase() &&
                item.address.toLowerCase() === wallet.address.toLowerCase()
            )
          ) {
            filteredData.push(wallet);
          }
        }

        state.wallets = filteredData;
      } else {
        state.wallets = data;
      }
    },
    setWallets(state, wallets) {
      state.wallets = wallets;
    },
    [types.SET_WALLETS_STRUCTURE](state, walletsStructure) {
      state.walletsStructure = walletsStructure;
    },
    [types.SET_CURRENT_WALLET](state, wallet) {
      state.currentWallet = wallet;
    },
    [types.SET_LOADED](state, value) {
      state.loaded = value;
    },
    [types.SET_CUSTOM_WALLETS_LIST](state, customWalletsList) {
      state.customWalletsList = customWalletsList;
    },
    [types.SET_ACTIVE_LIST](state, list) {
      state.activeList = list;
    },
    [types.SET_HIDDEN_WALLETS](state, wallets) {
      state.hiddenWallets = wallets;
    },
    [types.ADD_WALLET_TO_HIDDEN](state, address) {
      state.hiddenWallets.push(address);
    },
    [types.REMOVE_WALLET_FROM_HIDDEN](state, address) {
      const index = state.hiddenWallets.findIndex((a) => a === address);
      state.hiddenWallets.splice(index, 1);
    },
  },
  actions: {
    setFavouriteFlag({ commit }, value) {
      commit(types.SET_FAVOURITE_WALLET, value);
    },
    async getNewWallets(
      { getters, dispatch, rootGetters, commit },
      mode = 'lazy'
    ) {
      try {
        const { error, data: walletsList } = await citadel.getWalletList(mode);

        if (!error) {
          if (
            JSON.stringify(walletsList) !==
            JSON.stringify(getters.walletsStructure)
          ) {
            commit(types.SET_WALLETS_STRUCTURE, walletsList);
            const formatedList = walletsList
              .map((item) => {
                const found = getters.wallets.find(
                  ({ net, address }) =>
                    address.toLowerCase() === item.address.toLowerCase() &&
                    net.toLowerCase() === item.net.toLowerCase()
                );

                return {
                  ...item,
                  privateKeyEncoded: found?.privateKeyEncoded || null,
                  mnemonicEncoded: found?.mnemonicEncoded || null,
                  publicKey: found?.publicKey || null,
                  derivationPath: found?.derivationPath || null,
                  importedFromSeed: found?.importedFromSeed,
                };
              })
              .filter(({ net }) =>
                rootGetters['networks/networksList'].some(
                  (network) => network.net === net
                )
              );
            await dispatch('initWalletsInstances', formatedList);
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    async initWalletsInstances({ getters, dispatch, rootGetters }, wlletsList) {
      const wallets = [];
      const list = wlletsList || getters.wallets;
      list.sort((a, b) => (a.networkName > b.networkName ? 1 : -1));

      for (const walletOpts of list) {
        const { currency } = useWallets(walletOpts);
        // const WalletConstructor = models[walletOpts.net.toUpperCase()];
        walletOpts.config = rootGetters['networks/configByNet'](walletOpts.net);
        walletOpts.balanceUSD = BigNumber(walletOpts.balance.calculatedBalance)
          .times(currency.value.USD)
          .toNumber();
        wallets.push(new /* WalletConstructor */ CryptoCoin(walletOpts));
      }

      dispatch('pushWallets', {
        wallets: wallets.filter(
          (item) => item.type === WALLET_TYPES.PUBLIC_KEY || item.publicKey
        ),
        root: true,
      });
    },

    async setWallets({ commit }, wallets) {
      commit('setWallets', wallets);
    },

    async pushWallets({ commit, rootGetters }, { wallets, root = false }) {
      commit('pushWallets', { wallets, root, rootGetters });
    },

    async renameWalletTitle(context, { walletId, title }) {
      const { error } = await citadel.renameWalletTitleById(walletId, title);

      if (error) {
        notify({
          type: 'warning',
          text: error.message,
        });
      }
    },

    setCurrentWallet({ commit }, wallet) {
      commit(types.SET_CURRENT_WALLET, wallet);
    },

    setLoaded({ commit }, value) {
      commit(types.SET_LOADED, value);
    },

    async removeWallet(
      { commit, getters, dispatch /* , rootGetters */ },
      { wallet, walletId }
    ) {
      try {
        await citadel.removeWalletById(walletId);

        if (getters.walletByAddress(wallet)) {
          commit('removeWallet', wallet);
        }
        dispatch('removeWalletFromHidden', wallet);
      } catch (e) {
        console.error(e);
      }
    },

    async getCustomWalletsList({ commit }) {
      const res = await citadel.getCustomWalletLists();

      if (!res.error) {
        commit(types.SET_CUSTOM_WALLETS_LIST, res.data);
      } else {
        notify({
          type: 'warning',
          text: res.error,
        });
        commit(types.SET_CUSTOM_WALLETS_LIST, res.data);
      }
    },

    async editCustomWalletsList(
      { dispatch, commit },
      { listId, name, wallets, needSetActiveList = true }
    ) {
      const res = await citadel.editCustomWalletList(listId, name, wallets);

      if (!res.error) {
        await dispatch('getCustomWalletsList');

        if (needSetActiveList) {
          commit(types.SET_ACTIVE_LIST, name);
        }

        return true;
      }

      notify({
        type: 'warning',
        text: res.error,
      });

      if (needSetActiveList) {
        commit(types.SET_ACTIVE_LIST, 'all');
      }

      return false;
    },

    async createCustomWalletsList(
      { dispatch, commit },
      { name, wallets, needSetActiveList = true }
    ) {
      const res = await citadel.createCustomWalletList(name, wallets);

      if (!res.error) {
        await dispatch('getCustomWalletsList');

        if (needSetActiveList) {
          commit(types.SET_ACTIVE_LIST, name);
        }

        return true;
      }

      notify({
        type: 'warning',
        text: res.error,
      });

      if (needSetActiveList) {
        commit(types.SET_ACTIVE_LIST, 'all');
      }

      return false;
    },

    async deleteCustomWalletsList(
      { dispatch, commit },
      { listId, needSetActiveList = true }
    ) {
      const res = await citadel.deleteCustomWalletList(listId);

      if (!res.error) {
        await dispatch('getCustomWalletsList');

        if (needSetActiveList) {
          commit(types.SET_ACTIVE_LIST, 'all');
        }
      } else {
        notify({
          type: 'warning',
          text: res.error,
        });

        if (needSetActiveList) {
          commit(types.SET_ACTIVE_LIST, 'all');
        }
      }
    },

    initHiddenWallets({ commit, state }) {
      const hiddenWallets = getStorage(LS_HIDDEN_WALLETS_KEY);

      commit(types.SET_HIDDEN_WALLETS, JSON.parse(hiddenWallets) || []);
      setStorage(LS_HIDDEN_WALLETS_KEY, JSON.stringify(state.hiddenWallets));
    },

    toggleHiddenWallet({ commit, state }, { address, net }) {
      const path = `${net}_${address}`;
      const isHidden = state.hiddenWallets.includes(path);

      if (isHidden) {
        commit(types.REMOVE_WALLET_FROM_HIDDEN, path);
      } else {
        commit(types.ADD_WALLET_TO_HIDDEN, path);
      }

      setStorage(LS_HIDDEN_WALLETS_KEY, JSON.stringify(state.hiddenWallets));
    },

    removeWalletFromHidden({ commit, state }, { address, net }) {
      commit(types.REMOVE_WALLET_FROM_HIDDEN, `${net}_${address}`);
      setStorage(LS_HIDDEN_WALLETS_KEY, JSON.stringify(state.hiddenWallets));
    },

    clearHiddenWallets({ commit }) {
      commit(types.SET_HIDDEN_WALLETS, []);
      removeStorage(LS_HIDDEN_WALLETS_KEY);
    },
  },
};
