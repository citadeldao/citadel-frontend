<template>
  <div v-if="isloadingBalance || waiting" class="derivation-path-card">
    <Loading class="derivation-path-card-loader" />
  </div>
  <div
    v-else
    class="derivation-path-card"
    :class="{
      disabled: type !== 'custom' && exist,
      checked,
      custom: type === 'custom',
    }"
    @click="toggleChecked"
  >
    <div class="derivation-path-card__icon-mobile">
      <keep-alive>
        <component :is="icon" />
      </keep-alive>
    </div>
    <div class="derivation-path-card__wrapper1">
      <div class="derivation-path-card__section">
        <cardChecked v-if="exist" class="derivation-path-card__checked-icon" />
        <div class="derivation-path-card__icon">
          <keep-alive>
            <component :is="icon" />
          </keep-alive>
        </div>
        <div class="derivation-path-card__info">
          <span class="derivation-path-card__title">{{ name }}</span>
          <div v-if="type === 'custom'" class="derives-items">
            <div class="prefix-derive">
              {{ prefixDerivation }}
            </div>
            <div class="derives-separator">
              {{ separator }}
            </div>
            <input
              v-model="customFirst"
              class="derivation-path-card__input-mini"
              type="text"
              spellcheck="false"
              @blur="setCustomPath"
            />
            <div class="derives-separator">
              {{ separator }}
            </div>
            <input
              v-model="customSecond"
              class="derivation-path-card__input-mini"
              type="text"
              spellcheck="false"
              @blur="setCustomPath"
            />
            <div v-if="hasInitialCustomThird" class="derives-separator">
              {{ separator }}
            </div>
            <input
              v-if="hasInitialCustomThird"
              v-model="customThird"
              class="derivation-path-card__input-mini"
              type="text"
              spellcheck="false"
              @blur="setCustomPath"
            />
          </div>
          <span v-else class="derivation-path-card__path">
            {{ wallet.derivationPath }}
          </span>
        </div>
      </div>
      <div class="derivation-path-card__wrapper">
        <span class="derivation-path-card__address">{{
          wallet.getShortAddress(38)
        }}</span>
        <div class="derivation-path-card__balance-wrapper">
          <span
            v-pretty-number="{ value: balance, currency: wallet.code }"
            class="derivation-path-card__balance"
          />
          <span class="derivation-path-card__coin">
            {{ wallet.code }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, markRaw, watch, computed } from 'vue';
import debounce from 'lodash.debounce';
import { useWindowSize } from 'vue-window-size';
import { shortNameCrypto } from '@/helpers';
import Loading from '@/components/Loading';
import { screenWidths } from '@/config/sreenWidthThresholds';
import cardChecked from '@/assets/icons/card-checked.svg';
import CryptoCoin from '@/models/CryptoCoin';
import { WALLET_TYPES } from '@/config/walletType';
import notify from '@/plugins/notify';

export default {
  name: 'DerivationPathCard',
  components: { cardChecked, Loading },
  props: {
    type: {
      type: String,
    },
    checked: {
      type: Boolean,
    },
    wallet: {
      type: Object,
      default: null,
    },
    exist: {
      type: [Boolean, Object],
    },
    waiting: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['uncheck', 'check', 'changePath'],
  setup(props, { emit }) {
    const separator = computed(() =>
      props.wallet.net === 'polkadot' &&
      props.wallet.type !== WALLET_TYPES.LEDGER
        ? '//'
        : '/'
    );
    const balance = ref(null);
    const isloadingBalance = ref(false);
    const customPath = ref(props.wallet?.derivationPath);

    // check [m, 44, ...] after split and shifted NDX
    const shiftIndex = props.wallet?.derivationPath.includes('m') ? 0 : 1;
    const firstPiceIndexStart = computed(() =>
      props.wallet.net === 'polkadot' &&
      props.wallet.type !== WALLET_TYPES.LEDGER
        ? 2
        : 3
    );
    const secondPiceIndexStart = computed(() =>
      props.wallet.net === 'polkadot' &&
      props.wallet.type !== WALLET_TYPES.LEDGER
        ? 3
        : 4
    );
    const thirdPiceIndexStart = computed(() =>
      props.wallet.net === 'polkadot' &&
      props.wallet.type !== WALLET_TYPES.LEDGER
        ? 4
        : 5
    );

    // splited paths for change one item
    const customFirst = ref(
      props.wallet?.derivationPath?.split(separator.value)[
        firstPiceIndexStart.value - shiftIndex
      ]
    );
    const customSecond = ref(
      props.wallet?.derivationPath?.split(separator.value)[
        secondPiceIndexStart.value - shiftIndex
      ]
    );
    const customThird = ref(
      props.wallet?.derivationPath?.split(separator.value)[
        thirdPiceIndexStart.value - shiftIndex
      ]
    );
    const hasInitialCustomThird = ref(false);

    if (customThird.value) {
      hasInitialCustomThird.value = true;
    }

    // prefix not custom paths
    const prefixDerivation = computed(() => {
      if (props.wallet?.derivationPath) {
        return props.wallet?.derivationPath
          .split(separator.value)
          .slice(0, firstPiceIndexStart.value - shiftIndex)
          .join(separator.value);
      }

      return '';
    });

    const loadBalance = async (wallet) => {
      isloadingBalance.value = true;
      const { data: delegationBalance } = await CryptoCoin.getBalance({
        net: wallet.net,
        address: wallet.address,
      });
      balance.value = delegationBalance.calculatedBalance;
      isloadingBalance.value = false;
    };
    loadBalance(props.wallet);
    watch(
      () => props.wallet,
      (wallet, prevWallet) => {
        wallet.address !== prevWallet.address && loadBalance(wallet);
      }
    );

    const setCustomPath = () => {
      // old key with custom -customPath.value
      const thirdValue = customThird.value
        ? `${separator.value}${customThird.value}`
        : '';
      // concated prefix + paths
      const customPath = `${prefixDerivation.value}${separator.value}${customFirst.value}${separator.value}${customSecond.value}${thirdValue}`;
      const isPath = /^m?\/?44'?[/]/gm.test(customPath);

      if (
        (!customPath || !isPath) &&
        props.wallet.net !== 'polkadot' &&
        props.wallet.type !== WALLET_TYPES.LEDGER
      ) {
        // customPath.value = props.wallet?.derivationPath;
        customFirst.value = ref(
          props.wallet?.derivationPath?.split(separator.value)[
            firstPiceIndexStart.value - shiftIndex
          ]
        );
        customSecond.value = ref(
          props.wallet?.derivationPath?.split(separator.value)[
            secondPiceIndexStart.value - shiftIndex
          ]
        );
        customThird.value = ref(
          props.wallet?.derivationPath?.split(separator.value)[
            thirdPiceIndexStart.value - shiftIndex
          ]
        );

        return;
      }

      const customPathSplit = customPath.split(separator.value);
      const originalSplit = props.wallet?.derivationPath.split(separator.value);

      if (
        (customPathSplit[0] !== originalSplit[0] ||
          customPathSplit[1] !== originalSplit[1]) &&
        props.wallet.net !== 'polkadot' &&
        props.wallet.type !== WALLET_TYPES.LEDGER
      ) {
        notify({
          type: 'warning',
          text: `Invalid custom path ${customPath}`,
        });

        return;
      }

      props.wallet.derivationPath !== customPath &&
        emit('changePath', customPath);
    };

    const icon = ref();
    import(`@/assets/icons/token/${props.wallet.net}.svg`).then((val) => {
      icon.value = markRaw(val.default);
    });

    const toggleChecked = () => {
      if (props.type === 'custom' || !props.exist) {
        if (props.checked) {
          emit('uncheck', props.wallet);
        } else {
          emit('check', props.wallet);
        }
      }
    };

    const { width } = useWindowSize();
    const name = computed(() =>
      width.value >= screenWidths.lg
        ? shortNameCrypto(props.wallet.name)
        : props.wallet.name
    );

    return {
      icon,
      customPath,
      toggleChecked,
      balance,
      isloadingBalance,
      setCustomPath,
      name,
      prefixDerivation,
      customFirst,
      customSecond,
      customThird,
      hasInitialCustomThird,
      separator,
    };
  },
  methods: {
    debounce,
  },
};
</script>

<style lang="scss" scoped>
.derivation-path-card {
  width: 288px;
  height: 150px;
  background-color: $lavender;
  border-radius: 8px;
  padding: 24px 24px 21px 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  @include lg {
    width: 277px;
    padding: 16px 16px 13px 16px;
  }
  @include md {
    width: 100%;
    padding: 16px;
    height: 64px;
    flex-direction: row;
  }
  &.custom {
    width: 340px;
    background-color: $too-ligth-gray;
    .derivation-path-card__checked-icon {
      width: 28px;
      height: 28px;
      margin-top: -15px;
      // display: none;
    }
    @include md {
      width: 100%;
    }
  }
  &.custom:hover {
    background-color: $lavender;
  }
  &:hover {
    background-color: $too-ligth-blue;
    .derivation-path-card__address {
      color: $black;
    }
    .derivation-path-card__section {
      border-color: $darkgray;
    }
  }
  &__section {
    width: 100%;
    display: flex;
    padding-bottom: 14px;
    border-bottom: 1px solid $too-ligth-blue;
    margin-bottom: 10px;
    position: relative;
    @include md {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
  }
  &__checked-icon {
    position: absolute;
    right: 0;
    top: 0px;
    width: 24px;
    height: 24px;
    @include md {
      display: none;
    }
  }
  &__icon,
  &__icon-mobile {
    width: 46px;
    height: 46px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: $white;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    margin-right: 16px;
    fill: $mid-blue;
    @include md {
      display: none;
    }
    & svg {
      max-width: 24px;
      max-height: 24px;
      fill: $mid-blue;
    }
  }
  &__icon-mobile {
    /* display: none; */
    visibility: hidden;
    width: 32px;
    height: 32px;
    @include md {
      display: flex;
      visibility: visible;
    }
  }
  &__info {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    justify-content: center;
    @include md {
      width: 100%;
      flex-direction: row;
      justify-content: space-between;
      margin-bottom: 3px;
    }
  }
  &__title {
    font-size: 18px;
    line-height: 22px;
    color: $darkslategray;
    font-family: 'Panton_SemiBold';
    margin-bottom: 9px;
    @include md {
      font-size: 16px;
      line-height: 19px;
      margin-bottom: 0;
    }
  }
  &__path {
    font-size: 14px;
    line-height: 17px;
    font-family: 'Panton_SemiBold';
    color: $dark-blue;
  }
  &__wrapper {
    display: flex;
    flex-direction: column;
    @include md {
      flex-direction: row;
      justify-content: space-between;
    }
  }
  &__wrapper1 {
    padding-bottom: 15px;
    @include md {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      padding-bottom: 0;
    }
  }
  &__address {
    font-size: 12px;
    line-height: 14px;
    color: $mid-blue;
    margin-bottom: 8px;
    @include md {
      margin-bottom: 0;
    }
  }
  &__balance-wrapper {
    display: flex;
    align-items: baseline;
  }
  &__balance,
  &__coin {
    font-size: 12px;
    line-height: 14px;
    color: $ligth-blue;
    font-family: 'Panton_SemiBold' !important;
  }
  &__coin {
    color: $black;
    margin-left: 3px;
  }
  &-loader {
    zoom: 50%;
  }
  &__input {
    width: 100%;
    height: 30px;
    background: $too-ligth-blue;
    border-radius: 4px;
    border: none;
    color: $white;
    padding: 0px 9px;
    @include md {
      width: 150px;
      display: flex;
      justify-content: flex-end;
    }
  }

  &__input-mini {
    width: 40px;
    height: 26px;
    background: #4042e2;
    border-radius: 4px;
    border: none;
    color: $white;
    padding: 0px 9px;
    @include md {
      width: 40px;
      display: flex;
      justify-content: flex-end;
    }
  }

  .derives-items {
    display: flex;
    align-items: center;

    .derives-separator {
      color: #00a3ff;
      margin: 0 6px;
    }

    .prefix-derive {
      color: #00a3ff;
    }
  }
}

.disabled {
  background-color: $too-ligth-gray;
  .derivation-path-card__balance,
  .derivation-path-card__title,
  .derivation-path-card__path {
    color: $mid-blue;
  }
  .derivation-path-card__coin {
    color: $mid-gray;
  }
  @include md {
    background-image: url('~@/assets/images/checked.png');
    background-repeat: no-repeat;
    background-position: 318px center;
  }
  &:hover {
    background-color: $too-ligth-gray;
    .derivation-path-card__address {
      color: $mid-blue;
    }
    .derivation-path-card__section {
      border-color: $too-ligth-blue;
    }
  }
}

.custom {
  .derivation-path-card__title {
    margin-bottom: 0px;
  }
  .derivation-path-card__checked-icon {
    width: 16px;
    height: 16px;
  }
}

.checked,
.checked:hover {
  background-color: $too-dark-blue;
  .derivation-path-card__title,
  .derivation-path-card__coin,
  .derivation-path-card__path,
  .derivation-path-card__address {
    color: $white;
  }
  &.custom {
    background-color: $too-dark-blue;
  }
  &.custom .derivation-path-card__address {
    color: $too-ligth-blue;
  }

  .derivation-path-card__input {
    background: $royalblue;
    color: $white;
  }
  .derivation-path-card__section {
    border-color: $blue;
  }
  .derivation-path-card__balance {
    color: $ligth-blue;
  }
}
</style>
