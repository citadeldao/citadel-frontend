<template>
  <div class="transactions-placeholder">
    <span class="transactions-placeholder__info">
      {{ $t('transactionsPage.placeHolderInfo1') }}
    </span>
    <span class="transactions-placeholder__info">
      {{ $t('transactionsPage.placeHolderInfo2P1') }}
      {{ currentWallet.code }}
      {{ $t('transactionsPage.placeHolderInfo2P2') }}
    </span>
    <div class="transactions-placeholder__section">
      <div class="transactions-placeholder__block">
        <span class="transactions-placeholder__block-title">
          {{ $t('transactionsPage.buyVia') }}
          <span class="transactions-placeholder__citadel">Citadel.one</span>
        </span>
        <transactionsPlacholderCitadel
          class="transactions-placeholder__block-icon"
        />
        <PrimaryButton
          disabled
          data-qa="transactions__info__buy-now-button"
        >
          {{ $t('buyNow') }}
        </PrimaryButton>
      </div>
      <div class="transactions-placeholder__block-divider" />
      <div class="transactions-placeholder__block">
        <span class="transactions-placeholder__block-title">
          {{ $t('transactionsPage.placeHolderInfoTitle2') }}
        </span>
        <transactionsPlacholderDeposit
          class="transactions-placeholder__block-icon"
        />
        <PrimaryButton
          disabled
          data-qa="transactions__info__learn-how-button"
        >
          {{ $t('learnHow') }}
        </PrimaryButton>
      </div>
    </div>
  </div>
</template>

<script>
import transactionsPlacholderDeposit from '@/assets/icons/transactionsPlacholderDeposit.svg';
import transactionsPlacholderCitadel from '@/assets/icons/transactionsPlacholderCitadel.svg';
import PrimaryButton from '@/components/UI/PrimaryButton.vue';

export default {
  name: 'TransactionsPlaceholder',
  components: {
    PrimaryButton,
    transactionsPlacholderDeposit,
    transactionsPlacholderCitadel,
  },
  props: {
    currentWallet: {
      type: Object,
    },
  },
  setup() {
  },
};
</script>

<style lang="scss" scoped>
.transactions-placeholder {
  display: flex;
  flex-direction: column;
  padding: 88px 0 127px 0;
  @include lg {
    padding: 60px 0 63px 0;
  }
  @include md {
    padding: 19px 0 0 0;
  }

  &__info {
    font-size: 18px;
    line-height: 27px;
    font-family: "Panton_SemiBold";
    text-align: center;
    @include md {
      font-size: 16px;
      line-height: 23px;
    }
  }

  &__section {
    margin-top: 48px;
    display: flex;
    justify-content: center;
    @include lg {
      margin-top: 44px;
    }
    @include md {
      margin-top: 26px;
    }
  }

  &__block {
    display: flex;
    flex-direction: column;
    align-items: center;
    @include md {
      width: 235px;
    }

    & button {
      @include md {
        margin-bottom: 29px;
      }
    }
  }

  &__block-title,
  &__citadel {
    font-size: 18px;
    line-height: 27px;
    color: $too-dark-blue;
    margin-bottom: 31px;
    @include md {
      font-size: 14px;
      line-height: 27px;
      margin-bottom: 17px;
    }
  }

  &__block-icon {
    width: 178px;
    height: 160px;
    @include md {
      width: 80px;
      height: 82px;
    }
  }

  &__citadel {
    font-family: "Panton_ExtraBold";
    color: $blue;
  }

  &__block-divider {
    border-left: 1px dashed $mid-gray;
    margin: 0 175px 0 175px;
    @include lg {
      margin: 0 51px 0 51px;
    }
    @include md {
      margin: 0 0;
    }
  }
}
</style>