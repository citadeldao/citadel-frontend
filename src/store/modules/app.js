import store from '../../store';
import initPersistedstate from '@/plugins/persistedstate';
// import { SocketManager } from '@/utils/socket';
import { socketEventHandler } from '@/utils/socketEventHandler';
import citadel from '@citadeldao/lib-citadel';
import { setStorage } from '@/utils/storage';

const types = {
  SET_LOADER: 'SET_LOADER',
  SET_ROUTE_LOADER: 'SET_ROUTE_LOADER',
};

export default {
  namespaced: true,
  state: {
    showLoader: false,
    routeLoader: false,
  },
  getters: {
    showLoader: (state) => state.showLoader,
    showRouteLoader: (state) => state.routeLoader,
  },
  mutations: {
    [types.SET_LOADER](state, loadingState) {
      state.showLoader = loadingState;
    },
    [types.SET_ROUTE_LOADER](state, loadingState) {
      state.routeLoader = loadingState;
    },
  },
  actions: {
    setLoader({ commit }, loadingState) {
      commit(types.SET_LOADER, loadingState);
    },
    setRouteLoader({ commit }, loadingState) {
      commit(types.SET_ROUTE_LOADER, loadingState);
    },
    async initDefaultState({ dispatch, rootGetters }) {
      dispatch('setLoader', true);
      const { error } = await dispatch('profile/getInfo', null, { root: true });

      if (!error) {
        await dispatch('networks/loadConfig', null, { root: true });
        initPersistedstate(store);
        // SocketManager.connect();
        citadel.addEventListener('socketEvent', socketEventHandler);
        citadel.addEventListener('walletListUpdated', async () => {
          await dispatch('wallets/getNewWallets', 'lazy', { root: true });
        });
        await dispatch('setWallets');
        //save encodedMnemonic and passwordHash for sync in other tabs
        const userId = rootGetters['profile/info'].id;
        setStorage(
          `${userId}_syncEncodeUserMnemonic`,
          rootGetters['crypto/encodeUserMnemonic']
        );
        setStorage(
          `${userId}_syncPasswordHash`,
          rootGetters['crypto/passwordHash']
        );
        // await dispatch('wallets/getNewWallets','lazy', { root: true });
        // dispatch('wallets/getNewWallets','detail', { root: true });
        dispatch('wallets/getCustomWalletsList', null, { root: true });
        dispatch('rewards/getRewards', null, { root: true });
        await dispatch('transactions/getMempool', null, { root: true });

        if (window.ethereum?.selectedAddress) {
          dispatch('metamask/connectToMetamask', null, { root: true });
        }

        // dispatch('wallets/setLoaded', true, { root: true });

        return Promise.resolve();
      }

      return Promise.reject(error);
    },

    async setWallets({ rootGetters, dispatch, commit }, options = {}) {
      const networksList = rootGetters['networks/networksList'];
      const privateWallets = rootGetters['crypto/privateWallets'];

      if (privateWallets && privateWallets.length) {
        await dispatch('wallets/setWallets', privateWallets, { root: true });
      }

      let walletsList = rootGetters['wallets/wallets'];
      walletsList = walletsList
        .map((item) => {
          return {
            net: item.net,
            address: item.address,
            segwitAddress: item.address,
            nativeAddress: item.nativeAddress,
            publicKeyNative: item.publicKeyNative,
            publicKeySegwit: item.publicKeySegwit,
            type: item.type,
            publicKey: item.publicKey,
            privateKeyHash: item?.privateKeyHash,
            savedViewingKeys: item?.savedViewingKeys,
          };
        })
        .filter(({ net }) =>
          networksList.some((network) => network.net === net)
        );

      await citadel.setWalletList(walletsList, options);
      // get wallet list immediately, because walletListUpdated event will come with a 1 sec delay after last event
      await dispatch('wallets/getNewWallets', 'lazy', { root: true });
      commit('crypto/setPrivateWallets', [], { root: true });
    },
  },
};
