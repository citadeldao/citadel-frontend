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
              searchAppStr = '';
              $emit('search', '');
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
      <div v-if="false" class="filter">
        <keep-alive>
          <component :is="filterIcon" />
        </keep-alive>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, markRaw, watch } from 'vue';
import closeIcon from '@/assets/icons/addAddressV2/close.svg';

export default {
  name: 'ExtensionsHead',
  components: { closeIcon },
  props: {
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
  setup(props) {
    const appsIcon = ref();
    const filterIcon = ref();
    const searchIcon = ref();
    const searchAppStr = ref('');
    const showAppLogo = ref(false);
    const showMobileSearch = ref(false);

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
  padding: 0 25px;
  width: 100%;
  background: linear-gradient(90deg, #4776e6 0%, #8e54e9 100%);
  border-radius: 16px 16px 0px 0px;
  min-height: 80px;

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
    right: 40px;
    top: 25px;
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

    &:hover {
      cursor: pointer;
      opacity: 0.7;
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
