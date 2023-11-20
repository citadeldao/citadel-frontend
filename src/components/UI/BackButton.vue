<template>
  <button class="back-button" @click="$emit('click')">
    <div :class="{ isDown }" class="back-button__icon">
      <arrowRigth />
    </div>
    <template v-if="!isDown">
      {{ $t('backBtn') }}
    </template>
  </button>
</template>

<script>
import arrowRigth from '@/assets/icons/arrow-rigth.svg';
export default {
  name: 'BackButton',
  components: { arrowRigth },
  props: {
    isDown: {
      type: Boolean,
      required: false,
    },
  },
  emits: ['click'],
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.back-button {
  display: flex;
  align-items: center;
  font-size: 18px;
  line-height: 22px;
  color: $too-dark-blue;
  font-family: 'Panton_Bold';
  background: transparent;
  @include md {
    font-size: 14px;
    line-height: 17px;
  }
  &:hover {
    color: $dark-blue;
    & div {
      background: $blue;
    }
  }
  &__icon {
    width: 48px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: $dark-blue;
    border-radius: $round;
    box-shadow: 0px 4px 20px rgba(105, 95, 225, 0.7);
    margin-right: 16px;
    @include md {
      width: 32px;
      height: 32px;
      margin-right: 8px;
    }
    & svg {
      width: 9px;
      height: 14px;
      fill: $white;
      transform: rotate(180deg);
      @include md {
        width: 6px;
        height: 10px;
      }
    }

    &.isDown {
      transform: rotate(-90deg);
    }
  }
}

body.dark {
  .back-button {
    color: #4f70cf;

    &__icon {
      box-shadow: none;
    }
  }
}
</style>
