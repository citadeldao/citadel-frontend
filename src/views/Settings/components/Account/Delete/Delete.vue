<template>
  <div class="delete">
    <h5 class="delete__title">
      {{ $t('settings.delete.title') }}
    </h5>
    <div class="settings-wrap">
      <span class="delete__description">
        {{ $t('settings.delete.description') }}
      </span>
      <PrimaryButton
        bg-color="#FA3B33"
        hover-bg-color="#fc0800"
        box-shadow="0 0 25px 0 rgba(219, 71, 60, 0.3)"
        class="delete__button"
        data-qa="Delete-account"
        @click="openDeleteAccountModal"
      >
        {{ $t('settings.delete.button') }}
      </PrimaryButton>
    </div>
    <DeleteModal
      :show="isDeleteAccountModalOpened"
      @setModalFlag="setModalFlag"
    />
  </div>
</template>

<script>
import { ref } from 'vue';
import PrimaryButton from '@/components/UI/PrimaryButton';
import DeleteModal from '@/views/Settings/components/Account/Delete/DeleteModal';
export default {
  name: 'DeleteAccount',
  components: {
    PrimaryButton,
    DeleteModal,
  },
  props: {},
  setup() {
    const isDeleteAccountModalOpened = ref(false);
    const setModalFlag = (value) =>
      (isDeleteAccountModalOpened.value = !!value);
    const openDeleteAccountModal = () => {
      isDeleteAccountModalOpened.value = true;
    };
    return {
      setModalFlag,
      isDeleteAccountModalOpened,
      openDeleteAccountModal,
    };
  },
};
</script>

<style lang="scss" scoped>
.delete {
  @include settings-card-default;
  background: $white url('~@/assets/images/settings/delete-account-bg.png');
  background-repeat: no-repeat;
  background-position: 15%;
  background-size: 25%;

  @include md {
    padding: 22px 29px 22px;
  }

  min-width: 150px;
  height: auto;

  @include laptop {
    align-items: center;
    background: $white;
    .settings-wrap {
      flex-direction: column;
      span {
        width: 100%;
        text-align: center;
        margin: 5px 0 10px;
      }
    }
  }
  &__title {
    color: $red;
  }

  &__button {
    align-self: flex-end;
    margin-top: 15px;
    box-shadow: 0px 0px 25px rgba(219, 71, 60, 0.3);
    @include laptop {
      margin-top: 8px;
      align-self: center;
    }
  }
  @include laptop {
    text-align: center;
  }
}

.delete-modal {
  &__password {
    width: 100%;
    height: 68px;
    margin: 24px 0;
  }

  &__buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 24px;
  }

  &__button,
  &__checkbox {
    margin-bottom: 24px;
  }
}

body.dark {
  .delete {
    background: $dark-panel-bg;
    box-shadow: none;
  }
}
</style>
