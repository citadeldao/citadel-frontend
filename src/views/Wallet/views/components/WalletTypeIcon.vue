<template>
  <div class="wallet-type">
    <component :is="icon" width="16" height="16" />
    <div :style="{ backgroundColor: types[walletType].color }" class="badge" />
  </div>
</template>
<script>
import { markRaw, ref, onMounted } from 'vue';
import { types } from '@/config/walletType';

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
      types,
      icon,
    };
  },
};
</script>
<style lang="scss" scoped>
.wallet-type {
  position: relative;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: #afbccb;

  .badge {
    width: 11px;
    height: 11px;
    border-radius: $round;
    border: 1px solid $white;
    position: absolute;
    right: -4px;
    bottom: -3px;
    background-color: red;
  }

  svg {
    fill: #fff;
  }
}
</style>
