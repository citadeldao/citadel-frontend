<template>
  <div class="modal-card">
    <closeIcon class="modal-card__close-icon" @click="$emit('close')" />
    <div class="modal-card__header" />
    <div class="modal-card__icon">
      <keep-alive>
        <component :is="currentIcon" />
      </keep-alive>
    </div>
    <span class="modal-card__message">{{ message }}</span>
    <span class="modal-card__info">{{ info }}</span>
    <PrimaryButton @click="clickHandler">
      {{ $t('ok') }}
    </PrimaryButton>
  </div>
</template>

<script>
import PrimaryButton from '@/components/UI/PrimaryButton';
import closeIcon from '@/assets/icons/close-icon-round.svg';
import { markRaw, ref } from 'vue';
export default {
  name: 'ModalCard',
  components: { PrimaryButton, closeIcon },
  props: {
    icon: {
      type: String,
    },
    message: {
      type: String,
    },
    info: {
      type: String,
    },
  },
  emits: ['close', 'buttonClick'],
  setup(props, { emit }) {
    const currentIcon = ref();
    import(`@/assets/icons/${props.icon}.svg`).then((val) => {
      currentIcon.value = markRaw(val.default);
    });

    const clickHandler = () => {
      emit('buttonClick');
    };

    return { clickHandler, currentIcon };
  },
};
</script>

<style lang="scss" scoped>
.modal-card {
  width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: $white;
  box-shadow: 15px 15px 15px rgba(63, 54, 137, 0.2);
  border-radius: 16px;
  padding-bottom: 40px;
  position: relative;
  &__close-icon {
    position: absolute;
    right: 39px;
    top: 46px;
    width: 16px;
    height: 16px;
    &:hover {
      fill: $dark-blue;
    }
  }
  &__header {
    height: 15px;
    width: 100%;
    margin-bottom: 80px;
    background: $dark-blue;
    border-radius: 16px 16px 0px 0px;
  }
  &__icon {
    margin-bottom: 50px;
  }
  &__message {
    font-size: 20px;
    line-height: 30px;
    margin-bottom: 10px;
    text-align: center;
    font-family: 'Panton_Bold';
  }
  &__info {
    font-size: 16px;
    line-height: 24px;
    width: 72%;
    text-align: center;
    color: $mid-blue;
    margin-bottom: 25px;
  }
}
</style>
