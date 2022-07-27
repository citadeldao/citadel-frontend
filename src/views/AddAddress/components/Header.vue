<template>
  <div class="header">
    <div class="column">
      <BackButton data-qa="add-address__back-button" @click="goBack" />
      <div class="header__section">
        <span class="header__title">
          {{ title || currentStepInfo.headerTitle }}
        </span>
        <span class="header__desc">
          {{ info || currentStepInfo.headerInfo }}
        </span>
      </div>
    </div>
    <StepperMini :steps="steps" />
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import StepperMini from '@/components/StepperMini';
import BackButton from '@/components/UI/BackButton';

export default {
  name: 'Header',
  components: { BackButton, StepperMini },
  props: {
    steps: {
      type: Array,
      default: null,
    },
    currentStep: {
      type: Number,
    },
    title: {
      type: String,
    },
    info: {
      type: String,
    },
  },
  setup(props) {
    const router = useRouter();
    const route = useRoute();
    const currentStepInfo = computed(() =>
      props.steps.find((item) => item.id === props.currentStep)
    );

    const goBack = () => {
      if (route.name === 'MetamaskKeplr') {
        router.push({ name: 'AddWalletTypes' });
      } else {
        router.back();
      }
    };

    return { currentStepInfo, goBack };
  },
};
</script>

<style lang="scss" scoped>
.header {
  flex-shrink: 0;
  height: 133px;
  border-bottom: 1px solid $too-ligth-blue;
  // padding-right: 53px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .column {
    display: flex;
  }

  @include lg {
    height: 100px;
  }
  @include md {
    height: 95px;
    padding-right: 0;
  }

  &__section {
    display: flex;
    flex-direction: column;
    margin-left: 25px;
  }

  &__title {
    font-size: 20px;
    line-height: 30px;
    font-weight: 700;
    @include md {
      font-size: 18px;
    }
  }

  &__desc {
    font-size: 16px;
    line-height: 27px;
    color: $mid-blue;
    @include md {
      font-size: 14px;
      line-height: 17px;
    }
  }
}
</style>
