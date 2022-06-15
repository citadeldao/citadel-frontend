<template>
  <div class="delete-list-modal-content">
    <div v-if="isLoading" class="loader">
      <Loading />
    </div>

    <h4 class="delete-list-modal-content__title">
      {{ $t('customLists.deleteListModalTitle') }}
    </h4>
    <PrimaryButton
      data-qa="Yes"
      color="#FFFFFF"
      bg-color="#FA3B33"
      box-shadow="0px 0px 25px rgba(219, 71, 60, 0.3)"
      hover-bg-color="#000000"
      @click="$emit('deleteClick')"
    >
      {{ $t('yes') }}
    </PrimaryButton>
    <span
      class="delete-list-modal-content__no-button"
      @click="$emit('cancelClick')"
    >
      {{ $t('no') }}
    </span>
  </div>
</template>

<script>
import PrimaryButton from '@/components/UI/PrimaryButton';
import Loading from '@/components/Loading';

export default {
  name: 'DeleteListModalContent',
  components: {
    PrimaryButton,
    Loading,
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['deleteClick', 'cancelClick'],
};
</script>

<style lang="scss" scoped>
.delete-list-modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;

  &__title {
    font-family: 'Panton_Bold';
    font-size: 20px;
    line-height: 30px;
    margin: 0;
    margin-bottom: 30px;
  }

  &__no-button {
    font-size: 18px;
    line-height: 27px;
    text-decoration-line: underline;
    color: $too-dark-blue;
    font-family: 'Panton_Bold';
    margin-top: 24px;
    cursor: pointer;

    &:hover {
      color: $blue;
    }
  }

  .loader {
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
