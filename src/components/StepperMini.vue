<template>
  <div class="stepper-mini">
    <div class="stepper-mini__line" />
    <div
      v-for="(item, ndx) in steps"
      :key="ndx"
      :class="{
        active: statuses.active === item.status,
        finished: statuses.inactive === item.status && ndx < activeStepIndex,
      }"
      class="stepper-mini__step"
    >
      <div class="num">
        {{ ndx + 1 }}
      </div>
    </div>
  </div>
</template>
<script>
import { ref, computed } from 'vue';

export default {
  props: {
    steps: { required: true },
  },
  setup(props) {
    const statuses = ref({
      active: 'active',
      inactive: 'inactive',
    });

    const activeStepIndex = computed(() =>
      props.steps.findIndex((step) => step.status === statuses.value.active)
    );

    return {
      statuses,
      activeStepIndex,
    };
  },
};
</script>
<style lang="scss" scoped>
.stepper-mini {
  display: flex;
  align-items: center;
  position: relative;

  &__line {
    position: absolute;
    background: $too-ligth-blue;
    height: 1px;
    width: calc(100% - 10px);
    left: 4%;
    top: 9px;
    z-index: 0;
  }

  &__step {
    position: relative;
    width: 18px;
    height: 18px;
    box-sizing: border-box;
    border: 2px solid $too-ligth-blue;
    border-radius: 50%;
    margin-right: 30px;
    z-index: 11;
    background: $white;

    &:last-child {
      margin-right: 0;
    }

    &.active {
      background-color: $blue;

      .num {
        color: $black;
      }
    }

    &.finished {
      background-color: $green;
    }

    .num {
      position: absolute;
      left: 3px;
      top: 20px;
      font-family: 'Panton_SemiBold';
      font-size: 17px;
      color: $darkgray;
    }
  }
}
</style>
