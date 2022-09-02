<template>
  <div class="sync-data">
    <SyncToFromExtension v-if="syncModal" @close="closeModal" />
    <PrimaryButton class="sync-data__btn" @click="openSync">
      {{ $t('syncExtensions.syncWithExtension') }}
    </PrimaryButton>
  </div>
</template>

<script>
import SyncToFromExtension from '@/views/SyncToFromExtension';
import PrimaryButton from '@/components/UI/PrimaryButton';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'TransferData',
  components: {
    PrimaryButton,
    SyncToFromExtension,
  },
  setup() {
    const route = useRoute();
    const syncModal = ref(false);

    const openSync = () => {
      syncModal.value = true;
    };

    const closeModal = () => {
      syncModal.value = false;
      localStorage.removeItem('openSync');
    };

    if (route.hash === '#sync' || localStorage.getItem('openSync')) {
      setTimeout(() => {
        openSync();
        localStorage.removeItem('openSync');
      }, 1000);
    }

    return {
      openSync,
      closeModal,
      syncModal,
    };
  },
};
</script>

<style lang="scss" scoped>
.sync-data {
  display: flex;
  align-items: center;
  justify-content: center;

  &__btn {
    width: 90%;
    margin-top: 100px;
  }
}
</style>
