<template>
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
          <deleteX class="drag-input__delete-icon" @click.stop="removeFile" />
        </div>
        <span>{{ file.name }}</span>
      </div>
    </div>
  </div>
  <form @submit.prevent="submitHandler">
    <div class="password-input">
      <Input
        id="password"
        v-model="password"
        :label="$t('enterPasswordBackupLabel')"
        type="password"
        icon="key"
        :placeholder="$t('password')"
        :error="inputError"
      />
    </div>
    <PrimaryButton :disabled="!!inputError || !file">
      {{ $t('confirm') }}
    </PrimaryButton>
  </form>
</template>

<script>
import useCheckPassword from '@/compositions/useCheckPassword';
import Input from '@/components/UI/Input';
import PrimaryButton from '@/components/UI/PrimaryButton';
import incorrectFile from '@/assets/icons/incorrectFile.svg';
import deleteX from '@/assets/icons/delete.svg';
import downloadedFile from '@/assets/icons/downloaded-file.svg';
import Loading from '@/components/Loading';
import download from '@/assets/icons/download.svg';
import { ref, watch } from '@vue/runtime-core';
import CryptoCoin from '@/models/CryptoCoin';
import notify from '@/plugins/notify';

export default {
  emits: ['passwordConfirmed'],
  name: 'ImportModalContent',
  components: {
    Input,
    PrimaryButton,
    download,
    Loading,
    downloadedFile,
    deleteX,
    incorrectFile,
  },
  setup(props, { emit }) {
    const isLoading = ref(false);
    const fileIncorrect = ref(false);
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
          if (!backup.value?.passwordHash) {
            notify({
              type: 'warning',
              text: 'Backup password hash is null',
            });
            removeFile();
            return;
          }

          if (!(backup.value?.passwordHash && backup.value?.mnemonic)) {
            fileIncorrect.value = true;
          }
          dynamicHash.value = backup.value?.passwordHash;
        } catch (error) {
          fileIncorrect.value = true;
        }
      };

      reader.readAsText(file);
    };

    const submitHandler = () => {
      if (passwordError.value) {
        inputError.value = passwordError.value;

        return;
      }
      emit('passwordConfirmed', {
        password: password.value,
        mnemonic: CryptoCoin.decodeMnemonic(
          backup.value?.mnemonic,
          password.value
        ),
      });
    };
    const { password, passwordError, inputError, dynamicHash } =
      useCheckPassword();
    return {
      isLoading,
      fileIncorrect,
      file,
      handleFileInput,
      removeFile,
      submitHandler,
      inputError,
      password,
    };
  },
};
</script>

<style lang="scss" scoped>
.upload-file {
  &__drag-input {
    width: 100%;
    margin-top: 20px;
    margin-bottom: 32px;
    @include md {
      margin-bottom: 24px;
    }
  }
}
.drag-input {
  height: 250px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background: $aliceblue;
  border: 2px dashed $blue;
  border-radius: 8px;
  position: relative;

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
form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  .password-input {
    width: 100%;
    height: 68px;
    margin-bottom: 32px;
  }
}
</style>
