<template>
  <div class="message-info">
    <template v-if="messageForSign.meta_info">
      <div class="label description mt-20">
        {{ $t('extensions.signMessage') }}
      </div>
      <div class="meta-info">
        {{ messageForSign.meta_info }}
      </div>
    </template>
    <div class="flex-row">
      <div class="label description">Message data</div>
      <div>
        <div :class="{ open: showTx }" class="show" @click="showTx = !showTx">
          <keep-alive>
            <component
              :is="arrowDownIcon"
              :class="{ open: showTx }"
              class="arrow-icon"
            />
          </keep-alive>
        </div>
      </div>
    </div>
    <div v-if="showTx" class="item mt30">
      <div class="item-tx">
        <!--eslint-disable-next-line-->
        <pre>{{ JSON.stringify(messageForSign.message, null, 2) }}
        </pre>
      </div>
    </div>
    <div
      v-if="
        !msgSuccessSignature &&
        signerWallet &&
        PRIVATE_PASSWORD_TYPES.includes(signerWallet.type)
      "
      class="password-wrap"
    >
      <Input
        id="password-msg"
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
      />
    </div>
  </div>
</template>
<script>
import { ref, markRaw } from 'vue';
import Input from '@/components/UI/Input';
import { PRIVATE_PASSWORD_TYPES } from '@/config/walletType';

export default {
  name: 'MessageInfo',
  components: {
    Input,
  },
  props: {
    messageForSign: {
      type: Object,
      required: true,
    },
    msgSuccessSignature: {
      required: true,
    },
    incorrectPassword: {
      required: true,
    },
    confirmPassword: {
      required: true,
    },
    signerWallet: {
      required: true,
    },
  },
  setup(_, { emit }) {
    const password = ref('');
    const showTx = ref(false);
    const arrowDownIcon = ref('');

    import(`@/assets/icons/extensions/arrow_up.svg`).then((val) => {
      arrowDownIcon.value = markRaw(val.default);
    });

    const onChange = (val) => {
      emit('changePassword', val);
    };

    return {
      arrowDownIcon,
      showTx,
      password,
      PRIVATE_PASSWORD_TYPES,
      onChange,
    };
  },
};
</script>
<style lang="scss" scoped>
.message-info {
  width: 100%;

  .mt-20 {
    margin-top: 20px;
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

    svg {
      transform: rotate(90deg);
    }

    &.open {
      background: #4f70cf;

      svg {
        transform: rotate(0deg);
      }
    }
  }

  .flex-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0 0 0;
  }

  pre {
    display: block;
    unicode-bidi: embed;
    font-family: monospace;
    white-space: pre-wrap;
    color: #47697b;
    font-size: 12px;
  }

  .meta-info {
    margin-top: 10px;
  }

  .label.description {
    width: 100%;
    text-align: left;
    font-weight: 700;
    font-family: 'Panton_Bold';
  }

  .password-wrap {
    border-top: 1px solid #bcc2d8;
    width: 100%;
    height: 90px;
    margin-top: 20px;
    padding-top: 20px;
  }

  .item-tx {
    display: flex;
    justify-content: flex-start;
    overflow: auto;
    width: 100%;
    margin-top: 0;
    max-height: 260px;
    background: #d5e1fa52;
    border-radius: 8px;
  }
}

.item {
  margin: 18px 0;
  width: 100%;
  display: flex;

  .signature {
    word-break: break-word;
  }

  align-items: center;
  justify-content: space-between;

  &.mt30 {
    margin-top: 15px;
  }
}
</style>
