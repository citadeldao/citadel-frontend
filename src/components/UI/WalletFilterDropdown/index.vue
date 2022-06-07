<template>
  <div
    class="wallet-filter-dropdown"
    :class="{
      'wallet-filter-dropdown--active': showList,
      'wallet-filter-dropdown--input': inputStyle,
    }"
    data-qa="sidebar__sort-button"
    @click="toggleShowList($event)"
  >
    <keep-alive>
      <component
        :is="icon"
        class="wallet-filter-dropdown__value-icon"
      />
    </keep-alive>

    <teleport to="body">
      <transition name="fade">
        <div
          v-if="showList"
          id="tooltip"
          v-click-away="clickAwayHandler"
          :style="{ top: `${tooltipY}px`, left: `${tooltipX}px` }"
          class="wallet-filter-dropdown__list"
        >
          <ListItem
            v-for="item in items"
            :key="item.value"
            :item="item"
            :value="value"
            @click="changeValue(item)"
          />
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script>
import { markRaw, ref, watch, nextTick } from 'vue';
import ListItem from './components/ListItem.vue';

export default {
  name: 'WalletFilterDropdown',
  components: { ListItem },
  props: {
    value: {
      type: String,
      default: '',
    },
    items: {
      type: Array,
      default: () => [],
    },
    relativeComponent: {
      type: String,
      default: '',
    },
    top: {
      type: String,
      default: '',
    },
    left: {
      type: String,
      default: '',
    },
    inputStyle: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const showList = ref(false);
    const icon = ref();
    const tooltipX = ref(0);
    const tooltipY = ref(0);

    import(`@/assets/icons/${props.value}.svg`).then((val) => {
      icon.value = markRaw(val.default);
    });

    const changeValue = (item) => {
      emit('update:value', item.value);

      import(`@/assets/icons/${item.icon}.svg`).then((val) => {
        icon.value = markRaw(val.default);
      });

      showList.value = false;
    };

    const clickAwayHandler = () => {
      showList.value = false;
    };

    const toggleShowList = (event) => {
      showList.value = true;

      nextTick(() => {
        const tooltip = document.getElementById('tooltip');
        const {
          left,
          width,
          bottom,
        } = event.target.getBoundingClientRect();
        tooltipX.value = left - (tooltip.offsetWidth - width) / 2;
        tooltipY.value = bottom + 7;
      });
    };

    watch(() => props.value, (val) => {
      changeValue(props.items.find(i => i.value === val));
    });

    return {
      icon,
      showList,
      changeValue,
      clickAwayHandler,
      tooltipX,
      tooltipY,
      toggleShowList,
    };
  },
};
</script>

<style lang="scss" scoped>
.wallet-filter-dropdown {
  display: flex;
  cursor: pointer;
  position: relative;

  &:hover {
    .wallet-filter-dropdown__value-icon {
      fill: $blue;
    }
  }

  &__value-icon {
    @include md {
      width: 16px;
      height: 16px;
    }
    width: 20px;
    height: 20px;
  }

  &__list {
    display: flex;
    flex-direction: column;
    position: absolute;
    box-shadow: 0 15px 50px rgba(80, 100, 124, 0.1),
    0 10px 15px rgba(80, 100, 124, 0.16);
    border-radius: 8px;
    background: $white;
    padding: 4px 8px 4px 8px;
  }

  &--active {
    .wallet-filter-dropdown {
      &__value-icon {
        fill: $too-dark-blue;

        &:hover {
          fill: $too-dark-blue;
        }
      }
    }

    &.wallet-filter-dropdown {
      &--input {
        border-color: $too-dark-blue;
      }
    }
  }

  &--input {
    height: 68px;
    width: 68px;
    justify-content: center;
    align-items: center;
    border: 1px solid $too-ligth-blue;
    border-radius: 8px;
  }
}
</style>
