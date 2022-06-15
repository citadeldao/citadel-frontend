import { ref } from 'vue';

export default function useCheckItem() {
  const checkedItems = ref([]);
  const checked = (id) => {
    return checkedItems.value.some((item) => item === id);
  };

  const addItem = (id) => {
    checkedItems.value.push(id);
  };
  const removeItem = (id) => {
    checkedItems.value = checkedItems.value.filter((item) => item !== id);
  };

  const addSingleItem = (id) => {
    checkedItems.value = [];
    addItem(id);
  };

  return {
    checked,
    addItem,
    removeItem,
    checkedItems,
    addSingleItem,
  };
}
