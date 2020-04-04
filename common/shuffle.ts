// Fisher–Yates Shuffle
export default function* shuffle<T>(
  arr: T[]
): Generator<{ swap: number[]; snapshot: T[] }> {
  let i = arr.length - 1;

  for (i; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;

    yield {
      swap: [j, i],
      snapshot: arr
    };
  }
}
