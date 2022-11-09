<template>
  <!-- TODO SHIT ON V-CLICK-AWAY -->
  <Modal v-if="show">
    <ModalContent
      type="warning"
      :submit-button="false"
      @close="close"
      v-click-away="close"
    >
      <h4 class="delete-address-modal__title">
        {{ text || $t('settings.addresses.deleteModalTitle') }}
      </h4>
      <h3 v-html="$t('settings.addresses.deleteModalSubtitle')" />
      <PrimaryButton
        color="#FFFFFF"
        bg-color="#FA3B33"
        hover-bg-color="#fc0800"
        box-shadow="0 0 25px rgba(219, 71, 60, 0.3)"
        class="delete-address-modal__primary-button"
        data-qa="Yes"
        @click="$emit('confirm')"
        :loading="isLoading"
      >
        {{ $t('yes') }}
      </PrimaryButton>
      <TextButton @click="close">
        {{ $t('no') }}
      </TextButton>
    </ModalContent>
  </Modal>
</template>

<script>
import Modal from '@/components/Modal.vue';
import ModalContent from '@/components/ModalContent.vue';
import PrimaryButton from '@/components/UI/PrimaryButton.vue';
import TextButton from '@/components/UI/TextButton.vue';

export default {
  name: 'DeleteAddressModal',
  components: {
    Modal,
    ModalContent,
    PrimaryButton,
    TextButton,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: '',
    },
  },
  emits: ['confirm', 'close'],
  setup(props, { emit }) {
    const close = () => {
      emit('close');
    };
    return {
      close,
    };
  },
};
</script>

<style lang="scss" scoped>
.delete-address-modal {
  &__title {
    margin: 30px 0 10px;
    font-family: 'Panton_Bold';
    font-size: 20px;
    line-height: 30px;
  }
  &__primary-button {
    margin-bottom: 24px;
  }
  &__loader {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba($black, 0.2);
  }
}
h3 {
  font-size: 16px;
  font-weight: 400;
  margin-top: 0;
}
</style>
