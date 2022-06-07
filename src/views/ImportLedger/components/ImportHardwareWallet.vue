<template>
  <div class="import-hardware-wallet">
    <h4 class="import-hardware-wallet__title">
      {{ $t('importLedger.title1') }}
    </h4>
    <form @submit.prevent="submitHandler">
      <div class="import-hardware-wallet__autocomplete">
        <Autocomplete
          id="networks"
          v-model:value="search"
          :items="ledgerNetworks"
          :label="$t('network')"
          :placeholder="$t('selectNetwork')"
          initial-icon="citadel"
          :error="error"
          data-qa="add__address__hardware__network-field"
        />
      </div>
      <PrimaryButton
        :disabled="disabled"
        data-qa="add__address__hardware__select-button"
      >
        {{ $t('import') }}
      </PrimaryButton>
    </form>
  </div>
</template>

<script>
import Autocomplete from '@/components/UI/Autocomplete';
import { ref, computed, inject } from 'vue';
import PrimaryButton from '@/components/UI/PrimaryButton';
import useSelectNetwork from '@/compositions/useSelectNetwork';
import { useI18n } from 'vue-i18n';

export default {
  name: 'ImportHardwareWallet',
  components: { Autocomplete, PrimaryButton },
  emits: ['setNet'],
  setup(props, { emit }) {
    const { t } = useI18n();
    const { ledgerNetworks, netByTitle } = useSelectNetwork();

    const search = ref('');
    const net = computed(() => netByTitle[search.value]);

    const error = computed(
      () => search.value && !net.value && t('networkNameIncorrect'),
    );

    const disabled = computed(() => !search.value || error.value);

    const nextStep = inject('nextStep');
    const submitHandler = () => {
      emit('setNet', net.value);
      nextStep();
    };

    return {
      search,
      submitHandler,
      disabled,
      ledgerNetworks,
      net,
      error,
    };
  },
};
</script>

<style lang="scss" scoped>
.import-hardware-wallet {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
  padding-top: 80px;
  padding-left: 45px;
  margin-bottom: 8px;

  @include lg {
    padding-top: 32px;
  }
  @include md {
    padding-top: 24px;
    padding-left: 25px;
  }

  &__title {
    font-size: 20px;
    line-height: 30px;
    margin: 0;
    font-family: "Panton_Bold";
    margin-bottom: 24px;
  }

  & form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__autocomplete {
    width: 570px;
    height: 68px;
    position: relative;
    margin-bottom: 24px;
    @include md {
      width: 483px;
      margin-bottom: 16px;
    }
  }
}
</style>
