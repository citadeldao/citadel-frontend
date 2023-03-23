<template>
  <div
    v-if="currentApp"
    :class="{ fullScreen: showFullScreen }"
    class="extensions__app-wrap"
  >
    <keep-alive v-if="!showFullScreen">
      <component :is="closeIcon" class="close-icon" @click="$emit('close')" />
    </keep-alive>
    <iframe
      :src="currentApp.url"
      frameBorder="0"
      :width="showFullScreen ? '100%' : 550"
      height="710"
      align="left"
      name="target"
      class="extensions__frame"
    />
  </div>
</template>
<script>
import { ref, markRaw } from 'vue';

export default {
  name: 'FrameApp',
  props: {
    showFullScreen: {
      required: true,
    },
    currentApp: {
      required: true,
    },
  },
  setup() {
    const closeIcon = ref('');

    import(`@/assets/icons/extensions/close.svg`).then((val) => {
      closeIcon.value = markRaw(val.default);
    });

    return {
      closeIcon,
    };
  },
};
</script>
<style lang="scss" scoped>
.extensions__app-wrap {
  position: relative;
  border-radius: 20px;

  &.fullScreen {
    width: 100%;
    box-sizing: border-box;

    iframe {
      height: calc(100vh - 120px);
    }
  }

  .close-icon {
    position: absolute;
    top: 0px;
    right: -40px;

    &:hover {
      cursor: pointer;
      opacity: 0.7;
    }
  }
}

.extensions__frame {
  border-radius: 20px;
  border: none;
  outline: none;
  z-index: 1;
}
</style>
