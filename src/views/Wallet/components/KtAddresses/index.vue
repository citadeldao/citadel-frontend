<template>
  <div class="kt-addresses">
    <span class="kt-addresses__title">
      KT <span>{{ $t('address') }}</span>
    </span>
    <div id="list" class="kt-addresses__list">
      <resize-observer :show-trigger="true" @notify="handleResize" />
      <KtAddressItem
        :item="currentWallet"
        :current-wallet="currentWallet"
        :is-checked="!currentKtAddress"
        type="main"
        @click="updateCurrentKtAddress(null)"
      />
      <KtAddressItem
        v-for="(item, index) in displayData"
        :key="`${index}-${item.address}`"
        :item="item"
        :current-wallet="currentWallet"
        :is-checked="isChecked(item)"
        @click="updateCurrentKtAddress(item)"
      />
      <div
        v-if="hiddenData.length"
        class="kt-addresses__hidden-items"
        @click="showModal = true"
      >
        <span class="kt-addresses__hidden-items-title">
          {{ $t('all') }} KT <span>{{ $t('address') }}</span>
        </span>
        <span class="kt-addresses__hidden-items-count">
          + {{ hiddenData.length }}
        </span>
      </div>
    </div>
  </div>
  <teleport v-if="showModal" to="body">
    <Modal>
      <ModalContent
        v-click-away="modalCloseHandler"
        :title="$t('ktAddresses.modalTitle')"
        :desc="$t('ktAddresses.modalDesc')"
        type="action"
        width="600px"
        button-text="ok"
        @close="modalCloseHandler"
        @buttonClick="modalCloseHandler"
      >
        <div class="kt-addresses__modal-list">
          <KtAddressesModalContentItem
            :item="currentWallet"
            :current-wallet="currentWallet"
            :is-checked="!currentKtAddress"
            type="main"
            @click.stop="updateCurrentKtAddress(null)"
          />
          <KtAddressesModalContentItem
            v-for="(item, index) in ktAddresses"
            :key="`${index}-${item.address}`"
            :item="item"
            :current-wallet="currentWallet"
            :is-checked="isChecked(item)"
            @click.stop="updateCurrentKtAddress(item)"
          />
        </div>
      </ModalContent>
    </Modal>
  </teleport>
</template>

<script>
import Modal from '@/components/Modal';
import ModalContent from '@/components/ModalContent';
import { computed, inject, onMounted, ref } from '@vue/runtime-core';
import KtAddressItem from './components/KtAddressItem.vue';
import KtAddressesModalContentItem from './components/KtAddressesModalContentItem.vue';
import { useWindowSize } from 'vue-window-size';
import { screenWidths } from '@/config/sreenWidthThresholds';
export default {
  name: 'KtAddresses',
  components: {
    KtAddressItem,
    Modal,
    ModalContent,
    KtAddressesModalContentItem,
  },
  props: {
    currentWallet: {
      type: Object,
      default: () => {},
    },
  },
  setup() {
    onMounted(() => {
      wrapperWidth.value = document.getElementById('list').offsetWidth;
    });
    const showModal = ref(false);
    const wrapperWidth = ref();
    const handleResize = ({ width }) => {
      wrapperWidth.value = width;
    };
    const { width } = useWindowSize();
    const modalCloseHandler = () => {
      showModal.value = false;
    };
    const showCount = computed(() => {
      const placeholder = width.value >= screenWidths.xl ? 225 : 154;
      const item = width.value >= screenWidths.xl ? 322 : 159;
      const count = Math.floor((+wrapperWidth.value - placeholder) / item - 1);

      return count;
    });
    const currentKtAddress = inject('currentKtAddress');
    const ktAddresses = inject('ktAddresses');
    const updateCurrentKtAddress = inject('updateCurrentKtAddress');
    const isChecked = (item) =>
      currentKtAddress?.value?.address?.toLowerCase() ===
      item.address.toLowerCase();
    const displayData = computed(() =>
      ktAddresses.value.slice(0, showCount.value)
    );
    const hiddenData = computed(() =>
      ktAddresses.value.slice(showCount.value, ktAddresses.value.length)
    );

    return {
      showCount,
      currentKtAddress,
      ktAddresses,
      updateCurrentKtAddress,
      isChecked,
      displayData,
      hiddenData,
      showModal,
      modalCloseHandler,
      handleResize,
    };
  },
};
</script>

<style lang="scss" scoped>
.kt-addresses {
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
  @include lg {
    margin-bottom: 16px;
  }
  &__title,
  &__title > span {
    font-size: 22px;
    line-height: 26px;
    font-family: 'Panton_Bold';
    margin-bottom: 18px;
    & span {
      text-transform: lowercase;
      margin-bottom: 0;
    }
  }
  &__list {
    position: relative;
    display: flex;
  }
  &__hidden-items {
    width: 225px;
    height: 80px;
    border: 1px dashed $mid-blue;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    @include lg {
      width: 154px;
    }
    &:hover {
      cursor: pointer;
      border: 1px dashed $dark-blue;
      .kt-addresses__hidden-items-title,
      .kt-addresses__hidden-items-title > span {
        color: $dark-blue;
      }
    }
  }
  &__hidden-items-title,
  &__hidden-items-title > span {
    font-size: 18px;
    line-height: 22px;
    color: $mid-blue;
    font-family: 'Panton_SemiBold';
  }
  &__hidden-items-title {
    margin-bottom: 3px;
  }
  &__hidden-items-count {
    font-family: 'Panton_SemiBold';
    font-size: 14px;
    line-height: 17px;
    color: $too-dark-blue;
  }
  &__modal-list {
    display: flex;
    width: 100%;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
    margin-top: 16px;
    max-height: 281px;
  }
}
</style>
