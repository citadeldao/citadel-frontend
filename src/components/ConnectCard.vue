<template>
  <div class="connect-card">
    <keep-alive>
      <component :is="currentIcon" />
    </keep-alive>
    <span class="connect-card__title">{{ title }}</span>
  </div>
</template>

<script>
import { ref, markRaw } from 'vue';
export default {
  name: 'ConnectCard',
  props: {
    icon: {
      type: String,
    },
    title: {
      type: String,
    },
  },
  setup(props) {
    const currentIcon = ref();
    import(`@/assets/icons/${props.icon}.svg`).then((val) => {
      currentIcon.value = markRaw(val.default);
    });

    return {
      currentIcon,
    };
  },
};
</script>

<style lang="scss" scoped>
.connect-card {
  width: 275px;
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding-top: 47px;
  padding-bottom: 53px;
  border: 1px dashed $too-ligth-blue;
  border-radius: 8px;
  margin-right: 30px;
  @include lg {
    width: 256px;
  }
  @include md {
    width: 230px;
    margin-right: 15px;
  }
  &__title {
    font-size: 20px;
    line-height: 24px;
    color: $mid-blue;
  }
}
</style>