<template>
  <li class="autocomplete-result" @click="clickHandler">
    <keep-alive v-if="result.icon && !result.iconLink">
      <component :is="currentIcon" />
    </keep-alive>
    <span v-if="!result.icon && !result.iconLink" class="no-icon" />
    <img
      v-if="result.iconLink"
      :src="result.iconLink"
      width="18"
      height="18"
      :style="{ marginRight: '7px' }"
    />
    <span class="title">{{ split(result.title) }}</span>
  </li>
</template>

<script>
import { ref, markRaw } from 'vue';
export default {
  props: {
    result: {
      type: Object,
    },
    splitValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['setResult', 'updateCurrentIcon'],
  setup(props, { emit }) {
    const currentIcon = ref();

    const split = (title) => {
      if (!props.splitValue) return title;
      return title.split(':')[0];
    };

    if (props.result.icon) {
      import(`@/assets/icons/networks/${props.result.icon}.svg`).then((val) => {
        currentIcon.value = markRaw(val.default);
      });
    }

    const clickHandler = () => {
      emit('setResult', props.result.title);
      emit('updateCurrentIcon', props.result.icon);
    };

    return { currentIcon, clickHandler, split };
  },
};
</script>

<style lang="scss" scoped>
.autocomplete-result {
  display: flex;
  align-items: center;
  list-style: none;
  padding-left: 16px;
  padding-top: 7px;
  padding-bottom: 7px;
  cursor: pointer;
  font-size: 14px;
  line-height: 36px;
  color: $mid-gray;

  img {
    border-radius: 50%;
  }

  & .title {
    display: inline-block;
  }
  & .no-icon {
    width: 14px;
    margin-right: 8px;
  }
  & svg {
    width: 20px;
    margin-right: 10px;
    height: 14px;
    fill: $mid-blue;
  }
  &:last-child {
    margin-bottom: 15px;
  }
  &:hover {
    color: $blue;
    & svg {
      fill: $blue;
    }
  }
}
</style>
