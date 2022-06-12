<template>
  <div
    class="claim-rewards"
    :class="{
      noStaked: !currentWalletInfo?.claimableRewards,
      //noAccess: currentWallet?.type === WALLET_TYPES.PUBLIC_KEY,

      //noStaked: !currentWalletInfo?.rewards,
      noAccess: currentWallet?.type === WALLET_TYPES.PUBLIC_KEY && currentWalletType !== WALLET_TYPES.METAMASK,
    }"
    @click="handleBlockClick"
  >
    <div class="claim-rewards__section">
      <span class="claim-rewards__title">{{
        $t(currentWalletInfo?.claimableRewards ? "claimRewards" : "rewards")
      }}</span>
      <span
        class="claim-rewards__note"
      >{{
        currentWalletInfo?.claimableRewards
          ? currentWallet?.net === 'osmosis' ? $t("accruedDaily") : $t("youHave")
          :`Stake your ${currentWallet.code} not to miss`
      }}
      </span>
      <span class="claim-rewards__info">
        <span v-pretty-number="{ value: reward, currency }" />
        <span class="claim-rewards__currency">
          {{ currency }}
        </span>
        <span
          v-if="!currentWalletInfo?.claimableRewards"
          class="claim-rewards__apy"
        >APY</span>
      </span>
    </div>
    <div
      v-if="currentWallet?.type === WALLET_TYPES.PUBLIC_KEY && currentWalletType !== WALLET_TYPES.METAMASK"
      class="claim-rewards__lock"
    >
      <claimBlockLock />
    </div>
    <div
      v-if="currentWallet?.type !== WALLET_TYPES.PUBLIC_KEY || currentWalletType === WALLET_TYPES.METAMASK"
      class="claim-rewards__button"
    >
      <hotSale class="claim-rewards__button-shadow-icon" />
      <RoundArrowButton
        :bg-color="currentWalletInfo?.claimableRewards ? '#6A4BFF' : `white`"
        :icon-fill="currentWalletInfo?.claimableRewards ? 'white' : `#6A4BFF`"
        @click="handleButtonClick"
      />
    </div>
  </div>
  <teleport to="body">
    <Modal
      v-if="infoModal"
      @click.self="infoModal = false"
    >
      <InfoModal @close="infoModal = false" />
    </Modal>
  </teleport>
</template>

<script>
import hotSale from '@/assets/icons/hot-sale.svg';
import claimBlockLock from '@/assets/icons/claim-block-lock.svg';
import RoundArrowButton from '@/components/UI/RoundArrowButton';
import Modal from '@/components/Modal';
import InfoModal from './InfoModal';
import { WALLET_TYPES, OUR_TOKEN } from '@/config/walletType';
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'ClaimRewards',
  components: { hotSale, RoundArrowButton, claimBlockLock, Modal, InfoModal },
  props: {
    currentWallet: {
      type: Object,
      required: true,
    },
    isCurrentToken: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['prepareClaim', 'prepareXctClaim'],
  setup(props, { emit }) {
    const store = useStore();
    const currentWalletInfo = computed(() => props.isCurrentToken ? props.currentWallet.tokenBalance : props.currentWallet.balance);
    const apy = computed(() => props.isCurrentToken && props.currentWallet?.net === OUR_TOKEN
      ? store.getters['subtokens/inflationInfoXCT'].yieldPct
      : store.getters['profile/formatYeldByNet'](props.currentWallet.net),
    );
    const infoModal = ref(false);
    const router = useRouter();
    const route = useRoute();
    const reward = computed(() => currentWalletInfo.value?.claimableRewards || apy.value);
    const currency = computed(() =>
      currentWalletInfo.value?.claimableRewards
        ? props.currentWallet.code
        : `%`,
    );

    const metamaskConnector = computed(() => store.getters['metamask/metamaskConnector']);

    const currentWalletType = computed(() => {
      const metamaskNet = metamaskConnector.value.network;
      const metamaskAddress = metamaskConnector.value.accounts[0] && metamaskConnector.value.accounts[0].toLowerCase();
      const { address, net, type } = props.currentWallet;

      if (address.toLowerCase() === metamaskAddress && net.includes(metamaskNet) && type === WALLET_TYPES.PUBLIC_KEY) {
        return WALLET_TYPES.METAMASK;
      }

      return props.currentWallet.type;
    });

    const handleBlockClick = () => {
      if (props.currentWallet?.type === WALLET_TYPES.PUBLIC_KEY && currentWalletType.value !== WALLET_TYPES.METAMASK) {
        infoModal.value = true;
      }
    };

    const handleButtonClick = () => {
      if (currentWalletInfo.value?.claimableRewards) {
        props.isCurrentToken ? emit('prepareXctClaim') : emit('prepareClaim');
      } else {
        router.push({
          name: 'WalletStake',
          params: { ...route.params },
        });
      }
    };

    return {
      reward,
      currency,
      infoModal,
      handleBlockClick,
      WALLET_TYPES,
      handleButtonClick,
      currentWalletInfo,
      apy,
      currentWalletType,
    };
  },
};
</script>


<style lang="scss" scoped>
.claim-rewards {
  display: flex;
  padding: 24px 28px 19px 24px;
  justify-content: space-between;
  align-items: center;
  width: 329px;
  height: 150px;
  background: $paleturquoise1;
  border-radius: 16px;
  margin-left: 31px;
  @include lg {
    margin-left: 0;
    width: 100%;
    padding: 16px 20px 15px 24px;
    height: 126px;
  }

  &__section {
    margin-left: 0;
    display: flex;
    flex-direction: column;
  }

  &__title {
    font-size: 20px;
    line-height: 24px;
    color: $too-dark-blue;
    font-family: "Panton_Bold";
    @include lg {
      font-size: 18px;
      line-height: 22px;
    }
  }

  &__note {
    font-size: 14px;
    line-height: 17px;
    color: $mid-blue;
    margin-top: 3px;
    margin-bottom: 22px;
    @include lg {
      margin-bottom: 14px;
    }
  }

  &__info {
    font-size: 24px;
    line-height: 29px;
    color: $blue;
    font-family: "Panton_Bold" !important;
  }

  &__currency,
  &__apy {
    font-family: "Panton_Regular";
    font-size: 16px;
    line-height: 19px;
    color: $black;
  }

  &__lock {
    width: 95px;
    display: flex;
    justify-content: center;

    & svg {
      width: 63px;
      height: 95px;
    }
  }

  &__button {
    position: relative;

    & button {
      position: absolute;
      bottom: 17px;
      left: 16px;
    }
  }

  &__button-shadow-icon {
    fill: $powderblue;
    width: 79px;
    height: 99px;
  }
}

.noStaked {
  background: $blue-gradient;

  .claim-rewards__button-shadow-icon {
    fill: #8b66ea;
  }

  .claim-rewards__title {
    color: $white;
  }

  .claim-rewards__note {
    margin-top: 3px;
    color: $too-ligth-blue;
  }

  .claim-rewards__currency,
  .claim-rewards__apy {
    color: $too-ligth-blue;
  }

  .claim-rewards__apy {
    margin-left: 15px;
  }

  .claim-rewards__info {
    color: $white;
  }
}

.noAccess {
  background: $claimBlockNoAccessBackground;
  cursor: pointer;

  .claim-rewards__title {
    color: $too-dark-blue;
  }

  .claim-rewards__note {
    color: $dark-blue;
  }

  .claim-rewards__info {
    color: $dark-blue;
  }

  .claim-rewards__currency,
  .claim-rewards__apy {
    color: $black;
  }
}

.info-modal {
  background: $white;
}
</style>
