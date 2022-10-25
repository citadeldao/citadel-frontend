<template>
  <Modal v-if="show">
    <ModalContent type="warning" :submit-button="false" @close="$emit('close')">
      <h4 class="delete-address-modal__title">
        {{ text || $t('settings.addresses.deleteModalTitle') }}
      </h4>
      <div v-if="isLoading" class="delete-address-modal__loader">
        <Loading />
      </div>
      <template v-else>
        <PrimaryButton
          color="#FFFFFF"
          bg-color="#FA3B33"
          hover-bg-color="#fc0800"
          box-shadow="0 0 25px rgba(219, 71, 60, 0.3)"
          class="delete-address-modal__primary-button"
          data-qa="Yes"
          @click="$emit('confirm')"
        >
          {{ $t('yes') }}
        </PrimaryButton>
        <TextButton @click="$emit('close')">
          {{ $t('no') }}
        </TextButton>
      </template>
    </ModalContent>
  </Modal>
</template>

<script>
import Modal from '@/components/Modal.vue';
import ModalContent from '@/components/ModalContent.vue';
import PrimaryButton from '@/components/UI/PrimaryButton.vue';
import TextButton from '@/components/UI/TextButton.vue';
import Loading from '@/components/Loading';

export default {
  name: 'DeleteAddressModal',
  components: {
    Modal,
    ModalContent,
    PrimaryButton,
    TextButton,
    Loading,
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
};
</script>

<style lang="scss" scoped>
.delete-address-modal {
  &__title {
    margin: 30px 0;
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
</style>
