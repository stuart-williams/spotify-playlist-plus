import fetch from "./fetch";

// https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb
export function* shuffle<T>(
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

const moveTrack = (
  id: string,
  rangeStart: number,
  insertBefore: number,
  snapshotId?: string
) =>
  fetch({
    method: "put",
    url: `playlists/${id}/tracks`,
    data: {
      range_start: rangeStart,
      insert_before: insertBefore,
      snapshot_id: snapshotId
    }
  });

export const shufflePlaylist = (playlist: SpotifyApi.PlaylistObjectFull) => {
  return new Promise(resolve => {
    const { id, tracks } = playlist;
    const ar = tracks.items.map(({ track }) => track.name);
    const it = shuffle<string>(ar);

    let snapshotId: any;

    const next = async () => {
      const { done, value } = it.next();

      if (done) {
        resolve();
      } else {
        const r1 = await moveTrack(
          id,
          value.swap[0],
          value.swap[1],
          snapshotId
        );
        snapshotId = r1?.data?.snapshot_id;
        const r2 = await moveTrack(
          id,
          value.swap[1],
          value.swap[0],
          snapshotId
        );
        snapshotId = r2?.data?.snapshot_id;
        next();
      }
    };

    next();
  });
};
