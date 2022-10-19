export const parseTagsList = (extensionsList) => {
  return (
    extensionsList
      .map((app) => {
        return app.tags.map((tag) => (tag.isInternal ? tag.name : ''));
      })
      // .filter((tags) => tags.length)
      .reduce((prev, curr) => {
        return prev.concat(curr);
      }, [])
      .filter((item, pos, arr) => {
        return !!item && arr.indexOf(item) == pos;
      })
  );
};

export const filteredApps = (
  extensionsList,
  selectedTags,
  filterItems,
  searchStr
) => {
  const baseList = extensionsList.filter((app) => {
    let findTag;
    app.tags.forEach((tag) => {
      if (filterItems.includes(tag.name)) {
        findTag = true;
      }
    });
    return !findTag;
  });

  if (!searchStr.length) {
    if (!selectedTags.length) {
      return baseList;
    }

    return extensionsList
      .filter((app) => {
        let findTag;
        app.tags.forEach((tag) => {
          if (filterItems.includes(tag.name)) {
            findTag = true;
          }
        });
        return findTag;
      })
      .concat(baseList);
  }

  if (!selectedTags.length) {
    return baseList.filter((app) => app.name.toLowerCase().includes(searchStr));
  }

  return extensionsList
    .filter((app) => {
      let findTag;
      app.tags.forEach((tag) => {
        if (filterItems.includes(tag.name)) {
          findTag = true;
        }
      });
      return findTag;
    })
    .concat(baseList)
    .filter((app) => app.name.toLowerCase().includes(searchStr));
};
