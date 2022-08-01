const types = {
  //modal
  SHOW_MODAL: 'SHOW_MODAL',
  HIDE_MODAL: 'HIDE_MODAL',
  //loader
  SHOW_LOADER: 'SHOW_LOADER',
  HIDE_LOADER: 'HIDE_LOADER',
  //alreadyAddedModal
  SHOW_ALREADY_ADDED_MODAL: 'SHOW_ALREADY_ADDED_MODAL',
  HIDE_ALREADY_ADDED_MODAL: 'HIDE_ALREADY_ADDED_MODAL',
  //wallets
  SET_NEW_WALLETS_LIST: 'SET_NEW_WALLETS_LIST',
  RESET_NEW_WALLETS_LIST: 'RESET_NEW_WALLETS_LIST',
};

export default {
  namespaced: true,
  state: () => ({
    isShowLoader: false,
    isShowModal: false,
    isShowAlreadyAddedModal: false,
    newWalletList: [],
    routeName: '',
    catPageProps: {
      inputTypeIcon: 'oneseed-dot',
      dataQa: null,
      walletTypePlaceholder: 'Citadel One-Seed',
    },
  }),
  getters: {
    isModalShown: (state) => state.isShowModal,
    isShowLoaderG: (state) => state.isShowLoader,
    isShowAlreadyAddedModalG: (state) => state.isShowAlreadyAddedModal,
    newWalletsListG: (state) => state.newWalletList,
    routeNameG: (state) => state.routeName,
    catPagePropsG: (state) => state.catPageProps,
  },
  mutations: {
    //modal
    [types.SHOW_MODAL](state) {
      state.isShowModal = true;
    },
    [types.HIDE_MODAL](state) {
      state.isShowModal = false;
    },
    //loader
    [types.SHOW_LOADER](state) {
      state.isShowLoader = true;
    },
    [types.HIDE_LOADER](state) {
      state.isShowLoader = false;
    },
    //
    [types.SHOW_ALREADY_ADDED_MODAL](state) {
      state.isShowAlreadyAddedModal = true;
    },
    [types.HIDE_ALREADY_ADDED_MODAL](state) {
      state.isShowAlreadyAddedModal = false;
    },
    //wallets
    [types.SET_NEW_WALLETS_LIST](state, data) {
      state.newWalletList = data;
    },
    [types.RESET_NEW_WALLETS_LIST](state) {
      state.newWalletList = [];
    },
  },
  actions: {
    //modal
    showModal({ commit }) {
      commit(types.SHOW_MODAL);
    },
    hideModal({ commit }) {
      commit(types.HIDE_MODAL);
    },
    //loader
    showLoader({ commit }) {
      commit(types.SHOW_LOADER);
    },
    hideLoader({ commit }) {
      commit(types.HIDE_LOADER);
    },
    //
    //loader
    showAlreadyAddedModal({ commit }) {
      commit(types.SHOW_ALREADY_ADDED_MODAL);
    },
    hideAlreadyAddedModal({ commit }) {
      commit(types.HIDE_ALREADY_ADDED_MODAL);
    },
    //wallets
    setNewWalletsList({ commit }, data) {
      commit(types.SET_NEW_WALLETS_LIST, data);
    },
    resetNewWalletsList({ commit }) {
      commit(types.RESET_NEW_WALLETS_LIST);
    },
    //
    routerTo({ state }, routeName) {
      state.routeName = routeName;
    },
    setCatPageProps({ state }, propsObj) {
      state.catPageProps = { ...propsObj };
    },
  },
};
