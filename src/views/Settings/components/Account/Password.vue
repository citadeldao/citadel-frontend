<template>
  <div class="change-password-card">
    <h5 class="change-password-card__title">
      {{ $t('settings.changePassword.title') }}
      <Tooltip :text="$t('settings.changePassword.tooltip')">
        <Info></Info>
      </Tooltip>
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
        data-qa="Update"
        @click="updatePassword"
      >
        {{ $t('settings.changePassword.btnUpdate') }}
      </PrimaryButton>
    </ModalContent>
  </Modal>
</template>

<script>
import PrimaryButton from '@/components/UI/PrimaryButton';
import Tooltip from '@/components/UI/Tooltip';
import Info from '@/assets/icons/info.svg';
import { computed, ref, inject } from 'vue';
import { useStore } from 'vuex';
import useWallets from '@/compositions/useWallets';
import { sha3_256 } from 'js-sha3';
import successIcon from '@/assets/icons/success.svg';
import { WALLET_TYPES } from '../../../../config/walletType';
import CryptoCoin from '@/models/CryptoCoin';
import Modal from '@/components/Modal';
import ModalContent from '@/components/ModalContent';
import Input from '@/components/UI/Input';
export default {
  name: 'ChangePassword',
  components: {
    PrimaryButton,
    Tooltip,
    Info,
    successIcon,
    Modal,
    ModalContent,
    Input,
  },
  props: {},
  setup() {
    const store = useStore();
    const { wallets } = useWallets();
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

    const updatePassword = async () => {
      const walletsToUpdate = [];

      startUpdate.value = true;

      if (incorrectOldPassword.value || newPassword.value.length < 8) {
        return;
      }

      wallets.value.forEach(async (w) => {
        if (
          [WALLET_TYPES.PRIVATE_KEY, WALLET_TYPES.ONE_SEED].includes(w.type)
        ) {
          const privateKey = await w.getPrivateKeyDecoded(oldPassword.value);
          const privateKeyEncoded = await citadel.encodePrivateKeyByPassword(
            w.net,
            privateKey,
            newPassword.value
          );

          if (w.privateKeyEncoded) {
            w.privateKeyEncoded = privateKeyEncoded.data;
          } else {
            //polkadot,if imported from private key
            w.mnemonicEncoded = privateKeyEncoded.data;
          }

          if (w.importedFromSeed) {
            const mnemonic = await store.dispatch('crypto/decodeUserMnemonic', {
              password: oldPassword.value,
              customMnemonic: w.importedFromSeed,
            });
            const encodeMnemonic = await CryptoCoin.encodeMnemonic(
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

      const mnemonic = await store.dispatch('crypto/decodeUserMnemonic', {
        password: oldPassword.value,
      });

      if (mnemonic) {
        // rewrite encode mnemonic/passwordHash
        await store.dispatch('crypto/setAndEncodeUserMnemonic', {
          mnemonic,
          password: newPassword.value,
        });
      }
      // rewrite encode mnemonic/passwordHash
      await store.dispatch('crypto/setAndEncodeUserMnemonic', {
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

    const changePassword = () => {
      showChangePasswordModal.value = true;
    };
    return {
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

.change-password-card {
  @include settings-card-default;
  &__title {
    display: flex;
    align-items: center;
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
}
</style>
