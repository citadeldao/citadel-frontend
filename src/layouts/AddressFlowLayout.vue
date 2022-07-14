<template>
  <div class="address-layout">
    <div class="address-layout__header">
      <logoIcon
        class="address-layout__logo"
        @click="$router.push({ name: 'Overall' })"
      />
      <div class="address-layout__close" data-qa="Close" @click="onClose">
        <closeIcon />
      </div>
    </div>
    <div
      :class="{ 'menu-item': !menuRoutes.includes($route.name) }"
      class="address-layout__wrap"
    >
      <slot />
    </div>
  </div>
</template>

<script>
import closeIcon from '@/assets/icons/addAddressV2/close.svg';
import logoIcon from '@/assets/icons/addAddressV2/logo.svg';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { computed } from 'vue';

const menuRoutes = ['AddAddress', 'AddWalletTypes'];

export default {
  name: 'AddressFlowLayout',
  components: { logoIcon, closeIcon },
  setup() {
    const router = useRouter();
    const store = useStore();

    const wallets = computed(() => store.getters['wallets/wallets']);

    const onClose = () => {
      if (!wallets.value.length) {
        router.push({ name: 'Settings' });

        return;
      }
      window.history.state.back
        ? router.go(-1)
        : router.push({ name: 'Settings' });
    };

    return {
      menuRoutes,
      onClose,
    };
  },
};
</script>
<style lang="scss" scoped>
.address-layout {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
  padding: 50px 0 0;
  box-sizing: border-box;
  min-height: 100vh;
  height: 100vh;
  overflow-y: auto;
  background: linear-gradient(255.4deg, #f0f2fc 0%, #edf2fc 100%);

  &__header {
    width: 1140px;
    justify-content: space-between;
    display: flex;
    align-items: center;

    @include md {
      width: 94%;
    }
  }

  &__logo {
    cursor: pointer;
    // left: 170px;
    // top: 50px;
    // position: absolute;
  }

  &__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 45px;
    height: 45px;
    box-sizing: border-box;
    border-radius: 50%;
    border: 3px solid #fff;
    background: #6b93c0;
    // position: absolute;
    // right: 180px;
    // top: 40px;
    z-index: 100;

    &:hover {
      background: #6a4bff;
      cursor: pointer;
    }
  }

  &__wrap {
    width: 1140px;
    transition: none;

    @include md {
      width: 100%;
    }

    &.menu-item {
      margin-top: 100px;
    }
  }
}
</style>
