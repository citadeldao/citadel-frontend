<template>
  <div class="import-hardware-wallet">
    <span class="import-hardware-wallet__title">
      {{ $t("importTrezor.title1") }}
    </span>
    <form @submit.prevent="submitHandler">
      <div class="import-hardware-wallet__autocomplete">
        <Autocomplete
          id="networks"
          v-model:value="search"
          :items="trezorNetworks"
          :label="$t('network')"
          :placeholder="$t('selectNetwork')"
          initial-icon="citadel"
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
export default {
  name: 'ImportHardwareWallet',
  components: { Autocomplete, PrimaryButton },
  emits: ['setNet'],
  setup(props, { emit }) {
    const { trezorNetworks, netByTitle } = useSelectNetwork();

    const search = ref('');

    const disabled = computed(() => (search.value ? false : true));
    const net = computed(() => netByTitle[search.value]);

    const nextStep = inject('nextStep');
    const submitHandler = () => {
      emit('setNet', net.value);
      nextStep();
    };

    return {
      search,
      trezorNetworks,
      submitHandler,
      disabled,
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
    margin-bottom: 24px;
    font-family: "Panton_Bold";
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
