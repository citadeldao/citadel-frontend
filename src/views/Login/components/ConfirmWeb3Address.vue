<template>
  <div class="confirm-web3-address">
    <div class="confirm-web3-address__notify">
      <warningSvg
        width="40"
        height="40"
        :class="{ wrongNetwork: !supportNetworks }"
        class="icon"
      />
      <div
        v-html="
          !supportNetworks
            ? $t('login.confirmAddressTitleAnother')
            : isKeplr
            ? $t('login.confirmAddressTitleKeplr')
            : network === 'eth'
            ? $t('login.confirmAddressTitleMetamaskEth')
            : $t('login.confirmAddressTitleMetamaskBSC')
        "
      />
    </div>
    <div class="confirm-web3-address__address">
      <div v-if="rerenderIcon && supportNetworks" class="icon">
        <keep-alive>
          <component :is="icon" />
        </keep-alive>
      </div>
      <div class="info">
        <div class="network">
          {{ supportNetworks ? name : '' }}
        </div>
        <div class="address">{{ address }}</div>
      </div>
      <div
        v-if="isKeplr"
        class="refresh"
        :class="{ 'refresh-animation': refresh }"
        @click="$emit('refreshKeplr')"
      >
        <refreshSvg />
      </div>
      <div
        v-if="!isKeplr"
        class="refresh"
        :class="{ 'refresh-animation': refresh }"
        @click="$emit('refreshMetamask')"
      >
        <refreshSvg />
      </div>
    </div>
    <PrimaryButton
      class="confirm-web3-address__confirm"
      :loading="loading"
      @click="$emit('confirm')"
      >{{ $t('confirm') }}</PrimaryButton
    >
    <div class="confirm-web3-address__cancel" @click="$emit('cancel')">
      {{ $t('cancel') }}
    </div>
  </div>
</template>
<script>
import { markRaw, ref, watch, computed } from 'vue';
import warningSvg from '@/assets/icons/newLogin/warning.svg';
import refreshSvg from '@/assets/icons/newLogin/refresh.svg';
import PrimaryButton from '@/components/UI/PrimaryButton';
import { metamaskNets } from '@/config/availableNets';

export default {
  components: {
    warningSvg,
    refreshSvg,
    PrimaryButton,
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    isKeplr: {
      type: Boolean,
    },
    name: {
      type: String,
    },
    address: {
      type: String,
      default: () => '0x1',
    },
    network: {
      type: String,
    },
    refresh: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const icon = ref();
    const rerenderIcon = ref(true);

    const supportNetworks = computed(() => {
      if (props?.address?.startsWith('0x') && props?.address?.length === 42) {
        return metamaskNets.includes(props.network);
      }
      return true;
    });

    import(`@/assets/icons/networks/${props.network}.svg`).then((val) => {
      icon.value = markRaw(val.default);
    });

    watch(
      () => props.network,
      () => {
        import(`@/assets/icons/networks/${props.network}.svg`).then((val) => {
          icon.value = markRaw(val.default);
        });
      }
    );

    return {
      icon,
      rerenderIcon,
      supportNetworks,
    };
  },
};
</script>
<style lang="scss" scoped>
.confirm-web3-address {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &__address {
    width: 460px;
    height: 80px;
    background: #f0f3fd;
    border-radius: 8px;
    margin-top: 20px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 0 20px;
    position: relative;

    .icon {
      margin-right: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #6a4bff;
      svg {
        fill: $white;
        max-width: 21px;
        max-height: 21px;
      }
    }

    .info {
      display: flex;
      flex-direction: column;

      .network {
        font-weight: 700;
        font-size: 16px;
        color: $black;
        font-family: 'Panton_SemiBold';
      }

      .address {
        font-weight: 400;
        font-size: 12px;
        color: #6a4bff;
        margin-top: 3px;
      }
    }

    .refresh {
      border-left: 1px dashed #c3ceeb;
      padding-left: 20px;
      position: absolute;
      cursor: pointer;
      right: 20px;
      &:hover {
        opacity: 0.6;
      }
    }
  }

  &__notify {
    width: 460px;
    min-height: 80px;
    background: #e8f7ff;
    border-radius: 10px;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 10px 20px;
    color: #00a3ff;

    .icon {
      width: 90px;

      &.wrongNetwork {
        width: 45px;
      }
    }

    div {
      margin-left: 10px;
    }
  }

  &__confirm {
    margin-top: 25px;
  }

  &__cancel {
    cursor: pointer;
    margin-top: 15px;
    text-decoration: underline;
    font-family: 'Panton_SemiBold';
    color: #0a2778;
    font-weight: 700;
    font-size: 18px;
  }
}
.refresh-animation svg {
  animation: circle 2s linear infinite;
}
@keyframes circle {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
