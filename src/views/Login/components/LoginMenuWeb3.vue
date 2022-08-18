<template>
  <div class="login-menu-web3">
    <span class="login-menu-web3__title">
      {{ $t('login.web3TitleMenu') }}
    </span>
    <span class="login-menu-web3__info">
      {{ $t('login.web3DescriptionMenu') }}
    </span>
    <div class="login-menu-web3__item">
      <div class="icon">
        <mmSvg />
      </div>
      <div class="info">
        <div class="label">{{ $t('login.loginInWith') }}</div>
        <div class="description">Metamask</div>
      </div>
    </div>
    <div class="login-menu-web3__item">
      <div class="icon">
        <keplrSvg />
      </div>
      <div class="info">
        <div class="label">{{ $t('login.loginInWith') }}</div>
        <div class="description">Keplr</div>
      </div>
    </div>
    <div class="login-menu-web3__cancel" @click="$emit('cancel')">
      {{ $t('cancel') }}
    </div>
  </div>
</template>
<script>
import mmSvg from '@/assets/icons/newLogin/mm.svg';
import keplrSvg from '@/assets/icons/newLogin/keplr.svg';
export default {
  components: {
    mmSvg,
    keplrSvg,
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
    width: 350px;
    height: 68px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    box-sizing: border-box;
    cursor: pointer;
    margin-bottom: 12px;
    border: 1px solid #c3ceeb;
    display: flex;

    &:hover {
      box-shadow: 0px 15px 50px rgba(80, 100, 124, 0.1),
        0px 10px 15px rgba(80, 100, 124, 0.16);
    }

    .icon {
      margin-right: 12px;
    }

    .info {
      .label {
        font-size: 14px;
        color: #8b9bc7;
      }

      .description {
        color: #000;
        font-size: 18px;
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
</style>
