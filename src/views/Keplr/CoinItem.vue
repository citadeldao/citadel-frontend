<template>
  <div class="chains__selector-item" @click="select(chain)">
    <Checkbox :value="isActive" :label="''" @input.stop="select(chain)" />
    <keep-alive>
      <component :is="currentIcon" class="icon-item" />
    </keep-alive>
    <div>{{ chain.label }}</div>
  </div>
</template>
<script>
import Checkbox from '@/components/UI/Checkbox';
import { ref, markRaw } from 'vue';

export default {
  components: { Checkbox },
  props: {
    chain: {
      required: true,
      type: Object,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['select'],
  setup(props, { emit }) {
    const currentIcon = ref();

    const select = (chain) => {
      emit('select', chain);
    };

    import(`@/assets/icons/networks/${props.chain.net}.svg`).then((val) => {
      currentIcon.value = markRaw(val.default);
    });

    return {
      currentIcon,
      select,
    };
  },
};
</script>
<style lang="scss">
.chains__selector-item {
  user-select: none;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  min-width: 390px;
  min-height: 48px;
  border: 1px solid #f0f3fd;
  box-sizing: border-box;
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 0 12px;
  box-sizing: border-box;
  cursor: pointer;

  &:hover {
    .checkbox__checkmark {
      background: #1a53f0;
      border: 1px solid #1a53f0;
    }
  }

  & svg.icon-item {
    margin-right: 10px;
    width: 15px;
    height: 14px;
    fill: #603bee;
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
