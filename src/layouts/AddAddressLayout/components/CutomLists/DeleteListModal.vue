<template>
  <ModalContent
    v-click-away="deleteModalCloseHandler"
    button-text="save"
    type="warning"
    :submit-button="false"
    @close="deleteModalCloseHandler"
  >
    <DeleteListModalContent
      :is-loading="isLoading"
      @deleteClick="$emit('delete')"
      @cancelClick="deleteModalCloseHandler"
    />
  </ModalContent>
</template>
<script>
import ModalContent from '@/components/ModalContent';
import DeleteListModalContent from './components/DeleteListModalContent';

export default {
  name: 'DeleteListModal',
  components: {
    ModalContent,
    DeleteListModalContent,
  },
  props: {
    deleteModalCloseHandler: {
      required: true,
    },
    isLoading: {
      required: true,
    },
  },
};
</script>
<style scoped lang="scss"></style>
