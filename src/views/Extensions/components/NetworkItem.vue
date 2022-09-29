<template>
  <div class="icon">
    <keep-alive>
      <component :is="currentIcon" width="16" height="16" />
    </keep-alive>
  </div>
</template>
<script>
import { ref, markRaw } from 'vue';

export default {
  props: {
    icon: {
      required: true,
    },
  },
  setup(props) {
    const currentIcon = ref(null);

    import(`@/assets/icons/networks/${props.icon}.svg`).then((val) => {
      currentIcon.value = markRaw(val.default);
    });

    return {
      currentIcon,
    };
  },
};
</script>
<style lang="scss" scoped>
.icon {
  width: 50px;
  height: 30px;
  display: flex;
  align-items: center;

  svg {
    fill: #00a3ff;
  }
}
</style>
