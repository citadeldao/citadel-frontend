<template>
  <!-- Lib callback modal (send privateKey to lib) -->
  <Modal>
    <ModalContent
      :title="title"
      :desc="desc"
      button-text="confirm"
      type="action"
      :internal-icon="internalIcon"
      class="modal-content"
      @close="closeHandler"
      @buttonClick="clickHandler"
    >
      <div class="item mt30">
        <div class="label">{{ $t('extensions.typeOperation') }}</div>
        <span class="red">{{ $t('extensions.execute') }}</span>
      </div>
      <div class="item">
        <div class="label">
          {{ $t('extensions.transactionData') }}
        </div>
        <div class="show" @click="showTx = !showTx">
          {{ $t('extensions.showLabel') }}
          <keep-alive>
            <component
              :is="arrowDownIcon"
              :class="{ open: showTx }"
              class="arrow-icon"
            />
          </keep-alive>
        </div>
      </div>
      <pre v-if="showTx" class="item-tx">
          <highlightjs
            language="javascript"
            :code="JSON.stringify(libCallbackMessage).replaceAll(',', ', \n').replaceAll('{', '{ \n').replaceAll('}', '\n}')"
          />
        </pre>
      <div class="password-wrap">
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
        />
      </div>
    </ModalContent>
  </Modal>
</template>
<script>
import Modal from '@/components/Modal';
import ModalContent from '@/components/ModalContent';
import { sha3_256 } from 'js-sha3';
import { ref, markRaw, computed } from 'vue';
import { useStore } from 'vuex';
import { WALLET_TYPES } from '@/config/walletType';
import Input from '@/components/UI/Input';

export default {
  name: 'LibPasswordModal',
  components: { Modal, ModalContent, Input },
  props: {
    title: {
      type: String,
      default: '',
    },
    desc: {
      type: String,
      default: '',
    },
    internalIcon: {
      type: String,
      default: '',
    },
  },
  setup() {
    const store = useStore();
    const showTx = ref(false);
    const arrowDownIcon = ref();
    import(`@/assets/icons/extensions/arrow_down.svg`).then((val) => {
      arrowDownIcon.value = markRaw(val.default);
    });
    const password = ref('');
    const confirmPassword = ref(false);
    const incorrectPassword = computed(() => {
      return sha3_256(password.value) !== store.getters['crypto/passwordHash'];
    });

    const message = computed(() => store.getters['libCallback/message']);

    const clickHandler = () => {
      const walletId = store.getters['libCallback/walletId'];
      const wallet = store.getters['wallets/walletById'](walletId);
      const resolveCallbackPromise = store.getters['libCallback/resolve'];

      if (
        [WALLET_TYPES.ONE_SEED, WALLET_TYPES.PRIVATE_KEY].includes(wallet.type)
      ) {
        confirmPassword.value = true;
        if (incorrectPassword.value) {
          return;
        }
        resolveCallbackPromise({
          privateKey: wallet.getPrivateKeyDecoded(password.value),
          derivationPath: wallet.derivationPath,
        });
        confirmPassword.value = false;
        password.value = '';
        return;
      }
    };

    const closeHandler = () => {
      const rejectCallbackPromise = store.getters['libCallback/reject'];
      rejectCallbackPromise(new Error('Rejected by user'));
    };

    return {
      showTx,
      arrowDownIcon,
      password,
      incorrectPassword,
      confirmPassword,
      message,
      clickHandler,
      closeHandler,
    };
  },
};
</script>
<style scoped lang="scss">
.modal-content {
  .password-wrap {
    border-top: 1px solid #bcc2d8;
    width: 100%;
    height: 90px;
    margin-top: 20px;
    padding-top: 20px;
  }

  div.code {
    white-space: pre;
  }

  .item-tx {
    overflow: auto;
    width: 100%;
    margin-top: 0; // -35px;
    max-height: 260px;
  }

  .item {
    margin: 10px 0;
    width: 100%;
    display: flex;

    span {
      text-align: right;
    }

    align-items: center;
    justify-content: space-between;

    .arrow-icon {
      &.open {
        transform: rotate(180deg);
      }
    }

    .show {
      z-index: 0;
      color: #6b93c0;
      border-bottom: 1px dotted #6b93c0;
      text-transform: lowercase;
      cursor: pointer;
      display: flex;
      align-items: center;

      svg {
        margin-top: 2px;
        margin-left: 4px;
      }
    }

    .red {
      color: $red;
    }

    &.mt30 {
      margin-top: 30px;
    }
  }
}
</style>
