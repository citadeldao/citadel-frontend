<template>
  <ModalContent
    title="Bridge"
    :desc="$t('sendAssetsToAnotherNetwork')"
    :button-text="$t('send')"
    :loading="isLoading"
    :disabled="disabledForm"
    type="action"
    @close="closeHandler"
    @buttonClick="$emit('prepareBridge', transferParams)"
  >
    <div class="bridge">
      <div v-if="false" class="bridge__info-banner">
        <bannerInfo />
        <p>
          {{ $t('sendBannerInfo') }}<a href="#">{{ $t('link') }}</a
          >.
        </p>
      </div>
      <div class="bridge__autocomplete">
        <Select
          v-model="bridgeTargetNet"
          :label="$t('sendAssetsDestination')"
          icon="curve-arrow"
          :options="itemsNetworks"
          value-key="key"
          data-qa="send__destination-network-field"
          @change="selectBridgeNetwork"
          @click="showNetworkTargetWallets = false"
        />
      </div>
      <div
        class="bridge__section-input"
        v-click-away="() => (showNetworkTargetWallets = false)"
      >
        <Input
          id="to"
          v-model="toAddress"
          :label="$t('to')"
          type="text"
          icon="curve-arrow"
          :with-copy="true"
          :placeholder="$t('selectAddress')"
          :show-error-text="showErrorText"
          :error="incorrectAddress"
          data-qa="send__to-field"
          @focus="showNetworkTargetWallets = true"
        />
        <div
          v-if="showNetworkTargetWallets && networkTargetWallets.length"
          class="network-target-wallets"
        >
          <AddressItem
            v-for="(item, index) in networkTargetWallets"
            :key="`${item.address}${item.net}${index}`"
            :address="item"
            :last-child="index === networkTargetWallets.length - 1"
            :checked="false"
            @click.stop="setAddress(item)"
          />
        </div>
        <transition name="fade">
          <div v-if="incorrectAddress" class="bridge__section-error">
            <error class="bridge__section-error-icon" />
            <span class="bridge__section-error-text">
              {{ incorrectAddress }}
            </span>
          </div>
        </transition>
      </div>
      <div class="bridge__section-input">
        <Input
          id="amount"
          v-model="amount"
          type="currency"
          :decimals="currentWallet?.config?.decimals"
          :currency="currentWallet.code"
          :label="$t('amount')"
          :max="maxAmount"
          :disabled="
            incorrectAddress ||
            !toAddress ||
            !bridgeTargetNet ||
            maxAmount === 0 ||
            maxAmountParent === 0
          "
          placeholder="0.0"
          icon="coins"
          data-qa="send__amount-field"
          :show-set-max="maxAmountParent !== 0"
        />
        <transition name="fade">
          <div
            v-if="insufficientFunds"
            class="bridge__section-error"
            :class="{
              doNotHaveEnoughFunds: maxAmountParent === 0 || maxAmount === 0,
            }"
          >
            <error class="bridge__section-error-icon" />
            <span class="bridge__section-error-text">
              {{ insufficientFunds }}
            </span>
          </div>
        </transition>
      </div>
      <!-- memo -->
      <div
        v-if="
          !currentWallet.hideMemo &&
          !['eth', 'bsc'].includes(currentToken?.parentCoin?.net)
        "
        class="bridge__memo"
      >
        <div class="bridge__memo-toggle">
          <span class="bridge__memo-title">
            {{ $t('memo') }}
          </span>
          <el-tooltip
            placement="bottom"
            effect="rewards-list-tooltip"
            class="bridge__memo-tooltip"
          >
            <info />
            <template #content>
              <span class="bridge__memo-tooltip-text">{{
                $t('memoTooltip')
              }}</span>
            </template>
          </el-tooltip>
          <el-switch
            v-model="showMemo"
            active-color="#6a4bff"
            inactive-color="#dfe9f5"
            data-qa="bridge__memo-checkbox"
          />
        </div>
        <div v-if="showMemo" class="bridge__memo-input">
          <Input
            id="memo"
            v-model="memo"
            :label="$t('memo')"
            type="text"
            icon="text"
            :placeholder="$t('inputMemo')"
            :label-info="false"
            data-qa="bridge__memo-field"
          />
        </div>
        <div class="bridge__fee">
          Transaction Fee:
          <div class="amount">{{ fee.fee }}</div>
          <div class="symbol">
            {{ currentWallet.parentCoin?.code || currentWallet.code }}
          </div>
        </div>
      </div>
    </div>
  </ModalContent>
</template>
<script>
import Select from '@/components/UI/Select';
import ModalContent from '@/components/ModalContent';
import bannerInfo from '@/assets/icons/banner-info.svg';
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import Input from '@/components/UI/Input';
import AddressItem from '@/layouts/AddAddressLayout/components/CutomLists/components/AddressItem';
import { useWindowSize } from 'vue-window-size';
import { screenWidths } from '@/config/sreenWidthThresholds';
import error from '@/assets/icons/networks/error.svg';
import { useI18n } from 'vue-i18n';
import info from '@/assets/icons/info.svg';
import amountInputValidation from '@/helpers/amountInputValidation';

export default {
  components: {
    error,
    info,
    Select,
    Input,
    ModalContent,
    bannerInfo,
    AddressItem,
  },
  props: {
    isLoading: {
      required: true,
    },
    maxAmount: {
      required: true,
    },
    maxAmountParent: {
      required: true,
    },
    currentWallet: {
      required: true,
    },
    currentToken: {
      required: true,
    },
    itemsNetworks: {
      required: true,
    },
    networkTargetWallets: {
      required: true,
    },
    fee: {
      required: true,
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    const { width } = useWindowSize();
    const showErrorText = computed(() =>
      width.value < screenWidths.xl ? false : true
    );
    const showNetworkTargetWallets = ref(false);
    const bridgeTargetNet = ref(props.itemsNetworks[0].key);
    const toAddress = ref('');
    const amount = ref('');
    const memo = ref('');
    const showMemo = ref(false);

    const { t } = useI18n();

    const insufficientFunds = computed(() =>
      amountInputValidation({
        amount: amount.value,
        wallet: props.currentWallet,
        maxAmount: +props.maxAmount,
        type: 'send',
        maxAmountParent: +props.maxAmountParent,
      })
    );

    const incorrectAddress = computed(() => {
      // for networks that has not selfSend
      if (
        toAddress.value &&
        props.currentWallet.noSelfSend &&
        toAddress.value.toLowerCase() ===
          props.currentWallet.address.toLowerCase()
      ) {
        return t('noSelfSendError');
      }

      const networksConfig = computed(() => store.getters['networks/config']);

      const validateAddress = (address, validateNetwork) => {
        if (!toAddress.value) return false;

        const regExp = new RegExp(
          networksConfig.value[
            validateNetwork || bridgeTargetNet.value
          ].validating
        );

        return regExp.test(address);
      };

      return (
        toAddress.value &&
        !validateAddress(toAddress.value) &&
        t('messages.incorrectAddress')
      );
    });

    const closeHandler = () => {
      emit('close');
    };

    const setAddress = (item) => {
      toAddress.value = item.address;
      showNetworkTargetWallets.value = false;
    };

    const selectBridgeNetwork = async (key) => {
      // await getFees(key);
      bridgeTargetNet.value = key;
      toAddress.value = '';
      emit('selectBridgeNetwork', key);
    };

    const transferParams = computed(() => ({
      amount: amount.value,
      toAddress: toAddress.value,
      memo: memo.value,
      //for crossnetwork transfer
      token: props.currentWallet.net,
      toNetwork: bridgeTargetNet.value,
    }));

    const disabledForm = computed(() => {
      return (
        incorrectAddress.value ||
        insufficientFunds.value ||
        !amount.value ||
        !toAddress.value
      );
    });

    onMounted(() => {
      emit('selectBridgeNetwork', bridgeTargetNet.value);
      selectBridgeNetwork(bridgeTargetNet.value);
    });

    return {
      disabledForm,
      closeHandler,
      setAddress,
      showErrorText,
      incorrectAddress,
      selectBridgeNetwork,
      showNetworkTargetWallets,
      bridgeTargetNet,
      amount,
      memo,
      insufficientFunds,
      toAddress,
      showMemo,
      transferParams,
    };
  },
};
</script>
<style lang="scss" scoped>
.bridge {
  box-sizing: border-box;
  width: 520px;
  padding-top: 20px;

  &__autocomplete {
    width: 100%;
    height: 68px;
    margin-bottom: 23px;
    position: relative;
  }

  &__section-input {
    height: 68px;
    // width: 49.5%;
    margin-bottom: 23px;
    position: relative;

    @include lg {
      width: 100%;
      margin-bottom: 23px;
    }
    @include md {
      width: 100%;
      margin-bottom: 23px;
    }
  }

  &__section-error {
    display: flex;
    align-items: center;
    margin-top: 3px;
  }

  &__section-error-icon {
    margin-right: 8px;
    width: 19px;
  }

  &__section-muted-text,
  &__section-error-text {
    font-size: 14px;
    color: $red;
    font-family: 'Panton_Regular';
    @include lg {
      display: initial;
    }
    @include md {
      font-size: 12px;
      line-height: 14px;
    }
  }

  &__memo {
    display: flex;
    flex-direction: column;
    margin-top: 12px;
  }

  &__memo-title {
    font-weight: bold;
    margin-right: 8px;
    font-size: 18px;
  }

  &__memo-toggle {
    display: flex;
    margin-bottom: 15px;
    align-items: center;
  }

  &__memo-tooltip {
    margin-right: 26px;
  }

  &__memo-tooltip-text {
    font-size: 12px;
    color: $mid-blue;
    max-width: 178px;
    display: block;
  }

  &__memo-input {
    width: 100%;
    height: 68px;
    margin-bottom: 32px;
    @include lg {
      margin-bottom: 24px;
    }
  }

  &__fee {
    display: flex;
    align-items: center;
    color: #9e9e9e;
    font-size: 14px;

    .amount {
      color: #6b93c0;
      margin: 0 3px;
    }

    .symbol {
      color: #9e9e9e;
    }
  }

  &__info-banner {
    order: 1;
    width: 49.5%;
    max-width: 545px;
    margin-bottom: 40px;
    background: $banner-blue;
    border-radius: 8px;
    padding: 18px 12px 13px 19px;
    height: 100px;
    display: flex;

    & p {
      width: 457px;
      margin: 0px;
      font-size: 14px;
      line-height: 23px;
      color: $ligth-blue;
      @include lg {
        width: 473px;
      }
      @include md {
        line-height: 20px;
        width: 360px;
      }

      & a {
        color: $royalblue1;
        font-family: 'Panton_Bold';
      }
    }

    & svg {
      margin-right: 15px;
      width: 42px;
      height: 42px;
    }

    @include lg {
      order: 2;
      width: 100%;
      max-width: 573px;
      margin-bottom: 30px;
      padding: 18px 24px 13px 19px;
    }
    @include md {
      order: 2;
      width: 100%;
      max-width: 469px;
      margin-bottom: 16px;
      padding: 20px 16px 19px 19px;
    }
  }

  .network-target-wallets {
    width: 100%;
    z-index: 10;
    background: $white;
    padding: 10px 10px 0 10px;
    box-sizing: border-box;
    position: absolute;
    border-radius: 12px;
    border: 1px solid #c3ceeb;
    // border-top: none;
    top: 70px;
  }
}
</style>
