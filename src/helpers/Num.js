export const range = (min, max) => {
  return min + (max - min) * Math.random();
};

export const maxTextlength = arr => {
  const arrLen = arr.length;
  const strLenArr = [];
  for (let i = 0; arrLen > i; i++) {
    strLenArr.push(arr[i].length);
  }
  return Math.max.apply(null, strLenArr);
};
