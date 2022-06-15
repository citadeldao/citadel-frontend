<template>
  <div class="info">
    <div class="info__block">
      <div class="info__block-section">
        <h2 class="info__block-title">
          {{ $t('wallet.info.block1Title') }}
        </h2>
        <span class="info__block-info">
          {{ $t('wallet.info.block1Info') }}
        </span>
        <div class="info__block-icon">
          <placeholderKey />
        </div>
        <PrimaryButton @click="toAddAddress">
          {{ $t('importAddress') }}
        </PrimaryButton>
      </div>
    </div>
    <div class="info__divider" />
    <div class="info__block">
      <div class="info__block-section">
        <h2 class="info__block-title">
          {{ $t('wallet.info.block2Title') }}
        </h2>
        <span class="info__block-info">
          {{ $t('wallet.info.block2Info') }}
        </span>
        <div class="info__block-icon">
          <placeholderQuestion />
        </div>
        <PrimaryButton :disabled="true">
          {{ $t('learnHow') }}
        </PrimaryButton>
      </div>
    </div>
  </div>
</template>

<script>
import placeholderKey from '@/assets/icons/placeholderKey.svg';
import placeholderQuestion from '@/assets/icons/placeholderQuestion.svg';
import PrimaryButton from '@/components/UI/PrimaryButton';
import { useRouter } from 'vue-router';
export default {
  name: 'Info',
  components: { PrimaryButton, placeholderKey, placeholderQuestion },
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
.info {
  display: flex;
  width: 100%;
  justify-content: center;
  border-top: 1px dashed $lightsteelblue;
  padding-top: 41px;
  margin-top: 28px;
  &__divider {
    border-left: 1px dashed $gray;
    margin: 0 24px;
  }
  &__block {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 440px;
  }
  &__block-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    & button {
      align-self: center;
    }
  }
  &__block-title {
    margin: 0;
    font-size: 18px;
    line-height: 30px;
    font-family: 'Panton_Bold';
    color: $too-dark-blue;
    text-align: center;
  }
  &__block-info {
    font-size: 14px;
    line-height: 30px;
    color: $too-dark-blue;
    text-align: center;
    margin-bottom: 15px;
    padding: 0 10px;
  }
  &__block-icon {
    & svg {
      width: 178px;
      height: 160px;
    }
  }
}
</style>
