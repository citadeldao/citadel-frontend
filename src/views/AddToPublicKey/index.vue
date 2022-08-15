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
  </div>
</template>

<script>
import Input from '@/components/UI/Input';
import Autocomplete from '@/components/UI/Autocomplete';
import Header from '../AddAddress/components/Header';
import { ref, computed, onMounted } from 'vue';
import PrimaryButton from '@/components/UI/PrimaryButton';
import { useStore } from 'vuex';
import useSelectNetwork from '@/compositions/useSelectNetwork';
import useCreateWallets from '@/compositions/useCreateWallets';
import { useI18n } from 'vue-i18n';
import { WALLET_TYPES } from '../../config/walletType';
import { INPUT_TYPE_ICON } from '@/config/newWallets';

export default {
  name: 'AddToPublicKey',
  components: {
    Header,
    Autocomplete,
    Input,
    PrimaryButton,
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
    onMounted(() => {
      store.dispatch('newWallets/setCatPageProps', {
        inputTypeIcon: INPUT_TYPE_ICON.PUBLIC,
        dataQa: 'add-address__existing__public-key',
        walletTypePlaceholder: t('catPage.placeholderPublic'),
      });
    });
    const {
      setAddress,
      setNets,
      createWallets,
      newWallets,
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

    return {
      search,
      address,
      submitHandler,
      networks,
      msgError,
      isValidAddress,
      newWallets,
      showAlreadyAddedModal,
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
