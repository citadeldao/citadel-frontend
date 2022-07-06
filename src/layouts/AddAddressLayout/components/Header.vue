<template>
  <div class="header">
    <PrivacyModal v-if="showPrivacy" @close="showPrivacy = false" />
    <TermsModal v-if="showTerms" @close="showTerms = false" />
    <div
      v-if="
        wallets?.length &&
        !['multisigBalance', 'multisigSend'].includes($route.name)
      "
      class="header__breadcrumbs"
    >
      <Breadcrumbs />
    </div>
    <h1 v-else class="header__title">
      {{ title }}
    </h1>
    <div class="header__menu">
      <div class="header__menu-buttons">
        <button
          class="header__menu-button faq"
          active-class="header__menu-button--active"
          data-qa="header__dao-button"
        >
          <faq class="faq" />
          <div class="faq-items">
            <div class="faq-item" @click="showPrivacy = true">
              <privacy />
              <div>{{ $t('faq.privacyPolicy') }}</div>
            </div>
            <div class="faq-item" @click="showTerms = true">
              <terms />
              <div>{{ $t('faq.termsOfService') }}</div>
            </div>
          </div>
        </button>
        <button v-if="false" class="header__menu-button">
          <help />
          <Badge v-if="false" :content="12" background-color="#00A3FF" />
        </button>
        <router-link
          :to="{ name: 'Extensions', params: { name: XCT_GOVERNANCE_APP } }"
          class="header__menu-button"
          active-class="header__menu-button--active"
          data-qa="header__dao-button"
        >
          <customer />
        </router-link>
        <router-link
          :to="{ name: 'Rewards' }"
          class="header__menu-button"
          active-class="header__menu-button--active"
          data-qa="header__rewards-button"
        >
          <Badge
            v-if="false"
            :content="rewards.length"
            background-color="#FF5722"
          />
          <hotSale />
        </router-link>
        <router-link
          v-if="extensionsList?.length"
          :to="{ name: 'Extensions' }"
          class="header__menu-button"
          active-class="header__menu-button--active"
          data-qa="header__rewards-button"
        >
          <Badge :content="extensionsList?.length" background-color="#6A4BFF" />
          <app />
        </router-link>

        <div class="header__menu-button-wrapper">
          <button
            class="header__menu-button header__menu-button--user"
            data-qa="header__user-button"
          >
            <user />
            <div class="header__user-tooltip">
              <HeaderTooltip
                :data="userSubMenu"
                @settings="settingsHandler"
                @logout="openLogoutModal"
              />
            </div>
          </button>
        </div>
      </div>
    </div>

    <LogoutModal
      v-if="!!isLogoutModalOpened"
      :options="logoutOptions"
      :has-wallets="hasWallets"
      @update:options="updateOptions"
      @close="closeLogoutModal"
      @confirm="logout"
      @resetLogoutOptions="onResetLogoutOptions"
    />
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { computed, ref, reactive, inject } from '@vue/runtime-core';
import { useRoute, useRouter } from 'vue-router';

import { removeStorage } from '@/utils/storage';
import useWallets from '@/compositions/useWallets';
import HeaderTooltip from './HeaderTooltip.vue';
import LogoutModal from './LogoutModal.vue';
import Breadcrumbs from './Breadcrumbs.vue';
import Badge from '@/components/Badge';
import customer from '@/assets/icons/customer.svg';
import help from '@/assets/icons/help.svg';
import hotSale from '@/assets/icons/hot-sale.svg';
import app from '@/assets/icons/app.svg';
import user from '@/assets/icons/user.svg';
import faq from '@/assets/icons/faq.svg';
import privacy from '@/assets/icons/privacy.svg';
import terms from '@/assets/icons/terms.svg';
import exportPrivateKeys from '@/helpers/exportPrivateKeys';
import PrivacyModal from '@/components/Modals/Privacy';
import TermsModal from '@/components/Modals/Terms';
import { XCT_GOVERNANCE_APP } from '@/config/walletType';

export default {
  name: 'Header',
  components: {
    customer,
    help,
    hotSale,
    app,
    user,
    Badge,
    faq,
    privacy,
    terms,
    HeaderTooltip,
    LogoutModal,
    Breadcrumbs,
    PrivacyModal,
    TermsModal,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const { t } = useI18n();
    const { currentWallet, wallets } = useWallets();
    const citadel = inject('citadel');
    const showPrivacy = ref(false);
    const showTerms = ref(false);

    store.dispatch('extensions/fetchExtensionsList');
    const extensionsList = computed(
      () => store.getters['extensions/extensionsList']
    );

    const rewards = computed(() => store.getters['rewards/rewards']);
    const keyStorage = computed(
      () => `user_${store.getters['profile/info']?.id}`
    );
    const hasWallets = computed(() => !!wallets.value.length);

    const logoutOptions = reactive({
      erase: false,
      backup: false,
    });
    const isLogoutModalOpened = ref(false);
    const userSubMenu = ref([
      { title: t('menu.settings'), icon: 'settings' },
      {
        color: '#FA3B33',
        title: t('menu.logOut'),
        icon: 'logout',
        hasStroke: true,
      },
    ]);

    const isCurrentWallet = computed(() => route.path.includes('wallet'));
    const title = computed(() =>
      isCurrentWallet.value
        ? currentWallet.value?.name
        : t(route.meta.title || '')
    );

    const onResetLogoutOptions = () => {
      logoutOptions.erase = false;
      logoutOptions.backup = hasWallets.value;
    };

    const settingsHandler = () => {
      router.push({ name: 'Settings' });
    };
    const openLogoutModal = () => {
      isLogoutModalOpened.value = true;
    };
    const closeLogoutModal = () => {
      isLogoutModalOpened.value = false;
    };
    const updateOptions = (options) => {
      Object.assign(logoutOptions, options);
    };
    const logout = async () => {
      store.dispatch('app/setLoader', true);
      const { data } = await store.dispatch('auth/logout');

      if (data) {
        await citadel.reset(logoutOptions.erase);

        if (logoutOptions.backup) {
          exportPrivateKeys(keyStorage.value);
        }

        if (logoutOptions.erase) {
          await store.dispatch('crypto/resetState');
          removeStorage(keyStorage.value);
        }

        router.push({ name: 'Login' });
        window.location.reload();
      }
    };

    return {
      isCurrentWallet,
      rewards,
      extensionsList,
      title,
      userSubMenu,
      isLogoutModalOpened,
      logoutOptions,
      wallets,
      settingsHandler,
      logout,
      openLogoutModal,
      closeLogoutModal,
      updateOptions,
      onResetLogoutOptions,
      hasWallets,
      showPrivacy,
      showTerms,
      XCT_GOVERNANCE_APP,
    };
  },
};
</script>

<style lang="scss" scoped>
.header {
  min-height: 114px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 30px;

  @include md {
    min-height: 82px;
  }

  &__title {
    font-size: 35px;
    line-height: 42px;
    @include md {
      font-size: 24px;
    }
  }

  &__menu {
    display: flex;
    align-items: center;
  }

  &__menu-buttons {
    display: flex;
    position: relative;
  }

  &__menu-button-wrapper {
    &:hover {
      .header__user-tooltip {
        display: initial;
      }
    }
  }

  &__menu-button {
    justify-content: center;
    align-items: center;
    display: flex;
    width: 45px;
    height: 45px;
    border-radius: $round;
    background: $white;
    margin-right: 27px;
    position: relative;

    &.faq {
      position: relative;

      .faq-items {
        transition: 0.3s all ease-in-out;
        display: none;
        width: 259px;
        box-sizing: border-box;
        padding: 0 15px;
        background: $white;
        box-shadow: 0px 15px 50px rgba(80, 100, 124, 0.1),
          0px 10px 15px rgba(80, 100, 124, 0.16);
        border-radius: 8px;
        position: absolute;
        z-index: 10;
        top: 45px;

        .faq-item {
          padding: 16px 0;
          width: 100%;
          display: flex;
          align-items: center;
          color: rgb(107, 147, 192);

          &:hover {
            color: $dark-blue;

            svg {
              fill: $dark-blue !important;
            }
          }

          &:first-child {
            border-bottom: 1px solid #f0f3fd;
          }

          div {
            margin-left: 5px;
          }
        }
      }
    }

    &--user {
      background: $dark-blue;
      margin-right: 0;
    }

    &--active {
      background: $blue;

      & svg {
        fill: $white;
      }
    }

    @include md {
      width: 32px;
      height: 32px;
    }

    & svg {
      width: 20px;
      height: 20px;
      transition: none;
      @include md {
        width: 16px;
        height: 16px;
      }
    }

    &:hover {
      background: $blue;

      .faq-items {
        display: flex;
        flex-direction: column;
      }

      & svg.faq {
        fill: $white;
      }
    }
  }

  &__user-tooltip {
    display: none;
    position: absolute;
    z-index: 1001;
    right: 0;
    top: 45px;
    @include md {
      top: 32px;
    }
  }
}
</style>
