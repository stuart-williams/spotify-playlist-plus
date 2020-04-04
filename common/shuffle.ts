import fetch from "./fetch";

// Fisher–Yates Shuffle
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
  fetch<SpotifyApi.ReorderPlaylistTracksResponse>({
    method: "put",
    url: `playlists/${id}/tracks`,
    data: {
      range_start: rangeStart,
      insert_before: insertBefore,
      snapshot_id: snapshotId
    }
  });

export const shufflePlaylist = (playlist: SpotifyApi.PlaylistObjectFull) =>
  new Promise((resolve, reject) => {
    const { id, tracks } = playlist;
    const ar = tracks.items.map(({ track }) => track.name);
    const it = shuffle<string>(ar);

    const next = async (snapshotId?: string) => {
      const { done, value } = it.next();

      if (done) {
        return resolve();
      }

      try {
        const r1 = await moveTrack(
          id,
          value.swap[0],
          value.swap[1],
          snapshotId
        );
        const r2 = await moveTrack(
          id,
          value.swap[1],
          value.swap[0],
          r1.data.snapshot_id
        );

        next(r2.data.snapshot_id);
      } catch (error) {
        reject(error);
      }
    };

    next();
  });
