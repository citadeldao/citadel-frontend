<template>
  <div class="rigth-section-placeholder">
    <hotSale />
    <p>{{ $t('rewardsPage.rigthSectionPlaceholder') }}</p>
  </div>
</template>

<script>
import hotSale from '@/assets/icons/hot-sale.svg';
export default {
  name: 'RigthSectionPlaceholder',
  components: { hotSale },
  setup() {},
};
</script>

<style lang="scss" scoped>
.rigth-section-placeholder {
  width: 100%;
  height: 100%;
  border: 1px solid $too-ligth-blue;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  & svg {
    fill: $too-ligth-blue;
    width: 51px;
    height: 64px;
    margin-right: 21px;
  }
  & p {
    margin: 0;
    font-size: 18px;
    line-height: 24px;
    color: $too-ligth-blue;
    width: 182px;
    @include lg {
      width: 104px;
    }
    @include md {
      font-size: 14px;
      line-height: 17px;
      width: 75px;
    }
  }
}
</style>
