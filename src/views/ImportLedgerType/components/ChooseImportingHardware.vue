<template>
  <div class="choose-importing-hardware">
    <div class="choose-importing__info-banner">
      <InfoBanner
        icon="chrome"
        :content="$t('importHardwareWallet.note')"
        color="#00A3FF"
        :background="
          $store.getters['app/theme'] === 'dark' ? '#1B1C31' : '#E8F7FF'
        "
        guide
      />
    </div>
    <div class="choose-importing-hardware__card-wrapper">
      <div
        class="choose-type"
        @click="
          $router.push({
            name: 'ImportLedger',
            params: { isBluetooth: 'bluetooth' },
          })
        "
      >
        <bluetoothIcon />
        <div class="title">
          {{ $t('ledger.title') }}<span>{{ $t('ledger.btTitle1') }}</span>
        </div>
        <div class="description">{{ $t('ledger.btDesc') }}</div>
      </div>
      <div class="choose-type" @click="$router.push({ name: 'ImportLedger' })">
        <usbIcon />
        <div class="title">
          {{ $t('ledger.title') }}<span>{{ $t('ledger.usbTitle1') }}</span>
        </div>
        <div class="description">{{ $t('ledger.usbDesc') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import InfoBanner from '@/components/InfoBanner';
import bluetoothIcon from '@/assets/icons/ledger/bluetooth.svg';
import usbIcon from '@/assets/icons/ledger/usb.svg';

export default {
  name: 'ChooseImportingHardware',
  components: { InfoBanner, bluetoothIcon, usbIcon },
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.select-card {
  width: 275px;
  max-width: 275px;
  @include md {
    max-width: 137px;
    width: 137px;
  }
}
.choose-importing-hardware {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 48px;
  align-items: center;
  @include lg {
    padding-top: 31px;
  }
  @include md {
    padding-top: 24px;
  }
  &__info-banner {
    width: 570px;
    font-family: 'Panton_SemiBold';
    @include md {
      width: 483px;
    }
  }
  &__card-wrapper {
    display: flex;
    margin-top: 30px;

    @include lg {
      margin-top: 16px;
    }

    .choose-type {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 275px;
      height: 280px;
      border: 1px dashed #c3ceeb;
      margin: 0 15px;
      border-radius: 8px;
      cursor: pointer;

      @include lg {
        margin: 0 8px;
      }

      @include md {
        margin: 0 8px;
      }

      &:hover {
        background: rgb(245, 246, 253);
      }

      .title {
        margin-top: 30px;
        font-family: 'Panton_Regular';
        font-size: 20px;

        span {
          font-family: 'Panton_Bold';
        }
      }

      .description {
        margin-top: 5px;
        color: #1a53f0;
        font-family: 'Panton_Regular';
        font-size: 14px;
      }
    }
  }
}

body.dark {
  .choose-importing-hardware {
    &__card-wrapper {
      .choose-type {
        border: 1px dashed #4b4c63;

        .title {
          color: #6b758e;
        }

        .description {
          color: $white;
        }

        &:hover {
          background: #4b4c63;
        }
      }
    }
  }
}
</style>
