<template>
  <div class="chains__selector-item" @click="select(chain)">
    <div class="chains__selector-wrapper">
      <keep-alive>
        <component
          :id="chain.label === 'Osmosis' ? 'osmosis' : ''"
          :is="currentIcon"
          class="icon-item"
        />
      </keep-alive>
      <div class="chains__selector-info">
        <div class="chains__selector-title">{{ chain.label }}</div>
        <div class="chains__selector-subtitle">{{ chain.key }}</div>
      </div>
    </div>
    <Checkbox :value="isActive" :label="''" @input.stop="select(chain)" />
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
.chains__selector {
  &-wrapper {
    display: flex;
    align-items: center;
  }
  &-item {
    justify-content: space-between;
    user-select: none;
    display: flex;
    align-items: center;
    min-width: 300px;
    min-height: 48px;
    border: 1px solid #f0f3fd;
    box-sizing: border-box;
    border-radius: 8px;
    margin-bottom: 10px;
    padding: 12px 16px 14px 12px;
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
      width: 35px;
      height: 35px;
      fill: #1a53f0;
      path {
        fill: #1a53f0;
      }
    }
    &:last-child {
      margin-bottom: 15px;
    }
    &:hover {
      & svg.icon-item {
        color: #6b93c0;
        svg,
        path {
          fill: #6b93c0 !important;
        }
      }
    }
  }
  &-info {
    font-weight: 600;
  }
  &-title {
    font-size: 18px;
    line-height: 22px;
  }
  &-subtitle {
    color: $mid-blue;
    font-size: 14px;
    line-height: 17px;
  }
}
.chains__selector-item #osmosis {
  &,
  &:hover {
    path:nth-child(10),
    path:nth-child(11) {
      fill: white !important;
    }
  }
}
</style>
