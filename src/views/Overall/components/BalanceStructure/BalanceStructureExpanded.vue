<template>
  <Modal @click.self="$emit('close')">
    <div class="balance-structure-expanded">
      <div class="balance-structure-expanded__top">
        <div class="balance-structure-expanded__title">
          {{ $t('overallPage.balanceStructure.title') }}
        </div>
        <div class="balance-structure-expanded__tabs">
          <div class="balance-structure-expanded__network-tabs"></div>
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
        />
      </div>
    </div>
  </Modal>
</template>
<script>
import { ref } from 'vue';
import useWallets from '@/compositions/useWallets';
import Modal from '@/components/Modal';
import toggleInfoClose from '@/assets/icons/toggle-info-close.svg';
import BalanceStructureExpandedItem from '@/views/Overall/components/BalanceStructure/BalanceStructureExpandedItem';

export default {
  name: 'BalanceStructureExpanded',
  components: {
    BalanceStructureExpandedItem,
    Modal,
    toggleInfoClose,
  },
  setup() {
    const { balanceStructure } = useWallets();
    const isToggleHovered = ref(false);

    return {
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

  &__top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  &__title {
    font-family: 'Panton_Bold';
    font-weight: 700;
    font-size: $h5-size;
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
    min-height: 250px;
    height: 550px;

    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 5px 20px 0;

    @include lg {
      height: 475px;
    }
  }
}

body.dark {
  .balance-structure-expanded {
    background: $dark-panel-bg;

    &__toggle-info {
      background: #313354;
    }

    &__title {
      color: $white;
    }
  }
}
</style>
