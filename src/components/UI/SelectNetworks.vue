<template>
  <div class="select-networks">
    <div class="select-networks__networks">
      <Input
        id="assetsSearch"
        @input="handleKeyword"
        :label="$t('searchNetworks')"
        type="text"
        icon="loop"
        clearable
      />
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
        <div class="title">
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
export default {
  name: 'SelectNetworks',
  components: { NetworkCard, PrimaryButton, BackButton, Input },
  emits: ['selectNets'],
  setup(props, { emit }) {
    const store = useStore();
    const networksAmount = ref(6);
    const networksList = store.getters['networks/networksList'];
    const { wallets } = useWallets();
    const { isUserMnemonic } = useCreateWallets();
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
    const { checked, addItem, removeItem, checkedItems } = useCheckItem();
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
      if (nonRemovableItem) {
        removeItem(id, true);
        return checkedItemStatus();
      }
      removeItem(id);
      checkedItemStatus();
    };
    const checkedNetYetAdded = [];
    const clickHandler = () => {
      const checkedNets = checkedItems.value.map(
        (index) => networks.value.find((network) => network.id === index).net
      );
      let polkadotCondition;
      const oneSeedZeroLastIndexWalletsList = wallets.value
        .filter((wallet) => {
          if (wallet.net === 'polkadot')
            polkadotCondition = wallet.derivationPath;
          if (
            (WALLET_TYPES.ONE_SEED &&
              polkadotCondition &&
              polkadotCondition[polkadotCondition.length - 1] === '0') ||
            !polkadotCondition
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
      checkedItemStatus();
    };
    const prepareSelectedItems = () => {
      //добавляем айтемы по умолчанию из массива сеток
      for (const key in displayData.value) {
        const foundItem = wallets.value.find(
          (e) => e.net === displayData.value[key].net
        );
        if (foundItem) {
          addItem(+displayData.value[key].id);
          checkedNetYetAdded.push(displayData.value[key].net);
        } else if (
          netsPositionPriority.indexOf(displayData.value[key].net) !== -1 &&
          !wallets.value.length
        ) {
          addItem(displayData.value[key].id);
        }
      }
    };
    const disabledAllItems = () => {
      if (checkedNetYetAdded.length === checkedItems.value.length) {
        isDisabledBtn.value = true;
      }
    };
    //состояние кнопки
    const checkedItemStatus = () => {
      if (checkedNetYetAdded.length === checkedItems.value.length) {
        return (isDisabledBtn.value = true);
      }
      isDisabledBtn.value = false;
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
      disabledAllItems();
      if (isUserMnemonic.value) showAllNetworks();
    });
    return {
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
  overflow-y: auto;
  // padding-left: 6px;
  // @include lg {
  //   padding-left: 20px;
  // }
  // @include md {
  //   padding-top: 24px;
  // }
  & .input {
    height: 68px;
    margin: 0 70px;
  }
  &__search-input {
    height: 68px;
    width: 100%;
    flex-shrink: 0;
    padding-left: 31px;
    @include lg {
      padding-left: 40px;
    }
    @include md {
      padding-left: 25px;
    }
  }
  &__networks {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 7px;
    // align-content: baseline;
    // overflow-y: auto;
    // overflow-x: hidden;
    margin-bottom: 26px;
    padding: 24px 0px 0px 31px;

    @include lg {
      gap: 16px;
      padding: 24px 0px 0px 40px;
    }
    @include md {
      gap: 13px;
      padding: 16px 0px 0px 25px;
    }
  }
  &__controls {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    // justify-content: space-between;
    justify-content: right;
    align-items: center;
    margin-bottom: 10px;
    padding-left: 25px;

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
