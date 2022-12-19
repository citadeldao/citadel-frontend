<template>
  <div class="error-page">
    <appOffSvg />
    <span>{{ $t('errorPage.serviceOff') }}</span>
    <span class="description">{{ $t('errorPage.serviceOffDescription') }}</span>
  </div>
</template>

<script>
import appOffSvg from '@/assets/icons/appOff.svg';
export default {
  name: 'ErrorPage',
  components: { appOffSvg },
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.error-page {
  width: 100%;
  height: 100vh;
  background: $gray-gradient;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  & svg {
    margin-bottom: 47px;
  }
  & span {
    font-size: 55px;
    line-height: 66px;
    text-align: center;
    font-family: 'Panton_Bold';
    margin-bottom: 42px;

    &.description {
      font-size: 18px;
      width: 70%;
      margin-top: -5;
      color: $slategray1;
      margin-top: 15px;
      text-align: center;
      font-family: 'Panton_Regular';
      line-height: 30px;
    }
  }
}
</style>
