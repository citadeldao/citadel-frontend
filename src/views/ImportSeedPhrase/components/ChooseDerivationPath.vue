<template>
  <div v-if="wallets.length" class="choose-derivation-path">
    <div v-if="pathOptions.length > 1" class="autocomplete-wrap">
      <div class="autocomplete">
        <Select
          v-model="currentPath"
          :label="$t('importCustomPath.labelSelect')"
          icon="curve-arrow"
          :options="pathOptions"
          value-key="key"
          data-qa="settings__language-field"
          @change="selectCustomPathFormat"
        />
      </div>
    </div>
    <div class="choose-derivation-path__card-wrapper">
      <DerivationPathCard
        v-for="(wallet, key) in wallets"
        :key="key"
        :wallet="wallet.walletInstance"
        :exist="wallet.alreadyExist"
        :checked="checked(wallet.walletInstance)"
        @check="addSingleItem"
      />
      <div
        class="add-derivation__card"
        @click="generateNewPath"
        v-if="wallets.length < maxPaths"
      >
        <seedPhraseIcon class="initial-icon" />

        {{ $t('anotherAddress') }}
      </div>
    </div>
    <div class="choose-derivation-path__custom">
      <span>Custom</span>
      <DerivationPathCard
        v-if="customWallet"
        :wallet="customWallet.walletInstance"
        type="custom"
        :exist="customWallet.alreadyExist"
        :checked="checked(customWallet.walletInstance)"
        @changePath="setCustomWallet"
        @check="addSingleItem"
      />
    </div>
    <PrimaryButton :disabled="disabled" data-qa="Import" @click="clickHandler">
      {{ $t('import') }}
    </PrimaryButton>
  </div>
</template>

<script>
import seedPhraseIcon from '@/assets/icons/addAddressV2/seedphrase-type.svg';
import PrimaryButton from '@/components/UI/PrimaryButton';
import Select from '@/components/UI/Select';
import DerivationPathCard from '@/components/DerivationPathCard';
import useCheckItem from '@/compositions/useCheckItem';
import { useStore } from 'vuex';
import { ref, computed } from 'vue';
import { WALLET_TYPES } from '@/config/walletType';
import CryptoCoin from '@/models/CryptoCoin';

export default {
  name: 'ChooseDerivationPath',
  components: {
    PrimaryButton,
    DerivationPathCard,
    Select,
    seedPhraseIcon,
  },
  props: {
    walletOpts: {
      type: Object,
      default: () => {},
    },
  },
  emits: ['selectWallet'],
  setup(props, { emit }) {
    const { checked, addSingleItem, removeItem, checkedItems } = useCheckItem();
    const store = useStore();

    const currentPath = ref('');
    const pathOptions = ref(
      CryptoCoin.getDerivationPathTemplates(props.walletOpts.nets[0], 'seed')
    );
    const hasPathOptions = computed(() => pathOptions.value.length > 1);
    const numberOfPaths = ref(5);
    const wallets = ref([]);
    const isInvalid = ref(false);
    const maxPaths = ref(20);
    currentPath.value = pathOptions.value[0].key;

    const selectCustomPathFormat = (pathFormat) => {
      Promise.all(
        [...Array(numberOfPaths.value)].map((_, pathIndex) => {
          return store.dispatch('crypto/createWalletByMnemonic', {
            walletOpts: {
              //for polkadot
              derivationPath: hasPathOptions.value
                ? pathFormat.replace('N', pathIndex)
                : undefined,
              //for polkadot
              pathIndex: !hasPathOptions.value ? pathIndex : undefined,
              net: props.walletOpts.nets[0],
              ...props.walletOpts,
            },
            password: props.walletOpts.password,
          });
        })
      ).then((createdWallets) => (wallets.value = createdWallets));
    };

    selectCustomPathFormat(currentPath.value);

    const customWallet = ref(false);
    const setCustomWallet = (customPath) => {
      store
        .dispatch('crypto/createWalletByMnemonic', {
          walletOpts: {
            derivationPath: customPath,
            pathIndex:
              props.walletOpts.nets[0] === 'polkadot' && !customPath && 1,
            net: props.walletOpts.nets[0],
            ...props.walletOpts,
          },
          password: props.walletOpts.password,
        })
        .then((wallet) => {
          customWallet.value = wallet;
          addSingleItem(wallet.walletInstance);
          if (!customPath) {
            addSingleItem(wallets.value[0].walletInstance);
          }
          isInvalid.value = false;
        })
        .catch(() => {
          isInvalid.value = true;
          customWallet.value = false;
          setCustomWallet();
        });
    };
    setCustomWallet();

    const clickHandler = () => {
      emit('selectWallet', checkedItems.value[0]);
    };

    const disabled = computed(() => {
      const isChecked = checkedItems.value?.length;
      const foundAddress = store.getters['wallets/walletByAddress'](
        checkedItems.value[0]
      );
      const isExist =
        !!foundAddress && foundAddress.type !== WALLET_TYPES.PUBLIC_KEY;

      return !isChecked || isExist || isInvalid.value;
    });
    const generateNewPath = () => {
      if (numberOfPaths.value < maxPaths.value) {
        numberOfPaths.value++;
        selectCustomPathFormat(currentPath.value);
      }
    };
    return {
      maxPaths,
      generateNewPath,
      clickHandler,
      addSingleItem,
      removeItem,
      checked,
      wallets,
      setCustomWallet,
      customWallet,
      checkedItems,
      disabled,
      numberOfPaths,
      currentPath,
      pathOptions,
      selectCustomPathFormat,
    };
  },
};
</script>

<style lang="scss" scoped>
.choose-derivation-path {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
  padding-top: 80px;
  padding-left: 31px;

  .autocomplete-wrap {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    margin-bottom: 20px;
  }

  .autocomplete {
    width: 430px;
    height: 68px;
    position: relative;
    @include md {
      width: 483px;
    }
  }

  @include lg {
    padding-top: 32px;
    padding-left: 45px;
  }
  @include md {
    padding-top: 24px;
    padding-left: 24px;
  }
  &__card-wrapper {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 32px;
    @include lg {
      margin-bottom: 24px;
      gap: 8px;
    }
    @include md {
      margin-bottom: 16px;
      gap: 8px;
    }
  }
  &__custom {
    display: flex;
    flex-direction: column;
    margin-bottom: 32px;
    width: 100%;
    @include md {
      margin-bottom: 24px;
    }
    & span {
      font-size: 20px;
      line-height: 24px;
      font-family: 'Panton_Bold';
      margin-bottom: 27px;
      @include lg {
        margin-bottom: 11px;
      }
      @include md {
        margin-bottom: 11px;
      }
    }
  }
}
.add-derivation__card {
  width: 288px;
  height: 150px;
  border: 1px solid #c3ceeb;
  border-radius: 8px;
  padding: 24px 24px 21px 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  font-weight: 600;
  font-size: 18px;
  line-height: 22px;
  text-align: center;
  color: #6b93c0;
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
  svg {
    width: 40px;
    fill: $too-ligth-blue;
    &:hover {
      fill: $dark-blue;
    }
  }
}
</style>
