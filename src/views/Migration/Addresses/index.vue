<template>
  <div :style="{ marginTop: '20px' }" class="addresses">
    <div class="addresses__info">
      <span class="addresses__title">
        {{ $t('settings.addresses.title') }}
      </span>
      <div class="addresses__content">
        <Dropdown
          v-for="group in groupWalletsByNet"
          :key="group.net"
          :data="group"
          :hidden-wallets="hiddenWallets"
          :has-visible-button="hasVisibleButton(group)"
          @toggle-hidden="toggleWalletHidden"
          @exportWallet="exportWallet"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import Dropdown from './components/Dropdown';

const netsWithVisibleButton = ['Secret'];

export default {
  name: 'Addresses',
  components: { Dropdown },
  props: {
    groupWalletsByNet: {
      type: Array,
      required: true,
    },
  },
  emits: ['exportWallet'],
  setup(props, { emit }) {
    const store = useStore();

    const hiddenWallets = computed(
      () => store.getters['wallets/hiddenWallets']
    );

    const exportWallet = (val) => {
      emit('exportWallet', val);
    };

    const toggleWalletHidden = (wallet) => {
      store.dispatch('wallets/toggleHiddenWallet', wallet);
    };
    const hasVisibleButton = (group) =>
      netsWithVisibleButton.includes(group.net);

    return {
      hiddenWallets,
      toggleWalletHidden,
      exportWallet,
      hasVisibleButton,
    };
  },
};
</script>

<style lang="scss" scoped>
.addresses {
  flex: 1;
  min-height: 200px;
  max-height: 280px;
  padding-top: 10px;
  overflow: auto;
  width: 100%;
  // border-radius: 25px;

  &__info {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  &__title {
    font-size: 20px;
    line-height: 30px;
    margin: -15px 0 15px 0;
    font-family: 'Panton_Bold';
    @include md {
      margin-bottom: 4px;
    }
  }
}
</style>
