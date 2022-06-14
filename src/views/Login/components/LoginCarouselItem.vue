<template>
  <el-carousel-item>
    <figure class="login-carousel-item">
      <img
        :src="require(`@/assets/images/auth/${image}.png`)"
        alt=""
        class="login-carousel-item__image"
      />

      <figcaption class="login-carousel-item__caption">
        <h3 class="login-carousel-item__title">
          {{ title }}
        </h3>
        <p class="login-carousel-item__text">
          {{ text }}
        </p>
      </figcaption>
    </figure>
  </el-carousel-item>
</template>

<script>
export default {
  name: 'LoginForm',
  props: {
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
.login-carousel-item {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  margin: 0;
  text-align: center;

  &__image {
    height: 350px;
    max-width: 100%;
    object-fit: contain;
    object-position: bottom center;

    @include lg {
      height: 350px;
    }

    @include md {
      height: 300px;
    }
  }

  &__caption {
    text-align: center;
  }

  &__title {
    display: inline-block;
    width: 85%;
    margin: 25px 0 10px;
    font-size: 35px;
    line-height: 1.3;
    color: $dark-blue;
    font-family: 'Panton_Bold';

    @include lg {
      width: 100%;
      font-size: 28px;
    }

    @include md {
      font-size: 24px;
      margin: 15px 0 10px;
    }
  }

  &__text {
    display: inline-block;
    width: 85%;
    margin: 0;
    font-size: 22px;
    line-height: 1.6;
    letter-spacing: 0.25px;

    @include lg {
      font-size: 18px;
    }

    @include md {
      font-size: 16px;
    }
  }
}
</style>
