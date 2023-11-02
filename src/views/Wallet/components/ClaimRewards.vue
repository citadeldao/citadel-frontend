<template>
  <div
    class="claim-rewards"
    :class="{
      noStaked: !currentWalletInfo?.claimableRewards,
      //noAccess: currentWallet?.type === WALLET_TYPES.PUBLIC_KEY,

      //noStaked: !currentWalletInfo?.rewards,
      noAccess:
        currentWallet?.type === WALLET_TYPES.PUBLIC_KEY &&
        currentWalletType !== WALLET_TYPES.METAMASK,
      noClaim:
        currentWallet?.type !== WALLET_TYPES.PUBLIC_KEY &&
        (currentWalletInfo?.claimableRewards || currentWalletInfo?.stake) &&
        notRewardsCoins.includes(currentWallet.net),
    }"
    @click="handleBlockClick"
  >
    <div class="claim-rewards__section">
      <div>
        <span class="claim-rewards__title">
          {{
            notRewardsCoins.includes(currentWallet.net) &&
            (currentWalletInfo?.claimableRewards || currentWalletInfo?.stake)
              ? $t('claimSummary')
              : $t(title)
          }}
        </span>
        <div class="claim-rewards__tooltip">
          <Tooltip v-if="hasCustomClaimInfoNets.includes(currentWallet.net)">
            <info />
            <template #content>
              <span class="claim-rewards__tooltip-info">
                {{ $t(`${currentWallet.net}.claimTooltip`) }}
              </span>
            </template>
          </Tooltip>
        </div>
      </div>

      <span class="claim-rewards__note">
        {{
          notRewardsCoins.includes(currentWallet.net) &&
          (currentWalletInfo?.claimableRewards || currentWalletInfo?.stake)
            ? $t('claimSummaryDesc')
            : subtitle
        }}
      </span>
      <span
        v-if="apy || currentWalletInfo?.claimableRewards"
        class="claim-rewards__info"
      >
        <span
          v-pretty-number="{
            value: !showBalance ? HIDE_BALANCE_MASK : reward,
            currency,
          }"
        />
        <span class="claim-rewards__currency">
          {{ currency }}
        </span>
        <span
          v-if="!currentWalletInfo?.claimableRewards"
          class="claim-rewards__apy"
          >APY</span
        >
        <div class="claim-rewards__rewards-list-tooltip">
          <el-tooltip
            v-if="currentWallet?.hasMultiCoinRewards"
            placement="bottom"
            effect="rewards-list-tooltip"
            :disabled="!rewardsList.length"
          >
            <info
              class="claim-rewards__rewards-list-tooltip-icon"
              @click="visible = !visible"
            />
            <template #content>
              <div class="claim-rewards__rewards-list-tooltip-content">
                <div
                  class="claim-rewards__rewrd-item"
                  v-for="item in rewardsList"
                  :key="item.code"
                >
                  <span
                    class="claim-rewards__rewrd-item_value"
                    v-pretty-number="{
                      value: !showBalance ? HIDE_BALANCE_MASK : item.amount,
                      currency: item.code,
                    }"
                  >
                    {{ !showBalance ? HIDE_BALANCE_MASK : item.amount }}
                  </span>
                  <span class="claim-rewards__rewrd-item_currency">
                    {{ item.code }}
                  </span>
                </div>
              </div>
            </template>
          </el-tooltip>
        </div>
      </span>
    </div>
    <div
      v-if="
        notRewardsCoins.includes(currentWallet.net) &&
        currentWallet?.type !== WALLET_TYPES.PUBLIC_KEY &&
        (currentWalletInfo?.claimableRewards || currentWalletInfo?.stake)
      "
      class="claim-rewards__lock"
    >
      <claimBlockLockAuto v-if="notRewardsCoins.includes(currentWallet.net)" />
    </div>
    <div
      v-if="
        currentWallet?.type === WALLET_TYPES.PUBLIC_KEY &&
        currentWalletType !== WALLET_TYPES.METAMASK
      "
      class="claim-rewards__lock"
    >
      <!-- <claimBlockLockAuto v-if="notRewardsCoins.includes(currentWallet.net)" /> -->
      <claimBlockLock />
    </div>
    <div v-if="showClaimButton" class="claim-rewards__button">
      <hotSale class="claim-rewards__button-shadow-icon" />
      <RoundArrowButton
        :disabled="disabled"
        :bg-color="currentWalletInfo?.claimableRewards ? '#6A4BFF' : `white`"
        :icon-fill="currentWalletInfo?.claimableRewards ? 'white' : `#6A4BFF`"
        data-qa="Claim-rewards"
        @click="handleButtonClick"
      />
    </div>
  </div>
  <teleport to="body">
    <Modal v-if="infoModal" @click.self="infoModal = false">
      <InfoModal @close="infoModal = false" />
    </Modal>
  </teleport>
</template>

<script>
import info from '@/assets/icons/info.svg';
import hotSale from '@/assets/icons/hot-sale.svg';
import claimBlockLock from '@/assets/icons/claim-block-lock.svg';
import claimBlockLockAuto from '@/assets/icons/claim-block-lock-auto.svg';
import RoundArrowButton from '@/components/UI/RoundArrowButton';
import Modal from '@/components/Modal';
import InfoModal from './InfoModal';
import { WALLET_TYPES, OUR_TOKEN } from '@/config/walletType';
import { hasCustomClaimInfoNets } from '@/config/availableNets';
import { ref, computed, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import Tooltip from '@/components/UI/Tooltip';
import { useI18n } from 'vue-i18n';
import { HIDE_BALANCE_MASK } from '@/helpers/prettyNumber';

export default {
  name: 'ClaimRewards',
  components: {
    hotSale,
    RoundArrowButton,
    claimBlockLock,
    claimBlockLockAuto,
    Modal,
    InfoModal,
    Tooltip,
    info,
  },
  props: {
    disabled: {
      type: Boolean,
    },
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
    const notRewardsCoins = ref(['oasis', 'sui']);
    const store = useStore();
    const { t } = useI18n();
    const rewardsList = inject('rewardsList');
    const showBalance = computed(() => store.getters['balance/showBalance']);
    const width = computed(() => {
      if (window.innerWidth <= 1286 && window.innerWidth >= 1280) {
        return '310px';
      } else if (window.innerWidth <= 1024) {
        return '280px';
      }
      return '326px';
    });
    const currentWalletInfo = computed(() => {
      return props.isCurrentToken
        ? props.currentWallet.tokenBalance
        : props.currentWallet.balance;
    });
    const apy = computed(() =>
      props.isCurrentToken && props.currentWallet?.net === OUR_TOKEN
        ? +store.getters['subtokens/inflationInfoXCT'].yieldPct
        : +store.getters['profile/formatYeldByNet'](props.currentWallet.net)
    );
    const infoModal = ref(false);
    const router = useRouter();
    const route = useRoute();
    const reward = computed(
      () => currentWalletInfo.value?.claimableRewards || apy.value
    );
    const currency = computed(() =>
      currentWalletInfo.value?.claimableRewards ? props.currentWallet.code : `%`
    );

    const metamaskConnector = computed(
      () => store.getters['metamask/metamaskConnector']
    );

    const showClaimButton = computed(() => {
      if (notRewardsCoins.value.includes(props.currentWallet.net)) return false;
      if (currentWalletType.value === WALLET_TYPES.PUBLIC_KEY) return false;
      if (
        currentWalletInfo.value?.claimableRewards &&
        props.currentWallet.hasClaim === 'unstake'
      )
        return false;
      return true;
    });

    const title = computed(() =>
      currentWalletInfo?.value?.claimableRewards &&
      props.currentWallet.hasClaim === 'unstake'
        ? 'rewardsSummary'
        : currentWalletInfo?.value?.claimableRewards
        ? 'claimRewards'
        : 'rewards'
    );

    const subtitle = computed(() =>
      props.currentWallet.hasClaim === 'unstake' &&
      currentWalletInfo?.value?.claimableRewards
        ? t('autoclaimNote')
        : !apy.value
        ? t('noApyNote')
        : currentWalletInfo?.value?.claimableRewards
        ? props.currentWallet?.net === 'osmosis'
          ? t('accruedDaily')
          : t('youHave')
        : t('claimNote', { code: props.currentWallet.code })
    );
    const currentWalletType = computed(() => {
      const metamaskNet = metamaskConnector.value.network;
      const metamaskAddress =
        metamaskConnector.value.accounts[0] &&
        metamaskConnector.value.accounts[0].toLowerCase();
      const { address, net, type } = props.currentWallet;

      if (
        address.toLowerCase() === metamaskAddress &&
        net.includes(metamaskNet) &&
        type === WALLET_TYPES.PUBLIC_KEY
      ) {
        return WALLET_TYPES.METAMASK;
      }

      return props.currentWallet.type;
    });

    const handleBlockClick = () => {
      if (
        props.currentWallet?.type === WALLET_TYPES.PUBLIC_KEY &&
        currentWalletType.value !== WALLET_TYPES.METAMASK
      ) {
        infoModal.value = true;
      }
    };

    const handleButtonClick = () => {
      if (!props.disabled) {
        if (currentWalletInfo.value?.claimableRewards) {
          props.isCurrentToken ? emit('prepareXctClaim') : emit('prepareClaim');
        } else {
          router.push({
            name: 'WalletStake',
            params: { ...route.params },
          });
        }
      }
    };

    return {
      subtitle,
      title,
      showClaimButton,
      rewardsList,
      width,
      reward,
      currency,
      infoModal,
      handleBlockClick,
      WALLET_TYPES,
      handleButtonClick,
      currentWalletInfo,
      apy,
      currentWalletType,
      hasCustomClaimInfoNets,
      showBalance,
      HIDE_BALANCE_MASK,
      notRewardsCoins,
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
  &__rewards-list-tooltip {
    display: inline-block;
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
    font-family: 'Panton_Bold';
    @include lg {
      font-size: 18px;
      line-height: 22px;
    }
  }
  &__tooltip {
    display: inline-block;
    margin-left: 5px;
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
    font-family: 'Panton_Bold' !important;
  }

  &__currency,
  &__apy {
    font-family: 'Panton_Regular';
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
  &__rewards-list-tooltip-icon {
    margin-bottom: 2px;
    margin-left: 4px;
    &:hover {
      fill: $too-dark-blue;
    }
  }
  &__rewards-list-tooltip-content {
    padding: 10px 0 8px 11px;
    width: 130px;
    max-height: 230px;
    overflow: auto;
  }
  &__rewrd-item {
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    &_value {
      color: $blue;
      margin-right: 3px;
    }
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

.noClaim {
  background: #bfeaf0;

  .claim-rewards__info {
    opacity: 0;
  }

  .claim-rewards__title {
    color: #0a2778;
  }

  .claim-rewards__note {
    color: #313354;
  }

  .claim-rewards__lock {
    svg {
      fill: #a4dbe3;
      width: auto;
    }
  }
}

.info-modal {
  background: $white;
}

body.dark {
  .claim-rewards {
    background: #393c5f;

    &__title {
      color: $white;
    }

    &__info {
      color: $white;
    }

    &__currency {
      color: #6b93c0;
    }

    &__button-shadow-icon {
      fill: rgb(46, 56, 85);
    }
  }
}
</style>
