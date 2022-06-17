<template>
  <div
    class="step"
    :class="{
      'step--active': currentStep === step.id,
      'step--passed': currentStep > step.id,
      'step--next': currentStep < step.id,
      'step--disabled': step.status === 'inactive',
    }"
    @click="updateCurrentStep(step.id)"
  >
    <div class="step__info">
      <span class="step__title">{{ step.id }} {{ $t('steps.step') }} </span>
      <span class="step__desc"> {{ step.stepDesc }}</span>
    </div>
    <div class="step__icon">
      <done v-if="currentStep > step.id" />
      <keep-alive v-else>
        <component :is="icon" />
      </keep-alive>
    </div>
    <div class="step__dot" />
    <div class="step__white-space" />
  </div>
</template>

<script>
import { markRaw, ref, inject } from 'vue';
import done from '@/assets/icons/step/done.svg';

export default {
  name: 'Step',
  components: { done },
  props: {
    step: {
      type: Object,
    },
  },
  setup(props) {
    const icon = ref();
    import(`@/assets/icons/step/${props.step.icon}.svg`).then((val) => {
      icon.value = markRaw(val.default);
    });

    const currentStep = inject('currentStep');
    const updateCurrentStep = inject('updateCurrentStep');

    return {
      icon,
      currentStep,
      updateCurrentStep,
    };
  },
};
</script>

<style lang="scss" scoped>
.step--active {
  .step__icon,
  .step__dot {
    background: $blue;
  }
  .step__desc {
    color: $blue;
  }
}
.step--passed {
  .step__icon,
  .step__dot {
    background: $green;
  }
  .step__title,
  .step__desc {
    color: $mid-blue;
  }
}
.step--next {
  .step__icon {
    background: rgb(210, 219, 231); // $too-ligth-blue;
    opacity: 0.8;
    position: relative;
    &::after {
      content: '';
      // opacity: 0.5;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      position: absolute;
      border-radius: $round;
    }
    & svg {
      fill: $mid-gray;
    }
  }
  .step__title,
  .step__desc {
    color: $mid-gray;
  }
}

.step--disabled {
  cursor: not-allowed;
}

.step {
  display: flex;
  margin-bottom: 104px;
  position: relative;
  @include lg {
    margin-bottom: 64px;
  }
  @include md {
    height: 44px;
    margin-bottom: 37px;
    &__icon {
      width: 32px;
      height: 32px;
    }
  }
  &:hover:not(.step--next):not(.step--disabled) {
    .step__icon,
    .step__dot {
      background: $too-dark-blue;
      opacity: 1;
    }
    .step__title,
    .step__desc {
      color: $too-dark-blue;
    }
  }
  &:last-child {
    margin-bottom: 0;
    &::after {
      content: '';
      right: -2px;
      bottom: 0;
      position: absolute;
      width: 3px;
      height: 23px;
      background: $white;
      @include md {
        right: -2px;
        bottom: -1px;
      }
    }
  }
  &__info {
    display: flex;
    flex-direction: column;
    margin-right: 24px;
    justify-content: center;
    align-items: flex-end;
    @include lg {
      margin-right: 20px;
    }
    @include md {
      margin-right: 8px;
    }
  }
  &__title {
    font-size: 20px;
    line-height: 24px;
    font-family: 'Panton_Bold';
    @include md {
      font-size: 16px;
      line-height: 19px;
    }
  }
  &__desc {
    font-size: 14px;
    line-height: 17px;
    text-align: end;
    @include md {
      font-size: 12px;
      line-height: 14px;
    }
  }
  &__icon {
    width: 60px;
    height: 60px;
    border-radius: $round;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 40px;
    @include lg {
      margin-right: 24px;
    }

    @include md {
      width: 32px;
      height: 32px;
      margin-right: 21px;
    }
    & svg {
      width: 27px;
      height: 27px;
      @include md {
        width: 14px;
        height: 14px;
      }
    }
  }

  &__dot {
    width: 13px;
    height: 13px;
    border: 2px solid $too-ligth-blue;
    border-radius: $round;
    position: absolute;
    right: -7px;
    top: 24px;
    background: $white;
    @include md {
      width: 11px;
      height: 11px;
      border: 1px solid $too-ligth-blue;
      right: -6px;
      top: 11px;
    }
  }
}
</style>
