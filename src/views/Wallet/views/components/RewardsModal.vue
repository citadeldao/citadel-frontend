<template>
  <ModalContent
    :title="'Rewards detail list'"
    :desc="$t('claim.confirmModalDesc')"
    type="action"
    width="650px"
    @close="rewardsModalHandler"
  >
    <div class="rewards-modal-content">
      <EmptyList v-if="!rewardsList.length" title="Empty List" />
      <div v-else class="rewards-modal-content__list">
        <div
          v-for="(wallet, ndx) in rewardsList"
          :key="ndx"
          class="rewards-modal-content__list-item"
        >
          <div class="row">
            <WalletTypeIcon :wallet-type="wallet.type" class="type-wallet" />
            <div class="info">
              <div class="reward">
                <span
                  v-pretty-number="{
                    value: wallet.balance.claimableRewards,
                    currency: wallet.code,
                  }"
                  class="derivation-path-card__balance"
                />
                <span class="code">{{ wallet.code }}</span>
              </div>
              <div class="address">{{ wallet.address }}</div>
            </div>
          </div>
          <div class="buttons">
            <div
              class="btn-action claim"
              @click="$emit('prepareClaim', wallet)"
            >
              Claim
            </div>
            <div
              class="btn-action stake"
              @click="$emit('prepareRestake', wallet)"
            >
              Claim & Stake
            </div>
          </div>
        </div>
      </div>
    </div>
  </ModalContent>
</template>
<script>
import ModalContent from '@/components/ModalContent';
import { WALLET_TYPES } from '@/config/walletType';
import useWallets from '@/compositions/useWallets';
import WalletTypeIcon from './WalletTypeIcon';
import { computed } from 'vue';
import EmptyList from '@/components/EmptyList';

export default {
  components: {
    EmptyList,
    ModalContent,
    WalletTypeIcon,
  },
  emits: ['prepareClaim', 'prepareRestake'],
  props: {
    rewardsModalHandler: {
      required: true,
    },
  },
  setup() {
    const { wallets } = useWallets();

    const rewardsList = computed(() => {
      return wallets.value.filter(
        (item) =>
          WALLET_TYPES.PUBLIC_KEY !== item.type &&
          item.balance?.claimableRewards
      );
    });

    console.log('wallets.value', rewardsList.value);

    return {
      rewardsList,
      WALLET_TYPES,
    };
  },
};
</script>
<style lang="scss" scoped>
.rewards-modal-content {
  width: 100%;
  margin: 20px 0;

  &__list {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  &__list-item {
    padding: 5px 0 15px 0;
    box-sizing: border-box;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    border-bottom: 1px solid #8baacd45;
    margin-bottom: 10px;

    .row {
      display: flex;
      align-items: center;
    }

    .info {
      margin-left: 10px;
      display: flex;
      flex-direction: column;
    }

    .address {
      font-size: 14px;
      min-width: 370px;
      color: #6b93c0;
      font-family: 'Panton_Regular';
    }

    .reward {
      min-width: 140px;
      font-size: 14px;
      font-weight: 700;
      font-family: 'Panton_SemiBold';
      color: #6b93c0;

      .code {
        font-family: 'Panton_Regular';
        color: #afbccb;
        font-weight: 700;
      }
    }

    .buttons {
      display: flex;
      align-items: center;
      min-width: 180px;

      .type-wallet {
        margin-right: 10px;
      }

      .btn-action {
        height: 30px;
        padding: 0 8px;
        min-width: 51px;
        border: 1px solid #8496c0;
        color: #6b758e;
        font-size: 14px;
        font-family: 'Panton_Bold';
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        font-weight: 700;

        &:hover {
          opacity: 0.6;
        }

        &.stake {
          width: 110px;
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
