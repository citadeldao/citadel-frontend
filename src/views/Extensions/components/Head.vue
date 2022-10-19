<template>
  <div :class="{ isFullScreen }" class="extensions__head">
    <div class="extensions__head-logo">
      <template v-if="showFilter || !showAppLogo">
        <div class="logo">
          <keep-alive>
            <component :is="appsIcon" />
          </keep-alive>
        </div>
        <div class="descriptions">
          <div class="label">
            {{ $t('extensions.headerTitle') }}
          </div>
          <div class="description">
            {{ $t('extensions.headerDescription') }}
          </div>
        </div>
      </template>
      <template v-else>
        <div v-show="showAppLogo" class="logo">
          <img :src="appLogo" width="32" height="32" />
        </div>
        <div class="descriptions">
          <div class="label">
            {{ app.name }}
          </div>
          <div class="description">
            {{ app.short_description }}
          </div>
        </div>
        <div
          v-if="isFullScreen"
          class="extensions__close"
          @click="$emit('close')"
        >
          <closeIcon />
        </div>
      </template>
    </div>
    <div v-if="showFilter" class="extensions__head-filter">
      <div v-click-away="resetFilter" v-if="openFilter" class="filter-wrap">
        <div
          v-for="(tag, ndx) in filterItems"
          :key="ndx"
          class="filter-wrap__item"
          @click="onSelectTag(tag)"
        >
          <div class="icon">
            <checkSvg v-if="selectedTags.includes(tag)" />
          </div>
          <div class="title">{{ tag }}</div>
        </div>
      </div>
      <div :class="{ mobile: showMobileSearch }" class="wrap-input">
        <keep-alive class="icon">
          <component :is="searchIcon" />
        </keep-alive>
        <input
          v-model="searchAppStr"
          :placeholder="$t('extensions.searchPlaceholder')"
          @blur="
            () => {
              showMobileSearch = false;
            }
          "
          class="filter-input"
          @input="$emit('search', searchAppStr)"
        />
      </div>
      <div
        v-if="!showMobileSearch"
        class="wrap-input-mini"
        @click="showMobileSearch = true"
      >
        <keep-alive>
          <component :is="searchIcon" />
        </keep-alive>
      </div>
      <div class="filter" @click="openFilter = true">
        <keep-alive>
          <component :is="filterIcon" />
        </keep-alive>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, markRaw, watch, onMounted } from 'vue';
import closeIcon from '@/assets/icons/addAddressV2/close.svg';
import checkSvg from '@/assets/icons/extensions/check.svg';

export default {
  name: 'ExtensionsHead',
  components: { closeIcon, checkSvg },
  props: {
    filterItems: {
      required: true,
    },
    appLogo: {
      type: String,
    },
    app: {
      required: true,
    },
    showFilter: {
      type: Boolean,
      default: false,
    },
    isFullScreen: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const appsIcon = ref();
    const filterIcon = ref();
    const searchIcon = ref();
    const searchAppStr = ref('');
    const showAppLogo = ref(false);
    const showMobileSearch = ref(false);
    const selectedTags = ref([]);
    const openFilter = ref(false);

    const resetFilter = () => {
      openFilter.value = false;
    };

    onMounted(() => {
      const localData = localStorage.getItem('appTags');
      selectedTags.value = localData ? JSON.parse(localData) : [];
      emit('selectTags', selectedTags.value);
    });

    const onSelectTag = (tg) => {
      if (selectedTags.value.includes(tg)) {
        selectedTags.value = selectedTags.value.filter((tag) => tag !== tg);
      } else {
        selectedTags.value.push(tg);
      }
      emit('selectTags', selectedTags.value);
      localStorage.setItem('appTags', JSON.stringify(selectedTags.value));
    };

    watch(
      () => props.appLogo,
      () => {
        if (!props.appLogo) {
          showAppLogo.value = false;
        } else {
          setTimeout(() => {
            showAppLogo.value = true;
          }, 700);
        }
      }
    );

    import(`@/assets/icons/extensions/apps.svg`).then((val) => {
      appsIcon.value = markRaw(val.default);
    });
    import(`@/assets/icons/extensions/filter.svg`).then((val) => {
      filterIcon.value = markRaw(val.default);
    });
    import(`@/assets/icons/extensions/find.svg`).then((val) => {
      searchIcon.value = markRaw(val.default);
    });

    return {
      searchAppStr,
      searchIcon,
      appsIcon,
      filterIcon,
      showAppLogo,
      showMobileSearch,
      selectedTags,
      openFilter,
      resetFilter,
      onSelectTag,
    };
  },
};
</script>
<style scoped lang="scss">
.extensions__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 0 25px 0 35px;
  width: 100%;
  background: linear-gradient(90deg, #4776e6 0%, #8e54e9 100%);
  border-radius: 16px 16px 0px 0px;
  min-height: 80px;

  &.isFullScreen {
    padding: 0;
  }

  .extensions__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 45px;
    height: 45px;
    box-sizing: border-box;
    border-radius: 50%;
    border: 3px solid #fff;
    background: #6b93c0;
    position: absolute;
    right: -2px;
    top: 18px;
    z-index: 100;

    &:hover {
      background: #6a4bff;
      cursor: pointer;
    }
  }

  &.isFullScreen {
    background: transparent;
  }
}

.extensions__head-logo {
  display: flex;
  justify-content: center;
  align-content: center;

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    background: $white;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    width: 48px;
    height: 48px;
  }

  .descriptions {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 48px;
    color: $white;
    margin-left: 12px;

    .label {
      font-family: 'Panton_SemiBold';
      font-size: 18px;
    }

    .description {
      margin-top: 5px;
      font-family: 'Panton_Regular';
      font-size: 14px;
    }
  }
}

.extensions__head-filter {
  display: flex;
  align-items: center;
  position: relative;

  .filter-wrap {
    position: absolute;
    right: 0;
    top: 55px;
    min-width: 172px;
    min-height: 48px;
    background: #ffffff;
    z-index: 10;
    padding: 10px 15px;
    box-shadow: 0px 15px 50px rgba(80, 100, 124, 0.1),
      0px 10px 15px rgba(80, 100, 124, 0.16);
    border-radius: 8px;

    &__item {
      display: flex;
      align-items: center;
      height: 32px;
      margin-bottom: 5px;

      &:hover {
        cursor: pointer;
      }

      &:last-child {
        margin-bottom: 0;
      }

      .icon {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        background: #b8e5ff;
        width: 16px;
        height: 16px;

        svg {
          margin-top: -7px;
          margin-left: 2px;
        }
      }

      .title {
        font-size: 14px;
        margin-left: 10px;
      }
    }
  }

  .wrap-input {
    position: relative;

    .icon {
      position: absolute;
      left: 12px;
      top: 18px;
    }
  }

  .wrap-input-mini {
    cursor: pointer;
    display: none;
    width: 48px;
    height: 48px;
    border: 1px dashed #c3ceeb;
    justify-content: center;
    align-items: center;
    border-radius: 4px;

    svg {
      transform: scale(1.3);
    }
  }

  .filter-input {
    color: $white;
    padding-left: 32px;
    padding-right: 12px;
    margin-right: 12px;
    box-sizing: border-box;
    width: 275px;
    height: 48px;
    background: transparent;
    border: 1px solid #c3ceeb;
    box-sizing: border-box;
    border-radius: 8px;
    outline: none;
  }

  ::-webkit-input-placeholder {
    color: #c3ceeb;
  }
  ::-moz-placeholder {
    color: #c3ceeb;
  }
  :-moz-placeholder {
    color: #c3ceeb;
  }
  :-ms-input-placeholder {
    color: #c3ceeb;
  }

  .filter {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed #c3ceeb;
    border-radius: 8px;
    width: 48px;
    height: 48px;

    svg {
      fill: #f0f3fd;
    }

    &:hover {
      background: $white;
      cursor: pointer;

      svg {
        fill: #6a4bff;
      }
    }
  }
}

.extensions__head.isFullScreen {
  .descriptions {
    .label {
      color: $black;
    }

    .description {
      color: #59779a;
    }
  }
}

@media (max-width: 1024px) {
  .extensions__head-filter {
    .wrap-input {
      display: none;

      &.mobile {
        display: flex;
      }
    }
  }

  .extensions__head-filter {
    .wrap-input-mini {
      margin-right: 10px;
      display: flex;
    }
  }
}
</style>
