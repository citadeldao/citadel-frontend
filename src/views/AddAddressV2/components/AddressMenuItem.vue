<template>
  <div class="address-menu-item" :data-qa="item.dataQa">
    <div class="address-menu-item__info">
      <div class="title">
        {{ item.title }}
      </div>
      <div class="description">
        {{ item.description }}
      </div>
    </div>
    <div class="address-menu-item__image">
      <img :src="require(`@/assets/icons/addAddressV2/${item.icon}.png`)" />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    item: {
      required: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.address-menu-item {
  display: flex;
  justify-content: space-between;
  padding: 50px;
  box-sizing: border-box;
  width: 48%;
  height: 380px;
  border-radius: 25px;
  background: $white;
  position: relative;

  &:hover {
    background: linear-gradient(90deg, #f1f0ff 0%, #e3f6ff 100%);
    box-shadow: -10px 4px 50px rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }

  @include lg {
    padding: 50px 40px;
  }

  @include md {
    padding: 50px 20px;
  }

  &__image {
    position: absolute;
    bottom: 40px;
    right: 0;

    @include md {
      right: -15px;
      bottom: 20px;
      transform: scale(0.7);
    }
  }

  .title {
    font-family: 'Panton_Bold';
    font-weight: 700;
    font-size: 28px;
    color: $black;
    @include laptop {
      font-size: $h4-size;
    }
  }

  .description {
    margin-top: 15px;
    font-family: 'Panton_Regular';
    font-weight: 400;
    font-size: $default-size;
    line-height: 27px;
    color: $mid-blue;
    width: 44%;

    @include md {
      width: 45%;
    }

    @include laptop {
      font-size: $small-lg;
    }
  }
}

@media (max-width: 1178px) {
  .address-menu-item {
    min-height: 380px;
    height: auto;
  }
}

body.dark {
  .address-menu-item {
    background: #26273b;

    &__info {
      .title {
        color: $white;
      }
    }

    &:hover {
      background: #393c5f;
    }
  }
}
</style>
