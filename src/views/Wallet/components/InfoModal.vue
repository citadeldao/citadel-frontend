<template>
  <div class="info-modal">
    <div class="info-modal__top-line" />
    <div class="info-modal__content">
      <div class="info-modal__upper-block">
        <div class="info-modal__upper-left">
          <div class="info-modal__title">
            {{ $t('wallet.info.title') }}
          </div>
          <div class="info-modal__secondary-title">
            {{ $t('wallet.info.note') }}
          </div>
        </div>
        <div class="info-modal__upper-right" @click="$emit('close')">
          <closeIcon />
        </div>
      </div>
      <div class="info-modal__main">
        <div class="side">
          <div class="side__title">
            {{ $t('wallet.info.block1Title') }}
          </div>
          <div class="side__secondary-title">
            {{ $t('wallet.info.block1Info') }}
          </div>
          <div class="side__icon">
            <placeholderKey />
          </div>
          <PrimaryButton @click="toAddAddress">
            {{ $t('importAddress') }}
          </PrimaryButton>
        </div>
        <div class="info-modal__side-divider" />
        <div class="side">
          <div class="side__title">
            {{ $t('wallet.info.block2Title') }}
          </div>
          <div class="side__secondary-title">
            {{ $t('wallet.info.block2Info') }}
          </div>
          <div class="side__icon">
            <placeholderQuestion class="question" />
          </div>
          <PrimaryButton :disabled="true">
            {{ $t('learnHow') }}
          </PrimaryButton>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import closeIcon from '@/assets/icons/close-icon.svg';
import placeholderKey from '@/assets/icons/placeholderKey.svg';
import placeholderQuestion from '@/assets/icons/placeholderQuestion.svg';
import PrimaryButton from '@/components/UI/PrimaryButton';
import { useRouter } from 'vue-router';

export default {
  name: 'InfoModal',
  components: { closeIcon, placeholderKey, placeholderQuestion, PrimaryButton },
  emits: ['close'],
  setup() {
    const router = useRouter();
    const toAddAddress = () => {
      router.push({ name: 'AddAddress' });
    };

    return { toAddAddress };
  },
};
</script>
<style lang="scss" scoped>
.info-modal {
  background: $white;
  max-width: 900px;
  width: 100%;
  box-shadow: 15px 15px 15px rgba(63, 54, 137, 0.2);
  border-radius: 16px;
  overflow: hidden;
  &__top-line {
    height: 15px;
    background: $mid-blue;
    margin-bottom: 31px;
  }
  &__content {
    padding: 0 40px 40px;
  }
  &__upper-block {
    display: flex;
    justify-content: space-between;
    padding-bottom: 28px;
    border-bottom: 1px dashed $lightsteelblue;
    margin-bottom: 45px;
  }
  &__upper-right {
    width: 15px;
    cursor: pointer;
  }
  &__title {
    font-weight: bold;
    font-size: 20px;
    color: $black;
    margin-bottom: 11px;
  }
  &__secondary-title {
    font-size: 14px;
    color: $mid-blue;
  }
  &__main {
    display: flex;
    justify-content: space-between;
  }
  .side {
    width: 410px;
    display: flex;
    flex-direction: column;
    align-items: center;
    &__title {
      font-size: 18px;
      font-weight: 700;
      color: $too-dark-blue;
      text-align: center;
      line-height: 25px;
      margin-bottom: 7px;

      @include md {
        padding: 0;
      }
    }
    &__secondary-title {
      font-size: 14px;
      color: $too-dark-blue;
      text-align: center;
      line-height: 25px;
      padding: 0 10px;
    }
    &__icon {
      height: 160px;
      display: flex;
      justify-content: center;
      margin-top: 20px;
      & svg {
        width: 178px;
        height: 160px;
      }
      .question {
        margin-top: 14px;
      }
    }
  }
  &__side-divider {
    width: 1px;
    border-right: 1px dashed $lightsteelblue;
    margin: 0 24px;
  }
}

body.dark {
  .info-modal {
    background: $dark-panel-bg;
    box-shadow: none;

    .side__title {
      color: $white;
    }

    .side__secondary-title {
      color: #6b93c0;
    }

    .info-modal__upper-right {
      svg {
        fill: $white;
      }
    }

    &__title {
      color: $white;
    }
  }
}
</style>
