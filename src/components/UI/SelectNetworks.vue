<template>
  <div class="select-networks">
    <div class="select-networks__networks">
      <Input
        id="assetsSearch"
        v-model="keyword"
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
        @uncheck="removeItem"
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
        <div class="more" @click="showAllNetworks">
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
        :disabled="!checkedItems.length"
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
export default {
  name: 'SelectNetworks',
  components: { NetworkCard, PrimaryButton, BackButton, Input },
  emits: ['selectNets'],
  setup(props, { emit }) {
    const store = useStore();
    const networksAmount = ref(6);
    const networksList = store.getters['networks/networksList'];
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

    const keyword = ref('');
    const displayData = computed(() => {
      const strictOrderedAbbrs = ['BTC', 'BNB', 'ETH', 'ATOM', 'OSMO', 'SCRT'];
      const filterExistAbbr = networks.value.filter(
        (e) => strictOrderedAbbrs.indexOf(e.abbr) !== -1
      );
      let customOrderedNets = [
        filterExistAbbr[1],
        filterExistAbbr[0],
        filterExistAbbr[3],
        filterExistAbbr[2],
        filterExistAbbr[4],
        filterExistAbbr[5],
      ];
      let filterNets = networks.value.filter(
        (e) => strictOrderedAbbrs.indexOf(e.abbr) === -1
      );
      filterNets.unshift(...customOrderedNets);
      //
      if (!keyword.value) {
        return filterNets;
      }
      return filterNets.filter(
        (item) =>
          item.title.toLowerCase().includes(keyword.value.toLowerCase()) ||
          item.abbr.toLowerCase().includes(keyword.value.toLowerCase())
      );
    });

    const showAllNetworks = () => {
      networksAmount.value = displayData.value.length;
    };
    const { checked, addItem, removeItem, checkedItems } = useCheckItem();
    const checkedNetYetAdded = [];
    const clickHandler = () => {
      const checkedNets = checkedItems.value.map(
        (index) => networks.value[index].net
      );
      const checkedNetsWithoutYetAdded = checkedNets.filter(
        (e) => checkedNetYetAdded.indexOf(e) === -1
      );
      emit('selectNets', [checkedNets, checkedNetsWithoutYetAdded]);
    };
    const onCheck = (e) => {
      addItem(e);
    };
    onMounted(() => {
      const wallets = store.getters['wallets/wallets'];
      for (const key in displayData.value) {
        const foundItem = wallets.find(
          (e) => e.net === displayData.value[key].net
        );
        if (foundItem) {
          addItem(+displayData.value[key].id);
          checkedNetYetAdded.push(displayData.value[key].net);
        }
      }
      for (const key in displayData.value.slice(0, 6)) {
        addItem(+displayData.value[key].id);
      }
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
      onCheck,
      networksAmount,
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
