<template>
  <div class="address-specifications">
    <form @submit.prevent="submitHandler">
      <div class="address-specifications__autocomplete">
        <Autocomplete
          id="networks"
          v-model:value="search"
          :items="networks.filter((t) => t.icon !== 'tez')"
          :label="$t('network')"
          :placeholder="$t('selectNetwork')"
          initial-icon="citadel"
          data-qa="add-address__existing__seed-phrase__network-field"
        />
      </div>
      <div class="textarea__wrap">
        <textarea
          v-model="mnemonicPhrase"
          class="address-specifications__mnemonic-phrase"
          :placeholder="!hasFocus ? $t('enterMnemonicPhrase') : ''"
          data-qa="add-address__existing__seed-phrase__mnemonic-field"
          @focus="onFocus"
          @blur="onBlur"
        />
        <div v-if="mnemonicError" class="textarea__error">
          <error class="textarea__error-icon" />
          <span class="textarea__error-text">{{ mnemonicError }}</span>
        </div>
      </div>
      <div
        v-if="showAdvancedToggle"
        class="address-specifications__advanced-settings"
        :class="{
          'address-specifications__advanced-settings--active': showAdvanced,
        }"
        data-qa="add-address__existing__seed-phrase__settings-button"
        @click="showAdvanced = !showAdvanced"
      >
        <span> {{ $t('advancedSettings') }} </span>
        <arrowRigth />
      </div>
      <transition name="fade">
        <div
          v-if="showAdvanced"
          class="address-specifications__mnemonic-phrase-optional"
        >
          <Input
            id="optionalMnemonicPhrase"
            v-model="optionalMnemonicPhrase"
            :label="$t('mnemonicPassphraseOptional')"
            type="text"
            icon="text"
            :placeholder="$t('inputPassphrase')"
            data-qa="add-address__existing__seed-phrase__passphrase-field"
          />
        </div>
      </transition>

      <PrimaryButton :disabled="disabled" data-qa="Next">
        {{ $t('next') }}
      </PrimaryButton>
    </form>
  </div>
</template>

<script>
import Input from '@/components/UI/Input';
import arrowRigth from '@/assets/icons/arrow-rigth.svg';
import Autocomplete from '@/components/UI/Autocomplete';
import { ref, computed, inject } from 'vue';
import useSelectNetwork from '@/compositions/useSelectNetwork';
import PrimaryButton from '@/components/UI/PrimaryButton';
import CryptoCoin from '@/models/CryptoCoin';
import { useI18n } from 'vue-i18n';
import error from '@/assets/icons/networks/error.svg';
import models from '@/models';

export default {
  name: 'AddressSpecifications',
  components: { Autocomplete, Input, PrimaryButton, arrowRigth, error },
  emits: ['createOpts'],
  setup(props, { emit }) {
    const { t } = useI18n();
    const showAdvanced = ref(false);
    const hasFocus = ref(false);

    const optionalMnemonicPhrase = ref('');

    const mnemonicPhrase = ref('');

    const search = ref('');

    const { networks, netByTitle } = useSelectNetwork();

    const showAdvancedToggle = computed(
      () =>
        !models[netByTitle[search?.value]?.toUpperCase()]?.hasNoAdvancedSettings
    );

    const onFocus = () => {
      hasFocus.value = true;
    };

    const onBlur = () => {
      hasFocus.value = false;
    };

    const disabled = computed(
      () =>
        !(
          search.value &&
          mnemonicPhrase.value &&
          CryptoCoin.validateMnemonic(mnemonicPhrase.value)
        )
    );

    const mnemonicError = computed(() => {
      if (
        mnemonicPhrase.value &&
        !CryptoCoin.validateMnemonic(mnemonicPhrase.value)
      ) {
        return t('mnemonicIncorrect');
      }

      if (mnemonicPhrase.value && !search.value) {
        return t('pleaseSelectNetwork');
      }

      if (mnemonicPhrase.value && !netByTitle[search.value]) {
        return t('networkNameIncorrect');
      }

      return false;
    });

    const nextStep = inject('nextStep');
    const submitHandler = async () => {
      if (!mnemonicPhrase.value.trim()) {
        return;
      }

      emit('createOpts', {
        net: netByTitle[search.value],
        mnemonic: mnemonicPhrase.value,
        passphrase: optionalMnemonicPhrase.value,
      });
      nextStep();
    };

    return {
      search,
      networks,
      submitHandler,
      disabled,
      showAdvanced,
      mnemonicPhrase,
      optionalMnemonicPhrase,
      mnemonicError,
      hasFocus,
      onBlur,
      onFocus,
      showAdvancedToggle,
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
  padding-top: 48px;
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
  &__autocomplete {
    width: 570px;
    height: 68px;
    position: relative;
    @include md {
      width: 483px;
    }
  }
  &__autocomplete {
    margin-bottom: 24px;
    @include md {
      margin-bottom: 16px;
    }
  }
  &__mnemonic-phrase {
    width: 570px;
    height: 100px;
    border: 1px solid #c3ceeb;
    border-radius: 8px;
    resize: none;
    outline: none;
    padding: 12px 30px 0 15px;
    margin-bottom: 22px;
    @include md {
      width: 483px;
      margin-bottom: 16px;
    }
    &:focus {
      border: 1px solid $blue;
    }
  }
  &__advanced-settings {
    background: transparent;
    display: flex;
    align-items: center;
    margin-bottom: 21px;
    cursor: pointer;
    @include lg {
      margin-bottom: 20px;
    }
    @include md {
      margin-bottom: 12px;
    }
    & span {
      font-size: 20px;
      line-height: 24px;
      color: $darkgray;
      margin-right: 12px;
      @include lg {
        font-size: 18px;
        line-height: 22px;
      }
      @include md {
        font-size: 16px;
        line-height: 19px;
      }
    }
    &:hover {
      & span {
        color: $blue;
      }
      & svg {
        fill: $blue;
      }
    }
    & svg {
      height: 14px;
      width: 9px;
      fill: $darkgray;
      transform: rotate(90deg);
    }
    &--active {
      & span {
        color: $blue;
      }
      & svg {
        transform: rotate(270deg);
        fill: $blue;
      }
    }
  }
  &__mnemonic-phrase-optional {
    width: 570px;
    height: 68px;
    margin-bottom: 32px;
    @include md {
      width: 483px;
      margin-bottom: 24px;
    }
  }
}

.textarea__wrap {
  position: relative;
}

.textarea__error {
  display: flex;
  align-items: center;
  position: absolute;
  left: 0;
  bottom: -8px;
  font-size: 14px;
  font-weight: 600;
  line-height: 30px;
  color: $red;
  & svg {
    position: relative;
    margin-right: 8px;
  }
}

textarea:focus + .textarea__error {
  display: none;
}
</style>
