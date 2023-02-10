<template>
  <Modal v-if="show" @keyup.enter="updatePassword">
    <ModalContent
      v-click-away="() => $emit('setChangeModal')"
      type="action"
      :title="$t('settings.changePassword.modalTitle')"
      :desc="$t('settings.changePassword.modalDescription')"
      @close="$emit('setChangeModal')"
    >
      <form>
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
            id="new-password"
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
      </form>
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
import { computed, ref, inject } from 'vue';
import { useStore } from 'vuex';
import useWallets from '@/compositions/useWallets';
import { sha3_256 } from 'js-sha3';
import { PRIVATE_PASSWORD_TYPES } from '@/config/walletType';
import CryptoCoin from '@/models/CryptoCoin';
import Modal from '@/components/Modal';
import ModalContent from '@/components/ModalContent';
import Input from '@/components/UI/Input';
export default {
  name: 'ChangePassword',
  components: {
    PrimaryButton,
    Modal,
    ModalContent,
    Input,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    const { wallets } = useWallets();
    const citadel = inject('citadel');

    const oldPassword = ref('');
    const newPassword = ref('');
    const onChangeOldPassword = () => {};
    const onChangeNewPassword = () => {};
    const startUpdate = ref(false);

    const closeSuccessModal = () => {
      emit('setSuccessModal');
      window.location.reload();
    };

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
        if (PRIVATE_PASSWORD_TYPES.includes(w.type)) {
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
      emit('setChangeModal');
      emit('setSuccessModal', true);
    };

    const changePassword = () => {
      emit('setChangeModal', true);
    };
    return {
      changePassword,
      oldPasswordHash,
      oldPassword,
      newPassword,
      onChangeNewPassword,
      onChangeOldPassword,
      incorrectOldPassword,
      updatePassword,
      startUpdate,
      closeSuccessModal,
    };
  },
};
</script>

<style lang="scss" scoped>
form {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.input-wrapper {
  width: 100%;
  height: 70px;

  &.m-20 {
    margin: 45px 0 25px 0;

    &.hasError {
      margin: 75px 0 20px 0;
    }
  }
}

.change-password-card {
  height: 100%;
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
}
</style>
