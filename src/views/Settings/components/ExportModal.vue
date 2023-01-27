<template>
  <ModalContent
    v-bind="props"
    v-click-away="() => $emit('close')"
    @close="() => $emit('close')"
    @buttonClick="$emit('approveExport')"
  >
    <div class="export-modal">
      <div
        v-if="currentExportMethod === WALLET_TYPES.ONE_SEED"
        class="export-modal__mnemonick-phrase"
      >
        <div class="export-modal__mnemonick-phrase-list">
          <span
            v-for="item in phrase"
            :key="item"
            class="export-modal__mnemonick-phrase-list-item"
            >{{ item }}</span
          >
        </div>
      </div>
      <div
        v-if="
          derivationPath && currentExportMethod !== WALLET_TYPES.PRIVATE_KEY
        "
        class="export-modal__mnemonick-derivation"
      >
        Derivation path: <span>{{ derivationPath }}</span>
      </div>
      <div
        v-if="currentExportMethod === WALLET_TYPES.PRIVATE_KEY"
        class="export-modal__private-key"
      >
        <span class="export-modal__private-key-key">
          {{ privateKey }}
        </span>
      </div>
      <div class="export-modal__copy-icon" @click="copyAddress">
        <transition name="fade1">
          <span v-if="isCopied" class="export-modal__tooltip">
            {{ $t('copiedToClipboard') }}
          </span>
        </transition>
        <copyIcon />
      </div>
    </div>
  </ModalContent>
</template>

<script>
import ModalContent from '@/components/ModalContent';
import copyIcon from '@/assets/icons/copyIcon.svg';
import { WALLET_TYPES } from '@/config/walletType';
import { computed, ref } from '@vue/runtime-core';
import copyToClipboard from '@/helpers/copyToClipboard';
export default {
  name: 'ExportModal',
  components: { copyIcon, ModalContent },
  props: {
    currentExportMethod: {
      type: String,
      default: '',
    },
    mnemonicPhrase: {
      type: String,
      default: '',
    },
    privateKey: {
      type: String,
      default: '',
    },
    derivationPath: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const phrase = computed(() => props.mnemonicPhrase?.split(' '));
    const isCopied = ref(false);
    const copyAddress = () => {
      isCopied.value = true;
      // TO DO NEW TYPE ?
      copyToClipboard(
        props.currentExportMethod === WALLET_TYPES.ONE_SEED
          ? props.mnemonicPhrase
          : props.privateKey
      );
      setTimeout(() => {
        isCopied.value = false;
      }, 1500);
    };

    return { WALLET_TYPES, phrase, copyAddress, isCopied, props };
  },
};
</script>

<style lang="scss" scoped>
.export-modal {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;

  &__mnemonick-derivation {
    margin-top: 20px;
    color: $black;
    font-weight: 700;
    font-size: 18px;
    font-family: 'Panton_SemiBold';

    span {
      color: $dark-blue;
      font-size: 16px;
    }
  }

  &__mnemonick-phrase {
    display: flex;
    margin-top: 24px;
  }
  &__mnemonick-phrase-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    width: 460px;
  }
  &__mnemonick-phrase-list-item {
    height: 40px;
    min-width: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 5px;
    background: $lavender;
    border-radius: 6px;
    font-size: 14px;
    line-height: 17px;
    color: $dark-blue;
    font-family: 'Panton_SemiBold';
  }
  &__copy-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $too-ligth-gray;
    border-radius: 4px;
    position: absolute;
    right: 0;
    top: 24px;
    cursor: pointer;
    &:hover {
      background: $blue;
      & svg {
        fill: $white;
      }
    }
  }
  &__tooltip {
    background-color: $white;
    text-align: center;
    border-radius: 6px;
    padding: 8px 9px;
    position: absolute;
    white-space: nowrap;
    z-index: 1;
    top: 113%;
    left: 58%;
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
  &__private-key {
    display: flex;
    width: 100%;
    margin-top: 36px;
  }
  &__private-key-key {
    font-family: 'Panton_SemiBold';
    font-size: 14px;
    line-height: 17px;
    color: #6b93c0;
    display: block;
    max-width: 460px;
    word-wrap: break-word;
  }
}
</style>
