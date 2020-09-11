export function shuffleArray(arr: any[]) {
  for (let i = 0; i < arr.length; i++) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    const tmp = arr[i];
    arr[i] = arr[randomIndex];
    arr[randomIndex] = tmp;
  }
}

export type MovesPool = {
  next: () => {
    value: [number, number] | undefined;
    done: boolean;
  };
};

export function createMovesPool(width: number, height = width): MovesPool {
  const pool: [number, number][] = Array(width * height);
  let i = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      pool[i++] = [x, y];
    }
  }
  shuffleArray(pool);

  return {
    next() {
      const value = pool.pop();
      return { value, done: !value };
    },
  };
}
