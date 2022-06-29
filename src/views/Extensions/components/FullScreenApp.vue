<template>
  <div class="fullscreen-app"></div>
</template>
<script>
export default {
  name: 'FullScreenApp',
};
</script>
<style lang="scss" scoped>
.fullscreen-app {
  width: 100%;
  height: 100vh;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1000;
  background: linear-gradient(255.4deg, #f0f2fc 0%, #edf2fc 100%);
}
</style>
