<template>
  <div class="header-tooltip">
    <div
      v-for="item in data"
      :key="item.title"
      class="header-tooltip__line"
      :data-qa="`header__menu__${item.title.toLowerCase().replace(' ', '')}-button`"
      @click="$emit(`${item.icon}`, item.icon)"
    >
      <div class="header-tooltip__line-icon">
        <TooltipIcon
          :icon="item.icon"
          :class="{ hasStroke: item.hasStroke }"
        />
      </div>
      <span
        class="header-tooltip__line-title"
        :style="{ color: item.color ? item.color : '#6B93C0' }"
      >
        {{ item.title }}
      </span>
    </div>
  </div>
</template>

<script>
import TooltipIcon from './TooltipIcon.vue';

export default {
  name: 'HeaderTooltip',
  components: { TooltipIcon },
  props: {
    data: Array,
    default: () => [],
  },
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.header-tooltip {
  padding: 16px 16px 15px 16px;
  background: $white;
  box-shadow: 0 15px 50px rgba(80, 100, 124, 0.1),
  0 10px 15px rgba(80, 100, 124, 0.16);
  border-radius: 8px;

  &__line {
    display: flex;
    align-items: center;
    padding-top: 13px;
    padding-bottom: 13px;
    border-top: 1px solid $too-ligth-gray;
    cursor: pointer;

    &:first-child {
      padding-top: 0px;
      border-top: none;
    }

    &:last-child {
      padding-bottom: 0px;
    }

    &:hover {

      .header-tooltip__line-icon {
        & svg {
          fill: $dark-blue;

          &.hasStroke {
            stroke: $dark-blue;
          }
        }

      }

      .header-tooltip__line-title {
        color: $dark-blue !important;
      }
    }
  }

  &__line-icon {
    width: 17px;
    height: 17px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 7px;

    & svg {
      max-width: 16px;
      max-height: 17px;
    }
  }
}
</style>