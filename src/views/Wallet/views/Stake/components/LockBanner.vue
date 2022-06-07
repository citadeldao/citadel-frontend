<template>
  <div class="lock-banner">
    <div class="lock-banner__section">
      <lock class="lock-banner__icon" />
      <div class="lock-banner__info">
        <span v-html="$t('lockBanner.bannerInfo')" />
        <span
          class="lock-banner__link"
          @click="$emit('showPlaceholder')"
        >
          {{ $t("lockBanner.thisLink") }}
        </span>
        .
      </div>
    </div>
    <div class="lock-banner__button">
      <PrimaryButton
        color="#FFFFFF"
        bg-color="#FF5722"
        box-shadow="0px 0px 25px rgba(255, 87, 34, 0.5)"
        @click="clickHandler"
      >
        {{ $t("AddWallet") }}
      </PrimaryButton>
    </div>
  </div>
</template>

<script>
import lock from '@/assets/icons/lock1.svg';
import PrimaryButton from '@/components/UI/PrimaryButton';
import { useRouter } from 'vue-router';
export default {
  name: 'LockBanner',
  components: { lock, PrimaryButton },
  emits: ['showPlaceholder'],
  setup() {
    const router = useRouter();
    const clickHandler = () => {
      router.push({ name: 'AddAddress' });
    };

    return { clickHandler };
  },
};
</script>

<style lang="scss" scoped>
.lock-banner {
  background: $ligth-red;
  display: flex;
  width: 100%;
  border-radius: 10px;
  height: 100px;
  padding: 0 25px 0 36px;
  align-items: center;
  justify-content: space-between;
  @include lg {
    height: 281px;
    flex-direction: column;
    justify-content: center;
    padding: 0 65px 0 65px;
    border-radius: 8px;
  }
  @include md {
    height: 80px;
    padding: 0 17px 0 22px;
  }
  &__section {
    display: flex;
    align-items: center;
    @include lg {
      flex-direction: column;
      margin-bottom: 15px;
      max-width: 435px;
    }
  }
  &__icon {
    margin-right: 28px;
    @include lg {
      margin-right: 0;
      margin-bottom: 14px;
    }
    @include md {
      margin-right: 14px;
    }
  }
  &__info,
  &__info span,
  &__link {
    font-family: "Panton_Bold";
    font-size: 20px;
    line-height: 30px;
    @include lg {
      font-size: 18px;
      text-align: center;
    }
    @include md {
      font-size: 14px;
      line-height: 24px;
    }
  }
  &__link {
    cursor: pointer;
    color: $orange;
  }
  &__info {
    @include md {
      width: 258px;
    }
  }
}
</style>