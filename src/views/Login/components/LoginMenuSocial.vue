<template>
  <div class="login-menu-web3">
    <span class="login-menu-web3__title">
      {{ $t('login.socialTitleMenu') }}
    </span>
    <span class="login-menu-web3__info">
      {{ $t('login.socialDescriptionMenu') }}
    </span>
    <div class="login-menu-web3__item" @click="$emit('loginWith', 'apple')">
      <div class="icon">
        <appleSvg />
      </div>
      <div class="info">
        <div class="description">{{ $t('login.with') }} Apple</div>
      </div>
    </div>
    <div class="login-menu-web3__item" @click="$emit('loginWith', 'google')">
      <div class="icon">
        <googleSvg />
      </div>
      <div class="info">
        <div class="description">{{ $t('login.with') }} Google</div>
      </div>
    </div>
    <div class="login-menu-web3__item" @click="$emit('loginWith', 'linkedin')">
      <div class="icon">
        <inSvg />
      </div>
      <div class="info">
        <div class="description">{{ $t('login.with') }} Linkedin</div>
      </div>
    </div>
    <div class="login-menu-web3__cancel" @click="$emit('cancel')">
      {{ $t('cancel') }}
    </div>
  </div>
</template>
<script>
import appleSvg from '@/assets/icons/newLogin/apple.svg';
import googleSvg from '@/assets/icons/newLogin/google.svg';
import inSvg from '@/assets/icons/newLogin/in.svg';

export default {
  components: {
    appleSvg,
    googleSvg,
    inSvg,
  },
};
</script>
<style lang="scss" scoped>
.login-menu-web3 {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 55px 60px 10px 60px;
  border-radius: 25px;
  margin-bottom: 15px;
  @include lg {
    margin-bottom: 15px;
  }
  @include md {
    padding: 36px 36px 42px 36px;
    margin-bottom: 15px;
  }

  &__cancel {
    cursor: pointer;
    margin-top: 10px;
    text-decoration: underline;
    color: #0a2778;
    font-weight: 700;
    font-size: 18px;
  }

  &__item {
    min-width: 200px;
    width: 100%;
    max-width: 350px;
    height: 48px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;

    padding: 0 15px;
    box-sizing: border-box;
    cursor: pointer;
    margin-bottom: 12px;
    border: 1px solid #c3ceeb;

    svg {
      fill: #1a53f0;
    }

    &:hover {
      svg {
        fill: #000;
      }

      box-shadow: 0px 15px 50px rgba(80, 100, 124, 0.1),
        0px 10px 15px rgba(80, 100, 124, 0.16);

      .info {
        .description {
          color: $black;
        }
      }
    }

    .icon {
      margin-right: 12px;
    }

    .info {
      min-width: 80px;
      width: 100px;
      max-width: 120px;
      .description {
        color: #1a53f0;
        font-weight: 600;
        font-size: 16px;
      }
    }
  }

  &__title {
    font-family: 'Panton_Bold';
    font-size: 35px;
    line-height: 42px;
    margin-bottom: 16px;
    text-align: center;
    @include md {
      font-size: 25px;
      line-height: 30px;
      margin-bottom: 5px;
    }
  }

  &__info {
    font-size: 16px;
    line-height: 27px;
    color: $mid-blue;
    margin-bottom: 26px;
    @include md {
      margin-bottom: 18px;
    }
  }
}

body.dark {
  .login-menu-web3 {
    &__title {
      color: $white;
    }

    &__cancel {
      color: $white;
    }

    &__item {
      border: 1px solid #4b4c63;

      &:hover {
        box-shadow: none;
      }
    }
  }
}
</style>
