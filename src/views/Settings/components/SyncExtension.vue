<template>
  <div class="sync-data">
    <h5 class="sync-data__title">
      {{ $t('syncExtensions.extensionBlock') }}
    </h5>
    <SyncToFromExtension v-if="syncModal" @close="closeModal" />
    <div class="settings-wrap">
      <span class="sync-data__description">
        {{ $t('syncExtensions.syncWithExtension') }}
      </span>
      <PrimaryButton class="sync-data__button" @click="openSync">
        {{ $t('syncExtensions.sync') }}
      </PrimaryButton>
    </div>
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
  @include settings-card-default;

  margin-top: $card-margin;
  display: flex;
  align-items: center;
  justify-content: center;

  &__title {
    width: 100%;
    text-align: left;
  }

  &__button {
    margin-top: 10px !important;
  }
}
</style>
