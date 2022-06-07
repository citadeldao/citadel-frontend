<template>
  <div class="info">
    <h4 class="info__title">
      {{ $t(title) }}
    </h4>
    <span class="info__note">
      {{ $t("wallet.info.note") }}
    </span>
    <div class="info__wrapper">
      <div class="info__block">
        <div class="info__block-icon-md">
          <placeholderKey />
        </div>
        <div class="info__block-section">
          <h2 class="info__block-title">
            {{ $t("wallet.info.block1Title") }}
          </h2>
          <span class="info__block-info">
            {{ $t("wallet.info.block1Info") }}
          </span>
          <div>
            <div class="info__block-icon">
              <placeholderKey />
            </div>
            <PrimaryButton
              :data-qa="dataQa && `${dataQa}__import-address-button`"
              @click="toAddAddress"
            >
              {{ $t("importAddress") }}
            </PrimaryButton>
          </div>
        </div>
      </div>
      <div class="info__divider" />
      <div class="info__block">
        <div class="info__block-icon-md">
          <placeholderQuestion />
        </div>
        <div class="info__block-section">
          <h2 class="info__block-title">
            {{ $t("wallet.info.block2Title") }}
          </h2>
          <span class="info__block-info">
            {{ $t("wallet.info.block2Info") }}
          </span>
          <div>
            <div class="info__block-icon">
              <placeholderQuestion />
            </div>
            <PrimaryButton
              :disabled="true"
              :data-qa="dataQa && `${dataQa}__learn-how-button`"
            >
              {{ $t("learnHow") }}
            </PrimaryButton>
          </div>
        </div>
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
    const toAddAddress = () => {
      router.push({ name: 'AddAddress' });
    };

    return { toAddAddress };
  },
};
</script>

<style lang="scss" scoped>
.info {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64px 0 78px 0;
  align-self: center;
  @include lg {
    padding: 27px 0 40px 0;
  }
  @include md {
    width: 470px;
    padding: 23px 0 32px 0;
  }
  &__title {
    font-size: 30px;
    line-height: 30px;
    font-family: "Panton_Bold";
    margin: 0;
    margin-bottom: 11px;
    text-align: center;
    width: 100%;

    @include lg {
      font-size: 20px;
      margin-bottom: 7px;
    }
    @include md {
      font-size: 20px;
      margin-bottom: 4px;
      text-align: left;
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
      width: 550px;
    }
    @include md {
      font-size: 16px;
      line-height: 24px;
      text-align: left;
      margin-bottom: 24px;
    }
  }
  &__wrapper {
    display: flex;
    width: 100%;
    justify-content: center;
    @include md {
      flex-direction: column;
    }
  }
  &__divider {
    border-left: 1px dashed $gray;
    margin: 0 24px;
    @include lg {
      margin: 0 16px;
    }
    @include md {
      width: 100%;
      border-bottom: 1px dashed $gray;
      border-left: none;
      margin: 32px 0;
    }
  }
  &__block {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 440px;
    @include lg {
      width: 260px;
    }
    @include md {
      width: 100%;
      flex-direction: row;
      align-items: flex-start;
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
      align-items: flex-start;
    }
  }
  &__block-title {
    margin: 0;
    font-size: 20px;
    line-height: 30px;
    font-family: "Panton_Bold";
    color: $too-dark-blue;
    text-align: center;
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
    color: $too-dark-blue;
    text-align: center;
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
      text-align: left;
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
      height: 86px;
    }
    @include md {
      display: initial;
    }
  }
}
</style>