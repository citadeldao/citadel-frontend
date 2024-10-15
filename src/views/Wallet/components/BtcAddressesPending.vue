<template>
  <div class="btc-addresses">
    <div class="btc-addresses__head">
      <div class="title">Mempool txs</div>
      <div class="line" />
    </div>
    <div class="btc-addresses__items">
      <div v-for="(item, ndx) in list.slice(0, 2)" :key="ndx" class="item">
        <div class="left">
          <div class="address">
            {{ `${item.hash.slice(0, 5)}...${item.hash.slice(-5)}` }}
          </div>
          <div class="balance">
            <span
              v-pretty-number="{
                value: !showBalance ? HIDE_BALANCE_MASK : getBalance(item),
                currency: currentWallet.code,
              }"
            />
            <span class="code">{{ currentWallet.code }}</span>
          </div>
        </div>
        <div class="right">
          <div class="line"></div>
          <div class="copy-icon" @click.stop="$emit('openSettingsTx', item)">
            <SettingsUsdIcon />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { computed } from 'vue';
import { HIDE_BALANCE_MASK } from '@/helpers/prettyNumber';
import { useStore } from 'vuex';
import SettingsUsdIcon from '@/assets/icons/settingsusd.svg';

export default {
  name: 'BtcAddressesPending',
  components: {
    SettingsUsdIcon,
  },
  props: {
    currentWallet: {
      required: true,
    },
    list: {
      required: true,
    },
  },
  setup() {
    const store = useStore();

    const showBalance = computed(() => store.getters['balance/showBalance']);
    const selectedBtcAddressType = computed(
      () => store.getters['btcAddresses/selectedBtcAddressType']
    );

    const cutAddress = (address) => {
      return `${address.slice(0, 7)}...${address.slice(-6)}`;
    };

    const getBalance = (item) => {
      const amountType = item.view[0]?.components.find(
        (comp) => comp.type === 'amount'
      );
      if (amountType) {
        return amountType.value?.text || 0;
      }
      return '?';
    };

    return {
      showBalance,
      selectedBtcAddressType,
      HIDE_BALANCE_MASK,
      getBalance,
      cutAddress,
    };
  },
};
</script>
<style lang="scss" scoped>
.btc-addresses {
  display: flex;
  flex-direction: column;
  margin: 20px 0;

  &__head {
    display: flex;
    align-items: center;

    .title {
      font-size: 22px;
      font-family: 'Panton_SemiBold';
      margin-right: 10px;
    }

    .line {
      border-radius: 8px;
      width: calc(100% - 150px);
      height: 4px;
      background: #c3ceeb;
    }
  }

  &__items {
    display: flex;
    align-items: center;
    margin-top: 15px;

    .item {
      width: 290px;
      height: 64px;
      border-radius: 8px;
      margin-right: 10px;
      background: #cdbebe54;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 17px;
      box-sizing: border-box;
      border: 1px solid transparent;
      position: relative;

      &:hover {
        cursor: pointer;
        opacity: 0.8;
      }

      &.active {
        border: 1px dashed #6a4bff;
      }

      &.colored {
        background: rgba(0, 163, 255, 0.2);
      }

      .left {
        display: flex;
        flex-direction: column;

        .address {
          font-family: 'Panton_Regular';
          font-size: 16px;
          color: $dark-blue;
        }

        .btc-balance {
          font-family: 'Panton_SemiBold';
          font-size: 14px;
          color: #0a2778;
          margin-top: 5px;

          span.code {
            color: $dark-blue;
          }
        }
      }

      .right {
        display: flex;
        align-items: center;

        .line {
          height: 30px;
          // width: 1px;
          border: 1px dashed #4f70cf;
          margin-right: 12px;
        }

        .copy-icon {
          position: relative;
          cursor: pointer;

          & svg {
            width: 20px;
            height: 22px;
            fill: #6b93c0;
            @include md {
              width: 20px;
              height: 22px;
            }
          }

          &:hover {
            & svg {
              fill: $too-dark-blue;
            }
          }
        }

        .tooltip {
          background-color: $too-ligth-gray;
          text-align: center;
          border-radius: 6px;
          padding: 8px 9px;
          position: absolute;
          white-space: nowrap;
          z-index: 1;
          top: 110%;
          left: 50%;
          margin-left: -60px;
          box-shadow: 0px 4px 25px rgba(63, 54, 137, 0.25);
          border-radius: 6px;
          font-size: 12px;
          line-height: 16px;
          color: $too-dark-blue;

          &::after {
            content: '';
            position: absolute;
            bottom: 98%;
            left: 50%;
            margin-left: -5px;
            border-width: 5px;
            border-radius: 2px;
            border-style: solid;
            border-color: transparent transparent $too-ligth-gray transparent;
          }
        }
      }
    }
  }
}

body.dark {
  .btc-addresses {
    &__head {
      .title {
        color: $white;
      }
    }

    &__items {
      .item {
        .left {
          .address {
            color: #6b93c0;
          }

          .balance {
            background: transparent;
            color: $white;
          }

          .btc-balance {
            color: $white;

            span {
              color: #6b93c0;
            }
          }
        }
      }
    }
  }
}
</style>
