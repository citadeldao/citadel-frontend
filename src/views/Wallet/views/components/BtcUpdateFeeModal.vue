<template>
  <ModalContent
    title="Up transaction fee"
    desc="Speed ​​up the transaction by increasing the commission"
    button-text="confirm"
    type="action"
    :loading="signLoading"
    class="modal-content"
    @close="confirmModalCloseHandlerWithRequest"
    @buttonClick="confirmClickHandler"
  >
    <teleport to="body">
      <Modal v-if="showSuccessModal">
        <SuccessModal
          :close-success-modal="closeSuccessModal"
          :success-click-handler="successClickHandler"
          :wallet="signerWallet"
          :success-tx="successTx"
          @changeComment="onChangeComment"
        />
      </Modal>
      <Modal v-if="showLedgerConnect">
        <ConfirmLedgerModal
          v-if="showLedgerConnect"
          v-click-away="connectLedgerCloseHandler"
          @close="connectLedgerCloseHandler"
        />
      </Modal>
    </teleport>
    <div class="transaction-info">
      <div class="item mt30">
        <div class="label">Address</div>
        <span class="address">{{ signerWallet.address }}</span>
      </div>
      <div class="item">
        <div class="label">Amount</div>
        <div>
          <span
            v-pretty-number="{
              value: !showBalance ? HIDE_BALANCE_MASK : getBalance(txInfo),
              currency: signerWallet.code,
            }"
          />
          <span class="code">{{ signerWallet.code }}</span>
        </div>
      </div>
      <div class="item">
        <div class="label">Transaction</div>
        <span class="tx">{{
          `${txInfo.hash.slice(0, 5)}...${txInfo.hash.slice(-5)}`
        }}</span>
      </div>
      <div class="item min">
        <div class="label">Select fee</div>
        <div>
          <SelectSendFee
            v-if="dataFee"
            :fee-info="dataFee"
            :wallet="signerWallet"
            @changeFee="onChangeFeeSend"
          />
        </div>
      </div>
      <LedgerProtocol v-if="signerWallet.type === WALLET_TYPES.LEDGER" in-app />
      <div
        v-if="
          signerWallet && PRIVATE_PASSWORD_TYPES.includes(signerWallet.type)
        "
        class="password-wrap"
      >
        <Input
          id="password"
          v-model="password"
          :show-error-text="!!incorrectPassword && confirmPassword"
          :error="
            incorrectPassword && confirmPassword ? 'Incorrect password' : ''
          "
          :label="$t('enterPassword')"
          :placeholder="$t('password')"
          type="password"
          icon="key"
          @input="onChange"
          @keyup.enter="$emit('confirmInput')"
        />
      </div>
    </div>
  </ModalContent>
</template>
<script>
import Input from '@/components/UI/Input';

import LedgerProtocol from '@/components/LedgerProtocol';

import { PRIVATE_PASSWORD_TYPES, WALLET_TYPES } from '@/config/walletType';

import { ref, markRaw, computed, onMounted, watch } from 'vue';
import ModalContent from '@/components/ModalContent';
import SelectSendFee from '@/views/Wallet/views/Send/components/Fee';
import useCurrentWalletRequests from '@/compositions/useCurrentWalletRequests';
import { HIDE_BALANCE_MASK } from '@/helpers/prettyNumber';
import { useStore } from 'vuex';
import { sha3_256 } from 'js-sha3';
import ConfirmLedgerModal from '@/components/Modals/Ledger/ConfirmLedgerModal';
import Modal from '@/components/Modal';
import notify from '@/plugins/notify';

export default {
  name: 'TransactionInfo',
  components: {
    LedgerProtocol,
    ModalContent,
    Modal,
    Input,
    SelectSendFee,
    ConfirmLedgerModal,
  },
  props: {
    txInfo: {
      required: true,
    },
    signerWallet: {
      required: true,
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    const showTx = ref(false);
    const password = ref('');
    const arrowDownIcon = ref();
    const feeType = ref('');
    const signLoading = ref(false);
    const dataFee = ref(null);
    const confirmPassword = ref(false);
    const showLedgerConnect = ref(false);
    const showSuccessModal = ref(false);
    const successTx = ref('');
    const txComment = ref('');
    const toAddress = ref('');
    const amount = ref('');

    const {
      fees,
      getFees,
      rawTx,
      // rawTxError,
      prepareTransfer,
      // signAndSendTransfer,
      // txHash,
      // txError,
    } = useCurrentWalletRequests();

    const connectLedgerCloseHandler = () => {
      showLedgerConnect.value = false;
    };

    const clearStates = () => {
      confirmPassword.value = false;
      showSuccessModal.value = false;
      successTx.value = '';
      password.value = '';
    };

    const incorrectPassword = computed(() => {
      return sha3_256(password.value) !== store.getters['crypto/passwordHash'];
    });

    const showBalance = computed(() => store.getters['balance/showBalance']);

    const onChange = (val) => {
      emit('changePassword', val);
    };

    import(`@/assets/icons/extensions/arrow_up.svg`).then((val) => {
      arrowDownIcon.value = markRaw(val.default);
    });

    const confirmModalCloseHandler = () => {
      password.value = '';
    };

    const confirmModalCloseHandlerWithRequest = () => {
      emit('close');
    };

    const onChangeFeeSend = async (feeData) => {
      feeType.value = feeData;
      const fee = dataFee.value[feeType.value]?.fee;

      console.log('TX FEE', fee);
      await prepareTransfer({
        replaceHash: props.txInfo.hash,
        toAddress: toAddress.value,
        amount: amount.value,
        fee,
      });
      // const { data } = await props.signerWallet.prepareTransfer({
      //   walletId: props.signerWallet.id,
      //   options: {
      //     replaceHash: props.txInfo.hash,
      //     fee,
      //   },
      // });
      // console.log('prepare', data);
    };

    const getBalance = (item) => {
      const amountType = item.view[0]?.components.find(
        (comp) => comp.type === 'amount'
      );
      if (amountType) {
        return amountType.value?.text || 0;
      }
      return '?';
    };

    const confirmClickHandler = async () => {
      console.log('rawTx.value', rawTx.value);
      confirmPassword.value = true;

      signLoading.value = true;

      if (
        PRIVATE_PASSWORD_TYPES.includes(props.signerWallet.type) &&
        incorrectPassword.value
      ) {
        signLoading.value = false;
        return;
      }

      if (props.signerWallet.type === WALLET_TYPES.LEDGER) {
        showLedgerConnect.value = true;
      }

      const result = await props.signerWallet.signAndSendTransfer({
        walletId: props.signerWallet.id,
        rawTransaction: rawTx.value, // rawtx
        privateKey:
          password.value &&
          (await props.signerWallet.getPrivateKeyDecoded(password.value)),
        derivationPath: props.signerWallet.derivationPath,
        proxy: false,
      });
      console.log(result);

      if (result.data) {
        successTx.value = result.data;
        signLoading.value = false;
        showLedgerConnect.value = false;
        confirmModalCloseHandler();
        // showSuccessModal.value = true;
        notify({
          type: 'success',
          text: 'Transaction fee has been successfully increased',
        });
        emit('close');
      } else {
        signLoading.value = false;
        showLedgerConnect.value = false;
        confirmModalCloseHandler();
        clearStates();
        emit('close');
      }
    };

    const successClickHandler = async () => {
      txComment.value &&
        (await store.dispatch('transactions/postTransactionNote', {
          network: props.signerWallet.net,
          hash: successTx.value[0],
          text: txComment.value,
        }));
      txComment.value = '';

      clearStates();
    };

    const onChangeComment = (comm) => {
      txComment.value = comm;
    };

    const closeSuccessModal = () => {
      clearStates();
    };

    watch(
      () => props.txInfo,
      () => {
        if (!props.txInfo.inMempool) {
          emit('close');
        }
      }
    );

    onMounted(async () => {
      dataFee.value = await getFees(props.signerWallet.net);

      const addressType = props.txInfo.view[0]?.components.find(
        (comp) => comp.type === 'textWithURL'
      );
      if (addressType) {
        toAddress.value = addressType.value?.text;
      } else {
        toAddress.value = props.signerWallet.address;
      }
      amount.value = getBalance(props.txInfo);
    });

    return {
      closeSuccessModal,
      onChangeComment,
      successClickHandler,
      showSuccessModal,
      successTx,
      connectLedgerCloseHandler,
      showLedgerConnect,
      confirmPassword,
      incorrectPassword,
      getBalance,
      showBalance,
      HIDE_BALANCE_MASK,
      dataFee,
      feeType,
      signLoading,
      fees,
      showTx,
      PRIVATE_PASSWORD_TYPES,
      WALLET_TYPES,
      arrowDownIcon,
      password,
      confirmClickHandler,
      onChange,
      onChangeFeeSend,
      confirmModalCloseHandlerWithRequest,
    };
  },
};
</script>
<style lang="scss">
.transaction-info {
  width: 100%;

  .password-wrap {
    border-top: 1px solid #bcc2d8;
    width: 100%;
    height: 90px;
    margin-top: 20px;
    padding-top: 20px;
  }

  div.code {
    // white-space: pre;
  }

  .item-tx {
    overflow: auto;
    width: 100%;
    margin-top: 0;
    max-height: 260px;
    background: #d5e1fa52;
    border-radius: 8px;
  }

  pre {
    display: block;
    unicode-bidi: embed;
    font-family: monospace;
    white-space: pre-wrap;
    color: #47697b;
    font-size: 12px;
  }
}

.item {
  margin: 18px 0;
  width: 100%;
  display: flex;

  .address {
    font-size: 14px;
    font-family: Panton_SemiBold;
    color: #6b758e;
  }

  span.code {
    color: $dark-blue;
  }

  span.tx {
    color: #6b93c0;
  }

  &.min {
    min-height: 50px;
    height: 50px;
  }

  .signature {
    word-break: break-word;
  }

  span {
    text-align: right;
  }

  align-items: center;
  justify-content: space-between;

  a {
    text-decoration: none;
    text-decoration: underline;
    color: #437fec;

    .link-icon {
      width: 18px;
      height: 16px;
      margin-left: 5px;

      &.hovered {
        display: none;
      }
    }

    &:hover {
      color: pointer;
      color: #756aa8;

      .link-icon {
        display: none;

        &.hovered {
          display: initial;
        }
      }
    }
  }

  .arrow-icon {
    &.open {
      transform: rotate(0deg);
    }
  }

  .show {
    width: 32px;
    height: 32px;
    background: #6a4bff;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    &.open {
      background: #4f70cf;
    }

    svg {
      transform: rotate(90deg);
      fill: $white !important;
    }
  }

  .red {
    color: $red;
  }

  &.mt30 {
    margin-top: 30px;
  }
}

body.dark {
  .transaction-info {
    .item {
      .label {
        color: #6b758e;
      }

      .code {
        color: $dark-blue;
      }

      div {
        color: #6b758e;
      }

      span {
        color: $white;
      }

      .address {
        color: #6b758e;
      }

      span.tx {
        color: #6b93c0;
      }
    }

    pre {
      color: $white;
    }
  }
}
</style>
