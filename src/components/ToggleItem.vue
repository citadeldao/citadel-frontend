<template>
  <div class="toggle-item">
    <div class="toggle-item__head" @click="opened = !opened">
      <div class="titles">
        <questionIcon />
        <div class="toggle-item__title">{{ item.title }}</div>
      </div>
      <arrowIcon :class="{ opened }" class="arrow" />
    </div>
    <div v-if="!opened" class="toggle-item__body">
      <div class="toggle-item__description">{{ item.description }}</div>
      <div class="slot">
        <slot />
      </div>
    </div>
  </div>
</template>
<script>
import questionIcon from '@/assets/icons/settings/question.svg';
import arrowIcon from '@/assets/icons/settings/arrow.svg';
import { ref } from 'vue';

export default {
  name: 'ToggleItem',
  components: {
    questionIcon,
    arrowIcon,
  },
  props: {
    item: {
      requred: true,
    },
  },
  setup() {
    const opened = ref(true);

    return {
      opened,
    };
  },
};
</script>
<style lang="scss" scoped>
.toggle-item {
  display: flex;
  flex-direction: column;
  width: 100%;

  .slot {
    padding: 30px 0 0 30px;
  }

  &__head {
    width: 100%;
    display: flex;
    align-items: center;
    padding-bottom: 8px;
    justify-content: space-between;
    border-bottom: 1px dashed #c3d6ec;
    cursor: pointer;

    .titles {
      display: flex;
      align-items: center;
    }

    .arrow {
      transition: all 0.3s ease;

      &.opened {
        transform: rotate(-180deg);
      }
    }
  }

  &__body {
    width: 100%;
    box-sizing: border-box;
    padding-left: 25px;
    margin-top: 8px;
  }

  &__title {
    font-family: 'Panton_SemiBold';
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    color: #0095d6;
    margin-left: 10px;
  }

  &__description {
    font-family: 'Panton_Regular';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    color: #3c5b7e;
  }
}
</style>
