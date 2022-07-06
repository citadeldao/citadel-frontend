<template>
  <div class="select-networks">
    <div class="select-networks__networks">
      <NetworkCard
        v-for="network in displayData.slice(0, networksAmount)"
        :key="network.id"
        :network="network"
        :checked="checked(network.id)"
        icons-path="token"
        data-qa="add-address__one-seed"
        @check="addItem"
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
      <div
        v-if="networksAmount !== displayData.length"
        class="more"
        @click="showAllNetworks"
      >
        <div>{{ $t('addToOneSeed.moreNetworks') }}</div>
        <BackButton :is-down="true" data-qa="More networks" />
      </div>
      <div class="title">
        {{ $t('addToOneSeed.walletCreated') }}
      </div>
      <div class="desc">
        {{ $t('addToOneSeed.walletCreatedDescription') }}
      </div>
      <PrimaryButton
        :disabled="!checkedItems.length"
        @click="clickHandler"
        data-qa="Get-started"
      >
        {{ $t('addToOneSeed.getStartedBtn') }}
      </PrimaryButton>
    </div>
  </div>
</template>

<script>
import NetworkCard from '@/components/NetworkCard';
import PrimaryButton from '@/components/UI/PrimaryButton';
import useCheckItem from '@/compositions/useCheckItem';
import { useStore } from 'vuex';
import { computed, ref } from '@vue/reactivity';
import BackButton from '@/components/UI/BackButton';

export default {
  name: 'SelectNetworks',
  components: { NetworkCard, PrimaryButton, BackButton },
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
      if (!keyword.value) {
        return networks.value;
      }

      return networks.value.filter(
        (item) =>
          item.title.toLowerCase().includes(keyword.value.toLowerCase()) ||
          item.abbr.toLowerCase().includes(keyword.value.toLowerCase())
      );
    });

    const showAllNetworks = () => {
      networksAmount.value = displayData.value.length;
    };

    const { checked, addItem, removeItem, checkedItems } = useCheckItem();

    const clickHandler = () => {
      const checkedNets = checkedItems.value.map(
        (index) => networks.value[index].net
      );
      emit('selectNets', checkedNets);
    };

    return {
      displayData,
      checked,
      addItem,
      removeItem,
      keyword,
      clickHandler,
      checkedItems,
      showAllNetworks,
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
    display: flex;
    // height: 406px;
    flex-wrap: wrap;
    justify-content: center;
    gap: 7px;
    // align-content: baseline;
    // overflow-y: auto;
    // overflow-x: hidden;
    margin-bottom: 26px;
    padding: 24px 0px 0px 31px;

    @include lg {
      // height: 314px;
      gap: 16px;
      padding: 24px 0px 0px 40px;
    }
    @include md {
      gap: 13px;
      padding: 16px 0px 0px 25px;
      // height: 260px;
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
