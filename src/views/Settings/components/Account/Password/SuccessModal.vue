<template>
  <Modal v-if="show">
    <ModalContent
      v-click-away="() => $emit('closeSuccessModal')"
      type="success"
      @close="$emit('closeSuccessModal')"
    >
      <div class="success-modal">
        <successIcon width="100" height="100" class="success-icon" />
        <div class="title">
          {{ $t('settings.changePassword.successTitle') }}
        </div>
        <div class="description">
          {{ $t('settings.changePassword.successDescription') }}
        </div>
      </div>
    </ModalContent>
  </Modal>
</template>

<script>
import successIcon from '@/assets/icons/success.svg';
import Modal from '@/components/Modal';
import ModalContent from '@/components/ModalContent';
export default {
  name: 'ChangePassword',
  components: {
    successIcon,
    Modal,
    ModalContent,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.success-modal {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .success-icon {
    margin: 20px 0 40px;
  }

  .title {
    color: $black;
    font-family: Panton_Bold;
    font-size: 20px;
  }

  .description {
    color: #6b93c0;
    font-family: Panton_Regular;
    font-size: 16px;
    margin: 15px 0 10px 0;
  }
}
</style>
