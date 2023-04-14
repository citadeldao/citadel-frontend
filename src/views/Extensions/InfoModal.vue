<template>
  <ModalContent
    show-success-icon
    v-click-away="onClose"
    width="600px"
    :title="selectedApp.name"
    :desc="selectedApp.short_description"
    :internal-icon="selectedApp.logo"
    type="action"
    :submit-button="false"
    @close="onClose"
  >
    <AppInfo :app="selectedApp" @launchApp="onLaunchApp" />
  </ModalContent>
</template>
<script>
import AppInfo from './components/AppInfo';
import ModalContent from '@/components/ModalContent';

export default {
  name: 'InfoModal',
  components: {
    ModalContent,
    AppInfo,
  },
  props: {
    onClose: {
      required: true,
    },
    selectedApp: {
      required: true,
    },
    onLaunchApp: {
      required: true,
    },
  },
};
</script>
<style scoped></style>
