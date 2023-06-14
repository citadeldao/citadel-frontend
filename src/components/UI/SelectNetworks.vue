<template>
  <div class="select-networks">
    <div class="select-networks__controls-filter">
      <Input
        id="assetsSearch"
        v-model="keyword"
        @input="handleKeyword"
        :label="$t('searchNetworks')"
        type="text"
        icon="loop"
        clearable
        @clear="onClear"
      />
      <NetworksFilter
        class="filter-networks"
        @changeCategory="onChangeCategory"
      />
    </div>
    <div class="select-networks__selects">
      <div class="select" @click="selectAll">
        {{ $t('keplr.selectAll') }}
      </div>
      <div class="unselect" @click="unselectAll">
        <p>{{ $t('keplr.unselectAll') }}</p>
        <closeIcon class="close-icon" />
      </div>
    </div>
    <div class="select-networks__networks">
      <NetworkCard
        v-for="network in displayData.slice(0, networksAmount)"
        :key="network.id"
        :network="network"
        :checked="checked(network.id)"
        :is-new="isUserMnemonic && newItemIds[network.id]"
        :empty-mnemonic="!isUserMnemonic"
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
      <template
        v-if="networksAmount !== displayData.length && !activeNetworksCategory"
      >
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
        :disabled="
          !isUserMnemonic
            ? isDisabledBtn
            : !Object.keys(newItemIds).length || isDisabledBtn
        "
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
import { computed, ref, reactive } from '@vue/reactivity';
import { onMounted } from 'vue';
import Input from '@/components/UI/Input';
import { netsPositionPriority } from '@/config/netsPositionPriority.js';
import useWallets from '@/compositions/useWallets';
import useCreateWallets from '@/compositions/useCreateWallets';
import { WALLET_TYPES } from '@/config/walletType.js';
import { isNullDerivationPath } from '@/helpers';
import { useRoute } from 'vue-router';
import closeIcon from '@/assets/icons/close.svg';
import NetworksFilter from '@/components/UI/NetworksFilter';
import { networksFilterCategory } from '@/config/availableNets';

export default {
  name: 'SelectNetworks',
  components: {
    NetworkCard,
    NetworksFilter,
    PrimaryButton,
    BackButton,
    Input,
    closeIcon,
  },
  emits: ['selectNets'],
  setup(props, { emit }) {
    const route = useRoute();
    const store = useStore();
    const networksAmount = ref(6);
    const networksList = store.getters['networks/networksList'];
    const { wallets } = useWallets();
    const { isUserMnemonic } = useCreateWallets();
    const { checked, addItem, removeItem, checkedItems } = useCheckItem();
    const newItemIds = reactive({});

    // filter
    const isChangedCategory = ref(false);
    const activeNetworksCategory = ref('');
    const onChangeCategory = (category) => {
      isChangedCategory.value = true;
      if (category === 'all') {
        keyword.value = '';
        onClear();
        activeNetworksCategory.value = '';
      } else {
        activeNetworksCategory.value = networksFilterCategory[category];
      }
      setTimeout(() => {
        showAllNetworks();
      }, 0);
    };

    const networks = computed(() =>
      networksList
        .map((network, index) => ({
          id: index,
          title: network.name,
          percent: store.getters['profile/formatYeldByNet'](network.net),
          abbr: network.code,
          icon: network.net,
          net: network.net,
        }))
        .filter((n) => n.net !== 'tez')
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
        if (!activeNetworksCategory.value) return nets;

        return nets.filter((coin) =>
          activeNetworksCategory.value.includes(coin.net)
        );
      }

      if (!activeNetworksCategory.value) {
        return nets.filter(
          (item) =>
            item.title.toLowerCase().includes(keyword.value.toLowerCase()) ||
            item.abbr.toLowerCase().includes(keyword.value.toLowerCase())
        );
      }

      return nets.filter(
        (item) =>
          activeNetworksCategory.value.includes(item.net) &&
          (item.title.toLowerCase().includes(keyword.value.toLowerCase()) ||
            item.abbr.toLowerCase().includes(keyword.value.toLowerCase()))
      );
    });

    const showAllNetworks = () => {
      networksAmount.value = displayData.value.length;
    };
    const prepareRemoveItem = (id) => {
      if (newItemIds[id]) {
        delete newItemIds[id];
      }
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
      newItemIds[e] = !newItemIds[e];
      addItem(e);
      checkedBtnStatus();
    };
    const prepareSelectedItems = () => {
      //добавляем айтемы по умолчанию из массива сеток
      for (const key in displayData.value) {
        const displayItem = displayData.value[key];

        if (displayItem.net === 'polkadot') {
          // TO DO NEW TYPE ?
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
    const handleKeyword = () => {
      if (keyword.value) {
        showAllNetworks();
      } else if (!isUserMnemonic.value && !isShowMoreClicked) {
        networksAmount.value = 6;
      } else {
        showAllNetworks();
      }
    };

    const selectAll = () => {
      // keyword.value = '';
      // handleClickMore();
      displayData.value.forEach((item) => {
        if (!isUserMnemonic.value) {
          if (!checkedItems.value.includes(item.id)) {
            onCheck(item.id);
          }
        } else {
          if (!checked(item.id)) {
            if (!checkedItems.value.includes(item.id)) {
              onCheck(item.id);
            }
          }
        }
      });
    };

    const unselectAll = () => {
      // keyword.value = '';
      // handleKeyword();
      displayData.value.forEach((item) => {
        if (!isUserMnemonic.value) {
          prepareRemoveItem(item.id);
          // if (!netsPositionPriority.includes(item.net)) {
          //
          // }
        } else {
          if (newItemIds[item.id]) {
            prepareRemoveItem(item.id);
          }
        }
      });
    };

    const onClear = () => {
      keyword.value = '';
      handleKeyword();
    };

    onMounted(() => {
      prepareSelectedItems();
      checkedBtnStatus();
      if (isUserMnemonic.value) showAllNetworks();
    });
    return {
      onClear,
      selectAll,
      unselectAll,
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
      newItemIds,
      activeNetworksCategory,
      isChangedCategory,
      onChangeCategory,
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

  &__controls-filter {
    width: 100%;
    display: flex;

    .filter-networks {
      margin-left: 13px;
    }
  }

  .input {
    min-height: 68px;
    height: 68px;
    max-width: 100%; // 891px;
    margin-bottom: 20px;
  }

  &__networks {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start; // center;
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

  &__selects {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin: 0 0 25px;

    .input {
      height: 68px;
    }

    .select {
      color: #00a3ff;
      border-bottom: 1px dotted #00a3ff;
      cursor: pointer;
    }

    .unselect {
      display: flex;
      align-items: center;
      color: #fa3b33;
      p {
        margin: 0 8px 0 0;
        border-bottom: 1px dotted #fa3b33;
      }
      cursor: pointer;
    }
    .select,
    .unselect {
      transition: 0.2s;
      &.disabled {
        opacity: 0;
        cursor: initial;
      }
    }
  }
}
</style>
