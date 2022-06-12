<template>
  <div
    class="list-item"
    :class="{'active-list-item':value===item.value}"
    :data-qa="`sidebar__sort-button--${item.value.toLowerCase()}`"
  >
    <keep-alive>
      <component
        :is="icon"
        class="list-item__icon"
      />
    </keep-alive>
  </div>
</template>

<script>
import { markRaw, ref } from '@vue/reactivity';
export default {
  name: 'ListItem',
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    value: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const icon = ref();

    import(`@/assets/icons/${props.item.icon}.svg`).then((val) => {
      icon.value = markRaw(val.default);
    });

    return { icon };
  },
};
</script>

<style lang="scss" scoped>
.list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  padding: 8px 0;
  border-bottom: 1px solid $too-ligth-gray;
  cursor: pointer;
  &:hover {
    .list-item__icon {
      fill: $blue;
    }
  }
  &:last-child {
    border-bottom: none;
  }
  &__icon {
    @include md{
      max-width: 16px;
      max-height: 16px;
    }
    max-width: 18px;
    max-height: 20px;
  }
}
.active-list-item {
  .list-item__icon {
    fill: $too-dark-blue;
    &:hover {
      fill: $too-dark-blue;
    }
  }
}
</style>