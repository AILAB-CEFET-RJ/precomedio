export const Pagination = (data, num, numPage) => {
  let sizeArray = data.length;
  const countArray = 5;
  let listNum = [];
  if (numPage) {
    num = parseInt(numPage);
  }
  for (let np = 0; np < Math.ceil(sizeArray / countArray); np++) {
    listNum[np] = np;
  }
  let beginArray = countArray * num;
  let finishArray = beginArray + countArray;
  data = data.slice(beginArray, finishArray);
  return [data, listNum]
}