<template>
  <div>
    <teleport to="body">
      <div v-for="(modal, ndx) in modalItems" :key="ndx">
        <Modal v-if="modal.showFlag()">
          <ModalContent
            v-click-away="modal.onClose"
            :type="modal.type"
            :title="modal.title"
            :desc="modal.desc"
            :button-text="modal.buttonText"
            :button-text2="modal.buttonText2"
            @close="modal.onClose"
            @buttonClick="buttonClick(modal)"
            @buttonClick2="modal.onCancel"
          >
            <slot />
          </ModalContent>
        </Modal>
      </div>
    </teleport>
  </div>
</template>
<script>
import Modal from '@/components/Modal';
import ModalContent from '@/components/ModalContent';

export default {
  name: 'DynamicModal',
  components: {
    Modal,
    ModalContent,
  },
  props: {
    modalItems: {
      required: true,
      type: Array,
    },
  },
  setup(props, { emit }) {
    const buttonClick = function (modal) {
      modal.onSuccess;
      return emit(modal.eventName);
    };
    return {
      buttonClick,
    };
  },
};
</script>
<style lang="scss" scoped></style>
