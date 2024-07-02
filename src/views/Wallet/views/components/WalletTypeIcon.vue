<template>
  <div class="wallet-type">
    <component :is="icon" width="16" height="16" />
  </div>
</template>
<script>
import { markRaw, ref, onMounted } from 'vue';

export default {
  props: {
    walletType: {
      required: true,
    },
  },
  setup(props) {
    const icon = ref(null);

    onMounted(() => {
      import(`@/assets/icons/types/${props.walletType}.svg`).then((val) => {
        icon.value = markRaw(val.default);
      });
    });

    return {
      icon,
    };
  },
};
</script>
<style lang="scss" scoped>
.wallet-type {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: #afbccb;

  svg {
    fill: #fff;
  }
}
</style>
