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
import router from '@/router';
export default {
  name: 'NewWallets',
  components: {
    CatPage,
    AddressAlreadyAdded,
  },
  setup() {
    const store = useStore();
    const dataQa = computed(
      () => store.getters['newWallets/catPagePropsG'].dataQa
    );
    const inputTypeIcon = computed(
      () => store.getters['newWallets/catPagePropsG'].inputTypeIcon
    );
    const walletTypePlaceholder = computed(
      () => store.getters['newWallets/catPagePropsG'].walletTypePlaceholder
    );
    const newWalletList = computed(
      () => store.getters['newWallets/newWalletsListG']
    );
    const showLoader = computed(
      () => store.getters['newWallets/isShowLoaderG']
    );
    const showModal = computed(() => store.getters['newWallets/isModalShown']);
    const showAlreadyAddedModal = computed(
      () => store.getters['newWallets/isShowAlreadyAddedModalG']
    );
    const routeName = computed(() => store.getters['newWallets/routeNameG']);
    const modalCloseHandler = async () => {
      store.dispatch('newWallets/hideModal');
      if (!routeName.value) {
        await redirectToWallet({
          wallet:
            newWalletList.value[0] || store.getters['wallets/currentWallet'],
          root: true,
        });
      } else {
        router.push({
          name: routeName.value,
          params: {
            net: newWalletList.value[0]?.net,
            address: newWalletList.value[0]?.address,
          },
        });
      }
      store.dispatch('newWallets/hideLoader');
      store.dispatch('newWallets/hideAlreadyAddedModal');
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
