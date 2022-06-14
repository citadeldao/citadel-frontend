<template>
  <div class="add-to-one-seed">
    <span class="add-to-one-seed__title">
      {{
        isUserMnemonic
          ? $t('addAddress.cardTitle1')
          : $t('addAddress.cardTitle2')
      }}
    </span>
    <p class="add-to-one-seed__desc">
      {{ $t('addAddress.cardDescP1') }}
      {{ $t('addAddress.cardDescP2') }}
    </p>
    <div class="add-to-one-seed__section">
      <span class="add-to-one-seed__note">
        {{ $t('addAddress.cardNote') }}
      </span>
      <PrimaryButton
        color="#6A4BFF"
        bg-color="#FFFFFF"
        data-qa="add-address__one-seed-button"
        @click="clickHandler"
      >
        {{ $t('addAddress.cardButton') }}
      </PrimaryButton>
    </div>
    <img src="@/assets/images/one-seed-image.png" />
  </div>
</template>

<script>
import PrimaryButton from '@/components/UI/PrimaryButton';
import { useRouter } from 'vue-router';
import useCreateWallets from '@/compositions/useCreateWallets';

export default {
  name: 'AddToOneSeed',
  components: { PrimaryButton },
  setup() {
    const router = useRouter();
    const clickHandler = () => {
      router.push({ name: 'AddToOneSeed' });
    };
    const { isUserMnemonic } = useCreateWallets();

    return { clickHandler, isUserMnemonic };
  },
};
</script>

<style lang="scss" scoped>
.add-to-one-seed {
  width: 100%;
  flex-direction: column;
  position: relative;
  background: $blue-gradient;
  box-shadow: -10px 4px 27px rgba(0, 0, 0, 0.1);
  border-radius: 25px;
  overflow: hidden;
  padding-top: 58px;
  padding-left: 57px;
  padding-bottom: 56px;
  min-height: 400px;
  z-index: 1;

  &:hover {
    .add-to-one-seed__title {
      color: $black;
    }

    .add-to-one-seed__desc {
      color: $mid-blue;
    }

    .add-to-one-seed__note {
      color: $dark-blue;
    }

    & button {
      color: $white;
      background: $too-dark-blue;
    }
  }

  &::before {
    position: absolute;
    content: '';
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: $white;
    opacity: 0;
    z-index: -1;
    transition: 0.3s all;
  }

  &:hover::before {
    opacity: 1;
  }

  @include lg {
    min-height: 294px;
    padding-bottom: 35px;
    padding-right: 35px;
    padding-top: 30px;
    padding-left: 35px;
  }
  @include md {
    padding-top: 35px;
    padding-left: 32px;
    padding-right: 32px;
    padding-bottom: 37px;
    min-height: 215px;
    box-shadow: -10px 4px 19px rgba(0, 0, 0, 0.1);
  }

  &__title {
    font-size: 40px;
    line-height: 30px;
    color: $white;
    font-family: 'Panton_Bold';
    @include lg {
      font-size: 30px;
      line-height: 30px;
    }
    @include md {
      font-size: 26px;
      line-height: 30px;
    }
  }

  &__desc {
    font-size: 18px;
    line-height: 32px;
    color: $too-ligth-blue;
    width: 896px;
    @include lg {
      font-size: 16px;
      line-height: 30px;
      margin-bottom: 9px;
      width: initial;
    }
    @include md {
      font-size: 14px;
      line-height: 25px;
      margin-top: 11px;
      margin-bottom: 11px;
      width: initial;
    }
  }

  &__section {
    display: flex;
    flex-direction: column;
    @include md {
      flex-direction: initial;
      justify-content: space-between;
    }
  }

  &__note {
    font-size: 25px;
    line-height: 27px;
    color: $white;
    margin-bottom: 66px;
    font-weight: bold;
    font-family: 'Panton_Bold';

    @include lg {
      font-size: 20px;
      line-height: 27px;
      margin-bottom: 29px;
    }
    @include md {
      font-size: 14px;
      line-height: 27px;
      margin-bottom: 0;
    }
  }

  & img {
    position: absolute;
    display: none;
    top: -56px;
    right: 52px;
    @include xl {
      display: initial;
    }
  }
}
</style>
