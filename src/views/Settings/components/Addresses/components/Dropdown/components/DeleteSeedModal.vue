<template>
  <Modal>
    <ModalContent
      type="warning"
      :title="$t('settings.addresses.deleteSeedTitle')"
      :desc="$t('settings.addresses.deleteSeedDesc')"
      :submit-button="false"
      @close="$emit('close')"
    >
      <div
        v-if="isLoading"
        class="delete-seed-modal__loader"
      >
        <Loading />
      </div>

      <div class="delete-seed-modal__notify">
        <exclamation
          width="59"
          height="59"
        />
        <div class="delete-seed-modal__text">
          {{ $t('settings.addresses.deleteSeedInfo') }}
        </div>
      </div>
      <PrimaryButton
        color="#FFFFFF"
        bg-color="#FA3B33"
        hover-bg-color="#fc0800"
        box-shadow="0 0 25px rgba(219, 71, 60, 0.3)"
        class="delete-seed-modal__primary-button"
        data-qa="delete-address-Yes-button"
        @click="$emit('confirm')"
      >
        {{ $t('yes') }}
      </PrimaryButton>
      <TextButton
        @click="$emit('close')"
      >
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
import Loading from '@/components/Loading';
import exclamation from '@/assets/icons/exclamation.svg';

export default {
  name: 'DeleteSeedModal',
  components: {
    exclamation,
    Modal,
    ModalContent,
    PrimaryButton,
    TextButton,
    Loading,
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['confirm', 'close'],
};
</script>

<style lang="scss" scoped>

.delete-seed-modal {
  &__notify {
    width: 530px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    margin: 30px 0;
    background: #FFF1ED;
  }
  &__text {
    margin-left: 20px;
    color: #FA3B33;
    width: 386px;
    font-size: 14px;
    line-height: 20px;
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
    background-color: rgba($black, .2);
  }
}
</style>
