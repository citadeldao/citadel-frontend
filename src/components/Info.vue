<template>
  <div class="info">
    <h4 class="info__title">
      {{ $t(title) }}
    </h4>

    <span class="info__note">
      {{ $t('wallet.info.note') }}
    </span>

    <div class="info__wrapper">
      <div class="info__block" v-for="info in blockInfo" :key="info">
        <div class="info__block-icon-md">
          <component :is="info.component" />
        </div>
        <div class="info__block-section">
          <div class="info__block-text">
            <h2 class="info__block-title">
              {{ $t(info.title) }}
            </h2>
            <span class="info__block-info">
              {{ $t(info.description) }}
            </span>
          </div>
          <div>
            <div class="info__block-icon">
              <component :is="info.component" />
            </div>
            <PrimaryButton
              :disabled="info.buttonDisabled"
              :data-qa="dataQa && `${dataQa}${info.buttonPostfix}`"
              @click="toAddAddress(info.button)"
            >
              {{ $t(info.button) }}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { markRaw } from 'vue';
import placeholderKey from '@/assets/icons/placeholderKey.svg';
import placeholderQuestion from '@/assets/icons/placeholderQuestion.svg';
import PrimaryButton from '@/components/UI/PrimaryButton';
import { useRouter } from 'vue-router';
export default {
  name: 'Info',
  components: { PrimaryButton, placeholderKey, placeholderQuestion },
  props: {
    title: {
      type: String,
      default: '',
    },
    dataQa: {
      type: [String, null],
      default: null,
    },
  },
  setup() {
    const router = useRouter();
    const toAddAddress = (type) => {
      router.push({ name: type === 'importAddress' ? 'AddAddress' : '' });
    };
    return { toAddAddress };
  },
  data() {
    return {
      blockInfo: [
        {
          component: markRaw(placeholderKey),
          title: 'wallet.info.block1Title',
          description: 'wallet.info.block1Info',
          buttonDisabled: false,
          button: 'importAddress',
          buttonPostfix: '__import-address-button',
        },
        {
          component: markRaw(placeholderQuestion),
          title: 'wallet.info.block2Title',
          description: 'wallet.info.block2Info',
          buttonDisabled: true,
          button: 'learnHow',
          buttonPostfix: '__learn-how-button',
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.info {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 0 100px;

  &__title {
    font-size: 30px;
    line-height: 30px;
    font-family: 'Panton_Bold';
    margin: 0 0 11px;
    text-align: center;
    width: 100%;

    @include lg {
      font-size: 20px;
      margin-bottom: 7px;
    }
    @include md {
      font-size: 20px;
      margin-bottom: 4px;
    }
  }
  &__note {
    width: 100%;
    font-size: 18px;
    line-height: 30px;
    color: $mid-blue;
    text-align: center;
    margin-bottom: 44px;
    @include lg {
      font-size: 16px;
      line-height: 24px;
      margin-bottom: 33px;
      max-width: 550px;
    }
    @include md {
      font-size: 16px;
      line-height: 24px;
      margin-bottom: 24px;
    }
  }
  &__wrapper {
    display: flex;
    width: 100%;
    justify-content: center;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 1px;
      border-right: 1px dashed $gray;
      margin: auto;
    }

    @include md {
      flex-direction: column;
      &::after {
        height: 1px;
        width: 100%;
        border-right: none;
        border-bottom: 1px dashed $gray;
      }
    }
  }

  &__block {
    flex: 0 48%;
    padding: 0 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 550px;
    @include md {
      flex: 1 100%;
      flex-direction: row;
      align-items: center;
      max-width: 100%;
      &:not(:last-child) {
        padding-bottom: 25px;
      }
      &:last-child {
        padding-top: 25px;
      }
    }
  }
  &__block-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 100%;

    & button {
      align-self: center;
    }
    @include lg {
      height: 100%;
    }
    @include md {
      align-items: center;
      flex-direction: row;
    }

    .info__block-text {
      text-align: center;
      @include md {
        text-align: left;
        margin-right: 20px;
      }
    }
  }
  &__block-title,
  &__block-info {
    color: $too-dark-blue;
    text-align: center;
    @include md {
      text-align: left;
    }
  }

  &__block-title {
    margin: 0;
    font-size: 20px;
    line-height: 30px;
    font-family: 'Panton_Bold';
    @include lg {
      font-size: 16px;
      line-height: 24px;
    }
    @include md {
      font-size: 16px;
      line-height: 24px;
    }
  }
  &__block-info {
    font-size: 16px;
    line-height: 30px;
    margin-bottom: 15px;
    padding: 0 15px;
    @include lg {
      font-size: 14px;
      line-height: 24px;
      padding: 0 2px;
    }
    @include md {
      font-size: 14px;
      line-height: 24px;
      margin-bottom: 21px;
      padding: 0;
    }
  }

  &__block-icon {
    display: flex;
    justify-content: center;
    & svg {
      height: 160px;
    }
    @include md {
      display: none;
    }
  }

  &__block-icon-md {
    display: none;
    margin-right: 12px;
    & svg {
      width: 80px;
      height: 80px;
    }
    @include md {
      width: 80px;
      height: 80px;
      display: initial;
    }
  }
}
</style>
