<template>
  <div class="transaction-info-modal-content">
    <TxStatuses :info="info" :current-wallet="currentWallet" />
    <InfoBlock :current-wallet="currentWallet" :info="info" />
    <div v-if="info.view" class="inner-tx">
      <div
        v-for="(item, ndx) in info.view"
        :key="ndx"
        :class="{ empty: !item.components?.length }"
        class="inner-tx__view-item"
      >
        <template v-if="item.components">
          <div
            :class="{
              empty: !item.components?.length,
              last: info.view.length - 1 === ndx,
            }"
            class="icon-type"
          >
            <img width="32" height="32" :src="item.icon" />
            <div>{{ item.type }}</div>
          </div>
          <div
            v-for="(component, n) in item.components"
            :key="n"
            class="inner-tx__view-item-component"
          >
            <div
              v-if="
                !['amount_collection', 'text_collection'].includes(
                  component.type
                )
              "
              class="title"
            >
              {{ component.title }}
            </div>
            <div
              v-if="
                !['amount_collection', 'text_collection'].includes(
                  component.type
                )
              "
              class="line"
            />
            <div v-if="component.type === 'amount'" class="value">
              <div
                class="value-amount"
                :style="{
                  color: component?.value?.symbol ? '#6A4BFF' : '#262b61',
                }"
              >
                {{ component.value.text }}
                <transition name="fade1">
                  <span v-if="isCopied" class="input__tooltip">
                    {{ $t('copiedToClipboard') }}
                  </span>
                </transition>
              </div>
              <div class="value-symbol">
                {{ component.value.symbol.slice(0, 5) }}
              </div>
            </div>
            <div
              v-if="['text', 'textWithURL'].includes(component.type)"
              class="value"
            >
              <div
                class="value-amount"
                :style="{
                  cursor:
                    component.value === info.view[0].components[0]?.value
                      ? 'pointer'
                      : 'initial',
                }"
                @click="copyValue(component.value)"
              >
                {{ component.value.text || component.value }}
              </div>
            </div>
            <!-- structure in type -->
            <div
              v-if="component.type === 'amount_collection'"
              class="flex-value"
            >
              <div
                v-for="(componentInner, key) in component.value"
                :key="key"
                class="inner-tx__view-item-component-flex"
              >
                <div class="value">
                  <div class="value-symbol">
                    {{ componentInner.symbol }}
                  </div>
                  <div class="title">{{ componentInner.text }}</div>
                </div>
              </div>
            </div>
            <!-- text_collection -->
            <div v-if="component.type === 'text_collection'" class="flex-value">
              <div
                v-for="(componentInner, key) in component.value"
                :key="key"
                class="inner-tx__view-item-component-flex"
              >
                <div class="value">
                  <div class="value-symbol">
                    {{ componentInner.text }}
                  </div>
                  <div class="title">{{ componentInner.weight }}</div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <!-- <div
      v-if="currentWallet.hasTransactionComment"
      class="transaction-info-modal-content__textarea"
    >
      <div
        v-if="showPlaceholder"
        class="transaction-info-modal-content__textarea-placeholder"
        data-qa="transaction-info-modal__comment-button"
        @click.stop="togleShowPlaceholder"
      >
        <comment />
        <span class="transaction-info-modal-content__textarea-title">
          {{ $t('comment') }}
        </span>
        <span class="transaction-info-modal-content__textarea-subtitle">
          {{ $t('commentPlaceholder') }}
        </span>
      </div>
      <div v-else class="transaction-info-modal-content__textarea-textarea">
        <Textarea
          id="comment"
          icon="text"
          :value="txComment"
          :label="$t('comment')"
          :placeholder="$t('enterTextComment')"
          data-qa="transaction-info-modal__comment-field"
          @update:value="$emit('update:txComment', $event)"
        />
      </div>
    </div> -->
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import copyToClipboard from '@/helpers/copyToClipboard';
// import Textarea from '@/components/UI/Textarea';
// import comment from '@/assets/icons/comment.svg';
import InfoBlock from './InfoBlock.vue';
import TxStatuses from './TxStatuses';

export default {
  namae: 'TransactionInfoModalContent',
  components: {
    InfoBlock,
    // comment,
    // Textarea,
    TxStatuses,
  },
  props: {
    info: {
      type: Object,
      default: () => ({}),
    },
    currentWallet: {
      type: Object,
      default: () => ({}),
    },
    txComment: {
      type: String,
    },
  },
  setup(props) {
    const showPlaceholder = ref(!props.info.note);
    const isCopied = ref(false);
    const togleShowPlaceholder = () => {
      showPlaceholder.value = false;
      // nextTick(() => document.getElementById('comment').focus());
    };
    onMounted(() => {
      togleShowPlaceholder();
    });
    const copyValue = (e) => {
      if (e === props.info.view[0].components[0].value) {
        copyToClipboard(e);
        isCopied.value = true;

        setTimeout(() => {
          isCopied.value = false;
        }, 1500);
      }
    };
    return { copyValue, isCopied, showPlaceholder, togleShowPlaceholder };
  },
};
</script>

<style lang="scss" scoped>
$blue-dark: #262b61;

.transaction-info-modal-content {
  padding-top: 15px;
  width: 100%;
  display: flex;
  flex-direction: column;

  .inner-tx {
    margin-top: 20px;

    &__view {
      margin-top: 10px;
    }

    &__view-item {
      position: relative;
      margin-top: 50px;
      margin-bottom: 15px;
      background: #f0f3fd;
      border-radius: 8px;
      padding: 16px;
      box-sizing: border-box;

      .icon-type {
        display: flex;
        align-items: center;
        position: absolute;
        left: 0;
        top: -40px;

        &.empty {
          &.last {
            top: -5px;
          }
        }

        img {
          // margin-bottom: 10px;
        }

        div {
          margin-left: 10px;
        }
      }

      &.empty {
        border: none;
        padding: 0;
        margin: 10px 0;
      }

      .title {
        color: #6b93c0;
      }

      .flex-value {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
      }

      .value {
        display: flex;
        align-items: center;
        margin-bottom: 7px;

        .value-amount {
          font-size: 13px;
          margin-right: 5px;
          color: $blue-dark;
          font-family: 'Panton_Bold';
          word-break: break-all;
          text-align: right;
          padding-left: 1px;
        }

        .value-symbol {
          font-size: 13px;
          color: $blue-dark;
        }
      }
    }

    &__view-item-component {
      display: flex;
      justify-content: space-between;
      margin-top: 5px;
      align-items: center;
      .title {
        font-size: 14px;
        margin-bottom: 7px;
      }

      .line {
        flex-grow: 1;
        border: 0.01rem dashed #c3ceeb;
        height: 1px;
      }

      .inner-tx__view-item-component-flex {
        flex-direction: column;
        display: flex;

        .value {
          display: flex;
          flex-direction: column;
          align-items: flex-start;

          .value-symbol {
            font-size: 11px;
          }
        }
      }
    }
  }

  &__textarea {
    padding-top: 17px;
  }
  &__textarea-placeholder {
    cursor: pointer;
    padding-top: 41px;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 180px;
    border: 1px dashed $too-ligth-blue;
    box-sizing: border-box;
    border-radius: 8px;
  }
  &__textarea-title {
    font-size: 18px;
    line-height: 30px;
    font-family: 'Panton_Bold';
    margin-top: 13px;
    margin-bottom: 2px;
  }
  &__textarea-subtitle {
    font-size: 14px;
    line-height: 20px;
    letter-spacing: -0.02em;
    color: $ligth-blue;
    font-family: 'Panton_SemiBold';
  }
  &__textarea-textarea {
    height: 120px;
  }
}

.input {
  &__tooltip {
    background-color: $too-ligth-gray;
    text-align: center;
    border-radius: 6px;
    padding: 8px 9px;
    position: absolute;
    white-space: nowrap;
    z-index: 1;
    top: 38px;
    left: 50%;
    transform: translate(-50%, 7px);
    box-shadow: 0 4px 25px rgba(63, 54, 137, 0.25);
    font-size: 12px;
    line-height: 16px;
    color: $too-dark-blue;

    &::after {
      content: '';
      position: absolute;
      bottom: 98%;
      left: 50%;
      margin-left: -5px;
      border-width: 5px;
      border-radius: 2px;
      border-style: solid;
      border-color: transparent transparent $too-ligth-gray transparent;
    }
  }
}
</style>
