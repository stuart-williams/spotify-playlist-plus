import fetch from "../common/fetch";
import shuffle from "../common/shuffle";

export const fetchMyPlaylists = () =>
  fetch<SpotifyApi.ListOfCurrentUsersPlaylistsResponse>({
    url: "me/playlists",
    params: {
      limit: 50
    }
  });

export const fetchPlaylistById = (id: string) =>
  fetch<SpotifyApi.PlaylistObjectFull>({
    url: `playlists/${id}`
  });

export const reorderPlaylistTrack = (
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

export const randomisePlaylist = async (
  playlist: SpotifyApi.PlaylistObjectFull
) => {
  const { id, tracks } = playlist;
  const ar = tracks.items.map(({ track }) => track.name);
  const it = shuffle<string>(ar);

  const next = async (snapshotId?: string): Promise<any> => {
    const { done, value } = it.next();

    if (done) {
      return;
    }

    const r1 = await reorderPlaylistTrack(
      id,
      value.swap[0],
      value.swap[1],
      snapshotId
    );

    const r2 = await reorderPlaylistTrack(
      id,
      value.swap[1],
      value.swap[0],
      r1.data.snapshot_id
    );

    return next(r2.data.snapshot_id);
  };

  return next();
};
