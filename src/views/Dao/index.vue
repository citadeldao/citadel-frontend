<template>
  <div class="dao">
    <div class="dao__main">
      <DaoPlaceholder />
    </div>
    <div class="dao__rigth-section" />
  </div>
</template>

<script>
import DaoPlaceholder from './components/DaoPlaceholder.vue';
export default {
  name: 'Dao',
  components: { DaoPlaceholder },
  setup() {},
};
</script>

<style lang="scss" scoped>
.dao {
  display: flex;
  flex: 1;
  &__main {
    display: flex;
    flex: 1;
    background: $white;
    box-shadow: -10px 4px 27px rgba(0, 0, 0, 0.1);
    border-radius: 50px 50px 0px 0px;
    @include lg {
      border-radius: 25px 25px 0px 0px;
    }
    @include md {
      box-shadow: 0px 0px 25px rgba(106, 75, 255, 0.3);
      border-radius: 25px 25px 0px 0px;
    }
  }
}
</style>
