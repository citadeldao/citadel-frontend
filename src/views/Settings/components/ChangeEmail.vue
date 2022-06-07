<template>
  <div class="change-email">
    <div class="change-email__info">
      <span class="change-email__title">
        {{ $t('settings.changeEmail.title') }}
      </span>
      <span class="change-email__desc">
        {{ $t('settings.changeEmail.description') }}
      </span>
      <div class="change-email__input">
        <Input
          id="email"
          v-model="email"
          :label="$t('settings.changeEmail.inputLabel')"
          type="text"
          icon="mail"
          disabled
          :placeholder="$t('settings.changeEmail.inputPlaceHolder')"
          data-qa="settings__email-field"
        />
      </div>
      <PrimaryButton
        v-if="false"
        class="change-email__button"
        data-qa="settings__email-button"
        @click="clickHandler"
      >
        {{ $t('settings.changeEmail.button') }}
      </PrimaryButton>
    </div>
  </div>
</template>

<script>
import PrimaryButton from '@/components/UI/PrimaryButton';
import Input from '@/components/UI/Input';
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
export default {
  name: 'ChangeEmail',
  components: { PrimaryButton, Input },
  props: {},
  setup() {
    const store = useStore();
    const currentEmail = computed(() => store.getters['profile/info'].login);
    const email = ref(currentEmail.value);
    const clickHandler = () => {};

    return { clickHandler, email };
  },
};
</script>

<style lang="scss" scoped>
.change-email {
  height: 100%;
  padding: 40px 45px;
  display: flex;
  background: $white;
  box-shadow: -10px 4px 27px rgba(0, 0, 0, 0.1);
  border-radius: 25px;
  @include lg {
    padding: 30px 40px;
  }
  @include md {
    box-shadow: -10px 4px 24px rgba(0, 0, 0, 0.1);
    padding: 22px 29px 30px;
  }
  &__info {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  &__title {
    font-size: 20px;
    line-height: 30px;
    font-family: 'Panton_Bold';
    @include md {
      margin-bottom: 4px;
    }
  }
  &__desc {
    font-size: 16px;
    line-height: 27px;
    margin-bottom: 14px;
    color: $mid-blue;
    @include lg {
      font-size: 14px;
      line-height: 24px;
    }
    &-text {
      margin-bottom: 27px;
    }
    @include md {
      font-size: 14px;
      line-height: 24px;
    }
  }

  &__input {
    height: 68px;
    margin-bottom: 32px;
  }

  &__button {
    margin: 0 auto;
  }
}
</style>
