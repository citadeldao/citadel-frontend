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
            <div v-if="component.type !== 'amount_collection'" class="title">
              {{ component.title }}
            </div>
            <div v-if="component.type !== 'amount_collection'" class="line" />
            <div v-if="component.type === 'amount'" class="value">
              <div class="value-amount">{{ component.value.text }}</div>
              <div class="value-symbol">{{ component.value.symbol }}</div>
            </div>
            <div v-if="component.type === 'text'" class="value">
              <div class="value-amount">{{ component.value }}</div>
            </div>
            <div v-if="component.type === 'textWithURL'" class="value">
              <a target="_blank" :href="component.value.url">{{
                component.value.text
              }}</a>
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
    const togleShowPlaceholder = () => {
      showPlaceholder.value = false;
      // nextTick(() => document.getElementById('comment').focus());
    };
    onMounted(() => {
      togleShowPlaceholder();
    });

    return { showPlaceholder, togleShowPlaceholder };
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
          color: $dark-blue;
          font-family: 'Panton_Bold';
          word-break: break-all;
          text-align: right;
          padding-left: 5px;
        }

        .value-symbol {
          font-size: 13px;
          color: $blue-dark;
        }

        a {
          color: $blue-dark;
          text-decoration: none;
          font-size: 13px;

          &:hover {
            color: $blue-dark;
            cursor: pointer;
          }
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
        border: 0.01rem dashed #a18eff;
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
</style>
