<template>
  <div
    :class="{
      'select-card': type === 'simple',
      'select-card-special': type === 'special',
    }"
    :data-qa="dataQa"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <div
      :class="{
        'select-card__icon': type === 'simple',
        'select-card-special__icon': type === 'special',
      }"
    >
      <keep-alive>
        <component :is="hoveredIcon" v-if="hovered" />
        <component :is="staticIcon" v-else />
      </keep-alive>
      <!-- <img
        v-if="hovered"
        :src="`@/assets/images/selectCard/${method.hoveredIcon}.svg`"
      />
      <img
        v-else
        :src="`@/assets/images/selectCard/${method.icon}.svg`"
      /> -->
    </div>
    <span
      :class="{
        'select-card__info': type === 'simple',
        'select-card-special__info': type === 'special',
      }"
    >
      {{ method.info }}
    </span>
    <span
      :class="{
        'select-card__title': type === 'simple',
        'select-card-special__title': type === 'special',
      }"
    >
      {{ method.title }}
    </span>
  </div>
</template>

<script>
import { ref, markRaw } from 'vue';
export default {
  name: 'SelectCard',
  props: {
    method: {
      type: Object,
    },
    type: {
      type: String,
    },
    dataQa: {
      type: [String, null],
      default: null,
    },
  },
  setup(props) {
    const hovered = ref(false);

    const hoveredIcon = ref();
    import(`@/assets/images/selectCard/${props.method.hoveredIcon}.svg`).then(
      (val) => {
        hoveredIcon.value = markRaw(val.default);
      }
    );

    const staticIcon = ref();
    import(`@/assets/images/selectCard/${props.method.icon}.svg`).then(
      (val) => {
        staticIcon.value = markRaw(val.default);
      }
    );

    return { hovered, hoveredIcon, staticIcon };
  },
};
</script>

<style lang="scss" scoped>
.select-card {
  max-width: 275px;
  height: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px dashed $too-ligth-blue;
  border-radius: 8px;
  padding: 66px 30px 46px 30px;
  margin-right: 30px;
  cursor: pointer;
  justify-content: space-between;
  @include lg {
    max-width: 166px;
    height: 250px;
    margin-right: 16px;
    padding: 30px 8px 40px 8px;
  }
  @include md {
    height: 210px;
    max-width: 137px;
    margin-right: 8px;
    padding: 27px 9px 21px 9px;
  }
  &:last-child {
    margin-right: 0;
  }
  &:hover {
    border: 1px dashed $blue;
    .select-card__title {
      color: $black;
    }
    .select-card__info {
      color: $blue;
    }
  }
  &__icon {
    width: 183px;
    height: 92px;
    display: flex;
    justify-content: center;
    align-items: center;
    & svg {
      max-width: 98%;
      max-height: 100%;
    }
    @include lg {
      width: 100%;
      height: 67px;
    }
    @include md {
      width: 120px;
      height: 54px;
    }
  }
  &__info {
    font-size: 14px;
    line-height: 20px;
    color: $mid-blue;
    text-align: center;
    @include lg {
    }
    @include md {
      font-size: 12px;
      line-height: 18px;
    }
  }
  &__title {
    font-size: 20px;
    line-height: 24px;
    font-family: 'Panton_Bold';
    color: $mid-blue;
    text-align: center;
    @include lg {
      font-size: 16px;
      line-height: 19px;
    }
    @include md {
      font-size: 14px;
      line-height: 17px;
    }
  }
}
.select-card-special {
  width: 275px;
  height: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px dashed $too-ligth-blue;
  border-radius: 8px;
  padding: 66px 30px 46px 30px;
  margin-right: 30px;
  cursor: pointer;
  justify-content: space-between;
  @include lg {
    height: 280px;
    margin-right: 16px;
    padding: 30px 8px 40px 8px;
  }
  @include md {
    height: 200px;
    width: 137px;
    margin-right: 8px;
    padding: 27px 9px 21px 9px;
  }
  &:last-child {
    margin-right: 0;
  }
  &:hover {
    // background: $blue;
    border: 1px dashed #1a53f0; // border: 1px solid transparent;
    .select-card-special__info {
      color: #1a53f0;
    }

    .select-card-special__title {
      color: $black;
    }
  }
  &__icon {
    width: 183px;
    height: 92px;
    display: flex;
    justify-content: center;
    align-items: center;
    & svg {
      max-width: 98%;
      max-height: 100%;
    }
    @include lg {
      width: 100%;
      height: 67px;
    }
    @include md {
      width: 120px;
      height: 54px;
    }
  }
  &__info {
    font-size: 14px;
    line-height: 20px;
    color: $mid-blue;
    text-align: center;
    @include lg {
    }
    @include md {
      font-size: 12px;
      line-height: 18px;
    }
  }
  &__title {
    font-size: 20px;
    line-height: 24px;
    font-family: 'Panton_Bold';
    color: $mid-blue;
    text-align: center;
    @include lg {
      font-size: 16px;
      line-height: 19px;
    }
    @include md {
      font-size: 14px;
      line-height: 17px;
    }
  }
}

body.dark {
  .select-card {
    &:hover {
      .select-card__title {
        color: $white;
      }
    }
  }
}
</style>
