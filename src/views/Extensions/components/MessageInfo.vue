<template>
  <div class="message-info">
    <div class="label description">
      {{ $t('extensions.signMessage') }}
    </div>
    <div class="item mt30">
      <div class="item-tx">
        <json-viewer :value="messageForSign.message" :expand-depth="5" sort />
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
import { ref } from 'vue';
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

    const onChange = (val) => {
      emit('changePassword', val);
    };

    return {
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

  .label.description {
    margin: 25px 0 0 0;
    width: 100%;
    text-align: left;
    font-weight: 700;
  }

  .password-wrap {
    border-top: 1px solid #bcc2d8;
    width: 100%;
    height: 90px;
    margin-top: 20px;
    padding-top: 20px;
  }

  .item-tx {
    overflow: auto;
    width: 100%;
    margin-top: 0;
    max-height: 260px;
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
