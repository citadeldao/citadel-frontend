<template>
  <AppLayout>
    <router-view />
  </AppLayout>
  <teleport to="body">
    <Toasts />
  </teleport>
  <teleport v-if="showWarningRemoveWallets && loaded" to="body">
    <Modal>
      <WarningRemoveWallets />
    </Modal>
  </teleport>
  <teleport v-if="showModal" to="body">
    <Modal>
      <MobileAppModal @close="closeMobileModal" />
    </Modal>
  </teleport>
  <teleport v-if="newWalletsModalShow" to="body">
    <Modal>
      <NewWalletsModal />
    </Modal>
  </teleport>
</template>

<script>
import Modal from '@/components/Modal';
import MobileAppModal from './components/MobileAppModal';
import WarningRemoveWallets from '@/components/Modals/WarningRemoveWallets';
import NewWalletsModal from '@/components/Modals/NewWallets';
import { computed, inject, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import Toasts from '@/components/Toasts.vue';
import AppLayout from './layouts/AppLayout';
import { useWindowSize } from 'vue-window-size';
import { screenWidths } from '@/config/sreenWidthThresholds';
import { useRouter, useRoute } from 'vue-router';
// import { isMobile } from 'mobile-device-detect';

export default {
  name: 'App',
  components: {
    Toasts,
    AppLayout,
    MobileAppModal,
    Modal,
    NewWalletsModal,
    WarningRemoveWallets,
  },
  setup() {
    const citadel = inject('citadel');
    const isClosed = ref(false);
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const loaded = ref(false);
    const { width } = useWindowSize();
    const showWarningRemoveWallets = computed(
      () => store.getters['app/showWarningRemoveWallets']
    );
    const showModal = computed(() => {
      if (['modalPrivacy', 'modalTerms'].includes(route.name)) return false;
      return width.value < screenWidths.md && !isClosed.value; // !!(width.value < screenWidths.md && !isClosed.value && isMobile)
    });
    const newWalletsModalShow = computed(
      () =>
        store.getters['newWallets/isShowModal'] ||
        store.getters['newWallets/isShowLoader'] ||
        store.getters['newWallets/isShowAlreadyAddedModal']
    );
    onMounted(() => {
      setTimeout(() => {
        loaded.value = true;
        console.log('loaded', loaded.value);
      }, 3000);
      store.dispatch('i18n/init');
      window.addEventListener('focus', async function () {
        const isAuthenticated = JSON.parse(
          localStorage.getItem('isAuthenticated')
        );
        if (!isAuthenticated) {
          store.commit('auth/SET_USERNAME', null);
          store.commit('auth/SET_IS_AUTHENTICATED', null);
          await citadel.reset(false);
          router.push({ name: 'Login' });
        }
        const lsMnemonic = localStorage.getItem(
          `${store.getters['profile/info'].id}_syncEncodeUserMnemonic`
        );
        const lsPasswordHash = localStorage.getItem(
          `${store.getters['profile/info'].id}_syncPasswordHash`
        );
        store.commit(
          'crypto/setUserMnemonic',
          lsMnemonic === 'null' ? null : lsMnemonic
        );
        store.commit(
          'crypto/setPasswordHash',
          lsPasswordHash === 'null' ? null : lsPasswordHash
        );
      });
    });

    const closeMobileModal = () => {
      isClosed.value = true;
    };

    onMounted(() => {
      const theme = localStorage.getItem('appTheme');
      if (theme) {
        document.body.classList.add(theme);
      }
    });

    return {
      showModal,
      newWalletsModalShow,
      isClosed,
      loaded,
      showWarningRemoveWallets,
      closeMobileModal,
    };
  },
};
</script>
<style lang="scss">
body.dark {
  .json-container {
    background-color: #26273b;
    color: #fff;

    .json-key {
      color: #6b93c0;
    }
  }
}
</style>
