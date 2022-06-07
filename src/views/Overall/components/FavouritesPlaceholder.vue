<template>
  <div class="overall-favourite">
    <div class="favourite-placeholder">
      <img
        src="@/assets/images/favourite-addresses.png"
        class="favourite-placeholder__image"
      >
      <div class="favourite-placeholder__title">
        {{ $t('overallPage.favourites.placeholder.address.title') }}
      </div>
      <div class="favourite-placeholder__text">
        {{ $t('overallPage.favourites.placeholder.address.text') }}
      </div>
    </div>

    <div class="favourite-placeholder">
      <img
        src="@/assets/images/favourite-portfolio.png"
        class="favourite-placeholder__image"
      >
      <div class="favourite-placeholder__title">
        {{ $t('overallPage.favourites.placeholder.portfolio.title') }}
      </div>
      <div class="favourite-placeholder__text">
        {{ $t('overallPage.favourites.placeholder.portfolio.text') }}
      </div>
      <PrimaryButton
        class="favourite-placeholder__button"
        @click="showCustomListModal"
      >
        {{ $t('createList') }}
      </PrimaryButton>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import PrimaryButton from '@/components/UI/PrimaryButton';

const CUSTOM_LIST_MODAL = 'custom-list-modal';

export default {
  name: 'FavouritesPlaceholder',
  components: { PrimaryButton },
  emits: ['create-list'],
  setup() {
    const store = useStore();
    const showCustomListModal = () => {
      store.dispatch('modal/showModal', CUSTOM_LIST_MODAL);
    };

    return {
      showCustomListModal,
    };
  },
};
</script>

<style lang="scss" scoped>
.overall-favourite {
  display: flex;
  height: 100%;
  border: 1px solid $too-ligth-blue;
  border-radius: 25px;
  padding: 160px 0 50px;

  @include lg {
    padding-top: 80px;
  }

  @include md {
    padding-top: 50px;
  }
}

.favourite-placeholder {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1 auto;
  padding: 0 20px;
  text-align: center;

  &::after {
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: calc(100% - 40px);
    border-right: 1px dashed $gray;
  }

  &:not(&:last-child)::after {
    content: '';
  }

  &__image {
    align-self: center;
    width: 250px;

    @include lg {
      width: 200px;
    }

    @include md {
      width: 180px;
    }
  }

  &__title {
    margin: 48px 0 17px;
    font-family: "Panton_Bold";
    font-size: 30px;
    line-height: 1;

    @include lg {
      font-size: 22px;
    }

    @include md {
      font-size: 18px;
    }
  }

  &__text {
    font-size: 18px;
    line-height: 1.6;
    color: $mid-blue;
    max-width: 500px;

    @include lg {
      font-size: 16px;
      max-width: 400px;
    }

    @include md {
      font-size: 14px;
    }
  }

  &__button {
    margin-top: 30px;
  }
}
</style>
