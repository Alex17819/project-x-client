// Algorithm Fisher-Yates (Durstenfeld shuffle)
export const generateMatrix = (rows: number, cols: number) => {
  if ((rows * cols) % 2 !== 0) {
    throw new Error("Количество ячеек должно быть чётным!");
  }

  const pairsCount = (rows * cols) / 2;
  const values = Array.from({ length: pairsCount }, (_, i) => i + 1).flatMap(
    (v) => [v, v]
  );

  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }

  const matrix: { value: number; isMatched: boolean }[][] = [];
  for (let i = 0; i < rows; i++) {
    matrix.push(
      values
        .slice(i * cols, (i + 1) * cols)
        .map((value) => ({ value, isMatched: false }))
    );
  }

  return matrix;
};
