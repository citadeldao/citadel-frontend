<template>
  <div class="liquid-stake">
    <teleport to="body">
      <Modal v-if="showInfoModal">
        <InfoModal
          :signer-wallet="currentWallet"
          :on-close="closeAppInfoModal"
          :tx-info="txInfo"
          :amount="amount"
          :is-stx="!!currentNFT"
          :symbol="
            currentTab === 'stake'
              ? 'STX'
              : stakeTabMode === 'liquidstx'
              ? 'stSTX'
              : 'stSTXbtc'
          "
          :contract-address="
            currentMenu === 'liquidsbtc' || currentNFT?.isBtc
              ? CONTRACT_ADDRESS_BTC
              : stakeTabMode === 'liquidstx'
              ? CONTRACT_ADDRESS
              : CONTRACT_ADDRESS_BTC
          "
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
          :is-stacks-delayed="radioStake === 'delayed'"
          :amount="amount"
          :success-tx="successHash"
          @changeComment="onChangeComment"
        />
      </Modal>
      <Modal v-if="showClaimModal">
        <ClaimModal
          @close="closeClaimModal"
          :nfts="stakingInfo?.nfts || []"
          :current-height="stakingInfo?.currentHeight"
          @claim="onClaim"
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
        <RadioButton
          v-if="currentTab === 'stake'"
          v-model="radioStake"
          :value="liquidstx"
          @change="setActive('liquidstx')"
          >Liquid stSTX</RadioButton
        >
        <RadioButton
          v-if="currentTab === 'stake'"
          v-model="radioStake"
          :value="liquidsbtc"
          @change="setActive('liquidsbtc')"
          >Liquid stSTXbtc</RadioButton
        >
        <div v-if="currentTab === 'unstake'" class="liquid-label">
          {{
            stakeTabMode === 'liquidstx' ? 'Liquid stSTX' : 'Liquid stSTXbtc'
          }}
        </div>
        <RadioButton
          v-if="currentTab === 'unstake'"
          v-model="radioStake"
          :value="delayed"
          @change="setActive('delayed')"
          >Delayed</RadioButton
        >
        <RadioButton
          v-if="currentTab === 'unstake'"
          v-model="radioStake"
          :value="instant"
          @change="setActive('instant')"
          >Instant</RadioButton
        >
      </div>
    </div>
    <!-- content -->
    <div class="liquid-stake__form">
      <StakeChart :chart-data="chartData" style="width: 100%" />
      <StakeStats
        symbol="STX"
        :stakeBalance="+stakingInfo?.stSTX + +stakingInfo?.stSTXbtc"
        :available-balance="currentWallet?.balance?.mainBalance"
        :nft-balance="
          stakingInfo?.nfts?.reduce((acc, nft) => acc + +nft.STX, 0)
        "
      />
      <!-- <div v-if="stakingInfo?.stSTX" class="liquid-stake__staked">
        <div class="label">Staked</div>
        <div class="line" />
        <div class="value">{{ stakingInfo?.stSTX }} <span>stSTX</span></div>
      </div> -->
      <div v-if="currentTab === 'unstake'" class="liquid-stake__info">
        <div v-if="stakingInfo?.nfts?.length" class="liquid-stake__estimate">
          <div class="estimate-label">Estimated Time to Receive STX:</div>
          <div class="estimate-value">
            End of cycle (~{{ getTimeForClaim(stakingInfo?.nfts?.[0]) }})
          </div>
        </div>
        <div class="liquid-stake__title" v-html="descriptionStake" />
      </div>
      <Input
        id="amount"
        :value="amount"
        :label="$t('amount')"
        :decimals="currentWallet?.config?.decimals"
        type="currency"
        :currency="
          ['instant', 'delayed'].includes(currentMenu)
            ? stakeTabMode === 'liquidstx'
              ? 'stSTX'
              : 'stSTXbtc'
            : currentWallet.code
        "
        :max="maxAmount"
        icon="coins"
        placeholder="0.0"
        show-set-max
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
        {{ currentTab === 'stake' ? $t('Stake') : $t('Unstake') }}
      </PrimaryButton>
      <!-- <div
        v-if="currentMenu === 'delayed' && stakingInfo?.nfts"
        class="liquid-stake__nfts"
      >
        <NftPanel
          v-for="(nft, ndx) in stakingInfo?.nfts"
          :key="ndx"
          :nft="nft"
          :current-height="stakingInfo?.currentHeight"
          :loading-delayed="
            loadingDelayed && currentNFT && currentNFT.id === nft.id
          "
          :loading-instant="
            loadingInstant && currentNFT && currentNFT.id === nft.id
          "
          @delayed="onDelayed"
          @instant="onInstant"
          class="liquid-stake__nfts-item"
        />
      </div> -->
    </div>
  </div>
</template>
<script>
import { ref, computed, onMounted } from 'vue';
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
// import NftPanel from './NftPanel';
import ClaimModal from './ClaimModal';
import RadioButton from '@/components/UI/RadioButton';
import StakeChart from '../Stake/components/StakeChart';
import StakeStats from './StakeStats';

const CONTRACT_ADDRESS =
  'SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.stacking-dao-core-v4';

const CONTRACT_ADDRESS_BTC =
  'SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.stacking-dao-core-btc-v1';

export default {
  components: {
    TabsGroup,
    Input,
    PrimaryButton,
    InfoModal,
    Modal,
    SuccessModal,
    ClaimModal,
    StakeChart,
    StakeStats,
    RadioButton,
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
    const currentNFT = ref(null);
    const loadingDelayed = ref(false);
    const loadingInstant = ref(false);

    const txInfo = ref(null);
    const successHash = ref('');
    const showSuccessModal = ref(false);
    const showInfoModal = ref(false);

    const radioStake = ref('liquidstx');
    const liquidstx = ref('liquidstx');
    const liquidsbtc = ref('liquidsbtc');
    const delayed = ref('delayed');
    const instant = ref('instant');

    const stakeTabMode = ref('liquidstx');

    const showClaimModal = computed(
      () => store.getters['stacks/showClaimModal']
    );

    const stakingInfo = computed(() => store.getters['stacks/stakeInfo']);

    const tabs = computed(() => {
      if (stakingInfo?.value?.nfts) {
        return [
          { label: 'STAKE', value: 'stake' },
          { label: 'UNSTAKE', value: 'unstake' },
        ];
      }
      return [{ label: 'STAKE', value: 'stake' }];
    });

    const apiAction = computed(() => {
      if (currentMenu.value === 'liquidstx') return 'add';
      if (currentMenu.value === 'liquidsbtc') return 'add';
      if (currentMenu.value === 'delayed') return 'init-withdrawal';
      if (currentMenu.value === 'instant') return 'instant-withdrawal';
      return '';
    });

    const descriptionStake = computed(() => {
      if (currentMenu.value === 'liquidstx') return t('stacks.liquidstx');
      if (currentMenu.value === 'liquidsbtc') return t('stacks.liquidbtc');
      if (currentMenu.value === 'delayed')
        return t('stacks.liquiddelayed', {
          symbol: stakeTabMode.value === 'liquidsbtc' ? 'stSTXbtc' : 'stSTX',
        });
      if (currentMenu.value === 'instant') return t('stacks.liquidinstant');
      return '';
    });

    const currentWallet = computed(
      () => store.getters['wallets/currentWallet']
    );

    const insufficientFunds = computed(() => {
      return +amount.value > maxAmount.value ? 'Insufficient funds' : '';
    });

    const getTxUnstake = async (action, nftId, contractBtc) => {
      loading.value = true;
      const rawTx = await citadel.buildLiquidStaking(currentWallet.value.id, {
        action,
        nftId,
        contractAddress: contractBtc || CONTRACT_ADDRESS,
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
          text: rawTx.error || 'Tx not found',
        });
        return;
      }
      showInfoModal.value = true;
      txInfo.value = {
        txs,
        fee: rawTx.data?.fees[0]?.value,
      };
    };

    const getStakingInfo = async () => {
      await store.dispatch('stacks/getStakingInfo', currentWallet.value);
    };

    const getTx = async () => {
      loading.value = true;
      const rawTx = await citadel.buildLiquidStaking(currentWallet.value.id, {
        amount: amount.value,
        action: apiAction.value,
        nftId: '',
        contractAddress:
          currentMenu.value === 'liquidsbtc'
            ? CONTRACT_ADDRESS_BTC
            : stakeTabMode.value === 'liquidstx'
            ? CONTRACT_ADDRESS
            : CONTRACT_ADDRESS_BTC,
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
          text: rawTx.error || 'Tx not found',
        });
        return;
      }
      showInfoModal.value = true;
      txInfo.value = {
        txs,
        fee: rawTx.data?.fees[0]?.value,
      };
    };

    const onChangeCurrentTab = (val) => {
      if (val === 'stake') {
        currentMenu.value = 'liquidstx';
        currentNFT.value = null;
        amount.value = '';
        radioStake.value = stakeTabMode.value || 'liquidstx';
      } else {
        stakeTabMode.value = radioStake.value;
        amount.value = '';
        radioStake.value = 'delayed';
        currentMenu.value = 'delayed';
      }
    };

    const onInput = (val) => {
      amount.value = val || '';
    };

    const setActive = (val) => {
      currentMenu.value = val;
    };

    const onCancel = () => {
      showLedgerConnect.value = false;
      loading.value = false;
    };

    const closeAppInfoModal = async () => {
      showInfoModal.value = false;
      await getStakingInfo();
    };

    const onSuccess = async (hash) => {
      successHash.value = hash;
      // amount.value = '';
      showSuccessModal.value = true;
      txInfo.value = null;
      currentNFT.value = null;
      await getStakingInfo();
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
      amount.value = '';
      showSuccessModal.value = false;
      connectLedgerCloseHandler();
    };

    const closeSuccessModal = () => {
      txComment.value = '';
      successHash.value = [];
      showSuccessModal.value = false;
      loading.value = false;
      amount.value = '';
      showInfoModal.value = false;
      connectLedgerCloseHandler();
    };

    const onChangeComment = (comm) => {
      txComment.value = comm;
    };

    const onDelayed = async (nft) => {
      currentNFT.value = nft;
      loadingDelayed.value = true;
      amount.value = nft.stSTX;

      await getTxUnstake('withdrawal', nft.id);
      loadingDelayed.value = false;
    };

    const onInstant = async (nft) => {
      currentNFT.value = nft;
      loadingInstant.value = true;
      amount.value = nft.stSTX;

      await getTxUnstake('instant-withdrawal', nft.stSTX, nft.id);
      loadingInstant.value = false;
    };

    const closeClaimModal = () => {
      showClaimModal.value = false;
      store.dispatch('stacks/showClaimModal', false);
    };

    const onClaim = async (nft) => {
      currentNFT.value = nft;
      loadingDelayed.value = true;
      amount.value = nft.STX;

      await getTxUnstake(
        'withdrawal',
        nft.id,
        nft.isBtc ? CONTRACT_ADDRESS_BTC : ''
      );
      loadingDelayed.value = false;
    };

    const getStakingRatio = (
      availableBalance,
      // stakedBalance,
      nftBalance = 0
    ) => {
      const total = +availableBalance + +nftBalance;

      // Если общая сумма нулевая, возвращаем 0% для всех
      if (total === 0) {
        return {
          availableBalancePercent: 0,
          // stakedBalancePercent: 0,
          nftPercent: 0,
        };
      }

      // Вычисляем проценты для каждого баланса
      const availablePercent = (+availableBalance / total) * 100;
      // const stakedPercent = (+stakedBalance / total) * 100;
      const nftPercent = (+nftBalance / total) * 100;

      return {
        availableBalancePercent: availablePercent,
        // stakedBalancePercent: stakedPercent,
        nftPercent: nftPercent,
      };
    };

    const getTimeForClaim = (nft) => {
      if (!nft) return '';
      const blocksRemaining = nft.endUnlock - stakingInfo?.value?.currentHeight;
      const totalMinutes = blocksRemaining * 10;

      const days = Math.abs(Math.floor(totalMinutes / 1440)); // 1440 минут в дне
      const hours = Math.abs(Math.floor((totalMinutes % 1440) / 60));
      const minutes = Math.abs(totalMinutes % 60);

      const readable = `${days}days, ${hours}hours, ${minutes}mins`;
      return `${readable}`;
    };

    const chartData = computed(() => {
      const nftBalance =
        stakingInfo.value?.nfts?.reduce((acc, nft) => acc + +nft.STX, 0) || 0;
      // const stakedBalance = stakingInfo.value?.stSTX || 0;
      const availableBalance = currentWallet.value.balance.mainBalance;

      const ratios = getStakingRatio(
        availableBalance,
        // stakedBalance,
        nftBalance
      );

      const data = [
        {
          name: 'Avaliable balance',
          color: '#AFBCCB',
          share: ratios.availableBalancePercent,
        },
        // {
        //   name: 'Staked balance',
        //   color: '#FF5722',
        //   share: ratios.stakedBalancePercent,
        // },
        {
          name: 'Unlocking Balance (NFT)',
          color: '#4B9A43',
          share: ratios.nftPercent,
        },
      ];

      return data.filter((item) => item.share > 0);
    });

    const maxAmount = computed(() => {
      if (currentMenu.value === 'liquidstx')
        return currentWallet.value?.balance?.mainBalance - 0.1 || 0;
      if (currentMenu.value === 'liquidsbtc')
        return currentWallet.value?.balance?.mainBalance - 0.1 || 0;
      if (currentMenu.value === 'delayed') {
        if (stakeTabMode.value === 'liquidsbtc') {
          return stakingInfo?.value?.stSTXbtc || 0;
        }
        return stakingInfo?.value?.stSTX || 0;
      }
      if (currentMenu.value === 'instant')
        return stakingInfo?.value?.stSTXbtc || 0;
      return 0;
    });

    onMounted(async () => {
      await getStakingInfo();
    });

    return {
      showLedgerConnect,
      CONTRACT_ADDRESS,
      CONTRACT_ADDRESS_BTC,
      tabs,
      maxAmount,
      currentTab,
      currentMenu,
      stakeTabMode,
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
      stakingInfo,
      onDelayed,
      onInstant,
      loadingDelayed,
      loadingInstant,
      currentNFT,

      radioStake,
      liquidstx,
      liquidsbtc,
      delayed,
      instant,

      showClaimModal,
      closeClaimModal,
      onClaim,
      chartData,
      getTimeForClaim,
    };
  },
};
</script>
<style lang="scss" scoped>
.liquid-stake {
  padding: 20px 0;
  min-height: 400px;

  .liquid-label {
    color: #409eff;
    margin-right: 12px;
    font-size: 17px;
    font-family: 'Panton_SemiBold';
  }

  &__estimate {
    border-radius: 8px;
    padding: 0 20px;
    width: 100%;
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #f0f3fd;
    margin-bottom: 20px;

    @include xl {
      margin-left: 40px;
      width: 100%;
    }

    .estimate-label {
      color: #6b758e;
      font-size: 14px;
    }

    .estimate-value {
      color: #000;
      font-size: 14px;
    }
  }

  &__info {
    display: flex;
    flex-direction: column;

    @include xl {
      flex-direction: row-reverse;
    }
  }

  &__nfts {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }

  &__nfts-item {
    margin-right: 12px;
    margin-bottom: 12px;
  }

  &__staked {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 15px;

    .label {
      font-size: 16px;
      line-height: 19px;
      font-family: 'Panton_Bold';
    }

    .value {
      color: #00a3ff;
      font-size: 16px;
      font-family: 'Panton_Bold';

      span {
        color: #000;
      }
    }

    .line {
      flex-grow: 1;
      border-bottom: 1px dashed #dadada;
      margin-top: 12px;
    }
  }

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

    @include xl {
      width: 100%;
    }
  }

  &__menu {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__tabs {
    display: flex;
    top: 37px;
    // width: 300px;
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
    &__estimate {
      background-color: #313354;

      .estimate-label {
        color: #6b93c0;
      }

      .estimate-value {
        color: #c3ceeb;
      }
    }
    &__staked {
      .label,
      .value span {
        color: #fff;
      }
    }
    &__tabs-item {
      &.active {
        border-color: $dark-blue;
        color: #fff;
      }
    }
  }
}
</style>
