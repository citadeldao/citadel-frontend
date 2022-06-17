<template>
  <div class="custom-list-modal-content">
    <div
      v-if="showWarningBanner && !checkedItems.length"
      class="custom-list-modal-content__info-banner"
    >
      <exclamation />
      <p>
        {{ $t('customLists.infoBanner') }}
      </p>
    </div>
    <div
      class="custom-list-modal-content__input"
      :style="{ marginBottom: inputError ? '47px' : '' }"
    >
      <Input
        id="listName"
        :value="localListName"
        :label="$t('listName')"
        type="text"
        icon="text"
        :placeholder="$t('inputName')"
        :error="inputError"
        data-qa="create-list__name"
        @input="updateLocalListName"
      />
    </div>
    <div class="custom-list-modal-content__wallets-count">
      <span
        class="custom-list-modal-content__wallets-count-count"
        data-qa="create-list__counter"
      >
        {{ checkedItems.length }}
      </span>
      <span class="custom-list-modal-content__wallets-count-title">
        {{ $t('customLists.walletsCountTitle') }}
      </span>
    </div>
    <div
      class="custom-list-modal-content__addresses"
      :style="{ maxHeight: mode === 'create' ? '290px' : '' }"
    >
      <AddressItem
        v-for="(item, index) in wallets"
        :key="`${item.address}${item.net}${index}`"
        :address="item"
        :checked="checked(item)"
        @check="addItem"
        @uncheck="removeItem"
      />
    </div>
  </div>
</template>

<script>
import exclamation from '@/assets/icons/exclamation.svg';
import Input from '@/components/UI/Input';
import AddressItem from './AddressItem.vue';
import { ref } from '@vue/reactivity';
import { inject } from '@vue/runtime-core';
import { findAddressWithNet } from '@/helpers';

export default {
  name: 'CustomListModalContent',
  components: { AddressItem, Input, exclamation },
  props: {
    wallets: {
      type: Array,
      default: () => [],
    },
    currentCustomList: {
      type: [Object, null],
      default: null,
    },
    inputError: {
      type: String,
      default: '',
    },
    showWarningBanner: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: '',
    },
  },
  setup() {
    const checkedItems = inject('checkedWallets');
    const updateCheckedWallets = inject('updateCheckedWallets');
    const listName = inject('listName');
    const updateListName = inject('updateListName');
    const checked = (wallet) =>
      !!findAddressWithNet(checkedItems.value, wallet);
    updateCheckedWallets(checkedItems.value);

    const addItem = (item) => {
      checkedItems.value.push({ address: item.address, net: item.net });
      updateCheckedWallets(checkedItems.value);
    };

    const removeItem = (wallet) => {
      checkedItems.value = checkedItems.value.filter(
        ({ address, net }) =>
          !(
            address.toLowerCase() === wallet.address.toLowerCase() &&
            net === wallet.net
          )
      );
      updateCheckedWallets(checkedItems.value);
    };
    const localListName = ref(listName.value);

    const updateLocalListName = (e) => {
      updateListName(e);
    };

    return {
      checked,
      addItem,
      removeItem,
      checkedItems,
      localListName,
      updateLocalListName,
    };
  },
};
</script>

<style lang="scss" scoped>
.custom-list-modal-content {
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
      max-height: 215px;
    }
    @include md {
      max-height: 215px;
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
