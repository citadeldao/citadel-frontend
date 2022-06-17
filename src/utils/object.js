export const pickKeys = (srcObj = {}, keys = []) => {
  const newObj = {};

  keys.forEach((key) => {
    // @ts-ignore
    if (srcObj.hasOwnProperty(key)) {
      newObj[key] = srcObj[key];
    }
  });

  return newObj;
};

export const pickValues = (srcObj = {}, keys = []) => {
  return keys.length
    ? Object.entries(srcObj)
        .map(([key, value]) => (keys.includes(key) ? value : undefined))
        .filter((val) => val)
    : Object.values(srcObj);
};
