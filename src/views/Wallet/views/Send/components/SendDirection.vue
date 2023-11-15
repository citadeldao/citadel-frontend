<template>
  <div class="send-direction">
    <div v-if="showFrom" class="send-direction__line">
      <span class="send-direction__line-title">{{ $t('sendFrom') }}: </span>
      <span class="send-direction__line-from">
        {{ getMiddleCutText(dynamicAddress) }}
      </span>
    </div>
    <div v-if="to" class="send-direction__line">
      <span class="send-direction__line-title"> {{ $t('sendTo') }}: </span>
      <span class="send-direction__line-to">
        {{ getMiddleCutText(to) }}
      </span>
    </div>
    <div
      v-if="(amount || amount == 0) && !viewingKey"
      class="send-direction__line"
    >
      <span class="send-direction__line-title"> {{ $t('amount') }}: </span>
      <div>
        <span
          v-pretty-number="{ value: amount, currency: wallet?.code }"
          class="send-direction__line-amount"
        />
        <span class="send-direction__line-currency"> {{ wallet?.code }} </span>
      </div>
    </div>
    <div v-if="fee || currentWallet?.hasResource" class="send-direction__line">
      <span class="send-direction__line-title"> {{ $t('fee') }}: </span>
      <div v-if="currentWallet?.hasResource && Object.keys(adding).length">
        <div
          class="send-direction__resource-item"
          v-for="item in adding"
          :key="item.name"
        >
          <span
            v-pretty-number="item.current || item.value"
            class="send-direction__line-fee-amount"
          />
          <span class="send-direction__line-currency">
            {{ item.nameForUser }}
          </span>
        </div>
      </div>
      <div v-else>
        <span
          v-pretty-number="{ value: 0, currency: wallet?.code }"
          class="send-direction__line-fee-amount"
        />
        <span class="send-direction__line-currency">
          {{ currentToken ? currentToken.parentCoin.code : wallet?.code }}
        </span>
      </div>
    </div>
    <div v-if="memo" class="send-direction__line">
      <span class="send-direction__line-title">{{ $t('memo') }}: </span>
      <span
        v-pretty-number="{ value: memo, noPretty: true }"
        class="send-direction__line-memo"
      >
        {{ memo }}
      </span>
    </div>
    <div v-if="viewingKey" class="send-direction__vk">
      <div class="vk__title">{{ $t('viewingKey.vkFor') }} {{ tokenName }}</div>
      <div class="vk__val">
        <span>{{ viewingKeyParsed }}</span>
        <div class="vk__btns">
          <div class="vk__eye-btn" @click="handleClick">
            <vision v-if="isVkHidden === true" class="vk__eye-svg" />
            <hide v-else class="vk__eye-svg" />
          </div>
          <div class="vk__copy-btn" @click="copyValue">
            <transition name="fade1">
              <span v-if="isCopied" class="tooltip">
                {{ $t('copiedToClipboard') }}
              </span>
            </transition>
            <copyIcon class="vk__copy-svg" />
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="feeInfo && currentWallet?.hasResource"
      class="send-direction__needed-resources"
    >
      <span
        v-pretty-number="{
          value: feeInfo,
          currency: currentToken ? currentToken.parentCoin.code : wallet?.code,
        }"
        class="send-direction__needed-resources-amount"
      />
      <span class="send-direction__needed-resources-currency">
        {{ currentToken ? currentToken.parentCoin.code : wallet?.code }}
        {{ $t('neededResources') }}
      </span>
    </div>

    <span class="send-direction__line-title flex-column">
      <div v-for="item in txUrl" :key="item" class="send-direction__line">
        {{ $t('viewTranscasction')
        }}<a :href="item" target="_blank">
          <linkIcon class="send-direction__link-icon"
        /></a>
      </div>
    </span>
  </div>
</template>

<script>
import { getMiddleCutText } from '@/helpers';
import linkIcon from '@/assets/icons/link.svg';
import vision from '@/assets/icons/networks/vision.svg';
import hide from '@/assets/icons/networks/hide.svg';
import copyIcon from '@/assets/icons/copyIcon.svg';
import copyToClipboard from '@/helpers/copyToClipboard';
import { computed, inject, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'SendDirection',
  components: { linkIcon, vision, copyIcon, hide },
  props: {
    to: {
      type: String,
    },
    amount: {
      type: [String, Number],
    },
    memo: {
      type: String,
      default: '',
    },
    wallet: {
      type: Object,
    },
    txHash: {
      type: Array,
      default: () => [],
    },
    fee: {},
    viewingKey: {},
    showFrom: {
      type: Boolean,
      default: true,
    },
    tokenName: {},
    currentToken: {
      type: [Object, null],
      default: null,
    },
    adding: {
      type: Object,
      default: () => ({}),
    },
    feeInfo: {
      type: Number,
      default: 0,
    },
    mode: {
      type: String,
      default: '',
    },
    activeTab: {
      type: String,
      default: '',
    },
    redelegationNodeAddress: {
      type: String,
      default: '',
    },
    currentWallet: {
      type: Object,
    },
  },

  setup(props) {
    const store = useStore();
    const isMultiple = inject('isMultiple');
    const currentKtAddress = inject('currentKtAddress');

    const txUrl = computed(() => {
      const data = [];

      if (props.txHash) {
        const filteredData = props.txHash?.filter((item) => item);

        for (const item of filteredData) {
          data.push(props.wallet?.getTxUrl(props.wallet.id, item));
        }
      }

      return data;
    });

    const selectedBtcAddressType = computed(
      () => store.getters['btcAddresses/selectedBtcAddressType']
    );

    const isVkHidden = ref(true);
    const handleClick = () => {
      isVkHidden.value = !isVkHidden.value;
    };
    const viewingKeyParsed = computed(() => {
      if (isVkHidden.value) {
        return props.viewingKey.replace(/[\d\D]/g, '*');
      }

      return props.viewingKey;
    });
    const isCopied = ref(false);
    const copyValue = () => {
      copyToClipboard(props.viewingKey);
      isCopied.value = true;
      setTimeout(() => {
        isCopied.value = false;
      }, 1500);
    };
    const address = computed(() =>
      (props.activeTab === 'redelegate' || props.mode === 'redelegate') &&
      !isMultiple.value
        ? props.redelegationNodeAddress
        : currentKtAddress.value
        ? currentKtAddress.value.address
        : props.wallet?.address
    );

    const dynamicAddress = computed(() => {
      if (props.wallet.net === 'btc' && selectedBtcAddressType.value) {
        if (selectedBtcAddressType.value === 'segwit')
          return props.wallet.segwitAddress;
        if (selectedBtcAddressType.value === 'native')
          return props.wallet.nativeAddress;
      }
      return address.value;
    });

    return {
      txUrl,
      isVkHidden,
      viewingKeyParsed,
      handleClick,
      copyValue,
      isCopied,
      address,
      getMiddleCutText,
      dynamicAddress,
    };
  },
};
</script>

<style lang="scss" scoped>
.send-direction {
  display: flex;
  flex-direction: column;
  &__resource-item {
    &:not(:last-child) {
      margin-right: 5px;
    }
  }
  &__line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 8px;
    text-decoration: none;
    color: inherit;
    a {
      line-height: initial;
    }
    & svg {
      margin-left: 10px;
    }

    &:first-child {
      margin-top: 0;
    }
  }

  &__needed-resources {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  &__needed-resources-amount,
  &__needed-resources-currency {
    font-size: 12px;
    line-height: 14px;
    color: $gray;
  }

  &__needed-resources-amount {
    margin-right: 3px;
    font-family: 'Panton_Bold' !important;
    color: $slategray;
  }

  &__line-title {
    font-size: 14px;
    line-height: 30px;
    color: $gray;
    display: flex;
    align-items: center;

    &.flex-column {
      align-items: flex-start;
      flex-direction: column;
    }
  }

  &__link-icon {
    width: 17px;
    height: 15px;
  }

  &__line-from,
  &__line-to {
    font-size: 14px;
    line-height: 30px;
  }

  &__line-memo {
    font-size: 14px;
    height: auto;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-left: 10px;
    line-height: 1.2;
  }

  &__line-to {
    color: $blue;
  }

  &__line-amount,
  &__line-fee-amount {
    font-family: 'Panton_Bold' !important;
    font-size: 14px;
    line-height: 19px;
    color: $blue;
  }

  &__line-fee-amount {
    color: $red;
  }

  &__line-currency {
    font-size: 14px;
    line-height: 17px;
    color: $gray;
  }

  &__vk {
  }

  .vk {
    &__title {
      font-weight: 700;
      font-size: 18px;
      color: $too-dark-blue;
    }

    &__val {
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      span {
        font-size: 14px;
        color: $blue;
        max-width: 396px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    &__btns {
      display: flex;
    }

    &__eye-btn {
      margin-right: 8px;
      height: 40px;
      width: 40px;
      background-color: $blue;
      justify-content: center;
      align-items: center;
      display: flex;
      border-radius: 4px;
      cursor: pointer;
    }

    &__eye-svg {
      height: 25px;
      width: 20px;
      fill: $white;
      pointer-events: none;
    }

    &__copy-btn {
      position: relative;
      margin-right: 8px;
      height: 40px;
      width: 40px;
      background-color: $too-ligth-gray;
      justify-content: center;
      align-items: center;
      display: flex;
      border-radius: 4px;
      cursor: pointer;
    }

    &__copy-svg {
      height: 20px;
      width: 20px;
      fill: $ligth-blue;
      pointer-events: none;
    }
  }

  .tooltip {
    background-color: $too-ligth-gray;
    text-align: center;
    border-radius: 6px;
    padding: 8px 9px;
    position: absolute;
    white-space: nowrap;
    z-index: 1;
    top: 110%;
    left: 50%;
    margin-left: -60px;
    box-shadow: 0px 4px 25px rgba(63, 54, 137, 0.25);
    border-radius: 6px;
    font-size: 12px;
    line-height: 16px;
    color: $too-dark-blue;

    &::after {
      content: '';
      position: absolute;
      bottom: 98%;
      left: 50%;
      margin-left: -5px;
      border-width: 5px;
      border-radius: 2px;
      border-style: solid;
      border-color: transparent transparent $too-ligth-gray transparent;
    }
  }
}

body.dark {
  .send-direction__vk {
    .vk__title {
      color: $white;
    }
  }
  .vk {
    &__copy-btn {
      background: #30468e5c;
    }
  }
  .send-direction {
    &__line-title {
      color: #6b758e;
    }

    &__line-memo {
      color: $white;
    }

    &__line-from {
      color: $white;
    }

    &__line-to {
      color: #00a3ff;
    }

    &__line-amount {
      color: #00a3ff;
    }

    &__line-currency {
      color: #6b758e;
    }
  }
}
</style>
