<template>
  <div class="delete">
    <h5 class="delete__title">
      {{ $t('settings.delete.title') }}
    </h5>
    <span class="delete__description">
      {{ $t('settings.delete.description') }}
    </span>
    <PrimaryButton
      :disabled="!oldPasswordHash"
      class="delete__button"
      data-qa="settings__delete-account__confirm-button"
      @click="changePassword"
    >
      {{ $t('settings.changePassword.btnTitle') }}
    </PrimaryButton>
    <PrimaryButton
      bg-color="#FA3B33"
      hover-bg-color="#fc0800"
      box-shadow="0 0 25px 0 rgba(219, 71, 60, 0.3)"
      class="delete__button"
      data-qa="settings__delete-account-button"
      @click="openDeleteAccountModal"
    >
      {{ $t('settings.delete.button') }}
    </PrimaryButton>

    <!-- CHANGE SUCCESS PASSWORD -->
    <Modal v-if="showChangePasswordSuccessModal">
      <ModalContent
        v-click-away="closeSuccessModal"
        type="success"
        @close="closeSuccessModal"
      >
        <div class="success-modal">
          <successIcon width="100" height="100" class="success-icon" />
          <div class="title">
            {{ $t('settings.changePassword.successTitle') }}
          </div>
          <div class="description">
            {{ $t('settings.changePassword.successDescription') }}
          </div>
        </div>
      </ModalContent>
    </Modal>

    <!-- CHANGE PASSWORD -->
    <Modal v-if="showChangePasswordModal">
      <ModalContent
        v-click-away="
          () => {
            showChangePasswordModal = false;
          }
        "
        type="action"
        :title="$t('settings.changePassword.modalTitle')"
        :desc="$t('settings.changePassword.modalDescription')"
        @close="
          () => {
            showChangePasswordModal = false;
          }
        "
      >
        <div class="input-wrapper">
          <Input
            id="password"
            v-model="oldPassword"
            :label="$t('settings.changePassword.oldPassword')"
            :placeholder="$t('password')"
            type="password"
            icon="key"
            :error="
              oldPassword && incorrectOldPassword && startUpdate
                ? $t('settings.changePassword.incorrectOldPassword')
                : ''
            "
            :show-error-text="true"
            :style="{ marginTop: '25px' }"
            @input="onChangeOldPassword"
          />
        </div>
        <div
          :class="{
            hasError: oldPassword && incorrectOldPassword && startUpdate,
          }"
          class="input-wrapper m-20"
        >
          <Input
            id="password"
            v-model="newPassword"
            :label="$t('settings.changePassword.newPassword')"
            :placeholder="$t('password')"
            type="password"
            icon="key"
            :error="
              startUpdate && !incorrectOldPassword && newPassword.length < 8
                ? $t('settings.changePassword.minLen')
                : ''
            "
            :show-error-text="true"
            @input="onChangeNewPassword"
          />
        </div>
        <PrimaryButton
          class="delete-modal__button"
          data-qa="settings__delete-account__confirm-button"
          @click="updatePassword"
        >
          {{ $t('settings.changePassword.btnUpdate') }}
        </PrimaryButton>
      </ModalContent>
    </Modal>

    <Modal v-if="isDeleteAccountModalOpened">
      <ModalContent
        v-click-away="closeDeleteAccountModal"
        :title="$t('settings.delete.title')"
        icon="warningIcon"
        :desc="$t('settings.delete.modalDescription')"
        type="warning"
        @close="closeDeleteAccountModal"
        @buttonClick="closeDeleteAccountModal"
      >
        <template #default>
          <div class="delete-modal__password">
            <Input
              id="phrase"
              v-model="phrase"
              :label="$t('settings.delete.inputLabel')"
              :placeholder="$t('settings.delete.placeholder')"
              type="text"
              icon="lock"
              data-qa="settings__delete-account__codeword-field"
            />
          </div>

          <div v-if="hasWallets" class="delete-modal__checkbox">
            <Checkbox
              id="backup"
              v-model:value="needSaveBackup"
              :label="$t('logout.modal.downloadBackup')"
              data-qa="settings__delete-account__backup-checkbox"
            />
          </div>
        </template>

        <template #footer>
          <div class="delete-modal__buttons">
            <PrimaryButton
              :disabled="isButtonDisabled"
              bg-color="#FA3B33"
              hover-bg-color="#fc0800"
              class="delete-modal__button"
              data-qa="settings__delete-account__confirm-button"
              @click="deleteAccount"
            >
              {{ $t('settings.delete.button') }}
            </PrimaryButton>

            <TextButton
              data-qa="settings__delete-account__cancel-button"
              @click="closeDeleteAccountModal"
            >
              {{ $t('cancel') }}
            </TextButton>
          </div>
        </template>
      </ModalContent>
    </Modal>
  </div>
</template>

<script>
import { computed, ref, inject } from 'vue';
import { useStore } from 'vuex';
import PrimaryButton from '@/components/UI/PrimaryButton';
import TextButton from '@/components/UI/TextButton';
import Input from '@/components/UI/Input';
import Checkbox from '@/components/UI/Checkbox';
import Modal from '@/components/Modal';
import ModalContent from '@/components/ModalContent';
import exportPrivateKeys from '@/helpers/exportPrivateKeys';
import { removeStorage } from '@/utils/storage';
import useWallets from '@/compositions/useWallets';
import { sha3_256 } from 'js-sha3';
import successIcon from '@/assets/icons/success.svg';
import { WALLET_TYPES } from '../../../../config/walletType';
import CryptoCoin from '@/models/CryptoCoin';

export default {
  name: 'DeleteAccount',
  components: {
    PrimaryButton,
    TextButton,
    Input,
    Checkbox,
    Modal,
    ModalContent,
    successIcon,
  },
  props: {},
  setup() {
    const store = useStore();
    const isDeleteAccountModalOpened = ref(false);
    const phrase = ref('');
    const needSaveBackup = ref(true);
    const { wallets } = useWallets();
    const hasWallets = computed(() => !!wallets.value.length);
    const isButtonDisabled = computed(() => phrase.value !== 'delete');
    const userId = computed(() => store.getters['profile/info']?.id);
    const keyStorage = computed(() => `user_${userId.value}`);
    const citadel = inject('citadel');

    const oldPassword = ref('');
    const newPassword = ref('');
    const onChangeOldPassword = () => {};
    const onChangeNewPassword = () => {};
    const startUpdate = ref(false);
    const showChangePasswordSuccessModal = ref(false);

    const closeSuccessModal = () => {
      showChangePasswordSuccessModal.value = false;
      window.location.reload();
    };

    const showChangePasswordModal = ref(false);
    const oldPasswordHash = computed(
      () => store.getters['crypto/passwordHash']
    );
    const incorrectOldPassword = computed(() => {
      return sha3_256(oldPassword.value) !== oldPasswordHash.value;
    });

    const updatePassword = () => {
      const walletsToUpdate = [];

      startUpdate.value = true;

      if (incorrectOldPassword.value || newPassword.value.length < 8) {
        return;
      }

      wallets.value.forEach((w) => {
        if (
          [WALLET_TYPES.PRIVATE_KEY, WALLET_TYPES.ONE_SEED].includes(w.type)
        ) {
          const privateKey = w.getPrivateKeyDecoded(oldPassword.value);
          const privateKeyEncoded = citadel.encodePrivateKeyByPassword(
            w.net,
            privateKey,
            newPassword.value
          );

          w.privateKeyEncoded = privateKeyEncoded.data;

          if (w.importedFromSeed) {
            const mnemonic = store.getters['crypto/decodeUserMnemonic'](
              oldPassword.value,
              w.importedFromSeed
            );
            const encodeMnemonic = CryptoCoin.encodeMnemonic(
              mnemonic,
              newPassword.value
            );
            w.importedFromSeed = encodeMnemonic;
          }
          walletsToUpdate.push(w);
        }
      });

      store.dispatch('wallets/pushWallets', {
        wallets: walletsToUpdate,
        root: true,
      });

      const mnemonic = store.getters['crypto/decodeUserMnemonic'](
        oldPassword.value
      );

      // rewrite encode mnemonic/passwordHash
      store.dispatch('crypto/setAndEncodeUserMnemonic', {
        mnemonic,
        password: newPassword.value,
      });
      store.dispatch('crypto/setPassword', newPassword.value);

      // reset flags
      startUpdate.value = false;
      newPassword.value = '';
      oldPassword.value = '';
      showChangePasswordModal.value = false;

      showChangePasswordSuccessModal.value = true;
    };

    const openDeleteAccountModal = () => {
      isDeleteAccountModalOpened.value = true;
      needSaveBackup.value = hasWallets.value;
    };

    const closeDeleteAccountModal = () => {
      isDeleteAccountModalOpened.value = false;
      phrase.value = '';
    };

    const deleteAccount = async () => {
      await store.dispatch('auth/deleteAccount');

      if (needSaveBackup.value && hasWallets.value) {
        exportPrivateKeys(keyStorage.value);
      }

      await store.dispatch('crypto/resetState');
      await citadel.reset(true);
      removeStorage(keyStorage.value);
      window.location.reload(true);
    };

    const changePassword = () => {
      showChangePasswordModal.value = true;
    };

    return {
      phrase,
      isDeleteAccountModalOpened,
      needSaveBackup,
      isButtonDisabled,
      hasWallets,
      deleteAccount,
      closeDeleteAccountModal,
      openDeleteAccountModal,
      changePassword,
      showChangePasswordModal,
      oldPasswordHash,

      oldPassword,
      newPassword,
      onChangeNewPassword,
      onChangeOldPassword,
      incorrectOldPassword,
      updatePassword,
      startUpdate,
      showChangePasswordSuccessModal,
      closeSuccessModal,
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  min-width: 150px;
  height: 100%;
  padding: 40px 45px;
  background: $white;
  box-shadow: -10px 4px 27px rgba(0, 0, 0, 0.1);
  border-radius: 25px;

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

  .success-modal {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .success-icon {
      margin: 20px 0 40px;
    }

    .title {
      color: $black;
      font-family: Panton_Bold;
      font-size: 20px;
    }

    .description {
      color: #6b93c0;
      font-family: Panton_Regular;
      font-size: 16px;
      margin: 15px 0 10px 0;
    }
  }

  @include md {
    box-shadow: -10px 4px 24px rgba(0, 0, 0, 0.1);
    padding: 22px 29px 22px;
  }

  min-width: 150px;
  height: auto;

  @include laptop {
    align-items: center;
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
</style>
