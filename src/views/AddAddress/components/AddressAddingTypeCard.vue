<template>
  <div
    :class="{ inactive: type.inactive }"
    class="address-adding-type-card"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <div class="address-adding-type-card__icon">
      <img
        v-if="hovered"
        :src="require(`@/assets/images/${type.hoveredIcon}.png`)"
      />
      <img v-else :src="require(`@/assets/images/${type.icon}.png`)" />
    </div>
    <div class="address-adding-type-card__info">
      <span class="address-adding-type-card__title">
        {{ type.title }}
      </span>
      <span class="address-adding-type-card__desc">
        {{ type.desc }}
      </span>
      <span class="address-adding-type-card__important">
        {{ type.important }}
      </span>
      <span :style="cssVars" class="address-adding-type-card__note">
        {{ type.note }}
      </span>
    </div>
    <PrimaryButton
      :data-qa="`add-address__${type.name}-button`"
      @click="clickHandler"
    >
      {{ $t('addAddress.button') }}
    </PrimaryButton>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import PrimaryButton from '@/components/UI/PrimaryButton';

export default {
  name: 'AddressAddingTypeCard',
  components: { PrimaryButton },
  props: {
    type: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    const hovered = ref(false);
    const router = useRouter();

    const clickHandler = () => {
      router.push({ name: props.type.pathName });
    };

    return {
      hovered,
      clickHandler,
    };
  },
  computed: {
    cssVars() {
      return {
        '--textColor': this.type.noteColor,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.address-adding-type-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 32%;
  min-height: 300px;
  padding: 34px 30px 40px 40px;
  background: $white;
  box-shadow: -10px 4px 27px rgba(0, 0, 0, 0.1);
  border-radius: 25px;
  @include lg {
    min-height: 324px;
    align-items: center;
    padding: 30px 35px 35px 35px;
  }
  @include md {
    min-height: 370px;
    position: initial;
    align-items: center;
    padding: 31px 22px 45px 24px;
    box-shadow: -10px 4px 19px rgba(0, 0, 0, 0.1);
  }

  &__icon {
    position: absolute;
    right: 45px;
    bottom: 40px;
    @include lg {
      bottom: 76px;
      right: 25px;
    }
    @include md {
      position: initial;
    }

    & img {
      @include lg {
        width: 102px;
        height: 95px;
      }
      @include md {
        width: 80px;
        height: 72px;
      }
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    @include md {
      align-items: center;
    }
  }

  &__title {
    font-size: 20px;
    line-height: 30px;
    font-family: 'Panton_Bold';
    @include md {
      font-size: 16px;
      line-height: 30px;
      text-align: center;
    }
  }

  &__desc {
    font-size: 16px;
    line-height: 27px;
    color: $mid-blue;
    @include md {
      font-size: 14px;
      line-height: 20px;
      text-align: center;
      margin-bottom: 10px;
    }
  }

  &__important {
    font-family: 'Panton_SemiBoldItalic';
    font-size: 14px;
    line-height: 27px;
    color: $dark-blue;
    @include lg {
      font-size: 12px;
      line-height: 20px;
    }
    @include md {
      line-height: 16px;
      text-align: center;
    }
  }

  &__note {
    margin-top: 11px;
    font-size: 18px;
    line-height: 27px;
    font-family: 'Panton_Bold';
    color: var(--textColor);
    margin-bottom: 15px;
    @include md {
      font-size: 14px;
      margin-bottom: 0;
    }
  }

  &:hover {
    background: $blue;

    .address-adding-type-card__title,
    .address-adding-type-card__note {
      color: $white;
    }

    .address-adding-type-card__desc,
    .address-adding-type-card__important {
      color: $too-ligth-blue;
    }

    & button {
      color: $dark-blue;
      background: $white;
    }
  }
}
</style>
