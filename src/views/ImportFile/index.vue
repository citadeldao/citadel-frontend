<template>
  <div class="import-file">
    <MigrationLayout
      v-if="oldFormat"
      :private-wallets-mode="privateWalletsMode"
      :from-upload-file="true"
    />
    <Header :current-step="currentStep" :steps="steps" />
    <div class="import-file__section">
      <!-- <Stepper :steps="steps" /> -->
      <UploadFile
        v-if="currentStep === 2"
        @backupLoaded="setBackup"
        @loadOldFormat="setOldFormat"
      />
      <EnterPassword
        v-if="currentStep === 3 && !privateWalletsMode"
        :password-hash="backup.passwordHash"
        @passwordConfirmed="finalStep"
      />
    </div>
    <teleport v-if="showModal" to="body">
      <Modal>
        <img v-if="showLoader" src="@/assets/gif/loader.gif" alt="" />
        <CatPage
          v-else
          v-click-away="modalClickHandler"
          :data="newWallets"
          data-qa="add-address__existing__file"
          @close="modalCloseHandler"
          @buttonClick="modalClickHandler"
        />
      </Modal>
    </teleport>
  </div>
</template>

<script>
import MigrationLayout from '@/views/Migration/index';
import Header from '../AddAddress/components/Header';
import UploadFile from './components/UploadFile';
import EnterPassword from './components/EnterPassword';
import CatPage from '@/components/CatPage';
import Modal from '@/components/Modal';
import useCurrentStep from '@/compositions/useCurrentStep';
import useCreateWallets from '@/compositions/useCreateWallets';
import { ref, computed } from 'vue';
import { steps as fileSteps } from '@/static/importFile';
import { useStore } from 'vuex';
import { WALLET_TYPES } from '@/config/walletType';
import redirectToWallet from '@/router/helpers/redirectToWallet';

export default {
  name: 'ImportFile',
  components: {
    MigrationLayout,
    CatPage,
    Modal,
    UploadFile,
    Header,
    EnterPassword,
  },
  setup() {
    const store = useStore();
    const { currentStep, steps } = useCurrentStep(2, fileSteps);
    const showLoader = ref(false);
    const showModal = ref(false);
    const newWallets = ref([]);
    const backup = ref(null);
    const oldFormat = ref(false);
    const privateWalletsMode = ref(false); // citadel accs, when has oneseed
    const { isPasswordHash } = useCreateWallets();

    const oldBackupKey = computed(
      () => `__wallets__${store.getters['profile/info']?.id}`
    );

    const setBackup = (payload) => {
      backup.value = payload;

      if (
        isPasswordHash.value &&
        (backup.value.privateWallets || backup.value.wallets)
      ) {
        const list = backup.value.privateWallets || backup.value.wallets;
        privateWalletsMode.value = true;
        setTimeout(() => {
          localStorage.setItem(
            oldBackupKey.value,
            JSON.stringify([
              {
                type: 1,
                coins: list
                  .filter((w) =>
                    [WALLET_TYPES.PRIVATE_KEY, WALLET_TYPES.ONE_SEED].includes(
                      w.type
                    )
                  )
                  .map((w) => ({
                    ...w,
                    coin: w.net,
                    keys: {
                      publicKey: w.publicKey,
                      privateKeyEncoded: w.privateKeyEncoded,
                      mnemonicEncoded: w.mnemonicEncoded,
                    },
                  })),
                passwordHash: backup.value.passwordHash,
              },
            ])
          );
          oldFormat.value = true;
        }, 500);
      }
    };

    const setOldFormat = () => {
      setTimeout(() => {
        localStorage.setItem(oldBackupKey.value, JSON.stringify(backup.value));
        oldFormat.value = true;
      }, 500);
    };

    const finalStep = async () => {
      showModal.value = true;
      showLoader.value = true;
      const list = backup.value.privateWallets || backup.value.wallets;
      await Promise.all(
        list.map(async (wallet) => {
          if (wallet.net) {
            const newInstance = await store.dispatch(
              'crypto/createNewWalletInstance',
              { walletOpts: wallet }
            );
            await store.dispatch('wallets/pushWallets', {
              wallets: [newInstance],
            });
            newWallets.value.push(newInstance);
          }
        })
      );

      store.commit('crypto/setUserMnemonic', backup.value.mnemonic, {
        root: true,
      });
      await store.dispatch('app/setWallets', { addNotAddedWallets: true });
      store.commit('crypto/setPasswordHash', backup.value.passwordHash, {
        root: true,
      });
      const success = !![...newWallets.value].filter((w) => w).length;
      showModal.value = false;
      showLoader.value = false;

      if (success) {
        showModal.value = true;
      }

      await store.dispatch('wallets/getNewWallets', 'lazy');
      store.dispatch('wallets/getNewWallets', 'detail');
    };

    const redirectToNewWallet = () => {
      // eslint-disable-next-line
      const [wallet] = newWallets.value; // TODO

      newWallets.value = [];
      redirectToWallet({
        wallet: wallet,
        root: true,
      });
    };

    const modalCloseHandler = () => {
      showModal.value = false;
      redirectToNewWallet();
    };
    const modalClickHandler = () => {
      showModal.value = false;
      redirectToNewWallet();
    };

    return {
      setOldFormat,
      oldFormat,
      privateWalletsMode,
      steps,
      currentStep,
      showModal,
      showLoader,
      modalCloseHandler,
      modalClickHandler,
      setBackup,
      backup,
      finalStep,
      newWallets,
    };
  },
};
</script>
<style lang="scss" scoped>
.import-file {
  display: flex;
  flex-direction: column;
  background: $white;
  box-shadow: -10px 4px 27px rgba(0, 0, 0, 0.1);
  border-radius: 25px;
  padding: 0 44px 40px;
  flex-grow: 1;
  @include lg {
    padding: 0 40px 40px;
  }
  @include md {
    padding: 0 31px 40px;
    box-shadow: -10px 4px 24px rgba(0, 0, 0, 0.1);
  }

  &__section {
    display: flex;
    flex-grow: 1;
  }
}
</style>
