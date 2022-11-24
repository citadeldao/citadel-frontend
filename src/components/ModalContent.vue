<template>
  <div
    class="modal_content"
    :style="{ width }"
    :class="`modal_content--${type}`"
  >
    <div class="modal_content__header" />
    <div class="modal_content__content">
      <closeIcon
        v-if="!hideClose"
        class="modal_content__close-icon"
        :data-qa="dataQa && `${dataQa}__close-button`"
        @click.stop="$emit('close', $event)"
      />
      <div v-if="title" class="modal_content__block-header">
        <div
          v-if="internalIcon"
          class="modal_content__block-header-internal-icon"
        >
          <img :src="internalIcon" width="32" height="32" />
        </div>
        <div v-if="icon" class="modal_content__block-header-icon">
          <keep-alive>
            <component :is="currentIcon" />
          </keep-alive>
        </div>
        <div class="modal_content__block-header-text">
          <h4 class="modal_content__block-header-title">
            {{ title }}
            <successIcon v-if="showSuccessIcon" />
          </h4>
          <span
            v-if="desc"
            class="modal_content__block-header-desc"
            v-html="desc"
          />
        </div>
      </div>
      <slot />
      <slot name="footer">
        <div v-if="buttonText2" class="modal_content__buttons-block">
          <div class="modal__btn">
            <!-- WITH CUSTOM COLOR -->
            <PrimaryButton
              v-if="primaryMainBgColor"
              :bg-color="primaryMainBgColor"
              :hover-bg-color="primaryMainHoverBgColor"
              :disabled="disabled"
              :loading="loading"
              @click.stop="clickHandler"
            >
              {{ buttonText }}
            </PrimaryButton>
            <!-- DEFAULT COLOR -->
            <PrimaryButton
              v-else
              :disabled="disabled"
              :loading="loading"
              @click.stop="clickHandler"
            >
              {{ buttonText }}
            </PrimaryButton>
          </div>
          <div class="modal__btn modal__btn-second">
            <PrimaryButton
              :disabled="disabled2"
              no-decoration
              @click.stop="clickHandler2"
            >
              {{ buttonText2 }}
            </PrimaryButton>
          </div>
        </div>
        <div
          v-else-if="buttonText"
          class="modal__btn"
          :style="{ justifyContent: !hasSlot ? 'center' : '' }"
        >
          <PrimaryButton
            v-if="submitButton"
            ref="primaryButton"
            :disabled="disabled"
            :loading="loading"
            :data-qa="`${$t(buttonText).replace(' ', '-')}`"
            @click.stop="clickHandler"
          >
            {{ $t(`${buttonText}`) }}
          </PrimaryButton>

          <slot name="cancelButton" />
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
import closeIcon from '@/assets/icons/close-icon.svg';
import PrimaryButton from '@/components/UI/PrimaryButton';
import TextButton from '@/components/UI/TextButton';
import { markRaw, ref } from '@vue/reactivity';
import successIcon from '@/assets/icons/extensions/success.svg';

export default {
  name: 'ModalContent',
  components: { PrimaryButton, TextButton, closeIcon, successIcon },
  props: {
    hideClose: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    showSuccessIcon: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: '600px',
    },
    submitButton: {
      type: Boolean,
      default: true,
    },
    buttonText: {
      type: String,
    },
    buttonText2: {
      type: String,
    },
    icon: {
      type: String,
    },
    internalIcon: {
      type: String,
    },
    type: {
      type: String,
    },
    title: {
      type: [String, Error],
    },
    desc: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    disabled2: {
      type: Boolean,
      default: false,
    },
    hasSlot: {
      type: Boolean,
      default: false,
    },
    showBackButton: {
      type: Boolean,
      default: false,
    },
    dataQa: {
      type: [String, null],
      default: null,
    },
    // custom colors for btn
    primaryMainBgColor: {
      type: String,
      default: '',
    },
    primaryMainHoverBgColor: {
      type: String,
      default: '',
    },
  },
  emits: ['close', 'buttonClick', 'buttonClick2', 'backClick'],
  setup(props, { emit }) {
    const currentIcon = ref();
    const primaryButton = ref(null);
    props.icon &&
      import(`@/assets/icons/${props.icon}.svg`).then((val) => {
        currentIcon.value = markRaw(val.default);
      });
    const clickHandler = () => {
      emit('buttonClick');
    };
    const clickHandler2 = () => {
      emit('buttonClick2');
    };

    return { currentIcon, primaryButton, clickHandler, clickHandler2 };
  },
};
</script>

<style lang="scss" scoped>
.modal_content {
  position: relative;
  margin: auto;
  &--warning {
    .modal_content__header {
      background: $red;
    }
    .modal_content__block-header {
      // padding-bottom: 31px;
    }
  }
  &--success {
    .modal_content__header {
      background: $green;
    }
    .modal_content__block-header {
      // padding-bottom: 31px;
    }
  }
  &--action {
    .modal_content__header {
      background: $ligth-blue;
    }
    .modal_content__block-header {
      // padding-bottom: 20px;
    }
  }
  &--system {
    .modal_content__header {
      background: $mid-blue;
    }
    .modal_content__block-header {
      padding-bottom: 0;
      border-bottom: none;
    }
  }
  &--action-image {
    .modal_content__block-header {
      padding-top: 27px;
      border-bottom: none;
      display: block;
      & svg {
        width: auto;
        height: auto;
      }
    }
    .modal_content__block-header-icon {
      width: fit-content;
      height: auto;
      margin: 0 auto 24px;
    }
    .modal_content__block-header-internal-icon {
      width: fit-content;
      height: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
    }
    .modal_content__block-header-title {
      text-align: center;
    }
    .modal_content__block-header-desc {
      text-align: center;
    }
  }
  display: flex;
  flex-direction: column;
  background: $white;
  border-radius: 16px;
  box-shadow: 15px 15px 15px rgba(63, 54, 137, 0.2);
  &__buttons-block {
    display: flex;
    flex-direction: column;
  }
  &__content {
    display: flex;
    flex-direction: column;
    padding: 31px 40px 40px 40px;
    align-items: center;
    position: relative;
  }
  &__header {
    height: 16px;
    background: $dark-blue;
    border-radius: 16px 16px 0px 0px;
  }
  &__close-icon {
    position: absolute;
    right: 39px;
    top: 31px;
    cursor: pointer;
    width: 16px;
    height: 24px;
    &:hover {
      fill: $dark-blue;
    }
  }
  &__block-header {
    padding-bottom: 20px;
    display: flex;
    width: 100%;
    border-bottom: 1px dashed $lightsteelblue;
  }
  &__block-header-icon {
    width: 46px;
    height: 46px;
    margin-right: 19px;

    & svg {
      width: 46px;
      height: 46px;
    }
  }

  &__block-header-internal-icon {
    margin-top: 2px;
    background: $white; // linear-gradient(90deg, #f3e7ff 0%, #cde6ff 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 46px;
    height: 46px;
    margin-right: 19px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 8px;

    & svg {
      width: 46px;
      height: 46px;
    }
  }

  &__block-header-text {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  &__block-header-title {
    text-align: left;
    font-size: 20px;
    line-height: 30px;
    margin: 0;
    font-family: 'Panton_Bold';
    // width: 507px;
    margin-top: 5px;
  }
  &__block-header-desc {
    font-size: 14px;
    line-height: 22px;
    color: $mid-blue;
    span {
      color: $too-dark-blue;
    }
  }
  & button {
    margin-top: 32px;
  }
}

.modal__btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  & button {
    @include lg {
      order: 2;
    }
    @include md {
      order: 2;
    }
  }
  @include lg {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
  }
  @include md {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
  }
  &-second {
    margin-top: -8px;
    display: flex;
    justify-content: center;
  }
  &--back {
    justify-content: center;

    button {
      margin-top: 17px;
    }
  }
}
</style>
