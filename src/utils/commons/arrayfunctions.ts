export const findMax = (arr: number[]) => {
  let max = arr[0];
  arr.forEach((item) => {
    if (item > max) max = item;
  });
  return max;
};
