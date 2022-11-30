<template>
  <div class="select-networks">
    <Input
      id="assetsSearch"
      @input="handleKeyword"
      :label="$t('searchNetworks')"
      type="text"
      icon="loop"
      clearable
    />

    <div class="select-networks__networks">
      <NetworkCard
        v-for="network in displayData.slice(0, networksAmount)"
        :key="network.id"
        :network="network"
        :checked="checked(network.id)"
        data-qa="add-address__one-seed"
        @check="onCheck"
        @uncheck="prepareRemoveItem"
      />
    </div>
    <div class="select-networks__controls">
      <!-- <el-pagination
        layout="pager"
        :page-size="pageSize"
        :total="total"
        :current-page="currentPage"
        @current-change="setCurrentPage"
      /> -->
      <template v-if="networksAmount !== displayData.length">
        <div v-if="!keyword" class="more" @click="handleClickMore">
          <div>{{ $t('addToOneSeed.moreNetworks') }}</div>
          <BackButton :is-down="true" data-qa="More networks" />
        </div>
        <div
          class="title"
          v-if="!isUserMnemonic && route.name !== 'RestoreOneSeed'"
        >
          {{ $t('addToOneSeed.walletCreated') }}
        </div>
        <div class="desc">
          {{ $t('addToOneSeed.walletCreatedDescription') }}
        </div>
      </template>
      <PrimaryButton
        data-qa="Get-started"
        :disabled="!checkedItems.length || isDisabledBtn"
        @click="clickHandler"
      >
        {{ $t('addToOneSeed.getStartedBtn') }}
      </PrimaryButton>
    </div>
  </div>
</template>

<script>
import NetworkCard from '@/components/NetworkCard';
import PrimaryButton from '@/components/UI/PrimaryButton';
import BackButton from '@/components/UI/BackButton';
// import usePaginationWithSearch from '@/compositions/usePaginationWithSearch';
import useCheckItem from '@/compositions/useCheckItem';
import { useStore } from 'vuex';
import { computed, ref } from '@vue/reactivity';
import { onMounted } from 'vue';
import Input from '@/components/UI/Input';
import { netsPositionPriority } from '@/config/netsPositionPriority.js';
import useWallets from '@/compositions/useWallets';
import useCreateWallets from '@/compositions/useCreateWallets';
import { WALLET_TYPES } from '@/config/walletType.js';
import { isNullDerivationPath } from '@/helpers';
import { useRoute } from 'vue-router';
export default {
  name: 'SelectNetworks',
  components: { NetworkCard, PrimaryButton, BackButton, Input },
  emits: ['selectNets'],
  setup(props, { emit }) {
    const route = useRoute();
    const store = useStore();
    const networksAmount = ref(6);
    const networksList = store.getters['networks/networksList'];
    const { wallets } = useWallets();
    const { isUserMnemonic } = useCreateWallets();
    const { checked, addItem, removeItem, checkedItems } = useCheckItem();

    const networks = computed(() =>
      networksList.map((network, index) => ({
        id: index,
        title: network.name,
        percent: store.getters['profile/formatYeldByNet'](network.net),
        abbr: network.code,
        icon: network.net,
        net: network.net,
      }))
    );

    const keyword = ref(''); //search networks
    let isShowMoreClicked = false; //чтобы не сбрасывалось networksAmount при поиске
    const isDisabledBtn = ref(false);
    const displayData = computed(() => {
      //сначала идут названия сетей определённые в netsPositionPriority, затем оставшиеся
      const preferredOrder = [
        ...netsPositionPriority,
        ...networks.value
          .filter((e) => netsPositionPriority.indexOf(e.net) === -1)
          .map((e) => e.net),
      ];
      //сортировка по алфавиту
      let nets = networks.value.sort((a, b) => {
        return preferredOrder.indexOf(a.net) - preferredOrder.indexOf(b.net);
      });
      if (!keyword.value) {
        return nets;
      }
      return nets.filter(
        (item) =>
          item.title.toLowerCase().includes(keyword.value.toLowerCase()) ||
          item.abbr.toLowerCase().includes(keyword.value.toLowerCase())
      );
    });

    const showAllNetworks = () => {
      networksAmount.value = displayData.value.length;
    };
    const prepareRemoveItem = (id) => {
      //удаляем или нет элемент, удаляем если не добавлен(даже если выбран по умолчанию)
      const nonRemovableItem = displayData.value.find((displayedNet) => {
        const findedCheckedNetYetAdded = checkedNetYetAdded.find(
          (findedCheckedNetYetAddedItem) => {
            if (
              findedCheckedNetYetAddedItem === displayedNet.net &&
              id === displayedNet.id
            )
              return displayedNet.net;
          }
        );
        return displayedNet.net === findedCheckedNetYetAdded;
      });
      const walletsFoundedItem = wallets.value.find((e) => {
        return (
          e.net === nonRemovableItem?.net && e.type === WALLET_TYPES.ONE_SEED
        );
      });
      if (nonRemovableItem && walletsFoundedItem) {
        removeItem(id, true);
        return checkedBtnStatus();
      }
      removeItem(id);
      checkedBtnStatus();
      // disabledAllItems();
    };
    const checkedNetYetAdded = [];
    const clickHandler = () => {
      const checkedNets = checkedItems.value.map(
        (index) => networks.value.find((network) => network.id === index).net
      );
      const oneSeedZeroLastIndexWalletsList = wallets.value
        .filter((wallet) => {
          if (
            wallet.type === WALLET_TYPES.ONE_SEED &&
            (wallet.net === 'polkadot'
              ? !wallet.derivationPath
              : isNullDerivationPath(wallet))
          ) {
            return wallet;
          }
        })
        .map((e) => e.net);

      emit(
        'selectNets',
        checkedNets.filter(
          (e) => oneSeedZeroLastIndexWalletsList.indexOf(e) === -1
        )
      );
    };
    const onCheck = (e) => {
      addItem(e);
      checkedBtnStatus();
    };
    const prepareSelectedItems = () => {
      //добавляем айтемы по умолчанию из массива сеток
      for (const key in displayData.value) {
        const displayItem = displayData.value[key];

        if (displayItem.net === 'polkadot') {
          const foundItemOneSeed = wallets.value.find(
            (e) =>
              e.net === displayItem.net &&
              e.type === WALLET_TYPES.ONE_SEED &&
              !e.derivationPath
          );
          if (foundItemOneSeed) {
            addItem(displayItem.id);
            checkedNetYetAdded.push(displayItem.net);
          }
        } else {
          const foundItemOneSeed = wallets.value.find(
            (e) =>
              e.net === displayItem.net &&
              e.type === WALLET_TYPES.ONE_SEED &&
              isNullDerivationPath(e)
          );

          if (foundItemOneSeed) {
            addItem(displayItem.id);
            checkedNetYetAdded.push(displayItem.net);
          } else if (
            !isUserMnemonic.value &&
            netsPositionPriority.findIndex((e) => e === displayItem.net) !== -1
          ) {
            addItem(displayItem.id);
          }
        }
      }
    };
    //состояние кнопки
    const checkedBtnStatus = () => {
      const checkedItemsNets = [];
      //fillCheckedItems заполнение выбранных актуальных айтемов
      for (const displayItem of displayData.value) {
        if (checkedItems.value.findIndex((e) => e === displayItem.id) !== -1) {
          if (checkedItemsNets.length >= checkedNetYetAdded.length) {
            //для оптимизации
            return (isDisabledBtn.value = false);
          }
          if (
            netsPositionPriority.findIndex((e) => e.net === displayItem.net) ===
            -1
          )
            checkedItemsNets.push(displayItem.net);
        }
      }
      //checkNetChanges проверка изменений актуальных выбранных сеток и которые были выбраны изначально
      for (const iterator of checkedNetYetAdded) {
        if (checkedItemsNets.findIndex((e) => e === iterator) === -1) {
          return (isDisabledBtn.value = false);
        }
      }
      return (isDisabledBtn.value = true);
    };
    const handleClickMore = () => {
      showAllNetworks();
      isShowMoreClicked = true;
    };
    const handleKeyword = (value) => {
      keyword.value = value;
      if (value) {
        showAllNetworks();
      } else if (!isUserMnemonic.value && !isShowMoreClicked) {
        networksAmount.value = 6;
      } else {
        showAllNetworks();
      }
    };
    onMounted(() => {
      prepareSelectedItems();
      checkedBtnStatus();
      if (isUserMnemonic.value) showAllNetworks();
    });
    return {
      route,
      displayData,
      checked,
      addItem,
      removeItem,
      keyword,
      clickHandler,
      checkedItems,
      showAllNetworks,
      prepareRemoveItem,
      onCheck,
      handleClickMore,
      handleKeyword,
      networksAmount,
      isDisabledBtn,
      isUserMnemonic,
    };
  },
};
</script>

<style lang="scss" scoped>
.select-networks {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  padding-top: 32px;
  max-width: 891px;
  margin: 0 auto 40px;

  .input {
    min-height: 68px;
    height: 68px;
    max-width: 891px;
    margin-bottom: 50px;
  }

  &__networks {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0 10px;
  }
  &__controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 32px 0 0;
    .more {
      color: #0a2778;
      display: flex;
      align-items: center;
      font-family: Panton_Bold;
      font-size: 16px;
      margin: 15px 0 25px;
      cursor: pointer;

      div {
        margin-right: 10px;
      }
    }

    .title {
      font-family: Panton_Bold;
      color: $black;
      font-size: 18px;
    }

    .desc {
      margin: 15px 0 25px;
      color: #6b93c0;
      font-size: 14px;
    }
  }
}
</style>
