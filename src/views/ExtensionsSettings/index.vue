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
      <!-- ACCS -->
      <div v-if="!isLoading" class="extensions-settings__apps">
        <div class="title">{{ $t('settings.extensions.accsTitle') }}</div>
        <div class="apps-list">
          <div
            v-for="(user, ndx) in devAccounts"
            :key="ndx"
            class="apps-list__item acc"
          >
            <div class="info">
              <div class="logo">
                <anonymusSvg />
              </div>
              <div class="name">{{ user.full_name }}</div>
            </div>
            <removeIcon
              width="19"
              height="24"
              fill="#FA3B33"
              class="remove"
              @click.stop="disconnectAccount(user.id)"
            />
          </div>
        </div>
      </div>
      <!-- APPS -->
      <div v-if="!isLoading" class="extensions-settings__apps">
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
                  v-if="!app.is_single_connected"
                  :src="app.logo"
                  width="32"
                  height="32"
                  onerror="this.src = window.defaultIcon"
                />
              </div>
              <div class="name">{{ app.name }}</div>
            </div>
            <removeIcon
              v-if="app.is_single_connected"
              width="19"
              height="24"
              fill="#FA3B33"
              class="remove"
              @click.stop="disconnectApp(app.project_id)"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="block right">
      <div class="head">
        <div class="head__title">
          {{ $t('settings.extensions.guideTitle') }}
        </div>
        <div class="head__description">
          {{ $t('settings.extensions.guideTitleDescription') }}
        </div>
      </div>
      <div class="guides">
        <ToggleItem
          :item="{
            title: $t('settings.extensions.guides.question1Title'),
            description: $t('settings.extensions.guides.question1Description'),
          }"
          class="guides-item"
        >
          <answer1 />
        </ToggleItem>
        <ToggleItem
          :item="{
            title: $t('settings.extensions.guides.question2Title'),
            description: $t('settings.extensions.guides.question2Description'),
          }"
          class="guides-item"
        >
          <answer2 />
        </ToggleItem>
      </div>
    </div>
  </div>
</template>
<script>
// import appsettings from '@/assets/icons/appsettings.svg';
import removeIcon from '@/assets/icons/settings/remove.svg';
import Textarea from '@/components/UI/Textarea';
import Loading from '@/components/Loading';
import ToggleItem from '@/components/ToggleItem';
import { ref, computed, markRaw, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import anonymusSvg from '@/assets/icons/anonymus.svg';
import answer1 from '@/assets/icons/settings/answer1.svg';
import answer2 from '@/assets/icons/settings/answer2.svg';

export default {
  name: 'ExtensionsSettings',
  components: {
    Textarea,
    Loading,
    ToggleItem,
    removeIcon,
    anonymusSvg,
    answer1,
    answer2,
  },
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
        await store.dispatch('extensions/fetchDevAccount');
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

    const devAccounts = computed(() => store.getters['extensions/devAccount']);

    const connectToDevCenter = async (token) => {
      messageError.value = '';
      ignoreApps.value = [];

      if (!token.trim().length) {
        return;
      }

      isLoading.value = true;

      if (token.startsWith('app')) {
        await store.dispatch('extensions/connectDevApp', { token });
        await store.dispatch('extensions/fetchDevAppsList');
        isLoading.value = false;
        return;
      }

      try {
        const res = await store.dispatch('extensions/connectToDevCenter', {
          token,
        });
        if (!res.ok) {
          messageError.value = res.error;
          await store.dispatch('extensions/fetchDevAppsList');
          await store.dispatch('extensions/fetchDevAccount');
          isLoading.value = false;

          setTimeout(() => {
            messageError.value = '';
          }, 1500);
          return;
        }
        localStorage.setItem('userAppSettingsToken', token);
        await store.dispatch('extensions/fetchDevAppsList');
        await store.dispatch('extensions/fetchDevAccount');

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

    const disconnectAccount = async (developer_id) => {
      await store.dispatch('extensions/disconnectAccount', { developer_id });
      await store.dispatch('extensions/fetchDevAccount');
    };

    const disconnectApp = async (project_id) => {
      await store.dispatch('extensions/disconnectApp', { project_id });
      await store.dispatch('extensions/fetchDevAppsList');
    };

    return {
      appsListFiltered,
      devAccounts,
      appCode,
      isLoading,
      messageError,
      goToApp,
      onSetCode,
      connectToDevCenter,
      setIgnoreApps,
      disconnectAccount,
      disconnectApp,
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
    width: 100%;

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
    &:last-child {
      margin-top: 10px;
    }

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

        &.acc {
          background: linear-gradient(
            90deg,
            #fad0c4 0%,
            #fad0c4 1%,
            #ffd1ff 100%
          );
        }

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
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;

      .guides {
        width: 100%;
        margin-top: 20px;
        display: flex;
        flex-direction: column;
      }

      .guides-item {
        margin-bottom: 20px;
      }
    }
  }
}
</style>
