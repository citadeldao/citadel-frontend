<template>
  <div class="transaction-info-modal-content">
    <InfoBlock :current-wallet="currentWallet" :info="info" />
    <div
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
    </div>
  </div>
</template>

<script>
import { ref, nextTick, onMounted } from 'vue';
import Textarea from '@/components/UI/Textarea';
import comment from '@/assets/icons/comment.svg';
import InfoBlock from './InfoBlock.vue';
export default {
  namae: 'TransactionInfoModalContent',
  components: { InfoBlock, comment, Textarea },
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
      nextTick(() => document.getElementById('comment').focus());
    };
    onMounted(() => {
      togleShowPlaceholder();
    });

    return { showPlaceholder, togleShowPlaceholder };
  },
};
</script>

<style lang="scss" scoped>
.transaction-info-modal-content {
  padding-top: 15px;
  width: 100%;
  display: flex;
  flex-direction: column;
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
