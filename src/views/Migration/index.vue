<template>
  <div class="migration-layout">
    <teleport to="body">
      <!-- CONFIRM RESOTRE ONESEED -->
      <Modal v-if="restoreOneSeedModalFlag">
        <ModalContent
          :submit-button="false"
          :hide-close="true"
          :button-text="$t('migration.restore')"
          :button-text2="$t('migration.skip')"
          @buttonClick="restoreSeed"
          @buttonClick2="skip"
          @close="restoreOneSeedModalFlag = false"
        >
          <div class="finish-container">
            <keep-alive>
              <component :is="finishIcon" />
            </keep-alive>
            <div class="finish-container__title">
              {{ $t('migration.finishTitle') }}
            </div>
            <div class="finish-container__description">
              {{ $t('migration.finishDescription') }}
            </div>
          </div>
        </ModalContent>
      </Modal>
      <!-- FORGOT PASSWORD -->
      <Modal v-if="forgotModalFlag">
        <ModalContent
          v-show="forgotModalFlag"
          :hide-close="true"
          type="warning"
          primary-main-bg-color="#FA3B33"
          primary-main-hover-bg-color="#CCC"
          :button-text="$t('migration.logout')"
          :button-text2="$t('migration.cancel')"
          :submit-button="false"
          @buttonClick="forgotHandler"
          @buttonClick2="
            forgotModalFlag = false;
            backupModalFlag = true;
          "
          @close="
            forgotModalFlag = false;
            backupModalFlag = true;
          "
        >
          <div class="forgot-container">
            <keep-alive>
              <component :is="forgotIcon" />
            </keep-alive>
            <div class="forgot-container__title">
              {{ $t('migration.forgotPassword') }}
            </div>
            <div class="forgot-container__description">
              {{ $t('migration.forgotDescription') }}
            </div>
            <Checkbox
              id="downloadCheck"
              :value="downloadCheck"
              :label="$t('migration.download')"
              @input="downloadCheck = !downloadCheck"
            />
          </div>
        </ModalContent>
      </Modal>
      <!-- WELCOME -->
      <Modal v-if="existOldBackup && welcomeModalFlag">
        <ModalContent
          v-show="welcomeModalFlag"
          button-text="save"
          :hide-close="true"
          :submit-button="false"
          @close="startMigration"
        >
          <div class="welcome-container">
            <keep-alive>
              <component :is="welcomeIcon" />
            </keep-alive>
            <div class="welcome-container__title">
              {{ $t('migration.welcomeTitle') }}
            </div>
            <div class="welcome-container__description">
              {{ $t('migration.welcomeDescription') }}
            </div>
            <PrimaryButton
              :style="{ marginTop: '30px' }"
              @click="startMigration"
            >
              {{ $t('migration.restore') }}
            </PrimaryButton>
          </div>
        </ModalContent>
      </Modal>
      <!-- EXIST OLD BACKUP -->
      <Modal v-if="existOldBackup && backupModalFlag">
        <ModalContent
          v-show="migrationModalFlag"
          :title="$t('migration.title')"
          :desc="$t('migration.description')"
          button-text="save"
          :hide-close="!privateWalletsMode"
          type="system"
          :submit-button="false"
          @close="
            migrationModalFlag = false;
            backupModalFlag = false;
            $router.push({ name: 'AddWalletTypes' });
          "
        >
          <div v-if="migrationProcess" class="loader-layout">
            <Loading />
          </div>
          <Migration
            :group-wallets-by-net="citadel2FormatWallets"
            @exportWallet="exportWallet"
          />
          <div class="input-wrapper">
            <Input
              id="password"
              v-model="migrationPassword"
              :label="$t('migration.backupPassword')"
              :placeholder="$t('password')"
              type="password"
              icon="key"
              :error="
                migrationError && passwordIncorrect ? 'Incorrect password' : ''
              "
              :show-error-text="true"
              @input="onChangeMigrationPassword"
            />
          </div>
          <div class="input-wrapper" v-if="privateWalletsMode">
            <Input
              id="mainPassword"
              v-model="password"
              :label="$t('enterPassword')"
              :placeholder="$t('password')"
              type="password"
              icon="key"
              :error="inputErrorExport"
              :show-error-text="true"
              @input="onChangeMainPassword"
            />
          </div>
          <div
            v-if="!privateWalletsMode"
            :class="{ incorrect: migrationError && passwordIncorrect }"
            class="forgot-password"
            @click="startForgot"
          >
            {{ $t('migration.forgotPassword') }}
          </div>
          <div v-if="!privateWalletsMode" class="migration-download">
            <keep-alive>
              <component :is="downloadIcon" />
            </keep-alive>
            <div @click="downLoadOldBackup">Download backup file</div>
          </div>
          <PrimaryButton
            :disabled="migrationProcess || migrationError"
            :style="{ marginTop: '30px' }"
            @click="importOldWallets"
            data-qa="Agree"
          >
            {{ $t('migration.agree') }}
          </PrimaryButton>
        </ModalContent>
        <!-- approve export -->
        <ModalContent
          v-if="showApproveModal"
          :title="$t('exportWallet.approveExportModalTitle1')"
          :desc="$t('exportWallet.approveExportModalDesc1')"
          type="action"
          button-text="show"
          :disabled="!!inputErrorExport"
          @close="approveModalCloseHandler"
          @buttonClick="approveExport"
        >
          <ApproveExport
            :current-export-wallet="currentExportWallet"
            @approveExport="approveExport"
          />
        </ModalContent>
        <!-- export private -->
        <ModalContent
          v-if="showExportModal"
          :title="$t('exportWallet.exportModalTitle1')"
          :desc="$t('exportWallet.exportModalDesc')"
          type="action"
          :submit-button="false"
          @close="exportModalCloseHandler"
        >
          <ExportModal
            current-export-method="privateKey"
            :private-key="decodedPrivateKey"
            :mnemonic-phrase="''"
          />
        </ModalContent>
      </Modal>
    </teleport>
  </div>
</template>
<script>
import Modal from '@/components/Modal';
import ModalContent from '@/components/ModalContent';
import PrimaryButton from '@/components/UI/PrimaryButton';
import Migration from '@/views/Migration/Addresses/index.vue';
import Input from '@/components/UI/Input';
import ExportModal from '@/views/Settings/components/ExportModal.vue';
import ApproveExport from '@/views/Settings/components/ApproveExport.vue';
import useCheckPassword from '@/compositions/useCheckPassword';
import useOldBackup from '@/compositions/useOldBackup';
import Loading from '@/components/Loading';
import Checkbox from '@/components/UI/Checkbox';
import router from '@/router';
import { sha3_256 } from 'js-sha3';
import { useStore } from 'vuex';
import { computed, provide, ref, markRaw, inject } from '@vue/runtime-core';
import useWallets from '@/compositions/useWallets';
import CryptoCoin from '@/models/CryptoCoin';

export default {
  name: 'MigrationLayout',
  components: {
    Checkbox,
    Loading,
    Input,
    ModalContent,
    Modal,
    PrimaryButton,
    Migration,
    ExportModal,
    ApproveExport,
  },
  props: {
    privateWalletsMode: {
      type: Boolean,
      default: false,
    },
    fromUploadFile: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const citadel = inject('citadel');
    const store = useStore();
    const forgotModalFlag = ref(false);
    const downloadCheck = ref(true);
    const migrationModalFlag = ref(true);
    const welcomeModalFlag = ref(true);
    const backupModalFlag = ref(false);
    const restoreOneSeedModalFlag = ref(false);
    const migrationProcess = ref(false);
    const showApproveModal = ref(false);
    const showExportModal = ref(false);
    const decodedPrivateKey = ref('');
    const currentExportWallet = ref('');
    const migrationPassword = ref('');

    const downloadIcon = ref();
    const welcomeIcon = ref();
    const forgotIcon = ref();
    const finishIcon = ref();

    const migrationError = ref(false);

    import(`@/assets/icons/download_backup.svg`).then((val) => {
      downloadIcon.value = markRaw(val.default);
    });
    import(`@/assets/icons/welcome.svg`).then((val) => {
      welcomeIcon.value = markRaw(val.default);
    });
    import(`@/assets/icons/forgot.svg`).then((val) => {
      forgotIcon.value = markRaw(val.default);
    });
    import(`@/assets/icons/migration-finish.svg`).then((val) => {
      finishIcon.value = markRaw(val.default);
    });

    const startForgot = () => {
      forgotModalFlag.value = true;
      backupModalFlag.value = false;
    };

    const forgotHandler = async () => {
      if (downloadCheck.value) {
        downLoadOldBackup();
      }

      localStorage.removeItem(oldBackupKey.value);
      window.location.reload();
    };

    const startMigration = () => {
      backupModalFlag.value = true;
      welcomeModalFlag.value = false;
    };

    const exportWallet = (exportWallet) => {
      currentExportWallet.value = exportWallet;
      showApproveModal.value = true;
      migrationModalFlag.value = false;
    };

    const approveModalCloseHandler = () => {
      showApproveModal.value = false;
      migrationModalFlag.value = true;
      updatePassword('');
    };

    const exportModalCloseHandler = () => {
      decodedPrivateKey.value = '';
      showApproveModal.value = false;
      showExportModal.value = false;
      migrationModalFlag.value = true;
      updatePassword('');
    };

    const {
      password,
      passwordError,
      inputError: inputErrorExport,
    } = useCheckPassword();
    const updatePassword = (value) => {
      password.value = value;
    };
    provide('password', password);
    provide('updatePassword', updatePassword);
    provide('inputError', inputErrorExport);

    const approveExport = async () => {
      if (sha3_256(password.value) !== oldPasswordHash.value) {
        inputErrorExport.value = passwordError.value;

        return;
      }

      showApproveModal.value = false;
      showExportModal.value = true;
      decodedPrivateKey.value =
        await currentExportWallet.value.getPrivateKeyDecoded(password.value);
    };

    const {
      existOldBackup,
      oldBackupKey,
      citadel2FormatWallets,
      oldPasswordHash,
      oldWallets,
      downLoadOldBackup,
    } = useOldBackup();

    if (props.fromUploadFile) {
      localStorage.removeItem(oldBackupKey.value);
    }

    const restoreSeed = () => {
      store.commit('crypto/setPasswordHash', oldPasswordHash.value);
      store.commit('crypto/setMigrationPassword', migrationPassword.value);
      router.push({ name: 'RestoreOneSeed' });
      restoreOneSeedModalFlag.value = false;
    };

    const skip = () => {
      store.commit('crypto/setPasswordHash', oldPasswordHash.value);
      store.commit('crypto/setMigrationPassword', migrationPassword.value);
      restoreOneSeedModalFlag.value = false;

      if (props.fromUploadFile) {
        window.location.href = '/overall';
      }
    };

    const passwordIncorrect = computed(
      () => sha3_256(migrationPassword.value) !== oldPasswordHash.value
    );

    const onChangeMigrationPassword = (val) => {
      migrationPassword.value = val;
      migrationError.value = false;
    };

    const onChangeMainPassword = () => {
      migrationError.value = false;
    };

    const importOldWallets = async () => {
      store.commit('newWallets/setLoader', true);
      migrationError.value = false;
      const newWallets = [];

      if (passwordIncorrect.value) {
        migrationError.value = true;
        store.commit('newWallets/setLoader', false);
        return;
      }

      if (passwordError.value && props.privateWalletsMode) {
        inputErrorExport.value = passwordError.value;
        migrationError.value = true;
        store.commit('newWallets/setLoader', false);
        return;
      }

      // put imported wallets to user settings

      for (const wallet of oldWallets.value) {
        if (wallet.net) {
          let formatedWallet = wallet;
          if (props.privateWalletsMode) {
            let privateKeyEncoded;
            if (wallet.privateKeyEncoded) {
              const privateKey = await citadel.decodePrivateKeyByPassword(
                wallet.net,
                wallet.privateKeyEncoded,
                migrationPassword.value
              );
              privateKeyEncoded = citadel.encodePrivateKeyByPassword(
                wallet.net,
                privateKey.data,
                password.value
              );
              formatedWallet.privateKeyEncoded = privateKeyEncoded.data;
            }
            if (wallet.mnemonicEncoded) {
              formatedWallet.mnemonicEncoded = privateKeyEncoded.data;
            }
            if (wallet.importedFromSeed) {
              const mnemonic = CryptoCoin.decodeMnemonic(
                wallet.importedFromSeed,
                migrationPassword.value
              );
              const encodeMnemonic = CryptoCoin.encodeMnemonic(
                mnemonic,
                password.value
              );
              formatedWallet.importedFromSeed = encodeMnemonic;
            }
          }
          // add import wallet to privateWallets
          const newInstance = await store.dispatch(
            'crypto/createNewWalletInstance',
            { walletOpts: formatedWallet }
          );
          await store.dispatch('wallets/pushWallets', {
            wallets: [newInstance],
          });
          newWallets.push(newInstance);
        }
      }

      await store.dispatch('app/setWallets', { addNotAddedWallets: true });
      // await store.dispatch('wallets/getNewWallets','lazy');

      if (props.privateWalletsMode) {
        backupModalFlag.value = false;
        localStorage.removeItem(oldBackupKey.value);
        const { wallets } = useWallets();
        //window.location.reload();
        if (wallets.value[0]) {
          store.commit('newWallets/setNewWalletsList', newWallets);
          await router.push({
            name: 'WalletAssets',
            params: {
              net: wallets.value[0].net,
              address: wallets.value[0].address,
            },
          });
          store.commit('newWallets/setLoader', false);
          store.commit('newWallets/setModal', true);
        }

        return;
      }

      localStorage.removeItem(oldBackupKey.value);
      restoreOneSeedModalFlag.value = true;
      backupModalFlag.value = false;
      store.commit('newWallets/setLoader', false);
    };

    if (props.privateWalletsMode) {
      startMigration();
    }

    return {
      onChangeMainPassword,
      password,
      forgotIcon,
      startForgot,
      forgotModalFlag,
      downloadCheck,
      forgotHandler,
      finishIcon,
      startMigration,
      welcomeModalFlag,
      backupModalFlag,
      welcomeIcon,
      inputErrorExport,
      passwordError,
      exportModalCloseHandler,
      approveExport,
      approveModalCloseHandler,
      currentExportWallet,
      exportWallet,
      showApproveModal,
      showExportModal,
      migrationProcess,
      restoreSeed,
      skip,
      decodedPrivateKey,
      passwordIncorrect,
      migrationPassword,
      onChangeMigrationPassword,
      migrationError,
      existOldBackup,
      oldBackupKey,
      downloadIcon,
      downLoadOldBackup,
      citadel2FormatWallets,
      importOldWallets,
      migrationModalFlag,
      restoreOneSeedModalFlag,
    };
  },
};
</script>
<style scoped lang="scss">
.loader-layout {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.input-wrapper {
  width: 100%;
  height: 70px;
  margin-top: 35px;
}
.forgot-password {
  width: 100%;
  text-align: left;
  cursor: pointer;
  margin-top: 22px;
  color: $mid-blue;
  font-size: 12px;
  font-family: 'Panton_Regular';

  &.incorrect {
    margin-top: 50px;
  }

  &:hover {
    opacity: 0.6;
  }
}

.migration-download {
  display: flex;
  align-items: center;
  color: $too-dark-blue;
  margin-top: 40px;

  div {
    margin-left: 10px;
    font-family: 'Panton_Bold';
    font-size: 18px;
    border-bottom: 1px solid $too-dark-blue;
    cursor: pointer;
  }
}

.migration-agree {
  margin-top: 15px;
}

.forgot-container,
.finish-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &__title {
    margin: 25px 0 10px;
    font-family: 'Panton_SemiBold';
    font-size: 20px;
    color: $black;
  }

  &__description {
    margin-top: 10px;
    margin-bottom: 12px;
    font-family: 'Panton_Regular';
    text-align: center;
    font-size: 16px;
    color: $mid-blue;
    line-height: 30px;
  }

  .migration-download {
    margin-top: 20px;

    div {
      font-family: 'Panton_SemiBold';
      border: none;
    }
  }
}

.welcome-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;

  svg {
    transform: scale(0.8);
  }

  &__title {
    font-family: 'Panton_Bold';
    font-size: 20px;
  }

  &__description {
    margin-top: 10px;
    font-family: 'Panton_Regular';
    text-align: center;
    font-size: 16px;
    color: $mid-blue;
    padding: 0 40px;
    line-height: 30px;
  }
}
</style>
