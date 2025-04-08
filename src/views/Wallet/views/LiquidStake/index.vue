<template>
  <div class="liquid-stake">
    <teleport to="body">
      <Modal v-if="showInfoModal">
        <InfoModal
          :signer-wallet="currentWallet"
          :on-close="closeAppInfoModal"
          :tx-info="txInfo"
          :amount="amount"
          @onCancel="onCancel"
          @onSuccess="onSuccess"
          @showLedger="
            () => {
              showLedgerConnect = true;
            }
          "
        />
      </Modal>
      <Modal v-if="showSuccessModal">
        <SuccessModal
          :close-success-modal="closeSuccessModal"
          :success-click-handler="successClickHandler"
          :wallet="currentWallet"
          :amount="amount"
          :success-tx="successHash"
          @changeComment="onChangeComment"
        />
      </Modal>
    </teleport>
    <div class="liquid-stake__menu">
      <TabsGroup
        v-model:currentValue="currentTab"
        :tabs="tabs"
        @update:currentValue="onChangeCurrentTab"
      />
      <div class="liquid-stake__tabs">
        <div
          v-if="currentTab === 'stake'"
          class="liquid-stake__tabs-item"
          :class="{ active: currentMenu === 'liquidstx' }"
          @click="setActive('liquidstx')"
        >
          Liquid stSTX
        </div>
        <div
          v-if="currentTab === 'stake'"
          class="liquid-stake__tabs-item"
          :class="{ active: currentMenu === 'liquidsbtc' }"
          @click="setActive('liquidsbtc')"
        >
          Liquid sBTC
        </div>
        <div
          v-if="currentTab === 'unstake'"
          class="liquid-stake__tabs-item"
          :class="{ active: currentMenu === 'delayed' }"
          @click="setActive('delayed')"
        >
          DELAYED
        </div>
        <div
          v-if="currentTab === 'unstake'"
          class="liquid-stake__tabs-item"
          :class="{ active: currentMenu === 'instant' }"
          @click="setActive('instant')"
        >
          INSTANT
        </div>
      </div>
    </div>
    <!-- content -->
    <div class="liquid-stake__form">
      <div class="liquid-stake__title" v-html="descriptionStake" />
      <Input
        id="amount"
        :value="amount"
        :label="$t('amount')"
        :decimals="currentWallet?.config?.decimals"
        type="currency"
        :currency="currentWallet.code"
        :max="currentWallet?.balance?.mainBalance - 0.1 || 0"
        icon="coins"
        placeholder="0.0"
        :error="insufficientFunds"
        data-qa="liquid-stake__input"
        class="liquid-stake__input"
        @input="onInput"
      />
      <PrimaryButton
        :loading="loading"
        :disabled="!amount || !!insufficientFunds"
        @click="getTx"
      >
        {{ $t('Stake') }}
      </PrimaryButton>
    </div>
  </div>
</template>
<script>
import { ref, computed } from 'vue';
import TabsGroup from '@/components/UI/TabsGroup';
import citadel from '@citadeldao/lib-citadel';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import Input from '@/components/UI/Input';
import PrimaryButton from '@/components/UI/PrimaryButton';
import notify from '@/plugins/notify';
import InfoModal from './InfoModal';
import Modal from '@/components/Modal';
import SuccessModal from '@/views/Extensions/SuccessModal';

const CONTRACT_ADDRESS =
  'SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.stacking-dao-core-v4';

export default {
  components: {
    TabsGroup,
    Input,
    PrimaryButton,
    InfoModal,
    Modal,
    SuccessModal,
  },
  setup() {
    const store = useStore();
    const { t } = useI18n();
    const amount = ref('');
    const txComment = ref('');
    const showLedgerConnect = ref(false);
    const loading = ref(false);
    const currentTab = ref('stake');
    const currentMenu = ref('liquidstx');
    const tabs = ref([
      { label: 'STAKE', value: 'stake' },
      { label: 'UNSTAKE', value: 'unstake' },
    ]);
    const txInfo = ref(null);
    const successHash = ref('');
    const showSuccessModal = ref(false);
    const showInfoModal = ref(false);

    const apiAction = computed(() => {
      if (currentMenu.value === 'liquidstx') return 'add';
      if (currentMenu.value === 'liquidsbtc') return 'init-withdrawal';
      if (currentMenu.value === 'delayed') return 'withdrawal';
      if (currentMenu.value === 'instant') return 'instant-withdrawal';
      return '';
    });

    const descriptionStake = computed(() => {
      if (currentMenu.value === 'liquidstx') return t('stacks.liquidstx');
      if (currentMenu.value === 'liquidsbtc') return t('stacks.liquidbtc');
      if (currentMenu.value === 'delayed') return t('stacks.liquiddelayed');
      if (currentMenu.value === 'instant') return t('stacks.liquidinstant');
      return '';
    });

    const currentWallet = computed(
      () => store.getters['wallets/currentWallet']
    );

    const insufficientFunds = computed(() => {
      return +amount.value > currentWallet.value?.balance?.mainBalance - 0.1
        ? 'Insufficient funds'
        : '';
    });

    const getTx = async () => {
      loading.value = true;
      const rawTx = await citadel.buildLiquidStaking(currentWallet.value.id, {
        amount: amount.value,
        action: apiAction.value,
        contractAddress: CONTRACT_ADDRESS,
        publicKey: currentWallet.value.publicKey,
      });
      loading.value = false;
      const txs =
        rawTx.data && rawTx.data.txs && rawTx.data.txs.length
          ? rawTx.data.txs
          : null;

      if (!txs) {
        notify({
          type: 'warning',
          text: 'Tx not found',
        });
        return;
      }
      showInfoModal.value = true;
      txInfo.value = {
        txs,
        fee: rawTx.data?.fees[0]?.value,
      };
      console.log(txInfo.value);
    };

    const onChangeCurrentTab = (val) => {
      if (val === 'stake') {
        currentMenu.value = 'liquidstx';
      } else {
        currentMenu.value = 'delayed';
      }
    };

    const onInput = (val) => {
      amount.value = val;
    };

    const setActive = (val) => {
      currentMenu.value = val;
    };

    const onCancel = () => {
      showLedgerConnect.value = false;
      loading.value = false;
    };

    const closeAppInfoModal = () => {
      showInfoModal.value = false;
    };

    const onSuccess = (hash) => {
      successHash.value = hash;
      amount.value = '';
      showSuccessModal.value = true;
      txInfo.value = null;
    };

    // system
    const connectLedgerCloseHandler = () => {
      showLedgerConnect.value = false;
    };

    const successClickHandler = async () => {
      txComment.value &&
        (await store.dispatch('transactions/postTransactionNote', {
          network: currentWallet.value.net,
          hash: successHash.value[0],
          text: txComment.value,
        }));
      txComment.value = '';
      showSuccessModal.value = false;
      connectLedgerCloseHandler();
    };

    const closeSuccessModal = () => {
      txComment.value = '';
      successHash.value = [];
      showSuccessModal.value = false;
      loading.value = false;
      showInfoModal.value = false;
      connectLedgerCloseHandler();
    };

    const onChangeComment = (comm) => {
      txComment.value = comm;
    };

    return {
      showLedgerConnect,
      tabs,
      currentTab,
      currentMenu,
      descriptionStake,
      amount,
      loading,
      currentWallet,
      txInfo,
      successHash,
      txComment,
      insufficientFunds,
      onChangeCurrentTab,
      showSuccessModal,
      showInfoModal,
      setActive,
      getTx,
      onInput,
      onCancel,
      onSuccess,
      closeAppInfoModal,
      closeSuccessModal,
      successClickHandler,
      connectLedgerCloseHandler,
      onChangeComment,
    };
  },
};
</script>
<style lang="scss" scoped>
.liquid-stake {
  padding: 20px 0;
  min-height: 400px;

  &__form {
    margin-top: 20px;
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  &__input {
    margin-top: 20px;
    height: 68px;
    position: relative;
    margin-bottom: 19px;
  }

  &__title {
    font-size: 16px;
    color: rgba(107, 147, 192, 1);
    line-height: 25px;
  }

  &__menu {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__tabs {
    display: flex;
    top: 37px;
    width: 300px;
    @include lg {
      top: 28px;
    }
    @include md {
      top: 21px;
    }
  }
  &__tabs-item {
    flex: 1 20%;
    text-decoration: none;
    font-size: 20px;
    line-height: 30px;
    color: $mid-gray;
    border-bottom: 6px solid transparent;
    padding-bottom: 25px;
    margin: 0 5px;
    font-family: 'Panton_Bold';
    text-align: center;
    position: relative;
    cursor: pointer;

    &.active {
      border-color: $too-dark-blue;
      color: $too-dark-blue;
    }

    @include lg {
      font-size: 17px;
      padding-bottom: 10px;
    }

    @include md {
      padding-bottom: 9px;
      font-size: 14px;
    }
  }
}

body.dark {
  .liquid-stake {
    &__tabs-item {
      &.active {
        border-color: $dark-blue;
        color: #fff;
      }
    }
  }
}
</style>
