<template>
  <!--Create VK Modal -->
  <ModalContent
    v-bind="props"
    v-click-away="closeHandler"
    @close="closeHandler"
    @buttonClick="confirmClickHandler"
  >
    <div v-if="loading" class="loader">
      <Loading />
    </div>
    <div class="fields">
      <div class="field" v-if="appName">
        <div class="fieldName">
          {{ $t('app') }}
        </div>
        <div class="app-name">
          <img
            v-if="appIcon"
            :src="appIcon"
            width="22"
            height="22"
            class="app-icon"
          />{{ appName }}
        </div>
      </div>
      <div class="field">
        <div class="fieldName">
          {{ $t('sendFrom') }}
        </div>
        <div>{{ address }}</div>
      </div>
      <div class="field" v-if="!isKeplrWallet">
        <div class="fieldName">
          {{ $t('fee') }}
        </div>
        <div>
          <span class="feeAmount">{{ tokenFee }}</span>
          <span class="feeSign">SCRT</span>
        </div>
      </div>
      <LedgerProtocol
        v-if="currentWallet.type === WALLET_TYPES.LEDGER"
        class="mt-10"
      />
    </div>
    <form
      v-if="PRIVATE_PASSWORD_TYPES.includes(currentWallet.type)"
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
    </form>
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
</template>
<script>
import { ref, computed } from 'vue';
import { isHardwareWallet } from '@/config/walletType';
import ModalContent from '@/components/ModalContent';
import Input from '@/components/UI/Input';
import Loading from '@/components/Loading';
import useCheckPassword from '@/compositions/useCheckPassword';
import { WALLET_TYPES, PRIVATE_PASSWORD_TYPES } from '@/config/walletType';
import PrimaryButton from '@/components/UI/PrimaryButton';
import LedgerProtocol from '@/components/LedgerProtocol';

export default {
  name: 'CreateVkModal',
  components: {
    PrimaryButton,
    ModalContent,
    Input,
    Loading,
    LedgerProtocol,
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
      default: 0.002,
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
    appName: {
      type: String,
    },
    appIcon: {
      type: String,
    },
    loading: {
      type: Boolean,
    },
  },
  emits: ['close', 'success', 'goToImportVk', 'buttonClick'],
  setup(props, { emit }) {
    const isConfirmModalLoading = ref(false);
    const viewingKey = ref(''); // should be empty
    const isKeplrWallet = computed(
      () => props.currentWallet.type === WALLET_TYPES.KEPLR
    );

    const { password, passwordError, inputError } = useCheckPassword();

    const goToImportVk = () => {
      password.value = '';
      emit('goToImportVk');
    };

    const closeHandler = async () => {
      password.value = '';
      inputError.value = false;
      emit('close');
    };

    const confirmClickHandler = () => {
      if (
        passwordError.value &&
        !isHardwareWallet(props.currentWallet.type) &&
        props.currentWallet.type !== WALLET_TYPES.KEPLR
      ) {
        inputError.value = passwordError.value;
        return;
      }
      emit('buttonClick', password.value);
    };

    return {
      isConfirmModalLoading,
      password,
      passwordError,
      closeHandler,
      confirmClickHandler,
      inputError,
      viewingKey,
      isHardwareWallet,
      isKeplrWallet,
      goToImportVk,
      PRIVATE_PASSWORD_TYPES,
      props,
      WALLET_TYPES,
    };
  },
};
</script>

<style lang="scss" scoped>
.app-icon {
  vertical-align: middle;
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

.mt-10 {
  margin-top: 10px;
}

.app-name {
  color: #1a53f0;
  font-weight: 700;
}
.createVkPassword {
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

body.dark {
  .loader {
    background: transparent;
  }
  .goToImportVk {
    color: $white;
  }
  .fields {
    .field {
      color: $white;
    }
  }
}
</style>
