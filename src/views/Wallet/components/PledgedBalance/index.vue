<template>
  <div
    class="pledged-balance"
    :class="{
      'pledged-balance--public':
        currentWallet?.type === WALLET_TYPES.PUBLIC_KEY,
    }"
  >
    <div
      v-if="currentWallet?.type === WALLET_TYPES.PUBLIC_KEY"
      class="pledged-balance__lock"
    >
      <claimBlockLock />
    </div>
    <span class="pledged-balance__title">
      <span class="pledged-balance__title-title">
        {{ $t('pledgedBalance') }}
      </span>
      <el-tooltip placement="bottom" effect="rewards-list-tooltip">
        <info />
        <template #content>
          <span class="pledged-balance__tooltip-info">
            {{ $t('pledgeDescription.part1') }}
            <span class="pledged-balance__tooltip-info-gas">{{
              $t('pledgeDescription.part2')
            }}</span>
            {{ $t('pledgeDescription.part3') }}
            <span class="pledged-balance__tooltip-info-day">{{
              $t('pledgeDescription.part4')
            }}</span
            >{{ $t('pledgeDescription.part5') }}
          </span>
        </template>
      </el-tooltip>
    </span>
    <span class="pledged-balance__info"
      >{{ currentWallet.code }} {{ $t('lockedForiGasGeneration') }}
    </span>
    <div class="pledged-balance__balance">
      <span
        v-pretty-number="{
          value: pledgedBalance,
          currency: currentWallet.code,
        }"
        class="pledged-balance__balance-value"
      />
      <span class="pledged-balance__balance-currency">
        {{ currentWallet.code }}
      </span>
    </div>
    <div
      v-if="currentWallet?.type !== WALLET_TYPES.PUBLIC_KEY"
      class="pledged-balance__button"
    >
      <RoundArrowButton @click="openPledgeModal" />
    </div>
  </div>
  <teleport v-if="isLoading" to="body">
    <Modal>
      <img src="@/assets/gif/loader.gif" alt="" />
    </Modal>
  </teleport>
  <teleport v-if="showModal" to="body">
    <Modal>
      <ModalContent
        v-if="showCooseModeModal"
        v-click-away="modalCloseHandler"
        type="action"
        button-text="confirm"
        :disabled="disabled"
        @close="modalCloseHandler"
        @buttonClick="preparePledgeUnpledge"
      >
        <ChooseMode
          v-model:activeTab="activeTab"
          :amount="amount"
          :current-wallet="currentWallet"
          :pledged-balance="pledgedBalance"
          @nextStep="preparePledgeUnpledge"
        />
      </ModalContent>
      <ModalContent
        v-if="showConfirmModal"
        v-click-away="modalCloseHandler"
        :title="actionModalData.title"
        :desc="actionModalData.desc"
        button-text="confirm"
        type="action"
        :disabled="!!inputError || !password"
        @close="modalCloseHandler"
        @buttonClick="send"
      >
        <ActionModalContent
          :wallet="currentWallet"
          :staking-amount="amount"
          :staking-fee="fee"
          :adding="adding"
          @submitSend="send"
        />
      </ModalContent>
      <ModalContent
        v-if="showSuccessModal"
        v-click-away="modalCloseHandler"
        title="Success"
        :desc="$t('txWaitTitle')"
        button-text="ok"
        type="success"
        icon="success"
        data-qa="staking-success"
        @close="modalCloseHandler"
        @buttonClick="successClickHandler"
      >
        <SuccessModalContent
          v-model:txComment="txComment"
          :wallet="currentWallet"
          :amount="amount"
          :tx-hash="[txHash]"
          :active-tab="activeTab"
          :fee="fee"
          type="transfer"
        />
      </ModalContent>
    </Modal>
  </teleport>
</template>

<script>
import claimBlockLock from '@/assets/icons/claim-block-lock.svg';
import { WALLET_TYPES } from '@/config/walletType';
import ActionModalContent from './../../views/Stake/components/ActionModalContent.vue';
import SuccessModalContent from './../../views/Send/components/SuccessModalContent.vue';
import ChooseMode from './components/ChooseMode.vue';
import Modal from '@/components/Modal';
import ModalContent from '@/components/ModalContent';
import RoundArrowButton from '@/components/UI/RoundArrowButton';
import info from '@/assets/icons/info.svg';
import { inject } from '@vue/runtime-core';

export default {
  name: 'PledgedBalance',
  components: {
    info,
    RoundArrowButton,
    Modal,
    ModalContent,
    ChooseMode,
    ActionModalContent,
    SuccessModalContent,
    claimBlockLock,
  },
  props: {
    currentWallet: {
      type: Object,
      default: () => ({}),
    },
    pledgedBalance: {},
  },
  setup() {
    const isLoading = inject('isLoading');
    const showModal = inject('showModal');
    const modalCloseHandler = inject('modalCloseHandler');
    const showCooseModeModal = inject('showCooseModeModal');
    const openPledgeModal = inject('openPledgeModal');
    const activeTab = inject('activeTab');
    const amount = inject('amount');
    const disabled = inject('disabled');
    const preparePledgeUnpledge = inject('preparePledgeUnpledge');
    const showConfirmModal = inject('showConfirmModal');
    const showSuccessModal = inject('showSuccessModal');
    const fee = inject('fee');
    const adding = inject('adding');
    const send = inject('send');
    const inputError = inject('inputError');
    const txHash = inject('txHash');
    const successClickHandler = inject('successClickHandler');
    const txComment = inject('txComment');
    const password = inject('password');
    const actionModalData = inject('actionModalData');

    return {
      showModal,
      isLoading,
      modalCloseHandler,
      showCooseModeModal,
      openPledgeModal,
      activeTab,
      amount,
      disabled,
      preparePledgeUnpledge,
      showConfirmModal,
      fee,
      adding,
      send,
      inputError,
      showSuccessModal,
      txHash,
      successClickHandler,
      txComment,
      password,
      actionModalData,
      WALLET_TYPES,
    };
  },
};
</script>

<style lang="scss" scoped>
.pledged-balance {
  width: 100%;
  height: 150px;
  border-radius: 19px;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  padding: 24px 27px 31px 24px;
  position: relative;
  background-image: url('~@/assets/images/unpladgedBalanceBackground.jpg');

  &--public {
    background-image: url('~@/assets/images/pledgedBalanceLock.jpg');

    .pledged-balance__info,
    .pledged-balance__balance-value {
      color: $blue;
    }

    .pledged-balance__title {
      & svg {
        fill: $ligth-blue;
      }
    }
  }

  @include lg {
    height: 126px;
    padding: 21px 27px 19px 25px;
  }

  &__title {
    margin-bottom: 5px;
    display: flex;
    align-items: center;

    & svg {
      &:hover {
        fill: $too-dark-blue;
      }
    }
  }

  &__title-title {
    font-size: 18px;
    line-height: 22px;
    font-family: 'Panton_Bold';
    margin-right: 5px;
  }

  &__info {
    font-size: 14px;
    line-height: 17px;
    color: $dark-blue;
    margin-bottom: 22px;
    @include lg {
      margin-bottom: 12px;
    }
  }

  &__balance {
    display: flex;
    align-items: baseline;
  }

  &__balance-value {
    margin-right: 3px;
    font-size: 24px;
    line-height: 29px;
    color: $dark-blue;
    font-family: 'Panton_Bold' !important;
  }

  &__balance-currency {
    font-size: 16px;
    line-height: 19px;
    color: $black;
    font-family: 'Panton_Regular';
  }

  &__button {
    position: absolute;
    right: 27px;
    bottom: 32px;
    @include lg {
      right: 36px;
      bottom: 20px;
    }
  }

  &__tooltip-info {
    font-family: 'Panton_Light';
    font-size: 12px;
    line-height: 16px;
    color: $mid-blue;
    max-width: 305px;
    display: block;
  }

  &__tooltip-info-gas {
    color: $ligth-blue;
    font-family: 'Panton_SemiBold';
  }

  &__tooltip-info-day {
    color: $too-dark-blue;
    font-family: 'Panton_SemiBold';
  }

  &__lock {
    position: absolute;
    top: 30px;
    right: 31px;
    @include lg {
      top: 18px;
      right: 27px;
    }

    & svg {
      width: 63px;
      height: 95px;
      fill: $turquoise;
      opacity: 0.3;
    }
  }
}

body.dark {
  .pledged-balance {
    &__title-title {
      color: $white;
    }

    &__tooltip-info-day {
      color: $white;
    }

    &__balance-value {
      color: $white;
    }

    &__balance-currency {
      color: #8b9bc7;
    }

    background-image: url('~@/assets/images/unpladgedBalanceBackgroundDark.jpg');
    background-size: cover;
  }
}
</style>
