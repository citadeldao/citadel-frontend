<template>
  <div class="transaction-info">
    <div class="item mt30">
      <div class="label">{{ $t('extensions.typeOperation') }}</div>
      <span class="red">{{ extensionTransactionForSign?.type }}</span>
    </div>
    <div
      v-for="(meta, ndx) in extensionTransactionForSign?.meta_info"
      :key="ndx"
      class="item"
    >
      <template v-if="typeof meta.value === 'string'">
        <div class="label">
          {{ meta.title }}
        </div>
        <span>{{ meta.value }}</span>
      </template>
      <!-- object link + text -->
      <template v-if="typeof meta.value === 'object'">
        <div class="label">
          {{ meta.title }}
        </div>
        <a target="_blank" :href="meta.value.url"
          >{{ meta.value.text }} <linkIcon class="link-icon" /><linkIconHovered
            class="link-icon hovered"
        /></a>
      </template>
    </div>
    <div v-if="extensionTransactionForSign.fee" class="item">
      <div class="label">
        {{ $t('extensions.transactionFee') }}
      </div>
      <div>
        <span
          v-pretty-number="{
            value: extensionTransactionForSign.fee,
            currency: (signerWallet || metamaskSigner)?.code,
          }"
        />{{ (signerWallet || metamaskSigner)?.code }}
      </div>
    </div>
    <div class="item">
      <div class="label">
        {{ $t('extensions.transactionData') }}
      </div>
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
    <LedgerProtocol />
    <div class="item-tx">
      <!--eslint-disable-next-line-->
      <pre v-if="showTx && extensionTransactionForSign?.transaction">{{
          extensionTransactionForSign.messageScrt ||
          extensionTransactionForSign.transaction?.json ||
          extensionTransactionForSign.transaction
        }}
      </pre>
    </div>
    <div
      v-if="signerWallet && PRIVATE_PASSWORD_TYPES.includes(signerWallet.type)"
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
</template>
<script>
import Input from '@/components/UI/Input';

import linkIcon from '@/assets/icons/link.svg';
import linkIconHovered from '@/assets/icons/link_hovered.svg';
import LedgerProtocol from '@/components/LedgerProtocol';

import { PRIVATE_PASSWORD_TYPES } from '@/config/walletType';

import { ref, markRaw } from 'vue';

export default {
  name: 'TransactionInfo',
  components: {
    LedgerProtocol,
    linkIcon,
    linkIconHovered,
    Input,
  },
  props: {
    extensionTransactionForSign: {
      required: true,
    },
    signerWallet: {
      required: true,
    },
    metamaskSigner: {
      required: true,
    },
    incorrectPassword: {
      required: true,
    },
    confirmPassword: {
      required: true,
    },
  },
  setup(_, { emit }) {
    const showTx = ref(false);
    const password = ref('');
    const arrowDownIcon = ref();

    const onChange = (val) => {
      emit('changePassword', val);
    };

    import(`@/assets/icons/extensions/arrow_up.svg`).then((val) => {
      arrowDownIcon.value = markRaw(val.default);
    });

    return {
      showTx,
      PRIVATE_PASSWORD_TYPES,
      arrowDownIcon,
      password,
      onChange,
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
</style>
