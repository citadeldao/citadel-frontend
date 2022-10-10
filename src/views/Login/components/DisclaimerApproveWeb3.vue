<template>
  <div class="disclaimer-approve">
    <div :class="{ isMetamask }" class="disclaimer-approve__head" />
    <div class="disclaimer-approve__title">
      {{
        isMetamask
          ? $t('login.approveMetamaskTitle')
          : $t('login.approveKeplrTitle')
      }}
    </div>
    <div class="disclaimer-approve__description">
      {{ $t('login.approveDescription') }}
    </div>
    <div class="disclaimer-approve__cancel" @click="$emit('cancel')">
      {{ $t('cancel') }}
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isMetamask: {
      required: true,
    },
  },
  setup() {},
};
</script>
<style lang="scss" scoped>
.disclaimer-approve {
  display: flex;
  flex-direction: column;
  align-items: center;

  &__head {
    width: 410px;
    height: 135px;
    background-image: url('~@/assets/icons/newLogin/disclaimerKeplr.png');

    &.isMetamask {
      background-image: url('~@/assets/icons/newLogin/disclaimerMetamask.png');
    }
  }

  &__title {
    font-weight: 700;
    font-size: 20px;
    color: $black;
    font-family: 'Panton_SemiBold';
  }

  &__description {
    width: 350px;
    margin-top: 15px;
    text-align: center;
    font-size: 16px;
    color: #6b93c0;
    font-family: 'Panton_Light';
    line-height: 27px;
  }

  &__cancel {
    cursor: pointer;
    margin-top: 10px;
    text-decoration: underline;
    color: #0a2778;
    font-weight: 700;
    font-size: 18px;
  }
}
</style>
