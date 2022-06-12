<template>
  <div
    v-if="wallets.length"
    class="choose-derivation-path"
  >
    <div
      v-if="pathOptions.length > 1"
      class="autocomplete-wrap"
    >
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
    <PrimaryButton
      :disabled="disabled"
      data-qa="Import"
      @click="clickHandler"
    >
      {{ $t('import') }}
    </PrimaryButton>
  </div>
</template>

<script>
import PrimaryButton from '@/components/UI/PrimaryButton';
import Select from '@/components/UI/Select';
import DerivationPathCard from '@/components/DerivationPathCard';
import useCheckItem from '@/compositions/useCheckItem';
import { useStore } from 'vuex';
import { ref, computed, watch } from 'vue';
import { WALLET_TYPES } from '@/config/walletType';
import CryptoCoin from '@/models/CryptoCoin';

export default {
  name: 'ChooseDerivationPath',
  components: {
    PrimaryButton,
    DerivationPathCard,
    Select,
  },
  props: {
    walletOpts: {
      type: Object,
      default: ()=>{},
    },
  },
  emits: ['selectWallet'],
  setup(props, { emit }) {
    const { checked, addSingleItem, removeItem, checkedItems } = useCheckItem();
    const store = useStore();

    const allWallets = ref([]);
    const currentPath = ref('');
    const pathOptions = ref(CryptoCoin.getDerivationPathTemplates(props.walletOpts.nets[0], 'seed'));
    const numberOfPaths = 5;
    const wallets = ref([]);
    const isInvalid = ref(false);

    watch(allWallets, () => {
      Promise.all(allWallets.value.map(async (item, ndx) => {
        const balance = await CryptoCoin.getBalance({ net: props.walletOpts.nets[0], address: item.walletInstance.address });

        if (balance.data.mainBalance && !currentPath.value) {
          currentPath.value = item.templatePath;
          selectCustomPathFormat(currentPath.value);
        }

        // if 0 and end
        if (allWallets.value.length - 1 === ndx && !currentPath.value) {
          currentPath.value = pathOptions.value[0].key;
          selectCustomPathFormat(currentPath.value);
        }

        return balance;
      }));
    });

    const createDefaultWallets = () => {
      Promise.all(
        [...Array(numberOfPaths)].map((_, pathIndex) => {
          return store.dispatch('crypto/createWalletByMnemonic', {
            walletOpts: {
              pathIndex,
              net: props.walletOpts.nets[0],
              ...props.walletOpts,
            },
            password: props.walletOpts.password,
          });
        }),
      ).then((createdWallets) => (wallets.value = createdWallets));
    };

    const selectCustomPathFormat = pathFormat => {
      Promise.all(
        [...Array(numberOfPaths)].map((_, pathIndex) => {
          return store.dispatch('crypto/createWalletByMnemonic', {
            walletOpts: {
              derivationPath: pathFormat.replace('N', pathIndex),
              net: props.walletOpts.nets[0],
              ...props.walletOpts,
            },
            password: props.walletOpts.password,
          });
        }),
      ).then((createdWallets) => (wallets.value = createdWallets));
    };

    // when coins has walletTemplatesDerivation
    if (pathOptions.value.length > 1) {
      pathOptions.value.forEach(path => {
        Promise.all(
          [...Array(numberOfPaths)].map(async (_, pathIndex) => {
            const wallet = await store.dispatch('crypto/createWalletByMnemonic', {
              walletOpts: {
                derivationPath: path.key.replace('N', pathIndex),
                net: props.walletOpts.nets[0],
                ...props.walletOpts,
              },
              password: props.walletOpts.password,
            });
            wallet.templatePath = path.key;

            return wallet;
          }),
        ).then((createdWallets) => {
          allWallets.value = allWallets.value.concat(createdWallets);
        });
      });
    } else {
      // generate default wallets in all networks
      createDefaultWallets();
    }

    const customWallet = ref(false);
    const setCustomWallet = (customPath) => {
      store
        .dispatch('crypto/createWalletByMnemonic', {

          walletOpts: {
            derivationPath: customPath,
            pathIndex: props.walletOpts.nets[0] === 'polkadot' && !customPath && 1,
            net: props.walletOpts.nets[0],
            ...props.walletOpts,
          },
          password: props.walletOpts.password,
        })
        .then((wallet) => {
          customWallet.value = wallet;
          addSingleItem(wallet.walletInstance);
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
      const foundAddress = store.getters['wallets/walletByAddress'](checkedItems.value[0]);
      const isExist = !!foundAddress && foundAddress.type !== WALLET_TYPES.PUBLIC_KEY;

      return !isChecked || isExist || isInvalid.value;
    });

    return {
      clickHandler,
      addSingleItem,
      removeItem,
      checked,
      wallets,
      setCustomWallet,
      customWallet,
      checkedItems,
      disabled,

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
</style>
