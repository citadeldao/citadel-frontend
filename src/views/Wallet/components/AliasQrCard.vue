<template>
  <div class="alias-qr-card">
    <div class="alias-qr-card__header" />
    <div class="alias-qr-card__content">
      <closeIcon class="alias-qr-card__close-icon" @click="$emit('close')" />
      <qrcode-vue
        id="qr"
        :value="currentWallet.address"
        :size="247"
        level="H"
        :margin="5"
        background="#f0f3fd"
        class="alias-qr-card__qr"
      />
      <h4>{{ currentWallet.address }}</h4>
      <PrimaryButton :disabled="isCopying" @click="clickHandler">
        {{ $t(isCopied ? 'copied' : 'copy') }}
      </PrimaryButton>
    </div>
  </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue';
import closeIcon from '@/assets/icons/close-icon.svg';
import PrimaryButton from '@/components/UI/PrimaryButton';
import copyToClipboard from '@/helpers/copyToClipboard';
import { ref } from '@vue/reactivity';
// import domtoimage from 'dom-to-image';
export default {
  name: 'AliasQrCard',
  components: { PrimaryButton, closeIcon, QrcodeVue },
  props: {
    currentWallet: {
      type: Object,
    },
  },
  emits: ['close', 'buttonClick'],
  setup(props, { emit }) {
    const isCopied = ref(false);
    const isCopying = ref(false);
    const clickHandler = async () => {
      isCopied.value = false;
      isCopying.value = true;
      // const res = await domtoimage.toPng(document.getElementById('qr'), {
      //   quality: 1,
      // });
      // const link = document.createElement('a');
      // link.download = `${props.currentWallet.net}-${props.currentWallet.address}.png`;
      // link.href = res;
      // link.click();
      copyToClipboard(props.currentWallet.address);
      setTimeout(() => {
        isCopied.value = true;
        isCopying.value = false;
      }, 500);
      emit('buttonClick');
    };

    return {
      clickHandler,
      isCopied,
      isCopying,
    };
  },
};
</script>

<style lang="scss" scoped>
.alias-qr-card {
  width: 600px;
  display: flex;
  flex-direction: column;
  box-shadow: 15px 15px 15px rgba(63, 54, 137, 0.2);
  border-radius: 16px;
  background: $white;
  &__header {
    height: 16px;
    background: $dark-blue;
    border-radius: 16px 16px 0px 0px;
  }
  &__content {
    display: flex;
    flex-direction: column;
    padding: 31px 40px 41px 40px;
    align-items: center;
    position: relative;
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
  &__qr {
    margin-top: 16px;
    margin-bottom: 34px;
  }
  & h4 {
    margin: 0;
    font-size: 20px;
    line-height: 30px;
    font-family: 'Panton_Bold';
    margin-bottom: 27px;
  }
}
</style>
