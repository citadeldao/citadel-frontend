<template>
  <div class="address-specifications">
    <form @submit.prevent="submitHandler">
      <div class="address-specifications__autocomplete">
        <Autocomplete
          id="networks"
          v-model:value="search"
          :items="networks"
          :label="$t('network')"
          :placeholder="$t('selectNetwork')"
          initial-icon="citadel"
          data-qa="add-address__existing__private-key__network-field"
          @update:value="networkChangeHandler"
        />
      </div>
      <transition name="fade">
        <div
          v-if="accounts && accounts.length > 1"
          class="address-specifications__profile-select"
        >
          <Select
            v-model="account"
            :label="$t('accounts')"
            :options="accounts"
            value-key="key"
          />
        </div>
      </transition>
      <div class="address-specifications__address-input">
        <Input
          id="address"
          v-model="privateKey"
          :label="$t('enterYourPrivateKey')"
          type="text"
          icon="key"
          :placeholder="$t('privateKey')"
          data-qa="add-address__existing__private-key__key-field"
        />
      </div>
      <PrimaryButton
        :disabled="disabled"
        data-qa="add-address__existing__private-key__import-button"
      >
        {{ $t('import') }}
      </PrimaryButton>
    </form>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import Select from '@/components/UI/Select';
import Input from '@/components/UI/Input';
import Autocomplete from '@/components/UI/Autocomplete';
import useSelectNetwork from '@/compositions/useSelectNetwork';
import PrimaryButton from '@/components/UI/PrimaryButton';
import useIostProps from '@/compositions/useIostProps';
import models from '@/models';

export default {
  name: 'AddressSpecifications',
  components: {
    Autocomplete,
    Input,
    PrimaryButton,
    Select,
  },
  emits: ['setSpecifications'],
  setup(props, { emit }) {
    const privateKey = ref('');
    const search = ref('');
    const { networks, netByTitle } = useSelectNetwork();
    const submitHandler = () => {
      if (!privateKey.value.trim()) {
        return;
      }

      emit('setSpecifications', {
        net: netByTitle[search.value],
        privateKey: privateKey.value,
        account: account.value,
      });
    };
    const disabled = computed(() => !(search.value && privateKey.value && !waitAccounts.value));

    const { loadAccounts, waitAccounts, accounts, account } = useIostProps();

    watch(
      ()=> privateKey.value,
      async (newVal)=> {
        await loadAccounts(newVal, models[netByTitle[search.value]?.toUpperCase()]?.hasAccount);
      },
    );
    const networkChangeHandler = async (value)=> {
      await loadAccounts(privateKey.value, models[netByTitle[value]?.toUpperCase()]?.hasAccount);
    };

    return {
      search,
      privateKey,
      submitHandler,
      disabled,
      networks,
      loadAccounts,
      waitAccounts,
      accounts,
      account,
      networkChangeHandler,
    };
  },
};
</script>

<style lang="scss" scoped>
.address-specifications {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
  padding-top: 80px;
  padding-left: 45px;
  @include lg {
    padding-top: 32px;
  }
  @include md {
    padding-top: 24px;
    padding-left: 25px;
  }

  & form {
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 0;
  }

  &__autocomplete,
  &__address-input,
  &__profile-select {
    width: 570px;
    height: 68px;
    position: relative;
    @include md {
      width: 483px;
    }
  }

  &__autocomplete,
  &__profile-select {
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
