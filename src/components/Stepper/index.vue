<template>
  <div class="stepper">
    <Step
      v-for="step in steps"
      :key="step.id"
      :step="step"
    />
  </div>
</template>

<script>
import Step from './components/Step';
export default {
  name: 'Stepper',
  components: { Step },
  props: {
    steps: {
      Object,
    },
  },
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.stepper {
  min-width: 311px;
  height: fit-content;
  padding-top: 64px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  border-right: 1px solid $too-ligth-blue;
  margin-bottom: 92px;
  @include lg {
    min-width: 283px;
    padding-top: 32px;
    margin-bottom: 50px;
  }
  @include md {
    padding-top: 32px;
    min-width: 211px;
    margin-bottom: 0;
  }
}
</style>