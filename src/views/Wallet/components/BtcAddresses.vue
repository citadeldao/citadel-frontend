<template>
  <div class="btc-addresses">
    <div class="btc-addresses__head">
      <div class="title">Other address</div>
      <div class="line" />
    </div>
    <div class="btc-addresses__items">
      <div class="item">
        <div class="left">
          <div class="address">
            {{ cutAddress(currentWallet.nativeAddress) }}
          </div>
          <div class="balance">
            0 <span>{{ currentWallet.code }}</span>
          </div>
        </div>
        <div class="right">
          <div class="line"></div>
          <div
            class="copy-icon"
            @click="copyAddress(currentWallet.nativeAddress)"
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
      <div class="item colored">
        <div class="left">
          <div class="address">
            {{ cutAddress(currentWallet.segwitAddress) }}
          </div>
          <div class="balance">
            0 <span>{{ currentWallet.code }}</span>
          </div>
        </div>
        <div class="right">
          <div class="line"></div>
          <div
            class="copy-icon"
            @click="copyAddress(currentWallet.segwitAddress, true)"
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
import { ref } from 'vue';

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
    console.log('WTTTTTT', props.currentWallet);
    const isCopied = ref(false);
    const isCopiedSecond = ref(false);

    const copyAddress = (address, isSecond) => {
      isSecond ? (isCopiedSecond.value = true) : (isCopied.value = true);
      copyToClipboard(address);
      setTimeout(() => {
        isSecond ? (isCopiedSecond.value = false) : (isCopied.value = false);
      }, 1500);
    };

    const cutAddress = (address) => {
      return `${address.slice(0, 7)}...${address.slice(-6)}`;
    };

    return {
      isCopied,
      isCopiedSecond,
      copyAddress,
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
      background: rgba(106, 75, 255, 0.2);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 17px;
      box-sizing: border-box;

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

        .balance {
          font-family: 'Panton_SemiBold';
          font-size: 14px;
          color: #0a2778;
          margin-top: 5px;

          span {
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
</style>