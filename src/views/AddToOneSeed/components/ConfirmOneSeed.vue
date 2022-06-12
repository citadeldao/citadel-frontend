<template>
  <div class="confirm-one-seed">
    <div class="confirm-one-seed__confirms">
      <div class="item">
        <div class="num">
          {{ firstRandomIndexCofirmWord + 1 }}th word
        </div>
        <div
          :class="{ active: !firstConfirmWord }"
          class="field"
        >
          <span v-if="firstConfirmWord">{{ firstConfirmWord }}</span>
          <span
            v-else
            class="select-word"
            data-qa="first-word"
          >{{ $t('addToOneSeed.selectWord') }}</span>
          <deleteIcon
            v-if="firstConfirmWord"
            class="remove"
            @click="firstConfirmWord = ''"
          />
        </div>
      </div>
      <div class="item">
        <div class="num">
          {{ secondRandomIndexCofirmWord + 1 }}th word
        </div>
        <div
          :class="{ active: firstConfirmWord }"
          class="field"
        >
          <span v-if="secondConfirmWord">{{ secondConfirmWord }}</span>
          <span
            v-else
            class="select-word"
            data-qa="second-word"
          >{{ $t('addToOneSeed.selectWord') }}</span>
          <deleteIcon
            v-if="secondConfirmWord"
            class="remove"
            @click="secondConfirmWord = ''"
          />
        </div>
      </div>
    </div>
    <div class="confirm-one-seed__words">
      <div
        v-for="word in shuffledMnemonicArray"
        :key="word.key"
        class="confirm-one-seed__word"
        @click="setConfirmWord(word.item)"
      >
        {{ word.item }}
      </div>
    </div>
    <div
      v-if="!isMnemonicCorrect"
      class="confirm-one-seed__error"
    >
      <span>{{ $t('addToOneSeed.errorConfirmWords1') }}</span> {{ $t('addToOneSeed.errorConfirmWords2') }}
    </div>
    <PrimaryButton
      data-qa="Confirm"
      :disabled="!isMnemonicCorrect"
      @click="clickHandler"
    >
      {{ $t('confirm') }}
    </PrimaryButton>
  </div>
</template>

<script>
import PrimaryButton from '@/components/UI/PrimaryButton';
import { ref, inject, computed } from 'vue';
import { shuffleArray } from '@/helpers';
import deleteIcon from '@/assets/icons/delete.svg';

export default {
  name: 'ConfirmOneSeed',
  components: {
    deleteIcon,
    PrimaryButton,
  },
  props: {
    mnemonic: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const firstConfirmWord = ref('');
    const secondConfirmWord = ref('');
    const firstRandomIndexCofirmWord = ref(Math.round(Math.random() * 11));
    const secondRandomIndexCofirmWord = ref(Math.round(Math.random() * 11));

    const initialMnemonicArray = ref(props.mnemonic.split(' '));

    const setConfirmWord = (word) => {
      if (!firstConfirmWord.value) {
        firstConfirmWord.value = word;

        return;
      }

      secondConfirmWord.value = word;
    };

    const mnemonicArray = props.mnemonic
      .split(' ')
      .map((item, index) => ({ item, key: `${index + 1}. ${item}` }));

    let shuffledMnemonicArray = shuffleArray(mnemonicArray.slice(0, 6));
    shuffledMnemonicArray[0] = mnemonicArray[firstRandomIndexCofirmWord.value];
    shuffledMnemonicArray[1] = mnemonicArray[secondRandomIndexCofirmWord.value];
    shuffledMnemonicArray = shuffleArray(shuffledMnemonicArray);

    const isMnemonicCorrect = computed(() => {
      return initialMnemonicArray.value[firstRandomIndexCofirmWord.value] === firstConfirmWord.value &&
      initialMnemonicArray.value[secondRandomIndexCofirmWord.value] === secondConfirmWord.value;
    });

    const nextStep = inject('nextStep');
    const clickHandler = () => {
      nextStep();
    };

    return {
      firstRandomIndexCofirmWord,
      secondRandomIndexCofirmWord,
      firstConfirmWord,
      secondConfirmWord,
      shuffledMnemonicArray,
      isMnemonicCorrect,
      setConfirmWord,
      clickHandler,
    };
  },
};
</script>

<style lang="scss" scoped>
.confirm-one-seed {
  margin: 30px auto;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
  padding-top: 80px;

  @include lg {
    padding-top: 32px;
  }
  @include md {
    padding-top: 24px;
  }

  &__confirms {
    width: 320px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;

    .item {
      .num {
        font-size: 14px;
        color: #756AA8;
        margin-bottom: 10px;
      }

      .field {
        width: 144px;
        height: 40px;
        font-size: 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #F0F3FD;
        border: 1px solid #C3CEEB;
        box-sizing: border-box;
        border-radius: 6px;
        padding: 0 10px;
        box-sizing: border-box;
        color: $black;

        &.active {
          border: 1px solid #1A53F0;
        }

        .select-word {
          color: #8B9BC7;
        }

        .remove {
          width: 16px;
          height: 16px;

          &:hover {
            cursor: pointer;
            opacity: .7;
          }
        }
      }
    }
  }

  &__words {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 330px;
    flex-wrap: wrap;
    margin-bottom: 30px;
  }

  &__word {
    width: 100px;
    height: 40px;
    margin: 5px;
    background: #E1E7F5;
    border-radius: 6px;
    color: $dark-blue;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;

    &:hover {
      cursor: pointer;
      background: #6A4BFF;
      color: $white;
    }
  }

  &__error {
    width: 492px;
    color: $darkgray;
    font-size: 14px;
    line-height: 20px;
    margin-bottom: 30px;
    text-align: center;

    span {
      font-family: Panton_SemiBold;
      color: #FA3B33;
    }
  }
  //

  &__one-seed {
    display: flex;
    width: 710px;
    height: 151px;
    border: 1px dashed $darkgray;
    border-radius: 8px;
    margin-bottom: 24px;
    @include lg {
      width: 571px;
      margin-bottom: 17px;
    }
    @include md {
      width: 483px;
      height: 170px;
    }
  }

  &__placeholder {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    line-height: 22px;
    letter-spacing: -0.02em;
    color: $mid-gray;
    text-align: center;
    @include lg {
      padding: 0 48px;
    }
    @include md {
      font-size: 14px;
      line-height: 17px;
      padding: 0 74px;
    }
  }

  &__draggable {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    padding: 28px 0 33px 28px;
    @include lg {
      padding: 10px 0 10px 18px;
    }
    @include md {
      padding: 15px 0 15px 18px;
    }
  }

  &__draggable-item {
    width: 100px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $slateblue;
    border-radius: 6px;
    font-size: 14px;
    line-height: 17px;
    color: $white;
    margin-right: 10px;
    cursor: pointer;
    @include lg {
      margin-right: 8px;
    }
    @include md {
      margin-right: 13px;
    }

    &:hover {
      background: $white;
      box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.17);
      color: $dark-blue;
    }
  }

  &__one-seed-random {
    width: 660px;
    height: 90px;
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
    margin-bottom: 45px;
    @include lg {
      width: 570px;
      height: 140px;
      margin-bottom: 24px;
    }
    @include md {
      width: 453px;
      height: 140px;
      margin-bottom: 24px;
    }
  }
}

.hide {
  background: $lavender;
  color: $lavender;
  pointer-events: none;
}
</style>
