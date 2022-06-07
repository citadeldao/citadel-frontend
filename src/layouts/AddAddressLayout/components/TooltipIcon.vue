<template>
  <keep-alive>
    <component :is="currentIcon" />
  </keep-alive>
</template>

<script>
import { markRaw, ref } from 'vue';

export default {
  name: 'TooltipIcon',
  props: {
    icon: {
      type: String,
    },
  },
  setup(props) {
    const currentIcon = ref();
    import(`@/assets/icons/${props.icon}.svg`).then((val) => {
      currentIcon.value = markRaw(val.default);
    });

    return { currentIcon };
  },
};
</script>
