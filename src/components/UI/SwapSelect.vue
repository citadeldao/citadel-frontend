<template>
  <div
    class="swap-select"
    :style="{ zIndex }"
    @click.stop="toggle"
    v-click-away="onClose"
  >
    <div
      v-if="selectedItem"
      :style="{
        backgroundImage: `url(${getIcon(selectedItem)})`,
      }"
      class="swap-select__icon"
    ></div>
    <div :class="{ noTitle: !selectedItem }" class="swap-select__title">
      {{
        selectedItem?.name ||
        selectedItem?.title?.split(':')[0] ||
        'Select asset'
      }}
    </div>
    <div :class="{ opened }" class="swap-select__toggle">
      <arrowDownIcon width="14" height="11" />
    </div>
    <div v-if="opened" class="swap-select__container" @click.stop="() => {}">
      <input
        v-model="searchStr"
        class="swap-select__input"
        :placeholder="placeholder"
      />
      <div class="swap-select__items">
        <div v-if="!filteredItems.length" class="not-found-tokens">
          No tokens found. Try another name or paste the contract address
        </div>
        <div
          v-for="(item, ndx) in filteredItems"
          :key="ndx"
          class="swap-select__items-item"
          @click="onSelect(item)"
        >
          <div class="row">
            <div
              class="icon"
              :style="{
                backgroundImage: `url(${getIcon(item)})`,
              }"
            ></div>
            <div class="name">
              {{ item.name || item?.title?.split(':')[0] }}
            </div>
          </div>
          <div v-if="item.balance" class="balance-wrap">
            {{ item.balance }} <span>{{ item.symbol }}</span>
          </div>
        </div>
        <div
          v-if="filteredItems.length >= 10 && countToShow < items.length"
          class="swap-select__more"
          @click="showMore"
        >
          View more
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import arrowDownIcon from '@/assets/icons/arrow-down.svg';
import { ref, computed, watch } from 'vue';

export default {
  props: {
    zIndex: {
      type: [String, Number],
      default: 100,
    },
    placeholder: {
      type: String,
      default: '',
    },
    customIcon: {
      type: String,
      default: '',
    },
    items: {
      required: true,
    },
    selectedToken: {
      type: [null, Object, String],
      default: null,
    },
  },
  components: {
    arrowDownIcon,
  },
  setup(props, { emit }) {
    const opened = ref(false);
    const searchStr = ref('');
    const selectedItem = ref(null);
    const countToShow = ref(10);

    const showMore = () => {
      countToShow.value += 15;
    };

    const filteredItems = computed(() => {
      if (!searchStr.value) return props.items.slice(0, countToShow.value);

      return props.items
        .filter((item) => {
          return (
            item.name?.toLowerCase().includes(searchStr.value.toLowerCase()) ||
            item?.title
              ?.toLowerCase()
              .includes(searchStr.value.toLowerCase()) ||
            item?.denom
              ?.toLowerCase()
              .includes(searchStr.value.toLowerCase()) ||
            item?.address?.toLowerCase().includes(searchStr.value.toLowerCase())
          );
        })
        .slice(0, countToShow.value);
    });

    const toggle = () => {
      opened.value = !opened.value;
    };

    const onClose = () => {
      opened.value = false;
    };

    const getIcon = (item) => {
      return item && item[props.customIcon];
    };

    const onSelect = (item) => {
      emit('select', item.title);
      // selectedItem.value = item;
      onClose();
    };

    // watch(
    //   () => props.items,
    //   (newV) => {
    //     console.log('update items', newV);
    //   }
    // );

    watch(
      () => props.selectedToken,
      (newV) => {
        if (newV) {
          emit('select', newV.title);
          selectedItem.value = newV;
        }
      }
    );

    return {
      opened,
      searchStr,
      filteredItems,
      selectedItem,
      countToShow,
      showMore,
      toggle,
      onClose,
      getIcon,
      onSelect,
    };
  },
};
</script>
<style lang="scss" scoped>
.swap-select {
  cursor: pointer;
  // width: 129px;
  width: 170px;
  height: 48px;
  border-radius: 117px;
  background-color: #f0f3fd;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  &__more {
    width: 100%;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    min-height: 35px;
    background-color: #f0f3fd;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__title {
    text-align: left;
    width: 100%;
    font-size: 14px;
    margin-left: 5px;

    &.noTitle {
      color: #6b93c0;
    }
  }

  &__icon {
    min-width: 32px;
    height: 32px;
    background-size: cover;
    background-position: 50%;
    background-repeat: no-repeat;
    border-radius: 50%;
    background-color: $dark-blue;
  }

  &__toggle {
    svg {
      fill: #c3ceeb;
    }

    &.opened {
      transform: rotate(-180deg);
    }
  }

  &__container {
    width: 516px;
    height: auto;
    max-height: 350px;
    border: 1px solid #c3ceeb;
    position: absolute;
    top: 53px;
    right: -10px;
    background-color: #fff;
    z-index: 101px;
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;
    display: flex;
    flex-direction: column;
  }

  &__input {
    width: 100%;
    min-height: 40px;
    border: none;
    outline: none;
    padding: 0 15px;
    border-bottom: 1px solid #c3ceeb;
  }

  &__items {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    height: 200px;
    .not-found-tokens {
      padding: 20px;
      font-size: 14px;
      text-align: center;
      color: #6b93c0;
    }
  }

  &__items-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    height: 40px;
    min-height: 40px;

    .row {
      display: flex;
      align-items: center;
    }

    .balance-wrap {
      font-size: 14px;
      color: #6b93c0;

      span {
        color: #afbccb;
      }
    }

    .icon {
      width: 15px;
      height: 15px;
      border-radius: 50%;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: 50%;
    }

    .name {
      font-size: 14px;
      color: #afbccb;
      margin-left: 10px;
    }
  }
}

body.dark {
  .swap-select {
    background-color: rgba(57, 59, 83, 1);

    &__more {
      background-color: #393b53;
      color: #6b93c0;
    }

    &__title {
      color: #fff;

      &.noTitle {
        color: #6b93c0;
      }
    }

    &__toggle {
      svg {
        fill: rgba(107, 117, 142, 1);
      }
    }

    &__input {
      background-color: transparent;
      color: #afbccb;
      border-color: rgba(107, 147, 192, 1);
    }

    &__container {
      border-color: rgba(107, 147, 192, 1);
      background-color: rgba(27, 28, 49, 1);
    }
  }
}
</style>
