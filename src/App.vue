<template>
  <AppLayout>
    <router-view />
  </AppLayout>
  <teleport to="body">
    <Toasts />
  </teleport>
  <teleport v-if="showModal" to="body">
    <Modal>
      <MobileAppModal @close="isClosed = true" />
    </Modal>
  </teleport>
  <teleport v-if="newWalletsModalShow" to="body">
    <Modal>
      <NewWalletsModal data-qa="" />
    </Modal>
  </teleport>
</template>

<script>
import Modal from '@/components/Modal';
import MobileAppModal from './components/MobileAppModal';
import NewWalletsModal from '@/components/Modals/NewWallets';
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import Toasts from '@/components/Toasts.vue';
import AppLayout from './layouts/AppLayout';
import { useWindowSize } from 'vue-window-size';
import { screenWidths } from '@/config/sreenWidthThresholds';
import { isMobile } from 'mobile-device-detect';

export default {
  name: 'App',
  components: {
    Toasts,
    AppLayout,
    MobileAppModal,
    Modal,
    NewWalletsModal,
  },
  setup() {
    const isClosed = ref(false);
    const store = useStore();
    const { width } = useWindowSize();
    const showModal = computed(
      () => !!(width.value < screenWidths.md && !isClosed.value && isMobile)
    );
    const newWalletsModalShow = computed(
      () =>
        store.getters['newWallets/isShowModal'] ||
        store.getters['newWallets/isShowLoader'] ||
        store.getters['newWallets/isShowAlreadyAddedModal']
    );
    onMounted(() => {
      store.dispatch('i18n/init');
    });

    return {
      showModal,
      newWalletsModalShow,
      isClosed,
    };
  },
};
</script>
