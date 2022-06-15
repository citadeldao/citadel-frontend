<template>
  <Modal>
    <!--Create VK Modal -->
    <ModalContent
      v-if="showConfirmModal"
      v-click-away="closeHandler"
      :title="$t('viewingKey.confirmOperation')"
      :desc="`${$t('viewingKey.addVkFor')} ${token.name}`"
      type="action"
      :submit-button="false"
      @close="closeHandler"
      @buttonClick="confirmClickHandler"
    >
      <div v-if="isConfirmModalLoading" class="loader">
        <Loading />
      </div>
      <div class="fields">
        <div class="field">
          <div class="fieldName">
            {{ $t('sendFrom') }}
          </div>
          <div>{{ address }}</div>
        </div>
        <div class="field">
          <div class="fieldName">
            {{ $t('fee') }}
          </div>
          <div>
            <span class="feeAmount">{{ tokenFee }}</span>
            <span class="feeSign">SCRT</span>
          </div>
        </div>
      </div>
      <div
        v-if="!isHardwareWallet(currentWallet.type)"
        class="createVkPassword"
      >
        <Input
          id="createVkPassword"
          v-model="password"
          :label="$t('viewingKey.passwordText')"
          type="password"
          icon="key"
          :placeholder="$t('password')"
          :error="inputError"
          @keyup.enter="confirmClickHandler"
        />
      </div>
      <div class="confirm-btn-wrapper">
        <PrimaryButton
          ref="primaryButton"
          :disabled="!!inputError"
          @click.stop="confirmClickHandler"
        >
          {{ $t(`confirm`) }}
        </PrimaryButton>
      </div>
      <div class="goToImportVk">
        {{ $t('viewingKey.iHaveVk') }}
        &nbsp;
        <span @click="goToImportVk">{{ $t('import') }}</span>
      </div>
    </ModalContent>

    <!-- Import VK MODAL -->
    <ModalContent
      v-if="showImportVkModal"
      v-click-away="closeHandler"
      :title="`${$t('viewingKey.importVk')} ${token.name}`"
      :desc="$t('viewingKey.enterYourVk')"
      button-text="confirm"
      type="action"
      :disabled="!!inputError || !!ivkInputError"
      @close="closeHandler"
      @buttonClick="confirmImportHandler"
    >
      <div v-if="isConfirmModalLoading" class="loader">
        <Loading />
      </div>
      <div class="vk-input">
        <Input
          id="importVkInput"
          v-model="ivk"
          :label="$t('viewingKey.viewingKey')"
          type="text"
          :hard-autocomplete-off="true"
          icon="key"
          :error="ivkInputError"
          @keyup.enter="confirmImportHandler"
        />
      </div>
      <div
        v-if="!isHardwareWallet(currentWallet.type)"
        class="createVkPassword"
        :class="{ 'mt-40': ivkInputError }"
      >
        <Input
          id="createVkPassword"
          v-model="password"
          :label="$t('viewingKey.passwordText')"
          type="password"
          :autocomplete="false"
          :hard-autocomplete-off="true"
          icon="key"
          :placeholder="$t('password')"
          :error="inputError"
          @keyup.enter="confirmImportHandler"
        />
      </div>
    </ModalContent>

    <!--Confirm Ledger Modals-->
    <ConnectLedgerModal
      v-if="showConnectLedgerModal"
      v-click-away="connectLedgerCloseHandler"
      :error="ledgerError"
      @close="connectLedgerCloseHandler"
      @buttonClick="connectLedgerClickHandler"
    />
    <OpenAppLedgerModal
      v-if="showAppLedgerModal"
      v-click-away="appLedgerCloseHandler"
      @close="appLedgerCloseHandler"
      @buttonClick="appLedgerClickHandler"
    />
    <ConfirmLedgerModal
      v-if="showConfirmLedgerModal"
      @close="confirmLedgerCloseHandler"
    />
    <RejectLedgerModal
      v-if="showRejectedLedgerModal"
      v-click-away="rejectedLedgerCloseHandler"
      @close="rejectedLedgerCloseHandler"
      @buttonClick="rejectedLedgerClickHandler"
    />

    <!--Error Modal -->
    <ModalContent
      v-if="txError"
      v-click-away="closeHandler"
      title="Warning"
      icon="warningIcon"
      :desc="txError"
      button-text="ok"
      type="warning"
      @close="closeHandler"
      @buttonClick="closeHandler"
    />
    <!--Success Modal -->
    <ModalContent
      v-if="showSuccessModal"
      v-click-away="successCloseHandler"
      title="Success"
      :desc="$t('sendModal.desc2')"
      button-text="ok"
      type="success"
      icon="success"
      @close="successCloseHandler"
      @buttonClick="successCloseHandler"
    >
      <SuccessModalContent
        :show-from="false"
        :wallet="token"
        :snip20-token="token"
        :tx-hash="[txHash]"
        :viewing-key="viewingKey"
      />
    </ModalContent>
  </Modal>
</template>
<script>
import { ref, provide, watch, inject } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { isHardwareWallet } from '@/config/walletType';
import Modal from '@/components/Modal';
import ModalContent from '@/components/ModalContent';
import SuccessModalContent from '@/views/Wallet/views/Send/components/SuccessModalContent';
import ConfirmLedgerModal from '@/components/Modals/Ledger/ConfirmLedgerModal';
import ConnectLedgerModal from '@/components/Modals/Ledger/ConnectLedgerModal';
import OpenAppLedgerModal from '@/components/Modals/Ledger/OpenAppLedgerModal';
import RejectLedgerModal from '@/components/Modals/Ledger/RejectLedgerModal';
import PrimaryButton from '@/components/UI/PrimaryButton';
import Input from '@/components/UI/Input';
import Loading from '@/components/Loading';
import useCheckPassword from '@/compositions/useCheckPassword';
import useLedger from '@/compositions/useLedger';
import redirectToWallet from '@/router/helpers/redirectToWallet';

export default {
  name: 'CreateVkModal',
  components: {
    Modal,
    ModalContent,
    Input,
    SuccessModalContent,
    Loading,
    ConfirmLedgerModal,
    ConnectLedgerModal,
    OpenAppLedgerModal,
    RejectLedgerModal,
    PrimaryButton,
  },
  props: {
    address: {
      type: String,
      required: true,
    },
    token: {
      type: Object,
      default: () => ({}),
    },
    tokenFee: {
      type: Number,
      default: 0.2,
    },
    currentWallet: {
      type: Object,
      default: () => ({}),
    },
    vkType: {
      type: String,
      default: 'simple',
    },
    redirect: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['close', 'success'],
  setup(props, { emit }) {
    // SNIP-20 logic
    const store = useStore();
    const { t } = useI18n();
    const citadel = inject('citadel');

    const showSuccessModal = ref(false);
    const showConfirmModal = ref(true); // should be true
    const showImportVkModal = ref(false);
    const isConfirmModalLoading = ref(false);
    const showFeeSelectModal = ref(false);
    const amount = ref('');
    const txError = ref('');
    const txHash = ref(''); // should be empty
    const viewingKey = ref(''); // should be empty
    const ivk = ref('');
    const ivkInputError = ref('');

    const { password, passwordError, inputError } = useCheckPassword();
    provide('inputError', inputError);

    const {
      showConnectLedgerModal,
      showConfirmLedgerModal,
      showAppLedgerModal,
      showRejectedLedgerModal,
      ledgerError,
      clearLedgerModals,
      ledgerErrorHandler,
      isLedgerWallet,
    } = useLedger();

    const goToImportVk = () => {
      showConfirmModal.value = false;
      showImportVkModal.value = true;
      password.value = '';
    };
    const confirmImportHandler = async () => {
      isConfirmModalLoading.value = true;
      let isError = false;

      if (passwordError.value && !isHardwareWallet(props.currentWallet.type)) {
        inputError.value = passwordError.value;
        isConfirmModalLoading.value = false;
        isError = true;
      }

      if (!ivk.value) {
        ivkInputError.value = t('viewingKey.incorrectKey');
        isConfirmModalLoading.value = false;
        isError = true;
      }

      if (isError) {
        return;
      }

      const { error } = await citadel.importViewingKey(
        props.currentWallet.id,
        props.token.net,
        ivk.value
      );

      if (error) {
        txError.value = error;
        showImportVkModal.value = false;

        return;
      }

      viewingKey.value = ivk.value;
      showImportVkModal.value = false;
      showSuccessModal.value = true;
      isConfirmModalLoading.value = false;

      // await store.dispatch('wallets/getNewWallets','lazy');
    };

    const closeHandler = async () => {
      password.value = '';
      inputError.value = false;
      txError.value = '';
      txHash.value = '';
      emit('close');
    };

    const successCloseHandler = async () => {
      emit('success');
      closeHandler();

      if (props.redirect) {
        await store.dispatch('subtokens/setCurrentToken', props.token);

        redirectToWallet({
          wallet: props.currentWallet,
          token: props.token,
          root: true,
        });
      }
    };

    const confirmClickHandler = async () => {
      if (passwordError.value && !isHardwareWallet(props.currentWallet.type)) {
        inputError.value = passwordError.value;

        return;
      }

      let error;
      let transactionHash;
      let vk;
      isConfirmModalLoading.value = true;

      if (!isHardwareWallet(props.currentWallet.type)) {
        const res = await citadel.setViewingKey(
          props.currentWallet.id,
          props.token.net,
          props.vkType,
          {
            privateKey: await props.currentWallet.getPrivateKeyDecoded(
              password.value
            ),
            fee: props.tokenFee,
          }
        );

        // eslint-disable-next-line prefer-destructuring
        error = res.error;
        // eslint-disable-next-line
        transactionHash = res?.data?.transactionHash;
        vk = res?.data?.viewingKey;
      } else {
        isConfirmModalLoading.value = false;
        showConfirmModal.value = false;
        clearLedgerModals();
        showConfirmLedgerModal.value = true;

        const { error: resError, data } = await citadel.setViewingKey(
          [props.currentWallet.id],
          props.token.net,
          props.vkType,
          {
            derivationPath: props.currentWallet.derivationPath,
            fee: props.tokenFee,
          }
        );

        showConfirmLedgerModal.value = false;
        error = resError;
        transactionHash = data?.transactionHash;
        vk = data?.viewingKey;
      }
      showConfirmModal.value = false;
      if (error) {
        if (isHardwareWallet(props.currentWallet.type)) {
          ledgerErrorHandler(error);
          clearLedgerModals();
        }
        txError.value = error;

        return;
      }
      viewingKey.value = vk;
      showSuccessModal.value = true;
      isConfirmModalLoading.value = false;

      await store.dispatch('wallets/getNewWallets', 'lazy');
      txHash.value = transactionHash;
    };

    watch(
      () => ivk.value,
      () => {
        ivkInputError.value = '';
      }
    );

    return {
      showConfirmModal,
      isConfirmModalLoading,
      showFeeSelectModal,
      password,
      passwordError,
      closeHandler,
      successCloseHandler,
      amount,
      txError,
      txHash,
      confirmClickHandler,
      inputError,
      viewingKey,
      isHardwareWallet,
      showConnectLedgerModal,
      showConfirmLedgerModal,
      showAppLedgerModal,
      showRejectedLedgerModal,
      ledgerError,
      clearLedgerModals,
      ledgerErrorHandler,
      isLedgerWallet,
      showImportVkModal,
      goToImportVk,
      confirmImportHandler,
      ivk,
      ivkInputError,
      showSuccessModal,
    };
  },
};
</script>

<style lang="scss" scoped>
.createVkPassword {
  height: 68px;
  margin-top: 19px;
  width: 100%;
}

.vk-input {
  height: 68px;
  margin-top: 19px;
  width: 100%;
}

.fields {
  width: 100%;
  margin-top: 15px;
  font-size: 14px;

  .field {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }

    .fieldName {
      color: $fieldName;
    }

    .feeAmount {
      color: $red;
      margin-right: 5px;
      font-weight: bold;
    }

    .feeSign {
      color: $fieldName;
      font-weight: 400;
    }
  }
}

.loader {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background: white;
  z-index: 10;
}

.confirm-btn-wrapper {
  margin-top: 32px;
}

.goToImportVk {
  display: flex;
  justify-content: center;
  margin-top: 17px;
  font-weight: 700;
  color: $too-dark-blue;

  span {
    color: $dark-blue;
    border-bottom: 1px solid $dark-blue;
    cursor: pointer;
  }
}

.mt-40 {
  margin-top: 40px;
}
</style>
