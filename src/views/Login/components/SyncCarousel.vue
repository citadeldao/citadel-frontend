<template>
  <div class="sync-carousel">
    <el-carousel
      ref="syncCarousel"
      v-bind="carouselProps"
      @change="setActiveItem"
    >
      <SyncCarouselItem
        v-for="{ name, image } of slides"
        :key="name"
        :image="image"
        :title="$t(`login.sync.${name}.title`)"
        :text="$t(`login.sync.${name}.text`)"
      />
    </el-carousel>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount, onUnmounted } from 'vue';
import SyncCarouselItem from './SyncCarouselItem';

export default {
  name: 'SybcCarousel',
  components: { SyncCarouselItem },
  setup() {
    const syncCarousel = ref(null);
    const carouselHeight = ref();
    const activeItem = ref(0);
    const intervalID = ref(null);
    const screenWidth = ref(window.innerWidth);

    const onScreenWidthChange = () => {
      screenWidth.value = window.innerWidth;

      // set carousel height
      if (screenWidth.value < 1280) {
        carouselHeight.value = 400;
      } else {
        carouselHeight.value = 500;
      }
    };
    const carouselProps = computed(() => ({
      height: `${carouselHeight.value}px`,
      arrow: 'never',
      indicatorPosition: 'outside',
      trigger: 'click',
      autoplay: false,
    }));

    const slides = ref([
      {
        name: 'chooseValidator',
        image: '1',
      },
      {
        name: 'setAmount',
        image: '2',
      },
      {
        name: 'claimRewards',
        image: '3',
      },
    ]);

    carouselHeight.value = 600;
    onMounted(() => {
      window.addEventListener('resize', onScreenWidthChange);
      if (screenWidth.value < 1280) {
        carouselHeight.value = 400;
      } else {
        carouselHeight.value = 500;
      }

      // set random item
      startCarousel();
    });
    onUnmounted(() =>
      window.removeEventListener('resize', onScreenWidthChange)
    );
    const setRandomItem = () => {
      const randomIndex = Math.floor(Math.random() * slides.value.length);
      const isLastItem = randomIndex === activeItem.value;
      const newActiveIndex =
        randomIndex !== activeItem.value
          ? randomIndex
          : randomIndex === isLastItem
          ? 0
          : randomIndex + 1;

      syncCarousel.value.setActiveItem(newActiveIndex);
    };

    const startCarousel = () => {
      intervalID.value = setInterval(setRandomItem, 5000);
    };

    const stopCarousel = () => {
      clearInterval(intervalID.value);
    };

    const setActiveItem = (index) => {
      stopCarousel();
      activeItem.value = index;
      startCarousel();
    };

    onBeforeUnmount(() => {
      stopCarousel();
    });

    return {
      syncCarousel,
      carouselProps,
      slides,
      setActiveItem,
    };
  },
};
</script>

<style lang="scss" scoped>
.sync-carousel {
  width: 650px;
  display: flex;
  flex-direction: column;
  margin-right: 190px;

  @include lg {
    width: 500px;
    margin-right: 63px;
  }

  @include md {
    width: 400px;
    margin-right: 27px;
  }
}
</style>

<!-- for el-carousel nav -->
<style lang="scss">
.sync-carousel {
  .el-carousel {
    &__indicators {
      display: flex;
      justify-content: center;
      margin: 25px 0 10px;
      padding: 5px;

      @include lg {
        margin: 10px 0;
      }
    }

    &__indicator {
      border: 1px solid transparent;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 26px;
      height: 26px;
      margin: 0 3px;

      &.is-active {
        border: 1px solid $white;
      }

      &:hover {
        button {
          opacity: 1;
          background-color: $blue;

          &::after {
            content: '';
          }
        }
      }

      & button {
        position: relative;
        width: 13px;
        height: 13px;
        border-radius: 50%;
        background-color: $light-green;
        opacity: 1;

        &::after {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 5px 10px #00000029;
          background-color: $light-green;
          z-index: -1;
        }
      }

      &.is-active {
        button {
          background-color: $white;
          border: 1px solid $white;
          padding: 3px;
          box-sizing: border-box;
          border-radius: 50%;

          &::after {
            content: '';
            position: absolute;
            border-radius: 50%;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 20px;
            transform: translate(-50%, -50%);
            border: 1px solid $white;
          }
        }
      }
    }
  }
}
</style>
