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
    <div class="transaction-info">
      <div class="item mt30">
        <div class="label">Address</div>
        <span>{{ signerWallet.address }}</span>
      </div>
      <div class="item">
        <div class="label">Amount</div>
        <div>
          <span
            v-pretty-number="{
              value: !showBalance ? HIDE_BALANCE_MASK : 0.01,
              currency: signerWallet.code,
            }"
          />
          {{ signerWallet.code }}
        </div>
      </div>
      <div class="item">
        <div class="label">Transaction</div>
        <span class="red">{{ '0x2dfa..013a' }}</span>
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

import { ref, markRaw, computed, onMounted } from 'vue';
import ModalContent from '@/components/ModalContent';
import SelectSendFee from '@/views/Wallet/views/Send/components/Fee';
import useCurrentWalletRequests from '@/compositions/useCurrentWalletRequests';
import { HIDE_BALANCE_MASK } from '@/helpers/prettyNumber';
import { useStore } from 'vuex';

export default {
  name: 'TransactionInfo',
  components: {
    LedgerProtocol,
    ModalContent,
    Input,
    SelectSendFee,
  },
  props: {
    signerWallet: {
      required: true,
    },
    incorrectPassword: {
      required: true,
    },
    confirmPassword: {
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

    const { fees, getFees } = useCurrentWalletRequests();

    const showBalance = computed(() => store.getters['balance/showBalance']);

    const onChange = (val) => {
      emit('changePassword', val);
    };

    import(`@/assets/icons/extensions/arrow_up.svg`).then((val) => {
      arrowDownIcon.value = markRaw(val.default);
    });

    const confirmModalCloseHandlerWithRequest = () => {
      emit('close');
    };

    const onChangeFeeSend = (feeData) => {
      feeType.value = feeData;
      console.log('feeType', feeType.value);
    };

    const confirmClickHandler = () => {};

    onMounted(async () => {
      dataFee.value = await getFees(props.signerWallet.net);
    });

    return {
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

      div {
        color: #6b758e;
      }

      span {
        color: $white;
      }
    }

    pre {
      color: $white;
    }
  }
}
</style>
