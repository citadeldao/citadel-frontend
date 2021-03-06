<template>
  <div class="add-to-public-key">
    <Header
      :title="$t('addToPublicKey.title')"
      :info="$t('addToPublicKey.info')"
    />
    <div class="add-to-public-key__section">
      <form @submit.prevent="submitHandler">
        <div class="add-to-public-key__autocomplete">
          <Autocomplete
            id="networks"
            v-model:value="search"
            :items="networks"
            :label="$t('network')"
            :placeholder="$t('selectNetwork')"
            initial-icon="citadel"
            data-qa="add-address__public-key__network-field"
          />
        </div>
        <div class="add-to-public-key__address-input">
          <Input
            id="address"
            v-model="address"
            :label="$t('address')"
            type="text"
            icon="curve-arrow"
            :error="msgError"
            :placeholder="$t('enterAddress')"
            data-qa="add-address__public-key__address-field"
          />
        </div>
        <PrimaryButton data-qa="add-address__public-key__next-button">
          {{ $t('next') }}
        </PrimaryButton>
      </form>
    </div>
    <teleport to="body">
      <Modal v-if="showModal">
        <img v-if="showLoader" src="@/assets/gif/loader.gif" alt="" />
        <AddressAlreadyAdded
          v-else-if="showAlreadyAddedModal"
          v-click-away="alreadyAddedCloseHandler"
          @close="alreadyAddedCloseHandler"
          @buttonClick="alreadyAddedClickHandler"
        />
        <CatPage
          v-else
          v-click-away="successModalCloseHandler"
          :data="newWallets"
          :wallet-type-placeholder="$t('catPage.placeholderPublic')"
          input-type-icon="public-dot"
          data-qa="add-address__existing__public-key"
          @close="successModalCloseHandler"
          @buttonClick="successModalClickHandler"
        />
      </Modal>
    </teleport>
  </div>
</template>

<script>
import Input from '@/components/UI/Input';
import Autocomplete from '@/components/UI/Autocomplete';
import CatPage from '@/components/CatPage';
import Modal from '@/components/Modal';
import AddressAlreadyAdded from '@/components/Modals/AddressAlreadyAdded';
import Header from '../AddAddress/components/Header';
import { ref, computed } from 'vue';
import PrimaryButton from '@/components/UI/PrimaryButton';
import { useStore } from 'vuex';
import useSelectNetwork from '@/compositions/useSelectNetwork';
import useCreateWallets from '@/compositions/useCreateWallets';
import { useI18n } from 'vue-i18n';
import { WALLET_TYPES } from '../../config/walletType';

export default {
  name: 'AddToPublicKey',
  components: {
    Header,
    Autocomplete,
    Input,
    PrimaryButton,
    CatPage,
    Modal,
    AddressAlreadyAdded,
  },
  setup() {
    const store = useStore();
    const { t } = useI18n();
    const search = ref('');
    const msgError = ref('');

    const address = ref('');
    const { networks, netByTitle } = useSelectNetwork();
    const net = computed(() => netByTitle[search.value]);

    const isValidAddress = computed(() => {
      const regTemplate = store.getters['networks/configByNet'](
        net.value
      )?.validating;

      if (!regTemplate) {
        return false;
      }

      const regExp = new RegExp(regTemplate);

      return regExp.test(address.value);
    });

    const {
      setAddress,
      setNets,
      createWallets,
      showModal,
      showLoader,
      newWallets,
      redirectToNewWallet,
      showAlreadyAddedModal,
    } = useCreateWallets();

    const submitHandler = () => {
      if (!isValidAddress.value) {
        msgError.value = t('messages.incorrectAddress');

        return;
      }

      msgError.value = '';

      setAddress(address.value);
      setNets([net.value]);
      createWallets(WALLET_TYPES.PUBLIC_KEY);
    };

    const successModalCloseHandler = () => {
      showModal.value = false;
      redirectToNewWallet();
    };
    const successModalClickHandler = successModalCloseHandler;

    const alreadyAddedCloseHandler = () => {
      showAlreadyAddedModal.value = false;
      showModal.value = false;
      redirectToNewWallet();
    };
    const alreadyAddedClickHandler = alreadyAddedCloseHandler;

    return {
      search,
      address,
      submitHandler,
      showModal,
      successModalCloseHandler,
      successModalClickHandler,
      networks,
      msgError,
      isValidAddress,
      showLoader,
      newWallets,
      showAlreadyAddedModal,
      alreadyAddedClickHandler,
      alreadyAddedCloseHandler,
    };
  },
};
</script>

<style lang="scss" scoped>
.add-to-public-key {
  display: flex;
  flex-direction: column;
  background: $white;
  box-shadow: -10px 4px 27px rgba(0, 0, 0, 0.1);
  border-radius: 25px;
  flex-grow: 1;
  padding: 0 44px;
  margin-bottom: 8px;

  @include lg {
    padding: 0 40px;
  }
  @include md {
    box-shadow: -10px 4px 24px rgba(0, 0, 0, 0.1);
    padding: 0 32px;
  }

  &__section {
    display: flex;
    flex-grow: 1;
    justify-content: center;
    padding-top: 80px;
    @include lg {
      padding-top: 31px;
    }
    @include md {
      padding-top: 24px;
    }
  }

  & form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__autocomplete,
  &__address-input {
    width: 570px;
    height: 68px;
    position: relative;
    @include md {
      width: 483px;
    }
  }

  &__autocomplete {
    z-index: 2;
    margin-bottom: 24px;
    @include md {
      margin-bottom: 16px;
    }
  }

  &__address-input {
    margin-bottom: 32px;
    @include md {
      margin-bottom: 24px;
    }
  }
}
</style>
