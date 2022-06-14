<template>
  <div class="add-address-layout">
    <Sidebar v-if="!hideSidebarRoutes.includes($route.name)" />
    <main id="main" class="add-address-layout__main">
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
    const hideSidebarRoutes = ['multisigBalance', 'multisigSend'];

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
    padding-right: 23px;
    padding-left: 32px;
    flex-direction: column;
    display: flex;
    flex-grow: 1;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
    @include lg {
      padding-right: 25px;
    }
    @include md {
      padding-left: 24px;
      padding-right: 25px;
    }
    @include mobile {
      overflow: auto;
    }
  }
}
</style>
