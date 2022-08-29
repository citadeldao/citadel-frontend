<template>
  <transition-group name="fade">
    <img v-if="showLoader" src="@/assets/gif/loader.gif" alt="" />
    <!-- <slot name="additional_content"/> -->
    <AddressAlreadyAdded
      v-if="showAlreadyAddedModal"
      v-click-away="modalCloseHandler"
      @close="modalCloseHandler"
      @buttonClick="modalCloseHandler"
    />
    <CatPage
      v-if="showModal && !showAlreadyAddedModal"
      :data="newWalletList"
      :wallet-type-placeholder="walletTypePlaceholder"
      v-click-away="modalCloseHandler"
      @close="modalCloseHandler"
      @buttonClick="modalCloseHandler"
      :input-type-icon="inputTypeIcon"
      :data-qa="dataQa"
    />
  </transition-group>
</template>
<script>
import { computed } from 'vue';
import CatPage from '@/components/CatPage';
import { useStore } from 'vuex';
import AddressAlreadyAdded from '@/components/Modals/AddressAlreadyAdded';
import redirectToWallet from '@/router/helpers/redirectToWallet';
export default {
  name: 'NewWallets',
  components: {
    CatPage,
    AddressAlreadyAdded,
  },
  setup() {
    const store = useStore();
    const dataQa = computed(
      () => store.getters['newWallets/catPageProps'].dataQa
    );
    const inputTypeIcon = computed(
      () => store.getters['newWallets/catPageProps'].inputTypeIcon
    );
    const walletTypePlaceholder = computed(
      () => store.getters['newWallets/catPageProps'].walletTypePlaceholder
    );
    const newWalletList = computed(
      () => store.getters['newWallets/newWalletsList']
    );
    const showLoader = computed(() => store.getters['newWallets/isShowLoader']);
    const showModal = computed(() => store.getters['newWallets/isShowModal']);
    const showAlreadyAddedModal = computed(
      () => store.getters['newWallets/isShowAlreadyAddedModal']
    );
    const modalCloseHandler = async () => {
      store.commit('newWallets/setModal', false);
      await redirectToWallet({
        wallet:
          newWalletList.value[0] || store.getters['wallets/currentWallet'],
        root: true,
      });
      store.commit('newWallets/setLoader', false);
      store.commit('newWallets/setAlreadyAddedModal', false);
      store.commit('newWallets/setNewWalletsList', []);
    };
    return {
      newWalletList,
      showModal,
      showLoader,
      showAlreadyAddedModal,
      modalCloseHandler,
      dataQa,
      inputTypeIcon,
      walletTypePlaceholder,
    };
  },
};
</script>
