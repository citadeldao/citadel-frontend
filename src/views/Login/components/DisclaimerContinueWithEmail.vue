<template>
  <div class="disclaimer-with-email">
    <div class="disclaimer-with-email__head" />
    <div class="disclaimer-with-email__title">
      {{ $t('login.disclaimerMailTitle') }}
    </div>
    <div class="disclaimer-with-email__description">
      <span>1.</span> {{ $t('login.continueEmail1') }}
      <span class="bold">{{ $t('login.continueEmail2') }}</span>
      {{ $t('login.continueEmail3') }}
    </div>
    <div class="disclaimer-with-email__description">
      <span>2.</span> {{ $t('login.continueEmail4') }}
      <span class="bold">{{ $t('login.continueEmail5') }}</span>
      {{ $t('login.continueEmail6') }}
    </div>
    <div class="disclaimer-with-email__description">
      <span>3.</span> {{ $t('login.continueEmail7') }}
      <span class="bold">{{ $t('login.continueEmail8') }}</span>
      {{ $t('login.continueEmail9') }}
    </div>
    <div class="disclaimer-with-email__guide">
      {{ $t('login.disclaimerMailGuide') }}
      <a
        target="blank"
        href="https://medium.com/citadel-one/how-to-log-in-to-citadel-one-anonymously-d1e0ce1d16a3"
        >{{ $t('login.disclaimerMailGuide1') }}</a
      >
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

    a {
      color: #00a3ff;
      text-decoration: none;
    }

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
    @include laptop-standard {
      padding: 5px 15px;
      font-size: 16px;
      box-sizing: content-box;
    }
  }
}
@media (max-height: 710px) {
  .disclaimer-with-email {
    font-size: 14px;
    &__title {
      font-size: 20px;
      text-align: center;
    }
    &__description,
    &__guide {
      width: 100%;
    }
    &__head {
      display: none;
    }
  }
}

body.dark {
  .disclaimer-with-email {
    &__title {
      color: $white;
    }

    &__description {
      .bold {
        color: $white;
      }
    }

    &__without {
      color: $white;
    }
  }
}
</style>
