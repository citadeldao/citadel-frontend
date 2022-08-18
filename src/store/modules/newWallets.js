import { INPUT_TYPE_ICON } from '@/config/newWallets';

export default {
  namespaced: true,
  state: () => ({
    isShowLoader: false,
    isShowModal: false,
    isShowAlreadyAddedModal: false,
    newWalletList: [],
    catPageProps: {
      inputTypeIcon: INPUT_TYPE_ICON.SEED,
      dataQa: null,
      walletTypePlaceholder: 'Citadel One-Seed',
    },
  }),
  getters: {
    isShowModal: (state) => state.isShowModal,
    isShowLoader: (state) => state.isShowLoader,
    isShowAlreadyAddedModal: (state) => state.isShowAlreadyAddedModal,
    newWalletsList: (state) => state.newWalletList,
    catPageProps: (state) => state.catPageProps,
  },
  mutations: {
    setModal(state, payload) {
      state.isShowModal = payload;
    },
    setLoader(state, payload) {
      state.isShowLoader = payload;
    },
    setAlreadyAddedModal(state, payload) {
      state.isShowAlreadyAddedModal = payload;
    },
    setNewWalletsList(state, data) {
      state.newWalletList = data;
    },
    setCatPageProps(state, propsObj) {
      state.catPageProps = { ...propsObj };
    },
  },
};
