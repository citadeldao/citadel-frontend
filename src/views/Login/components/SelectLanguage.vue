<template>
  <div class="login-menu-changelang">
    <span class="login-menu-changelang__title">
      {{ $t('login.changeLangTitle') }}
    </span>
    <span
      class="login-menu-changelang__info"
      v-html="$t('login.changeLangDescription')"
    />
    <Select
      v-model="currentLanguage"
      icon="lang"
      :label="$t('login.language')"
      :options="languages"
      value-key="key"
      data-qa="settings__language-field"
      @change="changeLanguage"
      class="login-menu-changelang__input"
    />
    <PrimaryButton class="login-menu-changelang__btn" @click="next">
      {{ $t('confirm') }}
    </PrimaryButton>
    <div class="login-menu-changelang__cancel" @click="next">
      {{ $t('login.back') }}
    </div>
  </div>
</template>
<script>
import PrimaryButton from '@/components/UI/PrimaryButton';
import Select from '@/components/UI/Select';
import { useStore } from 'vuex';
import { ref, computed } from 'vue';

export default {
  components: {
    Select,
    PrimaryButton,
  },
  setup(_, { emit }) {
    const store = useStore();
    const languages = computed(() => store.getters['i18n/locales']);
    const currentLanguage = ref(store.getters['i18n/locale']);

    console.log('languages', languages);

    const changeLanguage = async (value) => {
      await store.dispatch('i18n/setLocale', value);
    };

    const next = () => {
      emit('accountCreate');
    };

    return {
      languages,
      currentLanguage,
      next,
      changeLanguage,
    };
  },
};
</script>
<style lang="scss" scoped>
.login-menu-changelang {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 55px 60px 10px 60px;
  border-radius: 25px;
  margin-bottom: 15px;
  @include lg {
    margin-bottom: 15px;
  }
  @include md {
    padding: 36px 36px 42px 36px;
    margin-bottom: 15px;
  }

  &__cancel {
    cursor: pointer;
    margin-top: 10px;
    text-decoration: underline;
    color: #0a2778;
    font-weight: 700;
    font-size: 18px;
  }

  &__title {
    font-family: 'Panton_Bold';
    font-size: 35px;
    line-height: 42px;
    margin-bottom: 16px;
    text-align: center;
    @include md {
      font-size: 25px;
      line-height: 30px;
      margin-bottom: 5px;
    }
  }

  &__info {
    font-size: 16px;
    line-height: 27px;
    text-align: center;
    color: $mid-blue;
    margin-bottom: 26px;
    @include md {
      margin-bottom: 18px;
    }
  }

  &__input {
    width: 350px;
    height: 68px;
    margin-bottom: 20px;
  }
}
</style>
