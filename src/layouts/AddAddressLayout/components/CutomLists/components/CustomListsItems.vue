<template>
  <div class="custom-lists">
    <div class="custom-lists__list">
      <div
        class="custom-list-item custom-list-item--important"
        :class="{ 'custom-list-item--active': activeList === LIST_ALL && !isInWallet }"
        :data-qa="`lists__list--${LIST_ALL}`"
        @click="$emit('set-active-list', LIST_ALL)"
      >
        <div class="custom-list-item__title">
          <house-icon />
          {{ $t('overallTitle') }}
        </div>
      </div>
      <div
        class="custom-list-item custom-list-item--important custom-list-item--favourites"
        :class="{ 'custom-list-item--active': activeList === LIST_FAVOURITES && !isInWallet }"
        :data-qa="`lists__list--${LIST_FAVOURITES.toLowerCase()}`"
        @click="$emit('set-active-list', LIST_FAVOURITES)"
      >
        <div class="custom-list-item__title">
          <favourite-icon />
          {{ $t('favourites') }}
        </div>
      </div>
      <div class="custom-lists__custom">
        <div
          v-for="item in listWithoutFavourites"
          :key="item.id"
          class="custom-list-item"
          :class="{ 'custom-list-item--active': activeList === item.name && !isInWallet }"
          :data-qa="`lists__list--${item.name}`"
          @click="$emit('set-active-list', item.name)"
        >
          <div class="custom-list-item__title">
            {{ getListName(item.name) }}
          </div>
          <div class="custom-list-item__edit-button__wrapper">
            <EditButton
              class="custom-list-item__edit-button"
              :data-qa="`lists__list--${item.name}__edit`"
              @click="$emit('edit-list', item)"
            >
              {{ $t('edit') }}
            </EditButton>
          </div>
        </div>
      </div>
    </div>

    <button
      class="custom-lists__add-list-button"
      data-qa="lists__create-button"
      @click="$emit('create-list')"
    >
      {{ $t('createList') }}
      <div>+</div>
    </button>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import EditButton from '@/components/UI/EditButton';
import houseIcon from '@/assets/icons/house.svg';
import favouriteIcon from '@/assets/icons/favorite.svg';

const MAX_NAME_LENGTH = 15;

export default {
  name: 'CustomListsItems',
  components: {
    EditButton,
    houseIcon,
    favouriteIcon,
  },
  props: {
    listData: {
      type: Array,
      default: () => [],
    },
    activeList: {
      type: String,
      default: '',
    },
  },
  emits: [
    'edit-list',
    'create-list',
    'set-active-list',
  ],
  setup(props) {
    const route = useRoute();
    const LIST_ALL = 'all';
    const LIST_FAVOURITES = 'Favourites';

    const isInWallet = computed(() => route.path.includes('wallet'));
    const listWithoutFavourites = computed(() => {
      return props.listData.filter(item => item.name !== LIST_FAVOURITES);
    });

    const getListName = (name) => name.length > MAX_NAME_LENGTH
      ? `${name.slice(0, MAX_NAME_LENGTH)}...`
      : name;

    return {
      LIST_ALL,
      LIST_FAVOURITES,
      isInWallet,
      listWithoutFavourites,
      getListName,
    };
  },
};
</script>

<style lang="scss" scoped>
.custom-lists {
  width: 203px;
  background: $white;
  display: flex;
  flex-direction: column;
  box-shadow: 0 15px 50px rgba(80, 100, 124, 0.1),
    0 10px 15px rgba(80, 100, 124, 0.16);
  border-radius: 25px;
  overflow: hidden;

  &__list {
    padding: 10px 25px 0 30px;
  }

  &__custom {
    max-height: 300px;
    padding-right: 10px;
    margin-right: -10px;
    overflow: auto;
  }

  .custom-list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    border-bottom: 1px dashed $ligthgray;
    cursor: pointer;

    &:hover {
      .custom-list-item {
        &__title {
          color: $blue;

          svg {
            fill: $blue;
          }
        }

        &__edit-button__wrapper {
          display: initial;
        }
      }
    }

    &__title {
      display: flex;
      align-items: center;
      max-width: 115px;
      color: $slategray;
      font-size: 14px;
      line-height: 50px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      transition: all 0s;

      svg {
        height: 16px;
        margin: 0 5px 3px 0;
        fill: $black;
        transition: all 0s;
      }
    }

    &__edit-button {
      &__wrapper {
        display: none;
        padding-left: 10px;
        background-color: $white;
      }
    }

    &--important {
      .custom-list-item__title {
        color: $black;
        font-family: "Panton_SemiBold";
      }

      &:nth-child(2) {
        border-bottom-color: $ligth-blue;
      }
    }

    &--favourites {
      svg {
        fill: $orange;
      }

      &:hover:not(.custom-list-item--active) {
        fill: $blue;
      }
    }

    &--active {
      cursor: default;

      .custom-list-item__title {
        font-family: "Panton_SemiBold";
        color: $black;

        svg {
          fill: $dark-blue;
        }
      }

      &:hover {
        .custom-list-item__title {
          color: $black;

          svg {
            fill: $dark-blue;
          }
        }
      }
    }
  }

  &__add-list-button {
    padding: 0 16px 0 30px;
    width: 100%;
    display: flex;
    background: $white;
    align-items: center;
    justify-content: space-between;
    height: 69px;
    font-family: "Panton_Bold";
    font-size: 14px;
    line-height: 17px;

    &:hover {
      color: $blue;

      & div {
        background: $blue;
        box-shadow: 0 4px 20px rgba(26, 83, 240, 0.5);
      }
    }

    & div {
      width: 32px;
      height: 32px;
      border-radius: $round;
      background: $dark-blue;
      font-size: 26px;
      color: $white;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 4px 20px rgba(105, 95, 225, 0.7);
    }
  }
}


</style>
