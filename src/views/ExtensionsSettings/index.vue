<template>
  <div class="extensions-settings">
    <div class="block left">
      <div class="head">
        <div class="head__title">{{ $t('settings.extensions.title') }}</div>
        <div class="head__description">
          {{ $t('settings.extensions.description') }}
        </div>
        <div class="head__search">
          <Textarea
            id="app-search"
            icon="text"
            :value="appCode"
            :label="$t('settings.extensions.searchLabel')"
            :placeholder="$t('settings.extensions.searchPlaceholder')"
            @update:value="onSetCode"
          />
          <div @click="connectToDevCenter(appCode)" class="head__enter">
            ENTER
          </div>
        </div>
        <div v-if="messageError" class="message">{{ messageError }}</div>
      </div>
      <div v-if="isLoading" class="loading">
        <Loading />
      </div>
      <div v-else class="extensions-settings__apps">
        <div class="title">{{ $t('settings.extensions.appsTitle') }}</div>
        <div class="apps-list">
          <div
            v-for="(app, ndx) in appsListFiltered"
            :key="ndx"
            class="apps-list__item"
            @click="goToApp(app)"
          >
            <div class="info">
              <div class="logo">
                <img
                  :src="app.logo"
                  width="32"
                  height="32"
                  onerror="this.src = window.defaultIcon"
                />
              </div>
              <div class="name">{{ app.name }}</div>
            </div>
            <removeIcon
              width="19"
              height="24"
              fill="#FA3B33"
              class="remove"
              @click.stop="setIgnoreApps(app.name)"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="block right">
      <appsettings />
    </div>
  </div>
</template>
<script>
import appsettings from '@/assets/icons/appsettings.svg';
import removeIcon from '@/assets/icons/settings/remove.svg';
import Textarea from '@/components/UI/Textarea';
import Loading from '@/components/Loading';
import { ref, computed, markRaw, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'ExtensionsSettings',
  components: { Textarea, Loading, appsettings, removeIcon },
  setup() {
    const router = useRouter();
    const store = useStore();
    const appCode = ref(localStorage.getItem('userAppSettingsToken') || '');
    const isLoading = ref(false);
    const messageError = ref('');
    const ignoreApps = ref([]);

    import(`@/assets/icons/extensions/app.svg`).then((val) => {
      window.defaultIcon = markRaw(val.default);
    });

    const setIgnoreApps = (app) => {
      if (ignoreApps.value.includes(app)) {
        ignoreApps.value = ignoreApps.value.filter((name) => name !== app);
        return;
      }
      ignoreApps.value.push(app);
    };

    onMounted(async () => {
      isLoading.value = true;

      try {
        await store.dispatch('extensions/fetchDevAppsList');
        isLoading.value = false;
      } catch (err) {
        isLoading.value = false;
      }
    });

    const appsListFiltered = computed(() =>
      store.getters['extensions/devAppsList'].filter((app) => {
        return !ignoreApps.value.includes(app.name);
      })
    );

    const connectToDevCenter = async (token) => {
      messageError.value = '';
      ignoreApps.value = [];

      if (!token.trim().length) {
        return;
      }

      isLoading.value = true;
      try {
        const res = await store.dispatch('extensions/connectToDevCenter', {
          token,
        });
        if (!res.ok) {
          messageError.value = res.error;
          await store.dispatch('extensions/fetchDevAppsList');
          isLoading.value = false;
          setTimeout(() => {
            messageError.value = '';
          }, 1500);
          return;
        }
        localStorage.setItem('userAppSettingsToken', token);
        await store.dispatch('extensions/fetchDevAppsList');
        isLoading.value = false;
      } catch (err) {
        console.log('err', err);
        isLoading.value = false;
      }
    };

    const onSetCode = (val) => {
      appCode.value = val;
    };

    const goToApp = (app) => {
      store.dispatch('extensions/addExtensionToList', {
        ...app,
        devCenterApp: true,
      });
      router.push({ name: 'Extensions', params: { name: app.slug } });
    };

    return {
      appsListFiltered,
      appCode,
      isLoading,
      messageError,
      goToApp,
      onSetCode,
      connectToDevCenter,
      setIgnoreApps,
    };
  },
};
</script>
<style scoped lang="scss">
.extensions-settings {
  display: flex;
  justify-content: space-between;

  .message {
    color: $red;
    margin: -10px 0 10px;
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: calc(100% - 120px);
  }

  .head {
    &__title {
      font-size: 20px;
      font-weight: 700;
      font-family: Panton_SemiBold;
    }

    &__description {
      color: #6b93c0;
      font-size: 16px;
      font-weight: 400;
      margin-top: 5px;
    }

    &__search {
      position: relative;
      height: 65px;
      margin: 20px 0;
    }

    &__enter {
      width: 64px;
      height: 30px;
      background: #876dff;
      border-radius: 6px;
      color: $white;
      font-size: 12px;
      text-transform: uppercase;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      right: 15px;
      bottom: 17px;

      &:hover {
        cursor: pointer;
        opacity: 0.7;
      }
    }
  }

  &__apps {
    .title {
      color: #59779a;
      font-weight: 700;
      font-size: 18px;
      font-family: Panton_SemiBold;
      margin-bottom: 20px;
    }

    .apps-list {
      display: flex;
      flex-direction: column;

      &__item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 72px;
        margin-bottom: 10px;
        background: linear-gradient(90deg, #f1f0ff 0%, #e3f6ff 100%);
        border-radius: 8px;
        padding: 0 12px;
        cursor: pointer;

        .info {
          display: flex;
          align-items: center;
        }

        .logo {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: $white;
          box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
          border-radius: 8px;

          img {
            border-radius: 8px;
          }
        }

        .name {
          font-size: 18px;
          color: #4b4c63;
          margin-left: 15px;
        }

        .remove {
          &:hover {
            cursor: pointer;
            opacity: 0.8;
          }
        }
      }
    }
  }

  .block {
    background: $white;
    box-shadow: -10px 4px 50px rgba(0, 0, 0, 0.1);
    border-radius: 16px;
    min-height: calc(100vh - 130px);
    padding: 20px;
    box-sizing: border-box;
    width: 49%;

    &.right {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
