<template>
  <div class="keplr">
    <Header :title="$t('keplr.addTitle')" :info="$t('keplr.addInfo')" />
    <Modal v-if="loadingImport">
      <Loading />
    </Modal>
    <div class="keplr__section">
      <div class="controls">
        <Input
          id="chainsSearch"
          :label="$t('searchNetworks')"
          @input="onChainsSearch"
          type="text"
          icon="loop"
          clearable
        />
        <div class="controls__row">
          <div
            class="select"
            :class="{ disabled: chainList.length === 0 }"
            @click="
              chainList.length !== 0
                ? (selectedCoins = [].concat(chains))
                : null
            "
          >
            {{ $t('keplr.selectAll') }}
          </div>
          <div
            class="unselect"
            :class="{ disabled: chainList.length === 0 }"
            @click="chainList.length !== 0 ? (selectedCoins = []) : null"
          >
            <p>{{ $t('keplr.unselectAll') }}</p>
            <closeIcon class="close-icon" />
          </div>
        </div>
      </div>
      <div class="chains__selector">
        <EmptyList
          v-if="!chainList.length"
          :title="$t('notFoundPlaceholderText')"
          class="nodes-list__empty"
        />
        <NetworkCard
          v-for="chain in chainList"
          :key="chain.key"
          :network="chain"
          icon-path="networks"
          :checked="!!selectedCoins.find((coin) => coin.label === chain.label)"
          :empty-mnemonic="true"
          @check="onSelectCoin"
          @uncheck="onSelectCoin"
        />
      </div>
      <PrimaryButton
        v-if="chainList.length !== 0"
        :disabled="!selectedCoins.length"
        class="confirm"
        @click="importWallets"
      >
        {{ $t('keplr.confirm') }}
      </PrimaryButton>
    </div>
  </div>
</template>

<script>
import Modal from '@/components/Modal';
import Loading from '@/components/Loading';
import NetworkCard from '@/components/NetworkCard';
import Input from '@/components/UI/Input';
import EmptyList from '@/components/EmptyList';

import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import notify from '@/plugins/notify';
import useCreateWallets from '@/compositions/useCreateWallets';
import { WALLET_TYPES } from '@/config/walletType';
import { i18n } from '@/plugins/i18n';
import { keplrNetworks } from '@/config/availableNets';
import Header from '../AddAddress/components/Header';
import PrimaryButton from '@/components/UI/PrimaryButton';
import KeplrConnector from '@/models/Services/Keplr';
import closeIcon from '@/assets/icons/close.svg';
import { INPUT_TYPE_ICON } from '@/config/newWallets';

const { t } = i18n.global;

export default {
  name: 'Metamask',
  components: {
    PrimaryButton,
    Modal,
    Header,
    Loading,
    closeIcon,
    NetworkCard,
    Input,
    EmptyList,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const loadingImport = ref(false);
    const showSuccess = ref(false);
    const walletLoading = ref(false);

    const chains = ref(keplrNetworks);

    chains.value.sort((a, b) => {
      if (a.label > b.label) {
        return 1;
      }

      if (a.label < b.label) {
        return -1;
      }

      return 0;
    });

    const privateWallets = computed(() =>
      store.getters['wallets/wallets'].filter(
        (w) => w.type !== WALLET_TYPES.PUBLIC_KEY
      )
    );

    const selectedCoins = ref([]);
    const importedAddresses = ref([]);

    const onSelectCoin = (c) => {
      const findIndex = selectedCoins.value.findIndex(
        (coin) => coin.label === c.label
      );

      if (findIndex === -1) {
        selectedCoins.value.push(c);
      } else {
        selectedCoins.value = selectedCoins.value.filter(
          (coin) => coin.label !== c.label
        );
      }
    };

    const importWallets = async () => {
      loadingImport.value = true;
      importedAddresses.value = [];
      await Promise.all(
        selectedCoins.value.map(async (c) => {
          try {
            const accs = await new KeplrConnector().connect(c.key);

            const find = privateWallets.value.find(
              (w) => w.address === accs[0].address
            );

            if (!find) {
              importedAddresses.value.push({
                address: accs[0].address,
                pubkey: Buffer.from(accs[0].pubkey).toString('hex'),
                net: c.net,
                key: c.key,
              });
            }

            return true;
          } catch (err) {
            notify({
              type: 'warning',
              text: `${c.label} - ${err}`,
            });

            return false;
          }
        })
      );

      if (!importedAddresses.value.length) {
        loadingImport.value = false;

        notify({
          type: 'warning',
          text: t('keplr.allExist'),
        });

        return;
      }

      await store.dispatch(
        'keplr/connectToKeplr',
        importedAddresses.value[0].key
      );
      const result = await Promise.all(
        await importedAddresses.value.map(async (c) => {
          setNets([c.net]);
          setType('keplr');
          setAddress(c.address);
          setPublicKey(c.pubkey);

          try {
            await createWallets(WALLET_TYPES.KEPLR);
            return true;
          } catch (err) {
            return false;
          }
        })
      );

      if (result.every((r) => r)) {
        store.commit('newWallets/setNewWalletsList', newWallets.value);
        await redirectToNewWallet();
        store.commit('newWallets/setModal', true);
        showSuccess.value = true;
      }
    };

    const {
      setNets,
      setType,
      createWallets,
      setAddress,
      setPublicKey,
      redirectToNewWallet,
      newWallets,
    } = useCreateWallets();

    const cancel = () => {
      router.push('/add-address');
    };

    onMounted(async () => {
      store.commit('newWallets/setCatPageProps', {
        inputTypeIcon: INPUT_TYPE_ICON.KEPLR,
        walletTypePlaceholder: 'Citadel Keplr',
      });
      if (!window.keplr) {
        notify({
          type: 'warning',
          text: t('keplr.notFound'),
        });
      }
    });

    const search = ref('');

    const chainList = computed(() => {
      if (!search.value) {
        return chains.value;
      }

      return chains.value.filter(
        (item) =>
          item.label.toLowerCase().includes(search.value.toLowerCase()) ||
          item.net.toLowerCase().includes(search.value.toLowerCase()) ||
          item.key.toLowerCase().includes(search.value.toLowerCase())
      );
    });

    const onChainsSearch = (value) => (search.value = value);

    return {
      showSuccess,
      chains,
      walletLoading,
      cancel,
      onSelectCoin,
      selectedCoins,
      importWallets,
      loadingImport,
      importedAddresses,
      privateWallets,
      chainList,
      onChainsSearch,
    };
  },
};
</script>

<style lang="scss" scoped>
.keplr {
  display: flex;
  flex-direction: column;
  background: $white;
  box-shadow: -10px 4px 50px rgba(0, 0, 0, 0.1);
  border-radius: 25px;
  padding: 0 40px 43px;
  margin-bottom: 40px;
  flex-grow: 1;

  .confirm {
    width: 200px;
    margin: 0 auto;
  }

  &__section {
    display: flex;
    flex-direction: column;
  }

  .controls {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    flex-direction: column;
    margin: 50px auto 0;
    max-width: 891px;

    .input {
      height: 68px;
    }

    &__row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      margin: 15px 0 25px;
    }
    .select {
      color: #00a3ff;
      border-bottom: 1px dotted #00a3ff;
      cursor: pointer;
    }

    .unselect {
      display: flex;
      align-items: center;
      color: #fa3b33;
      p {
        margin: 0 8px 0 0;
        border-bottom: 1px dotted #fa3b33;
      }
      cursor: pointer;
    }
    .select,
    .unselect {
      transition: 0.2s;
      &.disabled {
        opacity: 0;
        cursor: initial;
      }
    }
  }
}

.import-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &__address {
    margin-top: 10px;
  }

  &__icon {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-weight: 600;
    margin-top: 35px;
    width: 50px;
    height: 50px;
    border-radius: 8px;
    text-align: center;
    padding-top: 5px;

    & svg {
      fill: white;
      height: 24px;
    }

    background: $mid-blue;
  }

  &__select {
    width: 100%;
    height: 68px;
    z-index: 2;
    margin-top: 25px;
  }
}

.chains__selector {
  width: 100%;
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0 10px;
  margin-bottom: 30px;
  max-width: 891px;
}
.close-icon {
  svg {
    fill: $red;
  }
}
</style>
