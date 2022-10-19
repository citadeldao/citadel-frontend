<template>
  <div class="stake" :class="{ 'stake-view-only': isViewOnly }">
    <div v-if="isLoading" class="stake__loader">
      <Loading />
    </div>
    <XCTStaking
      v-if="!currentWallet.isSingleStake && !isLoading && currentToken"
      :current-token="currentToken"
      :current-wallet="currentWallet"
      :stake-nodes="stakeNodes"
      @showPlaceholder="showModal = true"
      @prepareClaim="$emit('prepareClaim')"
      @prepareXctClaim="$emit('prepareXctClaim')"
      @stake="stakeHandler"
    />
    <Multi
      v-if="!currentWallet.isSingleStake && !isLoading && !currentToken"
      :current-token="currentToken"
      :current-wallet="currentWallet"
      :list="list"
      :stake-nodes="stakeNodes"
      @showPlaceholder="showModal = true"
      @prepareClaim="$emit('prepareClaim')"
      @prepareXctClaim="$emit('prepareXctClaim')"
      @stake="stakeHandler"
    />
    <Single
      v-else-if="currentWallet.isSingleStake && !isLoading"
      :current-token="currentToken"
      :current-wallet="currentWallet"
      :list="list"
      :stake-nodes="stakeNodes"
      @showPlaceholder="showModal = true"
      @prepareClaim="$emit('prepareClaim')"
      @prepareXctClaim="$emit('prepareXctClaim')"
      @stake="stakeHandler"
    />
  </div>
  <teleport v-if="showModal" to="body">
    <Modal>
      <ModalContent
        v-click-away="modalCloseHandler"
        :title="$t('wallet.info.title')"
        :desc="$t('wallet.info.note')"
        type="system"
        :submit-button="false"
        width="900px"
        @close="modalCloseHandler"
      >
        <Info data-qa="send__info" />
      </ModalContent>
    </Modal>
  </teleport>
</template>

<script>
import XCTStaking from './components/XCTStaking.vue';
import Info from './components/Info.vue';
import Modal from '@/components/Modal';
import ModalContent from '@/components/ModalContent';
import Loading from '@/components/Loading';
import Multi from './components/Multi.vue';
import Single from './components/Single.vue';
import { ref } from '@vue/reactivity';
import { computed, watch } from '@vue/runtime-core';
import { useStore } from 'vuex';
import { shareInValue } from '@/helpers';
import { colors } from './components/config';
import BigNumber from 'bignumber.js';
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';
import redirectToWallet from '@/router/helpers/redirectToWallet';
import { WALLET_TYPES } from '@/config/walletType';

export default {
  name: 'Stake',
  components: {
    Multi,
    Single,
    Loading,
    ModalContent,
    Modal,
    Info,
    XCTStaking,
  },
  props: {
    currentWallet: {
      type: Object,
      default: () => ({}),
    },
    tokenList: {
      type: Array,
      default: () => [],
    },
    currentToken: {
      type: [Object, null],
      default: null,
    },
    subtokensIsLoading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['prepareClaim', 'prepareXctClaim'],
  setup(props) {
    const store = useStore();
    const isLoading = ref(false);
    const route = useRoute();

    onMounted(() => {
      if (!props.currentWallet.hasStake) {
        redirectToWallet({
          wallet: props.currentWallet,
          root: true,
        });
      }

      loadData(props.currentWallet);
    });

    const stakeNodes = computed(() => store.getters['staking/stakeNodes']);
    const stakeList = computed(() =>
      store.getters['staking/stakeList'].filter((item) => item.staked)
    );
    const totalStake = computed(() => {
      return stakeList.value.reduce(
        (total, currentValue) =>
          BigNumber(total).plus(currentValue.value).toNumber(),
        0
      );
    });
    const list = computed(() => {
      const data = stakeList.value.map((i, index) => {
        const stakedNodeInNodeList = stakeNodes.value?.find(
          (item) => item.address?.toLowerCase() === i.current?.toLowerCase()
        );

        return {
          ...i,
          ...stakedNodeInNodeList,
          address: stakedNodeInNodeList?.address || i.current,
          name: stakedNodeInNodeList?.name || i.current,
          share: shareInValue(
            props.currentWallet.balance?.calculatedBalance,
            i.value
          ),
          color: colors[index],
          stakeShare: shareInValue(totalStake.value, i.value),
        };
      });

      return data;
    });

    const loadData = async (currentWallet) => {
      // if subtoken has no stake list and stake nodes
      if (!props.currentToken && props.currentWallet.hasStake) {
        isLoading.value = true;
        await store.dispatch('staking/getStakeNodes', currentWallet.net);
        await store.dispatch('staking/getStakeList', currentWallet);
        isLoading.value = false;
      }
    };

    const showModal = ref(false);
    const modalCloseHandler = () => {
      showModal.value = false;
    };

    const stakeHandler = () => {
      loadData(props.currentWallet);
    };

    watch(
      () => route.params,
      async (params, oldParams) => {
        if (
          params.net !== oldParams.net ||
          params.address.toLowerCase() !== oldParams.address.toLowerCase()
        ) {
          await store.dispatch('subtokens/setCurrentToken', null);
          const newWallet = store.getters['wallets/walletByAddress']({
            net: params.net,
            address: params.address,
          });
          newWallet?.hasStake && (await loadData(newWallet));
        }
      },
      { deep: true }
    );

    const isViewOnly = computed(
      () => props.currentWallet.type === WALLET_TYPES.PUBLIC_KEY
    );

    return {
      isLoading,
      showModal,
      modalCloseHandler,
      stakeHandler,
      list,
      stakeNodes,
      totalStake,
      isViewOnly,
    };
  },
};
</script>

<style lang="scss" scoped>
.stake {
  &__loader {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 300px;
  }
  @include md {
    padding-bottom: 63px;
    &-view-only {
      padding-bottom: 0;
    }
  }
}
</style>
