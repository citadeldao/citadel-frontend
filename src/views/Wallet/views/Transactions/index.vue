<template>
  <TransactionsPlaceholder
    v-if="
      transactions?.length === 0 && currentPage === 1 && !txsFromMempool.length
    "
    :current-wallet="currentWallet"
  />
  <div v-else class="transactions">
    <div v-if="isLoading" class="transactions__loader">
      <Loading />
    </div>
    <table
      v-if="transactions?.length > 0 || txsFromMempool.length > 0"
      class="transactions__table"
    >
      <tr>
        <th class="radius-th-left header type">{{ $t('type') }}</th>
        <th class="header status">
          {{ $t('status') }}
        </th>
        <th class="header amount">{{ $t('amount') }}</th>
        <th class="header">
          {{ $t('timeDate') }}
        </th>
        <th class="header" />
      </tr>

      <!-- <template v-if="currentPage === 1">
        <TableRow
          v-for="tx in txsFromMempool"
          :key="tx.hash"
          :transaction="tx"
          :current-wallet="currentWallet"
          from-mempool
          @showTransactionInfo="showTransactionInfo"
          @editComment="editComment"
        />
      </template> -->

      <TableRow
        v-for="item in transactions"
        :key="item.hash"
        :transaction="item"
        :current-wallet="currentWallet"
        @showTransactionInfo="showTransactionInfo"
        @editComment="editComment"
      />
    </table>

    <div class="transactions__section">
      <div style="opacity: 0" class="transactions__export-csv">
        <fileExport />
        <span>CSV {{ $t('export') }}</span>
      </div>
      <div
        :class="{ column: (currentPage - 1) * pageLimit + 1 > 1000 }"
        class="transactions__pagination"
      >
        <div v-if="transactions?.length" class="transactions__item-count">
          <span class="transactions__current-amount">
            {{ (currentPage - 1) * pageLimit + 1 }} </span
          >&nbsp;
          <span class="transactions__total-amount">
            - {{ lastItemOnPage }}</span
          >
          <span class="transactions__total-amount"> / {{ total }}</span>
        </div>
        <el-pagination
          layout="pager"
          :page-size="pageLimit"
          :total="total"
          :current-page="currentPage"
          @current-change="setCurrentPage"
        />
        <el-select
          v-model="pageLimit"
          class="transactions__dropdown"
          @change="setLimit"
        >
          <el-option
            v-for="item in options"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </div>
    </div>
  </div>
  <WalletButtonsPanel
    :current-token="currentToken"
    :current-wallet="currentWallet"
    button2="swap"
    data-qa="transactions"
    @prepareClaim="$emit('prepareClaim')"
    @prepareXctClaim="$emit('prepareXctClaim')"
  />
  <teleport to="body">
    <Modal v-if="showModal">
      <ModalContent
        v-if="showEditCommentModal"
        v-click-away="modalCloseHandler"
        has-slot
        :title="$t('transactionsPage.editCommentModalTitle')"
        :desc="$t('transactionsPage.editCommentModalDesc')"
        button-text="save"
        type="action"
        @buttonClick="saveComment"
        @close="modalCloseHandler"
      >
        <template #default>
          <div class="transactions__edit-comment-modal-content">
            <div class="transactions__edit-comment-modal-content-textarea">
              <Textarea
                id="prevComment"
                v-model:value="txComment"
                icon="text"
                :label="$t('comment')"
                :placeholder="$t('enterTextComment')"
              />
            </div>
          </div>
        </template>
        <template #cancelButton>
          <span
            class="transactions__edit-comment-modal-cancel"
            @click="modalCloseHandler"
          >
            {{ $t('cancel') }}
          </span>
        </template>
      </ModalContent>
      <ModalContent
        v-if="showTransactionInfoModal"
        v-click-away="modalCloseHandler"
        :title="currentTransaction?.formatedStatus?.headerTitle"
        :desc="currentTransaction?.formatedStatus?.headerDescription"
        button-text="ok"
        data-qa="transaction-info-modal"
        @buttonClick="infoModalSubmit"
        @close="modalCloseHandler"
      >
        <TransactionInfoModalContent
          v-model:txComment="txComment"
          :current-wallet="currentWallet"
          :info="currentTransaction"
        />
      </ModalContent>
    </Modal>
  </teleport>
</template>

<script>
import { ref, computed, inject, nextTick, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import TransactionInfoModalContent from './components/TransactionInfoModalContent.vue';
import Textarea from '@/components/UI/Textarea';
import TableRow from './components/TableRow.vue';
import Loading from '@/components/Loading';
import WalletButtonsPanel from '@/components/WalletButtonsPanel';
import TransactionsPlaceholder from './components/TransactionsPlaceholder.vue';
import fileExport from '@/assets/icons/transactions/file-export.svg';
import Modal from '@/components/Modal';
import ModalContent from '@/components/ModalContent';

export default {
  name: 'Transactions',
  components: {
    fileExport,
    TransactionsPlaceholder,
    Loading,
    TableRow,
    WalletButtonsPanel,
    Modal,
    ModalContent,
    Textarea,
    TransactionInfoModalContent,
  },
  props: {
    currentWallet: {
      type: Object,
      default: () => ({}),
    },
    tokenList: {
      type: Array,
      default: () => [],
    },
    currentToken: {
      type: [Object, null],
      default: null,
    },
    subtokensIsLoading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['prepareClaim', 'prepareXctClaim'],
  setup(props) {
    const currentKtAddress = inject('currentKtAddress');
    const currentAddress = computed(() =>
      currentKtAddress.value
        ? currentKtAddress.value.address
        : route.params.address
    );
    const route = useRoute();
    const pageLimit = ref(10);
    const options = ref([10, 20, 50]);
    const currentPage = ref(1);

    const mempool = computed(() => store.getters['transactions/mempool']);
    const txsFromMempool = computed(() => {
      return mempool.value
        .filter((tx) => {
          const hasFrom =
            tx.from.toLowerCase() === currentAddress.value?.toLowerCase();
          const hasTo =
            tx.to.toLowerCase() === currentAddress.value?.toLowerCase();
          const txBelongToWallet =
            (hasFrom || hasTo) && tx.net === props.currentWallet.net;

          return txBelongToWallet;
        })
        .sort((a, b) => (a.date > b.date ? -1 : 1));
    });

    const setCurrentPage = (val) => {
      currentPage.value = val;
      getTransactions(props.currentWallet.id, val, pageLimit.value);
    };
    const setLimit = (val) => {
      currentPage.value = 1;
      getTransactions(props.currentWallet.id, currentPage.value, val);
    };

    const store = useStore();
    const isLoading = computed(
      () => store.getters['transactions/isTransactionsLoading']
    );
    const getTransactions = async (walletId, page, pageSize) => {
      await store.dispatch('transactions/getTransactions', {
        walletId,
        token: props.currentToken?.net,
        page,
        pageSize,
        kt: currentKtAddress.value?.address,
      });
    };

    const total = computed(() => {
      return store.getters['transactions/transactionsCount'];
    });

    const lastItemOnPage = computed(() => {
      const isLastPage =
        currentPage.value === Math.ceil(total.value / pageLimit.value);

      return isLastPage ? total.value : pageLimit.value * currentPage.value;
    });

    console.log('lastItemOnPage', total.value, pageLimit.value);

    getTransactions(props.currentWallet.id, currentPage.value, pageLimit.value);

    watch(
      () => route.params,
      () => {
        getTransactions(
          props.currentWallet.id,
          currentPage.value,
          pageLimit.value
        );
      }
    );
    watch(
      () => currentKtAddress.value,
      () => {
        getTransactions(
          props.currentWallet.id,
          currentPage.value,
          pageLimit.value
        );
      }
    );

    // если транзакция вышла из мемпула текущего кошелька, то обновляем транзакции
    watch(txsFromMempool, (newMempool, oldMempool) => {
      if (oldMempool.length > newMempool.length && currentPage.value === 1) {
        getTransactions(
          props.currentWallet.id,
          currentPage.value,
          pageLimit.value
        );
      }
    });

    const transactions = computed(() => {
      return store.getters['transactions/transactions'];
    });

    const showModal = ref(false);
    const showEditCommentModal = ref(false);
    const txComment = ref('');
    const currentTransaction = ref(null);
    const showTransactionInfoModal = ref(false);

    const modalCloseHandler = () => {
      showModal.value = false;
      showEditCommentModal.value = false;
      txComment.value = '';
      currentTransaction.value = null;
      showTransactionInfoModal.value = false;
    };
    const editComment = (transaction) => {
      showModal.value = true;
      showEditCommentModal.value = true;
      currentTransaction.value = transaction;
      txComment.value = transaction.note;
      nextTick(() => document.getElementById('prevComment').focus());
    };
    const saveComment = async () => {
      await store.dispatch('transactions/postTransactionNote', {
        network: route.params.token || route.params.net,
        hash: currentTransaction.value.hash,
        text: txComment.value,
      });
      await getTransactions(
        props.currentWallet.id,
        currentPage.value,
        pageLimit.value
      );
      modalCloseHandler();
    };
    const showTransactionInfo = async (transaction) => {
      currentTransaction.value = transaction;
      txComment.value = transaction.note;
      showModal.value = true;
      showTransactionInfoModal.value = true;

      if (props.currentWallet.hasTransactionComment) {
        // nextTick(() => document.getElementById('comment').focus());
      }
    };
    const infoModalSubmit = async () => {
      if (currentTransaction.value.note !== txComment.value) {
        saveComment();
      } else {
        modalCloseHandler();
      }
    };

    return {
      setCurrentPage,
      currentPage,
      options,
      pageLimit,
      transactions,
      txsFromMempool,
      setLimit,
      total,
      lastItemOnPage,
      isLoading,
      editComment,
      showTransactionInfo,
      showModal,
      showEditCommentModal,
      modalCloseHandler,
      txComment,
      saveComment,
      showTransactionInfoModal,
      currentTransaction,
      infoModalSubmit,
    };
  },
};
</script>

<style lang="scss" scoped>
.transactions {
  &__loader {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  justify-content: space-between;
  min-height: 311px;
  display: flex;
  flex-direction: column;
  margin: 42px 0 48px 0;
  @include lg {
    margin: 34px 0 38px 0;
  }
  @include md {
    margin: 23px 0 63px 0;
  }
  &__table-xl {
    display: none;
    @include xl {
      display: table-cell;
    }
  }
  &__table {
    border-collapse: separate;
    border-spacing: 0 0.5em;
    // border-collapse: collapse;
    // margin-bottom: 30px;
    @include lg {
      margin-bottom: 24px;
    }
    @include md {
      margin-bottom: 16px;
    }

    .radius-th-left {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }

    .radius-th-right {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }

  &__table-status {
    display: none;
    font-size: 16px;
    line-height: 19px;
    font-family: 'Panton_ExtraBold';
    @include xl {
      display: initial;
    }
  }
  & th {
    text-align: left;
    background: $too-ligth-gray;
    padding: 15px 0;
    font-size: 16px;
    line-height: 19px;
    font-style: normal;
    font-family: 'Panton_Regular';

    &.header {
      background: #e1e8fb;

      &.type {
        padding-right: 180px;
      }

      &.status {
        @include md {
          display: none;
        }
      }

      &.amount {
        @include md {
          display: none;
        }
      }
    }

    &:first-child {
      padding-left: 24px;
      @include md {
        padding-right: 16px;
      }
    }
    &:last-child {
      text-align: right;
      padding-right: 20px;
      @include lg {
        padding-right: 24px;
      }
      @include md {
        padding-right: 15px;
      }
    }
  }
  &__section {
    display: flex;
    justify-content: space-between;
  }
  &__export-csv {
    display: flex;
    align-items: center;
    &:hover {
      cursor: pointer;
      & span {
        color: $blue;
      }
    }
    & svg {
      margin-right: 9px;
    }
    & span {
      font-size: 16px;
      line-height: 19px;
      color: $ligth-blue;
      font-family: 'Panton_Bold';
    }
  }
  &__pagination {
    display: flex;
    align-items: center;

    &.column {
      flex-direction: column;
      align-items: flex-end;

      .transactions__item-count {
        margin-right: 5px;
      }
    }
  }
  &__dropdown {
    width: 80px;
    height: 40px;
    margin-left: 20px;
  }
  &__item-count {
    display: flex;
    margin-right: 32px;
  }
  &__current-amount,
  &__total-amount {
    font-size: 16px;
    line-height: 19px;
    font-family: 'Panton_SemiBold';
    color: $dark-blue;
  }
  &__total-amount {
    color: $mid-gray;
  }
  &__edit-comment-modal-cancel {
    font-size: 18px;
    line-height: 27px;
    font-family: 'Panton_Bold';
    text-decoration-line: underline;
    color: $too-dark-blue;
    margin-top: 24px;
    cursor: pointer;
    &:hover {
      color: $blue;
    }
  }
  &__edit-comment-modal-content {
    padding-top: 24px;
    width: 100%;
  }
  &__edit-comment-modal-content-textarea {
    height: 120px;
  }
}
</style>
