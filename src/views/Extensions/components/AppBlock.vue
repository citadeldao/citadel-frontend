<template>
  <div
    :style="{ borderLeft: `8px solid ${color}` }"
    class="app-block"
    @click="$emit('openApp', title)"
  >
    <keep-alive class="layout-icon">
      <component :is="layoutIcon" />
    </keep-alive>
    <div class="app-block__head">
      <div class="app">
        <div>
          <img
            :src="logo"
            width="32"
            height="32"
            onerror="this.src = window.defaultIcon"
          />
        </div>
        <!-- <keep-alive>
          <component :is="appIcon" />
        </keep-alive> -->
      </div>
      <div class="titles">
        <div class="title">
          {{ title }}
          <Tooltip :text="$t('extensions.appTooltip')">
            <keep-alive>
              <component :is="successIcon" />
            </keep-alive>
          </Tooltip>
        </div>
        <div class="category">
          {{ category }}
        </div>
      </div>
    </div>
    <div class="app-block__body">
      <div class="description">
        {{ description }}
      </div>
    </div>
    <div class="app-block__readmore" @click.stop="$emit('openAppInfo', title)">
      {{ $t(`extensions.readMore`) }}
      <keep-alive>
        <component :is="rightArrowIcon" />
      </keep-alive>
    </div>
  </div>
</template>
<script>
import { ref, markRaw } from 'vue';
import Tooltip from '@/components/UI/Tooltip';

export default {
  name: 'AppBlock',
  components: { Tooltip },
  props: {
    btnTitle: {
      type: String,
      default: '',
    },
    logo: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: '#00A3FF',
    },
  },
  setup() {
    const layoutIcon = ref();
    const appIcon = ref();
    const successIcon = ref();
    const rightArrowIcon = ref();

    import(`@/assets/icons/extensions/layout.svg`).then((val) => {
      layoutIcon.value = markRaw(val.default);
    });

    import(`@/assets/icons/extensions/app.svg`).then((val) => {
      appIcon.value = markRaw(val.default);
      window.defaultIcon = appIcon.value;
    });

    import(`@/assets/icons/extensions/success.svg`).then((val) => {
      successIcon.value = markRaw(val.default);
    });

    import(`@/assets/icons/extensions/right_arrow.svg`).then((val) => {
      rightArrowIcon.value = markRaw(val.default);
    });

    return {
      layoutIcon,
      appIcon,
      successIcon,
      rightArrowIcon,
    };
  },
};
</script>
<style scoped lang="scss">
.app-block {
  width: 300px;
  height: 234px;
  display: flex;
  flex-direction: column;
  padding: 15px;
  box-sizing: border-box;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  position: relative;
  background: $white;
  border-radius: 8px;
  overflow: hidden;

  .tooltip {
    width: 200px;
    height: 100%;
  }

  .layout-icon {
    z-index: -1;
    position: absolute;
    left: 0;
    top: 0;
  }

  &__head {
    display: flex;
    align-items: center;
    positions: relative;

    .app {
      box-sizing: border-box;
      min-width: 48px;
      height: 48px;
      border-radius: 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(90deg, #f3e7ff 0%, #cde6ff 100%);
      position: absolute;
      top: 10px;
      left: 10px;
    }

    .titles {
      margin-left: 50px;

      .title {
        color: $black;
        font-family: 'Panton_Bold';
        font-size: 18px;

        svg {
          margin-top: 3px;
          margin-left: 12px;
        }
      }

      .category {
        color: $dark-blue;
        font-family: 'Panton_SemiBold';
        font-size: 14px;
      }
    }
  }

  &__body {
    margin-top: 20px;

    .description {
      color: $mid-blue;
      font-family: 'Panton_Regular';
      font-size: 14px;
      line-height: 20px;
      overflow: hidden;
      max-height: 100px;
    }
  }

  &__readmore {
    display: flex;
    align-items: center;
    color: $mid-blue;
    font-family: 'Panton_Bold';
    font-size: 14px;
    text-transform: uppercase;
    position: absolute;
    bottom: 20px;
    right: 15px;

    &:hover {
      cursor: pointer;
      opacity: 0.7;
    }

    svg {
      margin-left: 10px;
    }
  }
}

.app-block:hover {
  box-shadow: -10px 4px 50px rgba(0, 0, 0, 0.1);
  transform: scale(1.1);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  z-index: 100;

  .app-block__readmore {
    color: #1a53f0;
  }
}
</style>
