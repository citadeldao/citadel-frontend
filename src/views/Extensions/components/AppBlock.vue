<template>
  <div
    :style="{ borderLeft: `16px solid ${color != '#fff' ? color : '#8496C0'}` }"
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
  position: relative;

  display: flex;
  flex-direction: column;

  height: 240px;
  transform: scale(0.9);
  transition: 0.2s;

  padding: 15px;
  padding-left: 20px;

  box-shadow: $card-shadow;
  background: $white;
  border-radius: 12px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;

  flex: 0 0 25%;

  @include lg {
    flex: 0 0 25%;
    min-width: 240px;
  }

  @include laptop-app {
    flex: 0 0 33%;
  }

  @include md {
    flex: 0 0 50%;
    min-width: 240px;
  }

  @include laptop {
    flex: 0 0 50%;
    min-width: 240px;
  }

  &:hover {
    transform: scale(1);
  }

  &::last-child {
    margin-right: auto;
  }

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
    height: 70px;
    .app {
      padding-top: 5px;
      box-sizing: border-box;
      min-width: 48px;
      height: 48px;
      border-radius: 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(90deg, #f3e7ff 0%, #cde6ff 100%);
      overflow: hidden;
    }

    .titles {
      margin-left: 12px;

      .title {
        color: $black;
        // @include title-default;
        font-size: 24px;
        font-family: 'Panton_Bold';
        display: flex;
        align-items: center;

        margin-bottom: 5px;

        svg {
          margin-left: 5px;
        }
      }

      .category {
        font-family: 'Panton_SemiBold';
        color: $dark-blue;
        font-size: 0.875rem;
      }
    }
  }

  &__body {
    margin-top: 20px;

    .description {
      color: $mid-blue;
      @include text-default;
      font-size: 1rem;
      line-height: 1.5;
      max-height: 100px;
    }
  }

  &__readmore {
    cursor: pointer;
    font-family: 'Panton_Bold';
    display: flex;
    align-items: center;

    width: fit-content;
    margin-top: auto;
    margin-left: auto;

    color: $black;
    text-transform: uppercase;

    &:hover {
      color: $blue;
    }

    svg {
      transition: 0.3s;
      margin-left: 10px;
      fill: #000;
      path {
        fill: $mid-blue;
      }
    }

    svg:hover {
      fill: #1a53f0;
      fill: red;
    }
  }

  &:hover {
    transform: scale(1);
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    z-index: 100;
  }
}

body.dark {
  .app-block {
    box-shadow: none;
    background: #303456;

    &__readmore {
      color: $white;

      svg {
        fill: $white;
      }
    }

    .titles {
      .title {
        color: $white;
      }
    }
  }
}
</style>
