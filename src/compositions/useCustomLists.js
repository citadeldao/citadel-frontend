export default function useCustomLists() {
  const existInList = (list, listName) =>
    list.some((item) => item.name === listName);

  return { existInList };
}
