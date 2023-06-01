<template>
  <div class="nodes-list">
    <div class="nodes-list__search-input">
      <Input
        id="search"
        v-model="keyword"
        :label="$t('staking.searchNode')"
        type="text"
        icon="loop"
        :placeholder="$t('staking.searchInputPlaceholder')"
        clearable
        data-qa="staking__node-list__search-field"
      />
    </div>
    <EmptyList
      v-if="!displayData.length && keyword.length"
      :title="$t('extensions.emptyList')"
      class="nodes-list__empty"
    />
    <div
      v-if="
        displayData.length &&
        currentWallet.hasMultiUnstake &&
        mode === 'unstake'
      "
      ref="nodesListRefMulti"
      class="nodes-list__nodes"
      :class="{ 'nodes-list__nodes--scrollbar': hasScrollbarMulti }"
      :style="{ maxHeight }"
    >
      <NestedNodesListItem
        v-for="item in displayData"
        :key="item.address"
        :selectedItems="items"
        :item="item"
        :icon="currentWallet?.net"
        :current-wallet="currentWallet"
        :chosen="isChosen(item)"
        :show-tag="showTag"
        @toggleNode="toggleNode"
        @toggleNodeList="toggleNodeList"
      />
    </div>
    <div
      v-else
      ref="nodesListRef"
      class="nodes-list__nodes"
      :class="{ 'nodes-list__nodes--scrollbar': hasScrollbar }"
      :style="{ maxHeight }"
    >
      <NodesListItem
        v-for="item in displayData"
        :key="item.address"
        :item="item"
        :icon="currentWallet?.net"
        :current-wallet="currentWallet"
        :chosen="isChosen(item)"
        :show-tag="showTag"
        @click="setNode(item)"
      />
    </div>

    <div v-if="errorMsg" class="nodes-list__error">
      <error />
      &nbsp;
      {{ $t(`polkadot.error.${errorMsg}`) }}
    </div>
    <div
      v-if="isMultipleMode || currentWallet.hasMultiUnstake"
      class="nodes-list__next"
    >
      <PrimaryButton :disabled="!items.length" @click="setMultipleNodes()">
        {{ $t('next') }}
      </PrimaryButton>
    </div>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import { nextTick, onMounted } from 'vue';
import NestedNodesListItem from './NestedNodesListItem.vue';
import NodesListItem from './NodesListItem.vue';
import error from '@/assets/icons/networks/error.svg';
import Input from '@/components/UI/Input';
import PrimaryButton from '@/components/UI/PrimaryButton';
import { ref } from '@vue/reactivity';
import { computed, inject, watch } from '@vue/runtime-core';
import EmptyList from '@/components/EmptyList';

export default {
  name: 'NodesList',
  components: {
    Input,
    NodesListItem,
    PrimaryButton,
    error,
    EmptyList,
    NestedNodesListItem,
  },
  props: {
    nodesList: {
      type: Array,
      default: () => [],
    },
    currentWallet: {
      type: Object,
      default: () => ({}),
    },
    maxHeight: {
      type: String,
      default: '290px',
    },
    isMultipleMode: {
      type: Boolean,
      default: false,
    },
    stakedNodes: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const nodesListRef = ref(null);
    const nodesListRefMulti = ref(null);

    const keyword = ref('');
    const hasScrollbar = ref(false);
    const hasScrollbarMulti = ref(false);

    const items = ref([]);
    const errorMsg = ref('');

    const displayData = computed(() => {
      if (!keyword) {
        return props.nodesList;
      }

      return props.nodesList.filter((data) =>
        data.name?.toLowerCase().includes(keyword.value.toLowerCase())
      );
    });
    const mode = inject('mode');

    const updateSelectedNode = inject('updateSelectedNode');
    const updateShowChooseNode = inject('updateShowChooseNode');
    const updateShowNodesList = inject('updateShowNodesList');
    const redelegationDirection = inject('redelegationDirection');
    const updateSelectedNodeForRedelegation = inject(
      'updateSelectedNodeForRedelegation'
    );
    const updateShowConfirmTransaction = inject('updateShowConfirmTransaction');
    const prepareDelegation = inject('prepareDelegation');

    const updateAmount = inject('updateAmount');
    const resMaxAmount = inject('resMaxAmount');

    const setNode = async (item) => {
      // if multiple mode collect items in array
      if (props.isMultipleMode) {
        errorMsg.value = '';

        if (items.value.find((c) => c.address === item.address)) {
          items.value = items.value.filter((c) => c.address !== item.address);
        } else {
          if (
            (mode.value === 'stake' &&
              items.value.length + props.stakedNodes.length > 15) ||
            (mode.value === 'redelegate' && items.value.length > 15)
          ) {
            errorMsg.value = 'chooseNotMoreThan16Nodes';

            return;
          }
          // if(mode.value === 'redelegate' && items.value.length > 15){
          //   errorMsg.value = 'chooseNotMoreThan16Nodes';

          //   return;
          // }
          {
            items.value.push(item);
          }
        }

        return;
      }

      // if not multiple mode, then immediately use chosen item
      updateShowChooseNode(true);
      updateShowNodesList(false);

      if (redelegationDirection.value === 'to') {
        await updateSelectedNodeForRedelegation(item);
      } else {
        await updateSelectedNode(item);
      }
    };

    const isChosen = (item) => {
      return items.value
        .map((c) => c.address)
        .some((addr) => addr === item.address);
    };

    watch(
      () => items.value,
      (newVal) => {
        if (props.currentWallet.hasMultiUnstake) {
          const totalSum = newVal.reduce(
            (total, currentObject) =>
              BigNumber(total).plus(currentObject.value).toNumber(),
            0
          );
          updateAmount(totalSum);
        }
      },
      { deep: true }
    );

    const setMultipleNodes = async () => {
      if (props.currentWallet.hasMultiUnstake) {
        await updateSelectedNode(items.value);
        await prepareDelegation();
        updateShowNodesList(false);
        updateShowConfirmTransaction(true);
        return;
      }
      updateShowChooseNode(true);
      updateShowNodesList(false);

      const chosenAddresses = items.value.map((c) => c.address);

      if (mode.value === 'redelegate') {
        await updateSelectedNodeForRedelegation(
          displayData.value.filter((c) => chosenAddresses.includes(c.address))
        );
        updateAmount(resMaxAmount.value);
      } else {
        await updateSelectedNode(
          displayData.value.filter((c) => chosenAddresses.includes(c.address))
        );
      }
    };

    onMounted(() => {
      nextTick(() => {
        if (nodesListRef?.value?.offsetHeight >= 400) hasScrollbar.value = true;
        if (nodesListRefMulti?.value?.offsetHeight >= 350)
          hasScrollbarMulti.value = true;
      });
    });

    const showTag = computed(() => {
      if (
        (mode.value === 'redelegate' &&
          redelegationDirection.value === 'from') ||
        mode.value === 'unstake'
      )
        return false;
      return true;
    });

    const toggleNode = (list) => {
      list.forEach((object) => {
        if (
          items.value.some(
            (node) => JSON.stringify(object) === JSON.stringify(node)
          )
        ) {
          items.value = items.value.filter(
            (item) => item.stakedSuiObjectId !== object.stakedSuiObjectId
          );
        } else {
          items.value.push(object);
        }
      });
    };
    const toggleNodeList = (list, isSelected) => {
      list.forEach((object) => {
        if (isSelected) {
          items.value = items.value.filter(
            (node) => node.stakedSuiObjectId !== object.stakedSuiObjectId
          );
        } else {
          if (
            !items.value.some(
              (node) => JSON.stringify(object) === JSON.stringify(node)
            )
          )
            items.value.push(object);
        }
      });
    };

    return {
      hasScrollbarMulti,
      nodesListRefMulti,
      toggleNodeList,
      toggleNode,
      showTag,
      keyword,
      displayData,
      hasScrollbar,
      nodesListRef,
      setNode,
      setMultipleNodes,
      items,
      isChosen,
      errorMsg,
      mode,
    };
  },
};
</script>

<style lang="scss" scoped>
.nodes-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 16px;

  &__search-input {
    height: 68px;
  }

  &__empty {
    margin-top: 20px;
  }

  &__nodes {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;

    &--scrollbar {
      width: calc(100% + 19px); // 15px + 4px - scrollbar width
      padding-right: 15px;
    }
  }
  &__next {
    display: flex;
    justify-content: center;
    margin-top: 30px;
  }
  &__error {
    color: $red;
    font-weight: 600;
    margin-top: 15px;
    display: flex;
    align-items: center;
  }
}
</style>
