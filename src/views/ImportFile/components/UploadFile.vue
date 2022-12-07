<template>
  <div class="upload-file">
    <span class="upload-file__title">{{ $t('importFile.title') }}</span>
    <div class="upload-file__drag-input">
      <div
        class="drag-input"
        :class="{
          'drag-input_file': file,
          'drag-input_is-loading': isLoading,
          'drag-input_file-incorrect': fileIncorrect,
        }"
      >
        <input
          v-if="!file"
          data-qa="file-input"
          type="file"
          name="file-input"
          accept=".citadel"
          @change="handleFileInput"
        />
        <div
          v-if="!isLoading && !file && !fileIncorrect"
          class="drag-input__placeholder"
        >
          <download />
          <span> {{ $t('importFile.selectBackupFile') }} </span>
        </div>

        <div v-else-if="isLoading" class="drag-input__isLoading">
          <Loading />
          <span> {{ $t('loadingFile') }} </span>
        </div>

        <div
          v-else-if="fileIncorrect"
          class="drag-input__placeholder drag-input__placeholder_incorrect"
        >
          <incorrectFile />
          <span> {{ $t('incorrectFile') }} </span>
        </div>

        <div v-else-if="!isLoading && file" class="drag-input__file">
          <div class="drag-input__icon">
            <downloadedFile class="drag-input__file-icon" />
            <deleteX class="drag-input__delete-icon" @click="removeFile" />
          </div>
          <span>{{ file.name }}</span>
        </div>
      </div>
    </div>
    <PrimaryButton :disabled="!file" @click="clickHandler" data-qa="Import">
      {{ $t('import') }}
    </PrimaryButton>
  </div>
</template>

<script>
import incorrectFile from '@/assets/icons/incorrectFile.svg';
import deleteX from '@/assets/icons/delete.svg';
import downloadedFile from '@/assets/icons/downloaded-file.svg';
import Loading from '@/components/Loading';
import download from '@/assets/icons/download.svg';
import PrimaryButton from '@/components/UI/PrimaryButton';
import { ref, inject, watch } from 'vue';
export default {
  name: 'UploadFile',
  components: {
    PrimaryButton,
    download,
    Loading,
    downloadedFile,
    deleteX,
    incorrectFile,
  },
  emits: ['backupLoaded', 'loadOldFormat'],
  setup(props, { emit }) {
    const isLoading = ref(false);
    const fileIncorrect = ref(false);
    const nextStep = inject('nextStep');
    const file = ref(null);
    const backup = ref(null);

    watch(
      () => file.value,
      (file) => {
        if (file) {
          readFile(file);
          isLoading.value = false;
        }
      }
    );

    watch(
      () => fileIncorrect.value,
      (val) => {
        if (val) {
          file.value = null;
        }
      }
    );

    const handleFileInput = (e) => {
      fileIncorrect.value = false;
      isLoading.value = true;
      const [payload] = e.target.files;

      if (!payload?.name?.match(/.citadel$/)) {
        isLoading.value = false;
        file.value = null;

        return;
      }

      file.value = payload;
    };

    const removeFile = () => {
      file.value = null;
    };

    const readFile = (file) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          backup.value = JSON.parse(event.target.result);

          if (
            !(
              backup.value?.privateWallets?.length ||
              backup.value?.wallets?.length
            ) &&
            !backup.value[0].id
          ) {
            fileIncorrect.value = true;
          }
        } catch (error) {
          fileIncorrect.value = true;
          alert(error);
          console.error(error);
        }
      };

      reader.readAsText(file);
    };

    const clickHandler = () => {
      emit('backupLoaded', backup.value);

      if (backup.value[0] && backup.value[0].id) {
        emit('loadOldFormat');

        return;
      }

      nextStep();
    };

    return {
      clickHandler,
      file,
      handleFileInput,
      removeFile,
      isLoading,
      fileIncorrect,
    };
  },
};
</script>

<style lang="scss" scoped>
.upload-file {
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
  &__title {
    font-family: 'Panton_ExtraBold';
    font-size: 20px;
    line-height: 30px;
    margin-bottom: 25px;
    text-align: center;
    @include lg {
      font-size: 18px;
      line-height: 30px;
    }
    @include md {
      font-size: 16px;
      line-height: 30px;
    }
  }
  &__drag-input {
    margin-bottom: 32px;
    @include md {
      margin-bottom: 24px;
    }
  }
}
.drag-input {
  width: 710px;
  height: 250px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background: $aliceblue;
  border: 2px dashed $blue;
  border-radius: 8px;
  position: relative;
  @include lg {
    width: 570px;
    height: 200px;
  }
  @include md {
    width: 484px;
    height: 200px;
  }

  &_file {
    background: $white;
  }

  &_is-loading {
    background: $too-ligth-gray2;
    border-color: $mid-gray;
  }

  &_file-incorrect {
    border-color: $red;
    background: $ligth-red2;
  }

  & input {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    opacity: 0;
    filter: alpha(opacity=0);
  }
  &__placeholder {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    & span {
      font-size: 18px;
      line-height: 22px;
      text-align: center;
      letter-spacing: -0.02em;
      color: $blue;
      font-family: 'Panton_SemiBold';
      margin-top: 27px;
      @include lg {
        font-size: 16px;
        line-height: 19px;
        margin-top: 15px;
      }
    }
    &_incorrect {
      & span {
        color: $red;
      }
    }
    & svg {
      width: 80px;
      height: 80px;
      @include lg {
        width: 60px;
        height: 60px;
      }
    }
  }
  &__isLoading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    & span {
      font-size: 18px;
      line-height: 22px;
      text-align: center;
      letter-spacing: -0.02em;
      color: $blue;
      font-family: 'Panton_SemiBold';
      margin-top: 27px;
      @include lg {
        font-size: 16px;
        line-height: 19px;
        margin-top: 15px;
      }
    }
  }
  &__file {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    & span {
      font-size: 18px;
      line-height: 22px;
      font-family: 'Panton_SemiBold';
      text-align: center;
      letter-spacing: -0.02em;
      @include lg {
        font-size: 16px;
        line-height: 19px;
      }
    }
  }
  &__file-icon {
    margin-bottom: 26px;
    width: 80px;
    height: 80px;
    @include lg {
      width: 60px;
      height: 60px;
      margin-top: 15px;
    }
  }
  &__delete-icon {
    position: absolute;
    top: -9px;
    right: -35px;
    width: 24px;
    height: 24px;
    cursor: pointer;
  }
  &__icon {
    position: relative;
  }
}
</style>
