import { ref, computed } from 'vue';

export default function usePaginationWithSearch(array, itemsCount, pageSizesOpts, initialPage) {
  const arr = ref(array);
  const pageSizes = ref(pageSizesOpts);
  const pageSize = ref(pageSizesOpts[0]);
  const currentPage = ref(initialPage);
  // const keyword = ref('');

  /* const searching = computed(() => {
    if (!keyword.value) {
      total.value = arr.value.length;

      return arr.value;
    }

    currentPage.value = 1;

    return arr.value.filter((data) =>
      data.title.toLowerCase().includes(keyword.value.toLowerCase())
        || data.abbr.toLowerCase().includes(keyword.value.toLowerCase()),
    );
  });*/

  const total = computed(() => {
    return arr.value.length;
  });

  const displayData = computed(() => {
    return arr.value.slice(
      pageSize.value * currentPage.value - pageSize.value,
      pageSize.value * currentPage.value,
    );
  });

  const setCurrentPage = (val) => {
    currentPage.value = val;
  };
  const setPageSize = (size) => {
    pageSize.value = size;
  };

  return {
    displayData,
    total,
    currentPage,
    pageSizes,
    pageSize,
    setCurrentPage,
    setPageSize,
  };
}
