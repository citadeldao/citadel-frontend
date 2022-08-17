<template>
  <div class="modal_content">
    <div class="modal_content__header" />
    <div class="modal_content__content">
      <closeIcon
        class="modal_content__close-icon"
        @click="$emit('close', $event)"
      />
      <addedIcon class="modal_content__image" />
      <div class="modal_content__title">
        {{ $t('addedModal.title') }}
      </div>
      <div class="modal_content__desc">
        {{ $t('addedModal.desc') }}
      </div>
      <div class="modal__btn">
        <PrimaryButton @click.stop="clickHandler"> Ok </PrimaryButton>
      </div>
    </div>
  </div>
</template>

<script>
import closeIcon from '@/assets/icons/close-icon-round.svg';
import addedIcon from '@/assets/icons/wallet-added.svg';
import PrimaryButton from '@/components/UI/PrimaryButton';

export default {
  name: 'AddressAlreadyAdded',
  components: { PrimaryButton, closeIcon, addedIcon },
  emits: ['close', 'buttonClick'],
  setup(props, { emit }) {
    const clickHandler = () => {
      emit('buttonClick');
    };

    return { clickHandler };
  },
};
</script>

<style lang="scss" scoped>
.modal_content {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 600px;
  background: $white;
  border-radius: 16px;
  box-shadow: 15px 15px 15px rgba(63, 54, 137, 0.2);
  &__content {
    display: flex;
    flex-direction: column;
    padding: 31px 40px 40px 40px;
    align-items: center;
    position: relative;
  }
  &__header {
    height: 16px;
    background: $dark-blue;
    border-radius: 16px 16px 0px 0px;
  }
  &__close-icon {
    position: absolute;
    right: 39px;
    top: 30px;
    cursor: pointer;
    width: 16px;
    height: 16px;
    &:hover {
      fill: $dark-blue;
    }
  }

  &__image {
    margin-top: 42px;
    margin-bottom: 32px;
  }
  &__title {
    margin-bottom: 7px;
    font-weight: 700;
    font-size: 20px;
    line-height: 30px;
  }
  &__desc {
    margin-bottom: 23px;
    font-weight: 400;
    font-size: 16px;
    line-height: 30px;
    color: $mid-blue;
  }
  & button {
  }
}

.modal__btn {
  text-align: center;
}
</style>
