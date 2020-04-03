// https://bost.ocks.org/mike/shuffle/

export default function* shuffle(arr: any[]) {
  let m = arr.length; // current item
  let t; // temp value for swapping items
  let i; // index of swap item

  while (m) {
    i = Math.floor(Math.random() * m--);

    yield [i, m];

    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }
}
