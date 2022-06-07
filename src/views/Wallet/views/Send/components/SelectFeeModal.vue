<template>
  <ModalContent
    :title="$t('transactionFee')"
    :desc="$t('sendModal.desc1')"
    :button-text="$t('confirm')"
    :disabled="invalidCustomFee"
    show-back-button
    @back-click="$emit('close')"
    @close="$emit('close')"
    @button-click="handleClickConfirm"
  >
    <div class="fee-modal-content">
      <div
        v-for="(fee, type) in fees"
        :key="type"
        class="fee-radio"
      >
        <input
          :id="type"
          v-model="selectedFeeType"
          type="radio"
          name="fee"
          :value="type"
          @change="changeHandler"
        >
        <label :for="type">
          <span>
            <span class="fee-radio__type">
              {{ type }}
            </span>
            <span class="fee-radio__amount">
              <span v-pretty-number="{ value: fee.fee, currency }" />
              {{ currency }}
            </span>
          </span>
          <checkmark class="fee-radio__checkmark" />
        </label>
      </div>

      <div class="fee-radio">
        <input
          id="custom"
          v-model="selectedFeeType"
          type="radio"
          name="fee"
          value="custom"
        >
        <label for="custom">
          <span class="fee-radio__type">
            Custom
          </span>
          <checkmark class="fee-radio__checkmark" />
        </label>
      </div>

      <transition name="slide-from-top">
        <div
          v-if="selectedFeeType === 'custom'"
          class="select-fee-input"
        >
          <Input
            id="amount"
            v-model="selectedCustomFee"
            type="currency"
            :label="$t('fee')"
            :currency="currency"
            icon="coins"
            placeholder="0.0"
            :show-error-text="invalidCustomFee"
            :error="invalidCustomFeeText"
            @input="inputHandler"
            @keyup.enter="handleClickConfirm"
          />
        </div>
      </transition>
    </div>

    <Modal v-if="showFeeErrorModal">
      <ModalContent
        v-click-away="closeFeeErrorModal"
        :title="$t('warning')"
        icon="warningIcon"
        :desc="$t('sendModal.changingModals.error')"
        button-text="ok"
        type="warning"
        @close.stop="closeFeeErrorModal"
        @buttonClick="closeFeeErrorModal"
      />
    </Modal>
  </ModalContent>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Input from '@/components/UI/Input';
import Modal from '@/components/Modal';
import ModalContent from '@/components/ModalContent';
import checkmark from '@/assets/icons/input/checkmark.svg';
import useWallets from '@/compositions/useWallets';

export default {
  name: 'SelectFeeModalContent',
  components: {
    Input,
    Modal,
    ModalContent,
    checkmark,
  },
  props: {
    feeType: {
      type: String,
      default: 'medium',
    },
    fees: {
      type: Object,
      default: () => {},
    },
    currency: {
      type: String,
      default: '',
    },
    customFee: {
      type: [Number, String],
      default: '',
    },
    balance: {
      type: Object,
      default: () => {},
    },
  },
  emits: ['close', 'confirm'],
  setup(props, { emit }) {
    const { t } = useI18n();
    const selectedFeeType = ref('');
    const selectedCustomFee = ref('');
    const showFeeErrorModal = ref(false);

    const isCustomSelected = computed(() => selectedFeeType.value === 'custom');

    const selectedFeeAmount = computed(() => isCustomSelected.value
      ? selectedCustomFee.value
      : props.fees[selectedFeeType.value].fee);

    const invalidCustomFee = computed(() => isCustomSelected.value
        && selectedCustomFee.value <= 0
        && selectedCustomFee.value === '');

    const invalidCustomFeeText = ref('');
    const inputHandler = ()=> {
      invalidCustomFeeText.value = invalidCustomFee.value ? t('sendModal.fee.invalidAmount') : false;
    };
    const changeHandler = ()=> {
      invalidCustomFeeText.value = '';
      selectedCustomFee.value = '';
    };

    onMounted(() => {
      selectedFeeType.value = props.feeType;
      selectedCustomFee.value = props.customFee || '';
    });

    const openFeeErrorModal = () => {
      showFeeErrorModal.value = true;
    };

    const closeFeeErrorModal = () => {
      showFeeErrorModal.value = false;
    };

    const { currentWallet } = useWallets();

    const validateFee = () => {
      if (selectedFeeAmount.value > currentWallet.value.balance.mainBalance) {
        openFeeErrorModal();

        return false;
      }

      return true;
    };

    const handleClickConfirm = () => {
      if (!validateFee()) {
        return;
      }
      emit('confirm', {
        type: selectedFeeType.value,
        custom: isCustomSelected.value
          ? selectedCustomFee.value
          : 0,
      });
    };

    return {
      validateFee,
      selectedFeeType,
      selectedCustomFee,
      showFeeErrorModal,
      invalidCustomFee,
      invalidCustomFeeText,
      openFeeErrorModal,
      closeFeeErrorModal,
      handleClickConfirm,
      inputHandler,
      changeHandler,
    };
  },
};
</script>

<style lang="scss" scoped>
.fee-modal-content {
  width: 100%;
  margin-top: 24px;
}

.fee-radio {
  position: relative;
  width: 100%;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }

  &__checkmark {
    display: none;
    height: 17px;
  }

  &__type {
    display: inline-block;
    width: 100px;
    font-family: "Panton_SemiBold";
    text-transform: capitalize;
    color: $mid-blue;
  }

  &__amount {
    font-family: "Panton_SemiBold";
    color: $slategray;
  }

  & > input[type="radio"] {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    opacity: 0;
    cursor: pointer;

    & + label {
      display: flex;
      justify-content: space-between;
      padding: 14px 16px;
      border-radius: 8px;
      background-color: $too-ligth-gray;
      font-size: 16px;
    }

    &:checked + label {
      background-color: $dark-blue;

      .fee-radio {
        &__checkmark {
          display: initial;
        }

        &__type,
        &__amount {
          color: $white;
        }
      }
    }
  }
}

// faster slide-top transition
.slide-from-top-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.select-fee-input{
  height: 68px;
}
</style>
