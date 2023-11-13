<template>
  <div class="language">
    <h5 class="language__title">
      {{ $t('settings.language.title') }}
    </h5>
    <span class="language__description">
      {{ $t('settings.language.description') }}
    </span>
    <Select
      v-model="currentLanguage"
      icon="lang"
      :options="languages"
      value-key="key"
      data-qa="settings__language-field"
      @change="changeLanguage"
      class="language__input"
    />
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
  @include card-default;
  &__title {
    @include title-default;
    margin: 0;
  }
  &__description {
    @include text-default;
    margin: 5px 0 10px;
  }

  &__input {
    height: 68px;
    margin: 0;
  }
}

body.dark {
  .language {
    &__title {
      color: $white;
    }
  }
}
</style>
