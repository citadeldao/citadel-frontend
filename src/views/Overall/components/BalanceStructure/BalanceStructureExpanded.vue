<template>
  <Modal @click.self="$emit('close')">
    <div class="balance-structure-expanded">
      <div class="balance-structure-expanded__top">
        <div class="balance-structure-expanded__title">
          {{ $t('overallPage.balanceStructure.title') }}
        </div>
        <div class="balance-structure-expanded__tabs">
          <div class="balance-structure-expanded__network-tabs">
            <NetworkTab
              :id="1"
              v-model:currentTab="currentTab"
              class="chart-top__tab"
              value="USD"
              icon="USD"
              data-qa="balance-structure-modal__currency--usd"
            />
            <NetworkTab
              :id="2"
              v-model:currentTab="currentTab"
              class="chart-top__tab"
              value="BTC"
              icon="btc"
              data-qa="balance-structure-modal__currency--btc"
            />
          </div>
          <div
            class="balance-structure-expanded__toggle-info"
            data-qa="balance-structure-modal__expand-button--hide"
            @click="$emit('close')"
            @mouseenter="isToggleHovered = true"
            @mouseleave="isToggleHovered = false"
          >
            <toggleInfoClose :fill="isToggleHovered ? '#fff' : '#8B9BC7'" />
          </div>
        </div>
      </div>
      <div class="balance-structure-expanded__list">
        <BalanceStructureExpandedItem
          v-for="(item, index) in balanceStructure"
          :key="index"
          :item="item"
          :current-tab="currentTab"
          :max-percent="maxPercent"
        />
      </div>
    </div>
  </Modal>
</template>
<script>
import { ref, computed } from 'vue';
import useWallets from '@/compositions/useWallets';
import Modal from '@/components/Modal';
import NetworkTab from '@/components/UI/NetworkTab';
import toggleInfoClose from '@/assets/icons/toggle-info-close.svg';
import BalanceStructureExpandedItem from '@/views/Overall/components/BalanceStructure/BalanceStructureExpandedItem';

export default {
  name: 'BalanceStructureExpanded',
  components: {
    BalanceStructureExpandedItem,
    Modal,
    NetworkTab,
    toggleInfoClose,
  },
  setup() {
    const { balanceStructure } = useWallets();
    const currentTab = ref('USD');
    const isToggleHovered = ref(false);

    // used to render color-bars relative to highest percent
    const maxPercent = computed(() => {
      let maxPrcnt = 0;

      for (const network of Object.values(balanceStructure)) {
        if (maxPrcnt < network.percent) {
          maxPrcnt = network.percent;
        }
      }

      return !maxPrcnt ? 100 : maxPrcnt;
    });

    return {
      currentTab,
      maxPercent,
      isToggleHovered,
      balanceStructure,
    };
  },
};
</script>
<style lang="scss">
.balance-structure-expanded {
  background: #fff;
  height: 100%;
  max-height: 665px;
  width: 1270px;
  border-radius: 16px;
  padding: 45px;
  overflow: hidden;
  @include lg {
    width: 1000px;
    height: 600px;
  }
  @include md {
    width: 820px;
    height: 586px;
  }

  &__top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 60px;
  }

  &__title {
    font-size: 20px;
    font-weight: 700;
  }

  &__tabs {
    max-width: 155px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__network-tabs {
    max-width: 108px;
    width: 100%;
    display: flex;
    justify-content: flex-end;

    & > div:first-child {
      margin-right: 8px;
    }
  }

  &__toggle-info {
    height: 30px;
    width: 30px;
    border-radius: 50%;
    background: $lavander-dark;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &:hover {
      background: $royalblue1;
    }
  }

  &__list {
    overflow: scroll;
    //height: 100%;
    height: 460px;
    @include lg {
      height: 400px;
    }
    @include md {
      height: 400px;
    }
  }
}
</style>
