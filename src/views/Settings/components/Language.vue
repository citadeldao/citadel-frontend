<template>
  <div class="language">
    <div class="language__info">
      <span class="language__title">
        {{ $t('settings.language.title') }}
      </span>
      <span class="language__desc">
        {{ $t('settings.language.description') }}
      </span>
      <div class="language__input">
        <Select
          v-model="currentLanguage"
          :label="$t('settings.language.inputLabel')"
          icon="lang"
          :options="languages"
          value-key="key"
          data-qa="settings__language-field"
          @change="changeLanguage"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Select from '@/components/UI/Select';
import { useStore } from 'vuex';
import { ref } from 'vue';

export default {
  name: 'Language',
  components: { Select },
  props: {},
  setup() {
    const store = useStore();
    const languages = store.getters['i18n/locales'];
    const currentLanguage = ref(store.getters['i18n/locale']);

    const changeLanguage = async (value) => {
      await store.dispatch('i18n/setLocale', value);
      window.location.reload();
    };

    return {
      languages,
      currentLanguage,
      changeLanguage,
    };
  },
};
</script>

<style lang="scss" scoped>
.language {
  height: 100%;
  padding: 40px 45px;
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
    @include md {
      font-size: 14px;
      line-height: 24px;
    }
    &-text {
      margin-bottom: 27px;
    }
  }
  &__input {
    height: 68px;
    margin-bottom: 32px;
  }
}
</style>
