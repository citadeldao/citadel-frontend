<template>
  <transition name="fade" mode="out-in">
    <div v-if="isUnderstand" class="create-one-seed">
      <div class="create-one-seed__info-banner">
        <InfoBanner
          icon="exclamation"
          :content="$t('addToOneSeed.exclamation')"
          :description="$t('addToOneSeed.exclamationLearn')"
          @showDescription="onShowDescription"
        />
      </div>
      <div class="create-one-seed__seed-phrase">
        <div
          v-for="item in mnemonicArray"
          :key="item.key"
          class="create-one-seed__seed-phrase-item"
        >
          {{ item.key }}
        </div>
      </div>
      <div class="create-one-seed__checkbox">
        <Checkbox
          id="agree"
          v-model:value="agree"
          :label="$t('addToOneSeed.checkboxLabel')"
          info=""
        />
      </div>
      <PrimaryButton data-qa="Next" :disabled="!agree" @click="next">
        {{ $t('next') }}
      </PrimaryButton>
    </div>
    <div v-else class="create-one-seed">
      <div class="create-one-seed__wallpaper">
        <img src="@/assets/images/seed-phrase.png" alt="" />
      </div>
      <div class="create-one-seed__info">
        <h4 class="create-one-seed__title">
          {{ $t('addToOneSeed.infoTitle') }}
        </h4>
        <ol class="create-one-seed__description">
          <li class="create-one-seed__description-item">
            {{ $t('addToOneSeed.infoLine1') }}
          </li>
          <li class="create-one-seed__description-item">
            {{ $t('addToOneSeed.infoLine2') }}
          </li>
          <li class="create-one-seed__description-item">
            {{ $t('addToOneSeed.infoLine3') }}
          </li>
        </ol>
      </div>
      <PrimaryButton data-qa="I understand" @click="clickHandler">
        {{ $t('understand') }}
      </PrimaryButton>
    </div>
  </transition>
  <teleport to="body">
    <Modal v-if="showDescriptionFlag">
      <ModalContent
        :submit-button="false"
        @close="
          () => {
            showDescriptionFlag = false;
          }
        "
      >
        <div class="seed-info-container">
          <keep-alive>
            <component :is="welcomeIcon" />
          </keep-alive>
          <div class="seed-info-container__title">
            {{ $t('addToOneSeed.whySeedTitle') }}
          </div>
          <div class="seed-info-container__description">
            {{ $t('addToOneSeed.whySeedDescription') }}
          </div>
          <PrimaryButton
            :style="{ marginTop: '30px' }"
            @click="
              () => {
                showDescriptionFlag = false;
              }
            "
          >
            {{ $t('ok') }}
          </PrimaryButton>
        </div>
      </ModalContent>
    </Modal>
  </teleport>
</template>

<script>
import Modal from '@/components/Modal';
import ModalContent from '@/components/ModalContent';
import Checkbox from '@/components/UI/Checkbox';
import PrimaryButton from '@/components/UI/PrimaryButton';
import InfoBanner from '@/components/InfoBanner';
import { ref, inject, computed, markRaw, onMounted } from 'vue';
import { useStore } from 'vuex';
export default {
  name: 'CreateOneSeed',
  components: {
    InfoBanner,
    PrimaryButton,
    Checkbox,
    Modal,
    ModalContent,
  },
  emits: ['createMnemonic'],
  setup(props, { emit }) {
    const agree = ref(false);
    const isUnderstand = ref(true);
    const showDescriptionFlag = ref(false);
    const welcomeIcon = ref();

    import(`@/assets/icons/oneseedInfo.svg`).then((val) => {
      welcomeIcon.value = markRaw(val.default);
    });

    const store = useStore();

    const onShowDescription = () => {
      showDescriptionFlag.value = true;
    };

    onMounted(async () => {
      await store.dispatch('crypto/generateNewMnemonic');
    });
    const mnemonic = computed(() => store.getters['crypto/newMnemonic']);
    const mnemonicArray = computed(
      () =>
        mnemonic.value &&
        mnemonic.value
          .split(' ')
          .map((item, index) => ({ item, key: `${index + 1}. ${item}` }))
    );

    const nextStep = inject('nextStep');
    const next = () => {
      nextStep();
    };

    const clickHandler = () => {
      emit('createMnemonic', mnemonic);
      isUnderstand.value = true;
    };

    clickHandler();

    return {
      isUnderstand,
      welcomeIcon,
      showDescriptionFlag,
      clickHandler,
      agree,
      mnemonicArray,
      next,
      onShowDescription,
    };
  },
};
</script>

<style lang="scss" scoped>
.create-one-seed {
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
  &__info-banner {
    width: 570px;
    @include md {
      width: 483px;
    }
  }
  &__wallpaper {
    width: 238px;
    height: 135px;
    margin-bottom: 32px;
    @include xl {
      width: 380px;
      height: 283px;
    }
    @include lg {
      margin-bottom: 34px;
    }
    @include md {
      margin-bottom: 17px;
    }
    & img {
      width: 100%;
      height: 100%;
    }
  }
  &__info {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  &__title {
    font-size: 20px;
    line-height: 30px;
    margin: 0;
    margin-bottom: 9px;
    @include lg {
      font-size: 18px;
    }
    @include md {
      font-size: 16px;
    }
  }
  &__checkbox {
    min-height: 30px;
    margin-bottom: 32px;
    @include md {
      margin-bottom: 24px;
    }
  }
  &__description {
    margin: 0;
    margin-bottom: 31px;
    padding-left: 17px;
    @include md {
      margin-bottom: 19px;
    }
  }
  &__description-item {
    font-size: 14px;
    line-height: 22px;
    color: $mid-blue;
  }
  &__seed-phrase {
    width: 650px;
    height: 90px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-content: baseline;
    margin-bottom: 32px;
    margin-top: 32px;
    @include lg {
      // width: 570px;
      height: 100px;
      margin-bottom: 24px;
      margin-top: 23px;
    }
    @include md {
      // width: 453px;
      height: 100px;
      margin-bottom: 24px;
      margin-top: 16px;
    }
  }
  &__seed-phrase-item {
    width: 100px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: $lavender;
    border-radius: 6px;
    font-size: 14px;
    line-height: 17px;
    color: $dark-blue;
  }
}

.seed-info-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;

  svg {
    transform: scale(0.9);
  }

  &__title {
    font-family: 'Panton_Bold';
    font-size: 20px;
    margin-top: 20px;
  }

  &__description {
    margin-top: 10px;
    font-family: 'Panton_Regular';
    text-align: center;
    font-size: 16px;
    color: $mid-blue;
    padding: 0 10px;
    line-height: 25px;
    width: 100%;
  }
}

body.dark {
  .create-one-seed {
    &__seed-phrase-item {
      background: #313354;
      color: $white;
    }
  }
}
</style>
