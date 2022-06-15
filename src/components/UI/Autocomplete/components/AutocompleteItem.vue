<template>
  <li class="autocomplete-result" @click="clickHandler">
    <keep-alive v-if="result.icon">
      <component :is="currentIcon" />
    </keep-alive>
    <span v-else class="no-icon" />
    <span class="title">{{ result.title }}</span>
  </li>
</template>

<script>
import { ref, markRaw } from 'vue';
export default {
  props: {
    result: {
      type: Object,
    },
  },
  emits: ['setResult', 'updateCurrentIcon'],
  setup(props, { emit }) {
    const currentIcon = ref();

    if (props.result.icon) {
      import(`@/assets/icons/networks/${props.result.icon}.svg`).then((val) => {
        currentIcon.value = markRaw(val.default);
      });
    }

    const clickHandler = () => {
      emit('setResult', props.result.title);
      emit('updateCurrentIcon', props.result.icon);
    };

    return { currentIcon, clickHandler };
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
