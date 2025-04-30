<template>
  <div class="delayed-info">
    <Infoicon />
    <div class="delayed-info__text">
      NFT Claim Process: You will find your NFTs in the "<span>Claim NFT</span>"
      section. Your NFTs will be available for claim once the delayed unstake
      cycle is complete.
    </div>
  </div>
</template>
<script>
import Infoicon from '@/assets/icons/infoicon.svg';
export default {
  components: {
    Infoicon,
  },
  setup() {},
};
</script>
<style lang="scss" scoped>
.delayed-info {
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-radius: 16px;
  background-color: #e9f6ff;

  &__text {
    font-size: 14px;
    line-height: 23px;
    font-family: Panton_Regular;
    color: #008de4;
    width: 436px;
    margin-left: 20px;
    margin-top: 10px;

    span {
      font-family: Panton_Bold;
      color: #1a53f0;
    }
  }
}

body.dark {
  .delayed-info {
    background-color: #393c5f;

    &__text {
      color: #6b93c0;

      span {
        color: #c5cad8;
      }
    }
  }
}
</style>
