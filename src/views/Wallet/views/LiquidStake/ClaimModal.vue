<template>
  <ModalContent
    width="600px"
    :title="$t('stacks.modalClaimTitle')"
    :desc="$t('stacks.modalClaimDescription')"
    type="action"
    @close="onClose"
  >
    <div class="claim-modal">
      <div v-for="(nft, ndx) in nfts" :key="ndx" class="claim-modal__item">
        <div class="claim-modal__item-column row">
          <el-tooltip
            v-if="currentHeight < nft.endUnlock"
            class="box-item"
            effect="customized"
            :content="getTimeForClaim(nft)"
            placement="bottom-start"
          >
            <div class="claim-modal__item-logo">
              <StacksIcon />
            </div>
          </el-tooltip>
          <div v-else class="claim-modal__item-logo">
            <StacksIcon />
          </div>
          <div class="claim-modal__item-column ml10">
            <div class="claim-modal__item-current">
              {{ `#${nft.id}`
              }}<span :class="{ btc: nft.isBtc }">
                {{ nft.isBtc ? 'stSTXbtc' : 'stSTX' }}</span
              >
            </div>
            <div class="claim-modal__item-current-label">
              {{
                nft.endUnlock - currentHeight < 0
                  ? `Withdrawal available`
                  : `Withdrawal available after ${
                      nft.endUnlock - currentHeight
                    } BTC blocks`
              }}
            </div>
          </div>
        </div>
        <div class="claim-modal__item-column row">
          <div class="claim-modal__item-value">{{ nft.STX }}</div>
          <div class="claim-modal__item-value-symbol">STX</div>
        </div>
        <div class="claim-modal__item-column">
          <div
            :class="{ disabled: currentHeight < nft.endUnlock }"
            class="claim-modal__btn"
            @click="onClaim(nft)"
          >
            Claim
          </div>
        </div>
      </div>
    </div>
  </ModalContent>
</template>
<script>
import ModalContent from '@/components/ModalContent';
import StacksIcon from '@/assets/icons/stacksround.svg';

export default {
  components: {
    ModalContent,
    StacksIcon,
  },
  props: {
    nfts: {
      required: true,
    },
    currentHeight: {
      required: true,
    },
  },
  setup(props, { emit }) {
    const onClose = () => {
      emit('close');
    };

    const getTimeForClaim = (nft) => {
      const symbol = nft.isBtc ? 'stSTXbtc' : 'stSTX';
      const str = `Delayed unstake from ${symbol}. Available in approximately`;

      const blocksRemaining = nft.endUnlock - props.currentHeight;
      const totalMinutes = blocksRemaining * 10;

      const days = Math.floor(totalMinutes / 1440); // 1440 минут в дне
      const hours = Math.floor((totalMinutes % 1440) / 60);
      const minutes = totalMinutes % 60;

      const readable = `${days}d ${hours}h ${minutes}m`;
      return `${str} ${readable}`;
    };

    const onClaim = (nft) => {
      if (props.currentHeight < nft.endUnlock) return;
      emit('claim', nft);
      onClose();
    };

    return {
      onClose,
      onClaim,
      getTimeForClaim,
    };
  },
};
</script>
<style lang="scss" scoped>
.claim-modal {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px 0;

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 8px;
    border: 1px solid #c3ceeb;
    box-sizing: border-box;
    padding: 0 10px;
    width: 100%;
    height: 68px;
    margin-bottom: 10px;
  }

  &__item-column {
    display: flex;
    flex-direction: column;

    &.row {
      flex-direction: row;
      align-items: center;
    }
  }

  &__item-logo {
    cursor: pointer;
    width: 48px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    background-color: #f0f3fd;
  }

  &__item-current {
    font-size: 17px;
    color: #000;
    font-family: Panton_SemiBold;

    span {
      display: inline-block;
      margin-left: 5px;
      font-size: 12px;
      color: #6b93c0;

      &.btc {
        color: #2f8f91;
      }
    }
  }

  &__item-current-label {
    min-width: 225px;
    margin-top: 2px;
    font-size: 12px;
    color: #6b758e;
    font-family: Panton_Regular;
  }

  &__item-value {
    font-size: 17px;
    color: $dark-blue;
    min-width: 80px;
    text-align: right;
  }

  &__item-value-symbol {
    font-size: 17px;
    color: #000;
    margin-left: 3px;
  }

  &__btn {
    width: 54px;
    height: 30px;
    border-radius: 4px;
    background-color: rgba(255, 87, 34, 0.2);
    color: rgba(255, 87, 34, 1);
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: Panton_Bold;

    &.disabled {
      background-color: rgba(107, 147, 192, 0.2);
      color: rgba(107, 147, 192, 1);

      &:hover {
        opacity: 1;
        cursor: initial;
      }
    }

    &:hover {
      cursor: pointer;
      opacity: 0.8;
    }
  }

  .ml10 {
    margin-left: 10px;
  }
}

body.dark {
  .claim-modal {
    &__item {
      border-color: #d6d6d61c;
    }

    &__item-logo {
      background-color: #6b93c026;
    }

    &__item-current {
      color: #8b9bc7;
    }

    &__item-value-symbol {
      color: #8b9bc7;
    }
  }
}
</style>
