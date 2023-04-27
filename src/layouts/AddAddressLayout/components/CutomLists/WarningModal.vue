<template>
  <ModalContent
    title="Warning"
    icon="warningIcon"
    :desc="$t('customLists.warningModalDesc')"
    button-text="ok"
    type="warning"
    @close="warningModalClickHandler"
    @buttonClick="warningModalClickHandler"
  />
</template>
<script>
import ModalContent from '@/components/ModalContent';

export default {
  name: 'WarningListModal',
  components: {
    ModalContent,
  },
  props: {
    warningModalClickHandler: {
      required: true,
    },
  },
};
</script>
<style scoped lang="scss"></style>
