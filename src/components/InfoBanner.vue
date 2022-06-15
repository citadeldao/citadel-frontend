<template>
  <div :style="{ background }" class="info-banner">
    <keep-alive>
      <component :is="currentIcon" class="info-banner__icon" />
    </keep-alive>
    <div class="info-banner__text">
      <span class="text-main" :style="{ color }"> {{ content }}</span>
      <div
        v-if="description"
        class="info-banner__description"
        @click="$emit('showDescription')"
      >
        {{ description }}
      </div>
      <!--      <a
        v-if="guide"
        href="#"
        class="text-guide"
      >
        <span>{{ $t('guide') }}</span>
        <linkIcon />
      </a>-->
    </div>
  </div>
</template>

<script>
import { markRaw, ref } from 'vue';
import linkIcon from '@/assets/icons/info-link.svg';

export default {
  name: 'InfoBanner',
  components: { linkIcon },
  props: {
    content: {
      type: String,
    },
    description: {
      type: String,
    },
    icon: {
      type: String,
    },
    background: {
      type: String,
    },
    color: {
      type: String,
    },
    guide: {
      type: Boolean,
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
.info-banner {
  width: 100%;
  border-radius: 10px;
  background: $ligth-red;
  display: flex;
  padding: 21px 23px 21px 32px;
  align-items: center;
  @include md {
    padding: 14px 11px 11px 16px;
    align-items: initial;
  }
  &__icon {
    width: 59px;
    height: 59px;
    margin-right: 24px;
    @include md {
      width: 31px;
      height: 36px;
      margin-right: 10px;
    }
  }
  &__text {
    width: 530px; // 440
    font-size: 14px;
    line-height: 20px;
    font-weight: 600;
    color: $orange;
    margin: 0;
    font-family: 'Panton_SemiBold';
    @include md {
      width: 414px;
    }
  }

  &__description {
    color: rgb(43, 82, 231);
    cursor: pointer;
  }
}

.text {
  &-guide {
    text-decoration: none;
    margin-left: 5px;
    white-space: nowrap;
    font-family: Panton_Bold;
    & svg {
      margin-left: 5px;
      fill: red;
    }
  }
}
</style>
