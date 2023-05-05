<template>
  <div class="change-password-card">
    <h5 class="change-password-card__title">
      {{ $t('settings.changePassword.title') }}
      <div class="ml-5">
        <Tooltip :text="$t('settings.changePassword.tooltip')">
          <Info></Info>
        </Tooltip>
      </div>
    </h5>
    <div class="settings-wrap">
      <span class="change-password-card__description">
        {{ $t('settings.changePassword.description') }}
      </span>

      <PrimaryButton
        :disabled="!oldPasswordHash"
        class="change-password-card__button"
        data-qa="settings__password-button"
        @click="changePassword"
      >
        {{ $t('settings.changePassword.button') }}
      </PrimaryButton>
    </div>
  </div>
  <SuccessModal
    @closeSuccessModal="closeSuccessModal"
    :show="showSuccessModal"
  />
  <ChangeModal
    @setChangeModal="setChangeModal"
    @setSuccessModal="setSuccessModal"
    :show="showChangeModal"
  />
</template>

<script>
import PrimaryButton from '@/components/UI/PrimaryButton';
import Tooltip from '@/components/UI/Tooltip';
import Info from '@/assets/icons/info.svg';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import SuccessModal from '@/views/Settings/components/Account/Password/SuccessModal';
import ChangeModal from '@/views/Settings/components/Account/Password/ChangeModal';
export default {
  name: 'ChangePassword',
  components: {
    PrimaryButton,
    Tooltip,
    Info,
    SuccessModal,
    ChangeModal,
  },
  props: {},
  setup() {
    const store = useStore();
    const oldPasswordHash = computed(
      () => store.getters['crypto/passwordHash']
    );
    const changePassword = () => {
      showChangeModal.value = true;
    };
    const showChangeModal = ref(false);
    const showSuccessModal = ref(false);
    const setChangeModal = (value) => (showChangeModal.value = !!value);
    const setSuccessModal = (value) => (showSuccessModal.value = !!value);
    const closeSuccessModal = () => {
      showSuccessModal.value = false;
      // window.location.reload();
    };

    return {
      changePassword,
      oldPasswordHash,
      setSuccessModal,
      setChangeModal,
      showChangeModal,
      showSuccessModal,
      closeSuccessModal,
    };
  },
};
</script>

<style lang="scss" scoped>
.change-password-card {
  height: 100%;
  @include settings-card-default;
  &__title {
    display: flex;
    align-items: center;

    .ml-5 {
      margin-left: 5px;
    }
  }

  .input-wrapper {
    width: 100%;
    height: 70px;

    &.m-20 {
      margin: 55px 0 20px 0;

      &.hasError {
        margin: 75px 0 20px 0;
      }
    }
  }
}
</style>
