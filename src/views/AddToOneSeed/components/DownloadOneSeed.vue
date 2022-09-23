<template>
  <div class="wrapper">
    <keep-alive>
      <component :is="icon" />
    </keep-alive>
    <h1>
      {{ $t('addToOneSeed.backUp.h1') }}
    </h1>
    <h2>
      {{ $t('addToOneSeed.backUp.h2') }}
    </h2>
    <h3>
      {{ $t('addToOneSeed.backUp.h3') }}
    </h3>
    <Checkbox
      disabled
      id="downloadCheck"
      :value="downloadCheck"
      :label="$t('migration.download')"
      @input="downloadCheck = !downloadCheck"
    />
    <PrimaryButton data-qa="Ok" @click="clickHandler">
      {{ $t('ok') }}
    </PrimaryButton>
  </div>
</template>
<script>
import { ref, markRaw, computed, inject } from 'vue';
import { useStore } from 'vuex';
import Checkbox from '@/components/UI/Checkbox';
import PrimaryButton from '@/components/UI/PrimaryButton';
import exportPrivateKeys from '@/helpers/exportPrivateKeys';
export default {
  name: 'DownloadOneSeed',
  components: {
    Checkbox,
    PrimaryButton,
  },
  emits: ['downloadedFile'],
  setup(props, { emit }) {
    const store = useStore();
    const nextStep = inject('nextStep');
    const downloadCheck = ref(false);
    const icon = ref();
    const keyStorage = computed(
      () => `user_${store.getters['profile/info'].id}`
    );
    import(`@/assets/icons/document-circle.svg`).then((val) => {
      icon.value = markRaw(val.default);
    });
    const clickHandler = async () => {
      if (downloadCheck.value) {
        exportPrivateKeys(keyStorage.value);

        emit('downloadedFile');
      }
      nextStep();
    };
    return { icon, downloadCheck, keyStorage, clickHandler };
  },
};
</script>
<style lang="scss" scoped>
.wrapper {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  text-align: center;
  h1 {
    font-weight: 700;
    font-size: 20px;
    line-height: 30px;
    color: #000000;
    max-width: 520px;
    margin: 31px 0 4px 0;
  }
  h2 {
    font-weight: 600;
    font-size: 14px;
    line-height: 22px;
    color: #6b93c0;
    max-width: 596px;
    margin: 0 0 8px 0;
  }
  h3 {
    font-weight: 700;
    font-size: 14px;
    line-height: 22px;
    color: #876dff;
    max-width: 521px;
    margin: 0 0 26px 0;
  }
  .checkbox {
    margin-bottom: 31px;
  }
}
</style>
