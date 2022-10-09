export const generateGameState = (size = 7) => {
  if (size % 2 === 0) return;
  const resultArr = [];
  const low = 2;
  const high = size - 3;
  const middle = Math.floor(size / 2);
  for (let r = 0; r < size; r++) {
    const row = [];
    for (let c = 0; c < size; c++) {
      let value = "1";
      if (r < low && c < low) value = "X";
      if (r > high && c < low) value = "X";
      if (r < low && c > high) value = "X";
      if (r > high && c > high) value = "X";
      if (r === middle && c === middle) value = "0";
      row.push(value);
    }
    resultArr.push(row);
  }
  return resultArr;
};
