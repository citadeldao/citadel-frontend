<template>
  <ModalContent
    :title="$t('chooseAddresses')"
    :desc="modalDesc"
    type="action"
    :button-text="$t('qr.generateQR')"
    :disabled="checkedItems?.length <= 0"
    @close="$emit('close')"
    @button-click="onButtonClick"
  >
    <div class="qr-card__content">
      <div class="qr-card__search-input">
        <Input
          id="search"
          v-model="keyword"
          :label="$t('searchAddress')"
          type="text"
          icon="loop"
          :placeholder="$t('addressName')"
        />
      </div>
      <div class="qr-card__addresses">
        <QrAddressItem
          v-for="item in displayData"
          :key="`${item.address}_${item.net}`"
          :address="item"
          :checked="checked(item)"
          @check="addItemHandler"
          @uncheck="removeItem"
        />
      </div>
    </div>
  </ModalContent>
</template>

<script>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Input from '@/components/UI/Input';
import ModalContent from '@/components/ModalContent';
import QrAddressItem from './components/QrAddressItem';
import useCheckItem from '@/compositions/useCheckItem';
import { WALLET_TYPES } from '@/config/walletType';
import useWallets from '@/compositions/useWallets';

export default {
  name: 'QrCard',
  components: {
    Input,
    QrAddressItem,
    ModalContent,
  },
  emits: ['close', 'confirm'],
  setup(props, { emit }) {
    const { t } = useI18n();
    const keyword = ref('');

    const { wallets: walletsList } = useWallets();
    const isError = computed(() => checkedItems.value.length > 2);
    const { addItem, checkedItems } = useCheckItem();
    const addItemHandler = (item) => {
      if (!isError.value) {
        addItem(item);
      }
    };
    const wallets = computed(() => {
      return walletsList.value
        .filter(wallet => wallet.type === WALLET_TYPES.ONE_SEED ||
          wallet.type === WALLET_TYPES.PRIVATE_KEY)
        .filter((v, i, a)=>a.findIndex(
          t => (t.address.toLowerCase() === v.address.toLowerCase() && t.net === v.net)) === i);
    });
    const displayData = computed(() => {
      if (!keyword.value) {
        return wallets.value;
      }

      return wallets.value.filter(
        (data) =>
          (
            data.title?.toLowerCase().includes(keyword.value.toLowerCase()) ||
            data.address?.toLowerCase().includes(keyword.value.toLowerCase())
          ) && (data.type === WALLET_TYPES.ONE_SEED || data.type === WALLET_TYPES.PRIVATE_KEY),
      );
    });
    const modalDesc = computed(() => isError.value
      ? `<span class="text-color--red">${t('qr.modalErrorInfo')}</span>`
      : t('qr.modalInfo'));

    const checked = ({
      address,
      net,
    }) => checkedItems.value.some((item) => item.address.toLowerCase() === address.toLowerCase() &&
      item.net === net);

    const removeItem = ({ address, net }) => {
      checkedItems.value = checkedItems.value
        .filter(item => !(address.toLowerCase() === item.address.toLowerCase() && net === item.net));

      return checkedItems.value;
    };

    const onButtonClick = () => {
      emit('confirm', checkedItems.value);
    };

    return {
      keyword,
      displayData,
      addItem,
      addItemHandler,
      removeItem,
      checked,
      checkedItems,
      isError,
      modalDesc,
      onButtonClick,
    };
  },
};
</script>

<style lang="scss" scoped>
.qr-card {
  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-top: 24px;
  }

  &__search-input {
    width: 100%;
    height: 68px;
    margin-bottom: 24px;
  }

  &__addresses {
    max-height: 290px;
    width: 100%;
    display: flex;
    padding-right: 7px;
    flex-direction: column;
    overflow: hidden auto;
  }
}
</style>
