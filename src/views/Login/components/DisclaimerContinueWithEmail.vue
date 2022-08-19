<template>
  <div class="disclaimer-with-email">
    <div class="disclaimer-with-email__head" />
    <div class="disclaimer-with-email__title">
      {{ $t('login.disclaimerMailTitle') }}
    </div>
    <div class="disclaimer-with-email__description">
      <span>1.</span> Email will help you to
      <span class="bold">easily switch</span> between web platform and mobile
      application.
    </div>
    <div class="disclaimer-with-email__description">
      <span>2.</span> With email we can stay in touch with you
      <span class="bold">in case of emergency.</span> There are a lot of
      situations when we need to deliver you information quickly: a validator
      has gone offline and you need to transfer your coins; a loan liquidation
      is approaching, etc. Once the C1 application section is full of various
      use-cases, this kind of communication will be necessary.
    </div>
    <div class="disclaimer-with-email__description">
      <span>3.</span> We might also let you know if you are
      <span class="bold">missing your staking rewards,</span> so you earn more,
      but it's optional.
    </div>
    <div class="disclaimer-with-email__guide">
      {{ $t('login.disclaimerMailGuide') }}
      <span>{{ $t('login.disclaimerMailGuide1') }}</span>
    </div>
    <PrimaryButton
      class="disclaimer-with-email__btn"
      @click="$emit('useEmail')"
    >
      {{ $t('login.useEmailBtn') }}
    </PrimaryButton>
    <div class="disclaimer-with-email__without" @click="$emit('continue')">
      {{ $t('login.continueWithoutEmail') }}
    </div>
  </div>
</template>
<script>
import PrimaryButton from '@/components/UI/PrimaryButton';

export default {
  components: {
    PrimaryButton,
  },
  setup() {},
};
</script>
<style lang="scss" scoped>
.disclaimer-with-email {
  display: flex;
  flex-direction: column;
  align-items: center;

  &__head {
    background-image: url('~@/assets/icons/newLogin/disclaimerEmail.png');
    width: 500px;
    height: 195px;
  }

  &__title {
    margin: 30px 0 20px;
    font-size: 22px;
    font-weight: 700;
    font-style: normal;
    font-family: 'Panton_Bold';
  }

  &__description {
    width: 120%;
    color: #59779a;
    font-style: 14px;
    line-height: 26px;
    font-weight: 400;
    font-family: 'Panton_Light';

    span {
      color: #6a4bff;
      font-family: 'Panton_SemiBold';
      font-weight: 700;
    }

    .bold {
      color: #54478f;
      font-weight: 700;
      font-family: 'Panton_SemiBold';
    }
  }

  &__without {
    cursor: pointer;
    text-decoration: underline;
    font-family: 'Panton_Bold';
    font-size: 20px;
    font-weight: 700;
    color: #0a2778;
  }

  &__guide {
    font-family: 'Panton_SemiBold';
    font-style: 17px;
    color: #6b93c0;
    font-weight: 700;
    text-align: left;
    width: 120%;
    margin-top: 15px;

    span {
      color: #00a3ff;
      cursor: pointer;
    }
  }

  &__btn {
    font-size: 20px;
    font-weight: 600;
    font-family: 'Panton_SemiBold';
    margin: 20px 0;
  }
}
</style>
