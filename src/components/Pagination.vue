<template>
  <div class="pagination">
    <div v-if="total > 0" class="pagination__item-count">
      <span class="pagination__current-amount">
        {{ (currentPage - 1) * pageSize + 1 }} </span
      >&nbsp;
      <span class="pagination__total-amount"> - {{ lastItemOnPage }}</span>
      <span class="pagination__total-amount"> / {{ total }}</span>
    </div>
    <div class="pagination__controls">
      <el-pagination
        layout="pager"
        :page-size="pageSize"
        :total="total"
        :current-page="currentPage"
        @current-change="setCurrentPage"
      />
      <el-select v-model="pageSizeValue" class="pagination__dropdown">
        <el-option
          v-for="item in pageSizes"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </div>
  </div>
</template>

<script>
import { ref, watch, computed } from 'vue';

export default {
  name: 'Pagination',
  props: {
    total: {
      type: Number,
      required: true,
    },
    currentPage: {
      type: Number,
      required: true,
    },
    pageSizes: {
      type: Array,
      default: () => [10, 25, 50],
    },
    pageSize: {
      type: Number,
      required: true,
    },
  },
  emits: ['change-page', 'change-page-size'],
  setup(props, { emit }) {
    const pageSizeValue = ref();
    const lastItemOnPage = computed(() => {
      const isLastPage =
        props.currentPage === Math.ceil(props.total / props.pageSize);

      return isLastPage ? props.total : props.pageSize * props.currentPage;
    });

    const setPageSize = (size) => {
      emit('change-page-size', size);
    };

    const setCurrentPage = (page) => {
      emit('change-page', page);
    };

    // el-select don't wants show :value correctly
    watch(
      () => props.pageSize,
      (value) => {
        pageSizeValue.value = value;
      },
      { immediate: true }
    );

    watch(pageSizeValue, (size) => {
      emit('change-page-size', size);
    });

    return {
      pageSizeValue,
      lastItemOnPage,
      setCurrentPage,
      setPageSize,
    };
  },
};
</script>

<style scoped lang="scss">
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__controls {
    display: flex;
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

  &__dropdown {
    width: 80px;
    height: 40px;
    margin-left: 20px;
  }
}
</style>

<style lang="scss">
.pagination {
  .el-pager {
    display: flex;
    align-items: center;
    height: 100%;
  }
}
</style>
