<template>
  <div class="qr-info">
    <closeIcon class="qr-info__close-icon" @click="$emit('close')" />
    <div class="qr-info__header">
      <h4 class="qr-info__title">
        {{ $t('qrInfo.title') }}
      </h4>
      <span class="qr-info__note">
        {{ $t('qrInfo.note') }}
      </span>
    </div>
    <div class="qr-info__section">
      <div class="qr-info__left-section">
        <div class="qr-info__qr">
          <qrcode-vue
            id="qr"
            :value="qrCodeValue"
            :size="247"
            level="H"
            :margin="5"
            background="#f0f3fd"
          />
        </div>
        <span class="qr-info__left-section-info">
          {{ $t('qrInfo.scanQrInfo') }}
        </span>
        <BackButton @click="previousStep" />
      </div>
      <div class="qr-info__right-section">
        <div class="qr-info__step">
          <qrStep1 class="qr-info__step-icon" />
          <span class="qr-info__step-step"> 1 </span>
          <span class="qr-info__step-info">
            {{ $t('qrInfo.step1Info') }}
          </span>
        </div>
        <div class="qr-info__step">
          <qrStep2 class="qr-info__step-icon" />
          <span class="qr-info__step-step"> 2 </span>
          <span class="qr-info__step-info">
            {{ $t('qrInfo.step2Info') }}
          </span>
        </div>
        <div class="qr-info__step">
          <qrStep3 class="qr-info__step-icon" />
          <span class="qr-info__step-step"> 3 </span>
          <span class="qr-info__step-info">
            {{ $t('qrInfo.step3Info') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed, inject } from 'vue';
import QrcodeVue from 'qrcode.vue';
import qrStep1 from '@/assets/icons/qr-step1.svg';
import qrStep2 from '@/assets/icons/qr-step2.svg';
import qrStep3 from '@/assets/icons/qr-step3.svg';
import BackButton from '@/components/UI/BackButton';
import closeIcon from '@/assets/icons/close-icon.svg';
import useWallets from '@/compositions/useWallets';

export default {
  name: 'QrInfo',
  components: {
    QrcodeVue,
    BackButton,
    closeIcon,
    qrStep1,
    qrStep2,
    qrStep3,
  },
  props: {
    addresses: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['close'],
  setup(props) {
    const store = useStore();
    const previousStep = inject('previousStep');

    const pHash = store.getters['crypto/passwordHash'];
    const { wallets } = useWallets();
    const qrCodeValue = computed(() => {
      const coins = props.addresses.map(({ address, net }) => {
        const cryptoAddress = wallets.value.find((wallet) => {
          return (
            wallet.address.toLowerCase() === address.toLowerCase() &&
            wallet.net === net
          );
        });

        return {
          net: cryptoAddress.net,
          pKey: cryptoAddress.privateKeyEncoded,
          mnemonicEncoded: cryptoAddress.mnemonicEncoded,
        };
      });

      return JSON.stringify({
        pHash,
        coins,
      });
    });

    return {
      previousStep,
      qrCodeValue,
    };
  },
};
</script>

<style lang="scss" scoped>
.qr-info {
  width: 1270px;
  display: flex;
  flex-direction: column;
  box-shadow: 15px 15px 15px rgba(63, 54, 137, 0.2);
  border-radius: 16px;
  background: $white;
  padding: 48px 44px 57px 44px;
  position: absolute;
  top: 145px;

  @include lg {
    top: 50px;
    width: 1120px;
  }
  @include md {
    top: 55px;
    width: 900px;
    padding: 26px 36px 40px 36px;
  }

  &__close-icon {
    position: absolute;
    right: 39px;
    top: 30px;
    cursor: pointer;
    width: 16px;
    height: 16px;

    &:hover {
      fill: $dark-blue;
    }
  }

  &__header {
    display: flex;
    flex-direction: column;
    margin-bottom: 24px;
    @include md {
      margin-bottom: 22px;
    }
  }

  &__title {
    margin: 0;
    font-size: 20px;
    line-height: 30px;
    font-family: 'Panton_Bold';
    @include md {
      width: 344px;
      margin-bottom: 10px;
    }
  }

  &__note {
    font-size: 16px;
    line-height: 30px;
    color: $mid-blue;
    @include md {
      font-size: 14px;
      line-height: 25px;
    }
  }

  &__section {
    display: flex;
  }

  &__left-section {
    display: flex;
    flex-direction: column;
    width: 253px;
    align-items: center;
    margin-right: 136px;

    & button {
      align-self: flex-start;
      @include md {
        position: absolute;
        bottom: 0;
      }
    }

    @include lg {
      margin-right: 59px;
    }
    @include md {
      width: 100%;
      margin-right: 0;
      position: relative;
    }
  }

  &__qr {
    width: 247px;
    height: 247px;
    background: #f0f3fd;
    margin-bottom: 23px;
    @include md {
      margin-bottom: 0;
      margin-right: 53px;
    }
  }

  &__left-section-info {
    font-size: 14px;
    line-height: 24px;
    margin-bottom: 61px;
    text-align: center;
    @include md {
      text-align: left;
      width: 322px;
      margin-bottom: 0;
    }
  }

  &__right-section {
    display: flex;
    justify-content: space-between;
    flex-grow: 1;
    @include md {
      margin-bottom: 43px;
    }
  }

  &__step {
    width: 169px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__step-icon {
    width: 171px;
    height: 265px;
    margin-bottom: 35px;
    @include md {
      width: 128px;
      height: 200px;
      margin-bottom: 25px;
    }
  }

  &__step-step {
    width: 100%;
    font-size: 50px;
    line-height: 60px;
    font-family: 'Panton_Bold';
    border-bottom: 3px solid $gainsboro1;
    text-align: center;
    padding-bottom: 6px;
    margin-bottom: 17px;
    @include md {
      margin-bottom: 12px;
    }
  }

  &__step-info {
    text-align: center;
    font-size: 16px;
    line-height: 19px;
  }
}
</style>
