<template>
  <div class="assets-list-modal-content">
    <div class="assets-list-modal-content__input">
      <Input
        id="assetName"
        v-model="searchQuery"
        :label="$t('assetsModal.searchLabel')"
        type="text"
        icon="loop"
        :placeholder="$t('assetsModal.searchPlaceholder')"
        data-qa="create-list__name"
      />
    </div>
    <div class="assets-list-modal-content__addresses">
      <AssetItem
        v-for="(asset, index) of filteredAssets"
        :key="`${asset.net}${asset.address}${index}`"
        :asset="asset"
        @click="$emit('click', asset)"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import Input from '@/components/UI/Input';
import AssetItem from './AssetItem.vue';

export default {
  name: 'CustomListModalContent',
  components: { AssetItem, Input },
  props: {
    currentWallet: {
      type: Object,
      required: true,
    },
  },
  emits: ['click'],
  setup(props) {
    const store = useStore();

    const searchQuery = ref('');
    const assetsList = computed(() =>
      store.getters['subtokens/formatedSubtokens'](false, props.currentWallet)
    );

    const filteredAssets = computed(() =>
      assetsList.value.filter((a) =>
        a.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    );

    return {
      assetsList,
      searchQuery,
      filteredAssets,
    };
  },
};
</script>

<style lang="scss" scoped>
.assets-list-modal-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 24px 0 0 0;

  &__input {
    width: 100%;
    height: 68px;
    margin-bottom: 20px;
  }

  &__addresses {
    padding-right: 10px;
    max-height: 290px;
    overflow-y: auto;

    @include lg {
      max-height: 216px;
    }

    @include md {
      max-height: 216px;
    }
  }

  &__wallets-count {
    display: flex;
    align-items: center;
  }

  &__wallets-count-title,
  &__wallets-count-count {
    font-size: 16px;
    line-height: 19px;
    color: $blue;
  }

  &__wallets-count-count {
    margin-right: 3px;
    font-family: 'Panton_Bold';
  }

  &__info-banner {
    width: 100%;
    height: 100px;
    background: $ligth-red;
    border-radius: 10px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    padding: 0 28px 0 29px;
    @include lg {
      height: 80px;
      padding: 0 19px 0 18px;
      margin-bottom: 16px;
    }
    @include md {
      height: 80px;
      padding: 0 19px 0 18px;
      margin-bottom: 16px;
    }

    & svg {
      min-width: 59px;
      height: 59px;
      margin-right: 18px;
      @include lg {
        min-width: 40px;
        height: 40px;
        margin-right: 14px;
      }
      @include md {
        min-width: 40px;
        height: 40px;
        margin-right: 14px;
      }
    }

    & p {
      margin: 0;
      font-size: 14px;
      line-height: 20px;
      color: $red;
      font-family: 'Panton_SemiBold';
    }
  }
}

.warning {
  height: 100px;
}
</style>
