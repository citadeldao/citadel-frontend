import { ref, provide } from 'vue';

export default function useCurrentStep(initialStep, stepList, blockPrevious = true) {
  // Только так копия создается правильно
  const steps = ref(JSON.parse(JSON.stringify(stepList)));
  const currentStep = ref(initialStep);
  provide('currentStep', currentStep);

  const updateCurrentStep = (step) => {
    if (steps.value) {
      const targetStep = steps.value.find(item => item.id === step);

      if (targetStep.status === 'active') {
        currentStep.value = step;
      } else {
        return;
      }
    }
  };
  provide('updateCurrentStep', updateCurrentStep);

  const setCurrentStep = (step) => {
    currentStep.value = step;
  };

  const nextStep = () => {
    if (steps.value) {
      const currStepIndex = steps.value.findIndex((step => step.id === currentStep.value));

      if (blockPrevious) {
        steps.value[currStepIndex].status = 'inactive';
      }

      steps.value[currStepIndex + 1].status = 'active';
      currentStep.value++;
    } else {
      currentStep.value++;
    }
  };
  provide('nextStep', nextStep);

  const previousStep = () => {
    currentStep.value--;
  };
  provide('previousStep', previousStep);

  return {
    currentStep,
    steps,
    nextStep,
    setCurrentStep,
  };
}
