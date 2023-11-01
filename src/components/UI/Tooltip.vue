<template>
  <teleport to="body">
    <div
      v-if="showTooltip"
      id="tooltip"
      class="tooltip"
      :style="{
        top: `${tooltipY}px`,
        left: `${tooltipX}px`,
        maxWidth: `${maxWidth}px`,
      }"
      @mouseover="tooltipSelfOn"
      @mouseout="tooltipOff"
      @click.stop
    >
      <slot name="content" />
      {{ text }}
    </div>
  </teleport>

  <div
    class="tooltip__target"
    @mouseover="tooltipOn($event)"
    @mouseout="tooltipOff"
  >
    <slot />
  </div>
</template>
<script>
import { ref, nextTick } from 'vue';

export default {
  name: 'Tooltip',
  props: {
    text: {
      type: String,
      default: '',
    },
    maxWidth: {
      type: Number,
    },
  },
  setup() {
    const showTooltip = ref(false);
    const tooltipX = ref(0);
    const tooltipY = ref(0);

    const tooltipSelfOn = () => (showTooltip.value = true);

    const tooltipOn = (event) => {
      if (event.target.className === 'tooltip__target') {
        return;
      }

      showTooltip.value = true;

      nextTick(() => {
        const tooltip = document.getElementById('tooltip');
        const { left, top, width, height } =
          event.target.getBoundingClientRect();
        tooltipX.value = left - (tooltip.offsetWidth - width) / 2;
        tooltipY.value = top - tooltip.offsetHeight - height / 2;
      });
    };

    const tooltipOff = () => {
      showTooltip.value = false;
    };

    return {
      showTooltip,
      tooltipOn,
      tooltipOff,
      tooltipX,
      tooltipY,
      tooltipSelfOn,
    };
  },
};
</script>

<style lang="scss" scoped>
.tooltip {
  background: $white;
  box-shadow: 0 4px 25px rgba(63, 54, 137, 0.25);
  border-radius: 6px;
  padding: 11px;
  position: absolute;
  z-index: 1001;
  top: 22px;
  transition: 0s;
  color: $mid-blue;
  max-width: 350px;
  word-wrap: break-word;
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -4px;
    transform: rotate(45deg);
    margin-left: -5px;
    border-radius: 2px;
    width: 10px;
    height: 10px;
    background: $white;
  }

  &__target {
    display: inline-flex;
    align-items: center;
    //margin-left: 5px;
    cursor: pointer;

    & svg {
      top: 1px;
    }
  }
}

body.dark {
  .tooltip {
    background: #313354;
    color: $white;

    &::after {
      background: #313354;
    }
  }
}
</style>
