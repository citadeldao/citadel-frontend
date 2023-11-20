<template>
  <div class="enter-one-seed">
    <form @submit.prevent="submitHandler">
      <div class="enter-one-seed__textarea" @click="clickHanadler">
        <span v-show="showPlaceholder" class="enter-one-seed__placeholder">
          {{ $t('restoreOneSeed.placeholder') }}
        </span>
        <textarea
          v-show="!showPlaceholder"
          ref="textArea"
          data-qa="enter-one-seed"
          v-model="mnemonic"
          :label="$t('enterPassword')"
          autofocus
          @blur="blurHandler"
          @input="inputHandler"
        />
        <div v-if="mnemonicError" class="textarea__error">
          <error class="textarea__error-icon" />
          <span class="textarea__error-text">{{ mnemonicError }}</span>
        </div>
      </div>
      <transition name="fade" mode="out-in">
        <div v-show="!showPlaceholder" class="enter-one-seed__counter">
          <span class="enter-one-seed__message">
            {{ $t('restoreOneSeed.counterMessage') }}
          </span>
          <div class="enter-one-seed__count">
            <span class="enter-one-seed__current-count">
              {{ phraseArray.length }}
            </span>
            <div class="enter-one-seed__line" />
            <span class="enter-one-seed__total-count">12 / 24</span>
          </div>
        </div>
      </transition>
      <PrimaryButton :disabled="disabled" data-qa="Import">
        {{ $t('import') }}
      </PrimaryButton>
    </form>
  </div>
</template>

<script>
import PrimaryButton from '@/components/UI/PrimaryButton';
import CryptoCoin from '@/models/CryptoCoin';
import error from '@/assets/icons/networks/error.svg';
import { useI18n } from 'vue-i18n';
import { ref, inject, nextTick, computed, watch } from 'vue';

export default {
  name: 'EnterOneSeed',
  components: {
    PrimaryButton,
    error,
  },
  props: {
    importedMnemonic: {
      type: String,
      default: '',
    },
  },
  emits: ['confirmMnemonic'],
  setup(props, { emit }) {
    const { t } = useI18n();
    const mnemonic = ref(props.importedMnemonic || '');

    const showPlaceholder = ref('true');

    const textArea = ref(null);

    const phraseArray = computed(() => {
      if (mnemonic.value) {
        return mnemonic.value
          .trim()
          .replace(/\r?\n/g, ' ')
          .replace(/ +/g, ' ')
          .split(' ');
      }

      return [];
    });

    const inputHandler = () => {
      if (phraseArray.value.length >= 24) {
        mnemonic.value = phraseArray.value.join(' ');

        return;
      }
    };

    const blurHandler = () => {
      if (mnemonic.value) {
        return;
      }

      showPlaceholder.value = true;
    };

    const clickHanadler = () => {
      showPlaceholder.value = false;
      nextTick(() => textArea.value.focus());
    };

    const mnemonicError = computed(() => {
      if (
        (phraseArray.value.length === 12 || phraseArray.value.length === 24) &&
        !CryptoCoin.validateMnemonic(mnemonic.value)
      ) {
        return t('mnemonicIncorrect');
      }

      return false;
    });
    const disabled = computed(() => {
      const result =
        (phraseArray.value.length !== 12 || phraseArray.value.length !== 24) &&
        !CryptoCoin.validateMnemonic(mnemonic.value);

      return result;
    });

    const nextStep = inject('nextStep');
    const submitHandler = () => {
      if (!mnemonic.value.trim()) {
        return;
      }

      emit('confirmMnemonic', mnemonic.value);
      nextStep();
    };

    watch(
      () => props.importedMnemonic,
      (value) => {
        if (value) {
          clickHanadler();
        }
      },
      { immediate: true }
    );

    return {
      mnemonic,
      submitHandler,
      showPlaceholder,
      clickHanadler,
      blurHandler,
      textArea,
      phraseArray,
      inputHandler,
      disabled,
      mnemonicError,
    };
  },
};
</script>

<style lang="scss" scoped>
.enter-one-seed {
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
  }
  &__placeholder {
    text-align: center;
    width: 60%;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: -0.02em;
    color: $mid-gray;
    @include lg {
      width: 89%;
    }
    @include md {
      width: 89%;
    }
  }
  &__textarea {
    position: relative;
    width: 710px;
    height: 151px;
    display: flex;
    border: 1px dashed $darkgray;
    border-radius: 8px;
    align-items: center;
    justify-content: center;
    margin-bottom: 26px;
    @include lg {
      width: 570px;
    }
    @include md {
      width: 484px;
    }
    & textarea {
      position: relative;
      width: 100%;
      height: 100%;
      resize: none;
      padding: 31px 26px;
      outline: none;
      border: none;
      border-radius: 8px;
      align-items: center;
    }
  }
  &__counter {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 22px;
  }
  &__message {
    font-family: 'Panton_Regular';
    font-size: 14px;
    line-height: 20px;
    margin-bottom: 15px;
  }
  &__count {
    position: relative;
    display: flex;
  }
  &__current-count {
    font-family: 'Panton_ExtraBold';
    font-size: 20px;
    line-height: 30px;
    color: $dark-blue;
    position: absolute;
    top: -12px;
    left: -28px;
  }
  &__line {
    height: 27px;
    border-right: 1px solid $too-ligth-blue;
    transform: rotate(221deg);
  }
  &__total-count {
    font-family: 'Panton_Light';
    font-size: 14px;
    line-height: 30px;
    color: $mid-blue;
    position: absolute;
    width: 55px;
    bottom: -13px;
    right: -52px;
  }
}

.textarea__error {
  display: flex;
  align-items: center;
  position: absolute;
  left: 0;
  bottom: -32px;
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

body.dark {
  .enter-one-seed {
    &__message {
      color: $white;
    }
  }
  .enter-one-seed__textarea {
    textarea {
      color: $white;
      background: transparent;

      &:focus {
        background: transparent;
      }
    }
  }
}
</style>
