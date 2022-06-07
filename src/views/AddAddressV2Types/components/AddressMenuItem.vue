<template>
  <div class="menu-type-item">
    <div class="menu-type-item__info">
      <div class="title">
        {{ title }}
      </div>
      <div class="description">
        {{ description }}
      </div>
    </div>
    <div class="menu-type-item__image">
      <restoreIcon
        v-if="icon === 'restore'"
        class="initial"
      />
      <restoreIconHover
        v-if="icon === 'restore'"
        class="hover"
      />
      <importIcon
        v-if="icon === 'import'"
        class="initial"
      />
      <importIconHover
        v-if="icon === 'import'"
        class="hover"
      />
      <seedPhraseIcon
        v-if="icon === 'seedphrase'"
        class="initial"
      />
      <seedPhraseIconHover
        v-if="icon === 'seedphrase'"
        class="hover"
      />
      <privateKeyIcon
        v-if="icon === 'privatekey'"
        class="initial"
      />
      <privateKeyIconHover
        v-if="icon === 'privatekey'"
        class="hover"
      />
      <metamaskKeplrIcon
        v-if="icon === 'metamaskkeplr'"
        class="initial"
      />
      <metamaskKeplrIconHover
        v-if="icon === 'metamaskkeplr'"
        class="hover"
      />
      <hardwareIcon
        v-if="icon === 'hardware'"
        class="initial"
      />
      <hardwareIconHover
        v-if="icon === 'hardware'"
        class="hover"
      />
    </div>
  </div>
</template>
<script>
import restoreIcon from '@/assets/icons/addAddressV2/restore-type.svg';
import restoreIconHover from '@/assets/icons/addAddressV2/restore-type-hover.svg';
import importIcon from '@/assets/icons/addAddressV2/import-type.svg';
import importIconHover from '@/assets/icons/addAddressV2/import-type-hover.svg';
import seedPhraseIcon from '@/assets/icons/addAddressV2/seedphrase-type.svg';
import seedPhraseIconHover from '@/assets/icons/addAddressV2/seedphrase-type-hover.svg';
import privateKeyIcon from '@/assets/icons/addAddressV2/privatekey-type.svg';
import privateKeyIconHover from '@/assets/icons/addAddressV2/privatekey-type-hover.svg';
import metamaskKeplrIcon from '@/assets/icons/addAddressV2/metamaskkeplr-type.svg';
import metamaskKeplrIconHover from '@/assets/icons/addAddressV2/metamaskkeplr-type-hover.svg';
import hardwareIcon from '@/assets/icons/addAddressV2/hardware-type.svg';
import hardwareIconHover from '@/assets/icons/addAddressV2/hardware-type-hover.svg';

export default {
  components: {
    restoreIcon,
    restoreIconHover,
    importIcon,
    importIconHover,
    seedPhraseIcon,
    privateKeyIcon,
    metamaskKeplrIcon,
    hardwareIcon,
    seedPhraseIconHover,
    privateKeyIconHover,
    metamaskKeplrIconHover,
    hardwareIconHover,
  },
  props: {
    title: {
      required: true,
    },
    description: {
      required: true,
    },
    icon: {
      required: false,
    },
  },
};
</script>
<style lang="scss" scoped>
  .menu-type-item {
    display: flex;
    justify-content: space-between;
    padding: 26px 31px;
    box-sizing: border-box;
    width: 100%;
    height: 160px;
    border: 1px dashed #8B9BC7;
    border-radius: 16px;
    background: $white;
    position: relative;

    &:hover {
      box-shadow: 0px 15px 50px rgba(80, 100, 124, 0.1), 0px 10px 15px rgba(80, 100, 124, 0.16);
      cursor: pointer;
    }

    &__image {
      position: absolute;
      bottom: 25px;
      right: 15px;

      .hover {
        display: none;
      }
    }

    .title {
      font-family: 'Panton_Bold';
      font-weight: 700;
      font-size: 18px;
      color: $black;
    }

    .description {
      font-family: 'Panton_Regular';
      font-weight: 400;
      font-size: 14px;
      line-height: 23px;
      color: $mid-blue;
      width: 70%;
    }
  }

  .menu-type-item:hover {
    .menu-type-item__image {
      .initial {
        display: none;
      }

      .hover {
        display: initial;
      }
    }
  }
</style>
