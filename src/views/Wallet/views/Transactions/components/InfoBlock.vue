<template>
  <div class="info-block">
    <div v-if="info.hash" class="info-block__line" target="_blank">
      <div class="info-block__line-title flex-between">
        <div>
          {{ $t('viewTranscasction')
          }}<a target="_blank" :href="txUrl"
            ><linkIcon class="info-block__link-icon"
          /></a>
        </div>
        <div
          :class="{ hasComment: info.note }"
          class="comment-btn"
          @click="setComment"
        >
          {{
            customNote !== info.note
              ? $t('save')
              : info.note
              ? $t('editComment')
              : $t('addComment')
          }}
        </div>
      </div>
    </div>
    <div v-if="info.memo" class="info-block__line">
      <span class="info-block__line-title"> {{ $t('memo') }}: </span>
      <span class="info-block__line-to">
        {{ info.memo }}
      </span>
    </div>
    <div v-if="info.note || activateEdit">
      <div class="comment-label">{{ $t('comment') }}</div>
      <div v-if="!activateEdit" class="comment-value">{{ info.note }}</div>
      <textarea
        v-if="activateEdit"
        v-model="customNote"
        id="editComment"
        rows="4"
        class="comment-field"
      />
    </div>
    <div v-if="info.to" class="info-block__line">
      <span class="info-block__line-title"> {{ $t('sendTo') }}: </span>
      <span class="info-block__line-to">
        {{ info.to }}
      </span>
    </div>
    <div v-if="info.value" class="info-block__line">
      <span class="info-block__line-title"> {{ $t('amount') }}: </span>
      <div>
        <span
          v-pretty-number="{
            value: info.value,
            currency: formatedValueSymbol || currentWallet?.code,
          }"
          class="info-block__line-amount"
        />
        <span class="info-block__line-currency">
          {{ formatedValueSymbol || currentWallet?.code }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import linkIcon from '@/assets/icons/link.svg';
import { computed, ref, nextTick } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'InfoBlock',
  components: { linkIcon },
  props: {
    info: {
      type: Object,
      default: () => ({}),
    },
    currentWallet: {
      type: Object,
      default: () => ({}),
    },
  },

  setup(props) {
    const store = useStore();
    const activateEdit = ref(false);
    const customNote = ref(props.info.note);
    const txUrl = computed(() =>
      props.currentWallet?.getTxUrl(props.currentWallet.id, props.info.hash)
    );

    const formatedValueSymbol = computed(() => {
      if (!props.info.view) return '';
      const findType = props.info.view[0].components.find(
        (w) => w.type === 'amount'
      );
      return findType.value.symbol;
    });

    const setComment = async () => {
      if (activateEdit.value) {
        if (customNote.value !== props.info.note) {
          await store.dispatch('transactions/postTransactionNote', {
            network: props.currentWallet.net,
            hash: props.info.hash,
            text: customNote.value,
          });
          /* eslint-disable */
          props.info.note = customNote.value;
          activateEdit.value = false;
        }
        return;
      }

      // activate input
      activateEdit.value = true;
      nextTick(() => document.getElementById('editComment').focus());
    };

    return { txUrl, customNote, activateEdit, setComment, formatedValueSymbol };
  },
};
</script>

<style lang="scss" scoped>
.info-block {
  display: flex;
  flex-direction: column;
  &__line {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-top: 8px;
    text-decoration: none;
    & svg {
      margin-left: 10px;
    }
    &:first-child {
      margin-top: 0;
    }

    .value {
      color: #6b93c0;
    }
  }

  .comment-field {
    border: 1px solid #c3ceeb;
    border-radius: 8px;
    color: #6b758e;
    font-size: 14px;
    font-weight: 400;
    padding: 10px;
    width: 100%;
    resize: none;
    margin-top: 5px;

    &:focus {
      border: 1px solid #c3ceeb;
      outline: none;
    }
  }

  .comment-label {
    margin-top: 5px;
    font-size: 18px;
    font-weight: 700;
  }

  .comment-value {
    font-size: 14px;
    color: #54478f;
    margin-top: 5px;
  }

  &__line-title {
    display: flex;
    align-items: center;
    font-size: 14px;
    line-height: 30px;
    color: $gray;

    &.flex-between {
      width: 100%;
      display: flex;
      justify-content: space-between;

      .comment-btn {
        width: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 30px;
        background: rgba(43, 82, 231, 0.2);
        color: #1a53f0;
        font-family: 'Panton_Regular';
        border-radius: 6px;
        font-size: 13px;
        font-weight: 700;

        &.hasComment {
          background: rgba(236, 99, 55, 0.2);
          color: #ff5722;
        }

        &:hover {
          cursor: pointer;
        }
      }
    }
  }
  &__date,
  &__status,
  &__line-to,
  &__line-currency {
    font-size: 14px;
    line-height: 30px;
    word-break: break-word;
  }
  &__line-to {
    text-align: right;
  }
  &__status {
    font-family: 'Panton_Bold';
    text-transform: capitalize;
  }
  &__date {
    color: $mid-blue;
  }

  &__line-amount {
    font-family: 'Panton_Bold' !important;
    font-size: 16px;
    line-height: 19px;
    color: $blue;
    margin-right: 3px;
  }
  &__link-icon {
    width: 17px;
    height: 15px;
  }

  &__line-currency {
    color: $mid-gray;
  }
}
</style>
