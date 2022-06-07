<template>
  <div class="rewards-placeholder">
    <div class="rewards-placeholder__icon">
      <rewardsPlaceHolder />
      <span>{{ $t("rewardsPage.rewardsPlaceholder") }}</span>
    </div>
  </div>
</template>

<script>
import rewardsPlaceHolder from '@/assets/icons/rewardsPlaceHolder.svg';
export default {
  name: 'RewardsPlaceholder',
  components: { rewardsPlaceHolder },
  setup() {},
};
</script>

<style lang="scss" scoped>
.rewards-placeholder {
  display: flex;
  flex: 1;
  height: calc(100vh - 114px);
  display: flex;
  border-radius: 50px 50px 0px 0px;
  background: $white;
  padding: 38px 36px 31px 45px;
  @include lg {
    border-radius: 25px 25px 0px 0px;
  }
  @include md {
    border-radius: 25px 25px 0px 0px;
    height: calc(100vh - 82px);
  }
  &__icon {
    border: 1px solid $too-ligth-blue;
    box-sizing: border-box;
    border-radius: 25px;
    flex-direction: column;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    & svg {
      margin-bottom: 18px;
    }
    & span {
      font-size: 18px;
      line-height: 24px;
      color: $too-ligth-blue;
    }
  }
}
</style>