<template>
  <div class="add-address-layout">
    <Sidebar v-if="!hideSidebarRoutes.includes($route.name)" />
    <main
      id="main"
      :class="{
        noMargin: $route.name === 'Extensions' && $route.params.name,
        noPadding: $route.name === 'Extensions' && $route.params.name,
      }"
      class="add-address-layout__main"
    >
      <Header />
      <slot />
    </main>
    <MigrationLayout />
  </div>
</template>

<script>
import { computed } from 'vue';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MigrationLayout from '@/views/Migration/index';
import { useStore } from 'vuex';

export default {
  name: 'AddAddressLayout',
  components: {
    Header,
    Sidebar,
    MigrationLayout,
  },
  setup() {
    const store = useStore();
    const isAuthenticated = computed(
      () => store.getters['auth/isAuthenticated']
    );
    const hideSidebarRoutes = [
      'multisigBalance',
      'multisigSend',
      'multisender',
    ];
    if (window.localStorage.getItem('setLang')) {
      window.localStorage.removeItem('setLang');
      window.location.reload();
    }

    return { hideSidebarRoutes, isAuthenticated };
  },
};
</script>

<style lang="scss" scoped>
.add-address-layout {
  height: 100vh;
  display: flex;
  background: $gray-gradient;
  @include md {
  }
  &__main {
    padding: $main-padding;
    flex-direction: column;
    display: flex;
    flex-grow: 1;
    overflow-y: overlay;
    overflow-x: hidden;
    width: 100%;
    position: relative;
    @include lg {
      padding-right: 25px;
    }
    @include md {
      padding-left: 0;
      padding-right: 25px;
    }
    @include laptop {
      margin-left: 80px;
      padding: $main-padding-laptop;
    }
    @include mobile {
      overflow: auto;
    }

    &.noMargin {
      margin-left: 0 !important;
    }

    &.noPadding {
      padding-top: 0 !important;
    }
  }
}
</style>
