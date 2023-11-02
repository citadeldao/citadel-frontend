<template>
  <div class="btc-addresses">
    <div class="btc-addresses__head">
      <div class="title">Other address</div>
      <div class="line" />
    </div>
    <div class="btc-addresses__items">
      <div
        :class="{ active: selectedBtcAddressType === 'native' }"
        class="item"
        @click="setBtcAddressType('native')"
      >
        <div class="left">
          <div class="address">
            {{ cutAddress(currentWallet.nativeAddress) }}
          </div>
          <div class="balance">
            <span
              v-pretty-number="{
                value: !showBalance ? HIDE_BALANCE_MASK : nativeBalance,
                currency: currentWallet.code,
              }"
            />
            <span class="code">{{ currentWallet.code }}</span>
          </div>
        </div>
        <div class="right">
          <div class="line"></div>
          <div
            class="copy-icon"
            @click.stop="copyAddress(currentWallet.nativeAddress)"
          >
            <transition name="fade1">
              <span v-if="isCopied" class="tooltip">
                {{ $t('copiedToClipboard') }}
              </span>
            </transition>
            <copy />
          </div>
        </div>
      </div>
      <div
        :class="{ active: selectedBtcAddressType === 'segwit' }"
        class="item colored"
        @click="setBtcAddressType('segwit')"
      >
        <div class="left">
          <div class="address">
            {{ cutAddress(currentWallet.segwitAddress) }}
          </div>
          <div class="balance">
            <span
              v-pretty-number="{
                value: !showBalance ? HIDE_BALANCE_MASK : segwitBalance,
                currency: currentWallet.code,
              }"
            />
            <span class="code">{{ currentWallet.code }}</span>
          </div>
        </div>
        <div class="right">
          <div class="line"></div>
          <div
            class="copy-icon"
            @click.stop="copyAddress(currentWallet.segwitAddress, true)"
          >
            <transition name="fade1">
              <span v-if="isCopiedSecond" class="tooltip">
                {{ $t('copiedToClipboard') }}
              </span>
            </transition>
            <copy />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import copy from '@/assets/icons/copy.svg';
import copyToClipboard from '@/helpers/copyToClipboard';
import { onMounted, ref, watch, computed } from 'vue';
import citadel from '@citadeldao/lib-citadel';
import { HIDE_BALANCE_MASK } from '@/helpers/prettyNumber';
import { useStore } from 'vuex';

export default {
  name: 'BtcAddresses',
  components: {
    copy,
  },
  props: {
    currentWallet: {
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const isCopied = ref(false);
    const isCopiedSecond = ref(false);
    const segwitBalance = ref(0);
    const nativeBalance = ref(0);

    const showBalance = computed(() => store.getters['balance/showBalance']);
    const selectedBtcAddressType = computed(
      () => store.getters['btcAddresses/selectedBtcAddressType']
    );

    const setBtcAddressType = (value) => {
      store.dispatch('btcAddresses/setBtcAddressType', value);
    };

    const copyAddress = (address, isSecond) => {
      isSecond ? (isCopiedSecond.value = true) : (isCopied.value = true);
      copyToClipboard(address);
      setTimeout(() => {
        isSecond ? (isCopiedSecond.value = false) : (isCopied.value = false);
      }, 1500);
    };

    const fetchBalance = async () => {
      const segwitRes = await citadel.getBalanceByAddress(
        'btc',
        props.currentWallet.segwitAddress
      );
      const nativeRes = await citadel.getBalanceByAddress(
        'btc',
        props.currentWallet.nativeAddress
      );

      if (!segwitRes.error) {
        segwitBalance.value = segwitRes.data.mainBalance;
        store.dispatch('btcAddresses/setBtcBalanceType', {
          type: 'segwit',
          balance: segwitBalance.value,
        });
      }

      if (!nativeRes.error) {
        nativeBalance.value = nativeRes.data.mainBalance;
        store.dispatch('btcAddresses/setBtcBalanceType', {
          type: 'native',
          balance: nativeBalance.value,
        });
      }
    };

    const cutAddress = (address) => {
      return `${address.slice(0, 7)}...${address.slice(-6)}`;
    };

    watch(
      () => props.currentWallet.nativeAddress,
      async () => {
        setBtcAddressType('');
        await fetchBalance();
      }
    );

    onMounted(async () => {
      await fetchBalance();
    });

    return {
      isCopied,
      isCopiedSecond,
      segwitBalance,
      nativeBalance,
      showBalance,
      selectedBtcAddressType,
      HIDE_BALANCE_MASK,
      copyAddress,
      cutAddress,
      setBtcAddressType,
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
      background: rgba(106, 75, 255, 0.2);
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
            @include md {
              width: 18px;
              height: 20px;
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
