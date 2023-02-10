<template>
  <div class="top">
    <div class="top__title">
      {{ $t(`overallPage.${title}.title`) }}
    </div>
    <div class="top__buttons">
      <div class="top__network-tabs">
        <slot name="tabs"></slot>
      </div>
      <slot name="expand" class="top__toggle-wrapper"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TopPanel',
  props: {
    title: {
      type: String,
      required: true,
      default: 'balance',
    },
  },
};
</script>

<style lang="scss" scoped>
.top {
  display: flex;
  height: 30px;
  justify-content: space-between;
  margin-bottom: 25px;

  &__title {
    font-family: 'Panton_Bold';
    font-style: normal;
    font-weight: 700;
    font-size: $h5-size;
    color: $black;
  }

  &__buttons {
    display: flex;
  }

  &__network-tabs {
    display: flex;

    ::v-deep(div:not(:first-child)) {
      margin-left: 8px;
    }
  }

  ::v-deep(&__toggle-wrapper) {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $lavander-dark;
    border-radius: 50%;
    margin-left: 17px;
    cursor: pointer;

    &:hover {
      background: $royalblue1;
    }
  }
}
</style>
