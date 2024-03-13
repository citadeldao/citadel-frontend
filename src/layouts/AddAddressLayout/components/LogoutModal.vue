<template>
  <teleport to="body">
    <Modal>
      <ModalContent
        v-click-away="close"
        hide-header
        :submit-button="false"
        @close="close"
      >
        <div class="logout-modal">
          <h4 class="logout-modal__header">
            {{ $t('logout.modal.title') }}
          </h4>

          <div v-if="hasWallets" class="logout-modal__form">
            <div class="logout-modal__checkbox">
              <Checkbox
                id="erase"
                :value="options.erase"
                :label="$t('logout.modal.eraseBtn')"
                @input="updateOptions($event, 'erase')"
              />
            </div>
            <div class="logout-modal__checkbox">
              <Checkbox
                id="backup"
                :value="options.backup"
                :label="$t('logout.modal.downloadBackup')"
                @input="updateOptions($event, 'backup')"
              />
            </div>
            <div class="logout-modal__checkbox">
              <Checkbox
                id="write"
                :value="options.write"
                :label="$t('logout.modal.write')"
                @input="updateOptions($event, 'write')"
              />
            </div>
          </div>

          <div class="logout-modal__footer">
            <PrimaryButton class="logout-modal__button" @click="close">
              {{ $t('no') }}
            </PrimaryButton>
            <TextButton @click="$emit('confirm')">
              {{ $t('yes') }}
            </TextButton>
          </div>
        </div>
      </ModalContent>
    </Modal>
  </teleport>
</template>

<script>
import { onMounted } from 'vue';
import Modal from '@/components/Modal';
import ModalContent from '@/components/ModalContent';
import PrimaryButton from '@/components/UI/PrimaryButton';
import TextButton from '@/components/UI/TextButton';
import Checkbox from '@/components/UI/Checkbox';

export default {
  name: 'LogoutModal',
  components: {
    Modal,
    ModalContent,
    PrimaryButton,
    TextButton,
    Checkbox,
  },
  props: {
    options: {
      type: Object,
      default: () => {},
    },
    hasWallets: {
      type: Boolean,
    },
    hasMnemonic: {
      type: Boolean,
    },
  },
  emits: ['close', 'confirm', 'update:options', 'resetLogoutOptions'],
  setup(props, { emit }) {
    const close = () => {
      console.log('close');
      emit('close');
    };
    const updateOptions = (event, option) => {
      emit('update:options', {
        ...props.options,
        [option]: event.target.value !== 'true',
      });
    };

    onMounted(async () => {
      emit('resetLogoutOptions');
    });

    return {
      close,
      updateOptions,
    };
  },
};
</script>

<style lang="scss" scoped>
.logout-modal {
  &__header {
    font-size: 20px;
    text-align: center;
  }

  &__form {
    margin-bottom: 34px;
  }

  &__footer {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__button {
    margin-bottom: 24px;
  }

  &__checkbox {
    min-height: 28px;
    margin-bottom: 16px;
  }
}

body.dark {
  .logout-modal {
    &__header {
      color: $white;
    }
  }
}
</style>
