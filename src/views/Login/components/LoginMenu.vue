<template>
  <div class="login-web3-menu">
    <div class="login-web3-menu__item socials" @click="$emit('loginSocial')">
      <div class="icon">
        <socialsSvg />
      </div>
      <div class="info">
        <div class="label">{{ $t('login.loginInWith') }}</div>
        <div class="description">{{ $t('login.socialAccount') }}</div>
      </div>
    </div>
    <div class="login-web3-menu__item web3" @click="$emit('loginWeb3')">
      <div class="info">
        <div class="label">{{ $t('login.loginInWith') }}</div>
        <div class="description large">{{ $t('login.web3wallet') }}</div>
      </div>
      <web3Svg />
    </div>
  </div>
</template>
<script>
import socialsSvg from '@/assets/icons/newLogin/socials.svg';
import web3Svg from '@/assets/icons/newLogin/web3.svg';

export default {
  name: 'LoginMenu',
  components: {
    socialsSvg,
    web3Svg,
  },
};
</script>
<style lang="scss" scoped>
.login-web3-menu {
  display: flex;
  width: 350px;
  margin: 0 auto;
  flex-direction: column;
  border-radius: 8px;

  &__item {
    border: 1px solid transparent;
    width: 350px;
    height: 80px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    box-sizing: border-box;
    cursor: pointer;

    &:hover {
      border: 1px solid #1a53f0;
      box-shadow: 0px 15px 50px rgba(80, 100, 124, 0.1),
        0px 10px 15px rgba(80, 100, 124, 0.16);
    }

    .info {
      .label {
        font-size: 14px;
        color: $slategray1;
      }

      .description {
        color: #0a2778;

        &.large {
          font-size: 24px;
        }
      }
    }

    &.socials {
      margin-bottom: 12px;
      border: 1px solid #1a53f0;
      display: flex;

      .icon {
        width: 39px;
        height: 36px;
        margin-right: 12px;
      }
    }

    &.web3 {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-image: url('~@/assets/icons/newLogin/web3block.png');
      background-size: cover;
      background-position: 50%;
    }
  }
}
</style>
