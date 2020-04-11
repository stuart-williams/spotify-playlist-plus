import { NextPageContext } from "next";
import move from "array-move";
import fetch from "../common/fetch";
import shuffle from "../common/shuffle";
import * as tracksApi from "../api/tracks";

export const getListOfPlaylists = (
  ctx?: Pick<NextPageContext, "req" | "res">
) =>
  fetch<SpotifyApi.ListOfCurrentUsersPlaylistsResponse>(
    {
      url: "me/playlists",
      params: {
        limit: 50,
      },
    },
    ctx
  );

export const getPlaylistById = (
  id: string,
  ctx?: Pick<NextPageContext, "req" | "res">
) =>
  fetch<SpotifyApi.PlaylistObjectFull>(
    {
      url: `playlists/${id}`,
    },
    ctx
  );

export const reorderTrack = (
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
      snapshot_id: snapshotId,
    },
  });

export const randomise = async (playlist: SpotifyApi.PlaylistObjectFull) => {
  const { id, tracks } = playlist;
  const ar = tracks.items.map(({ track }) => track.name);
  const it = shuffle<string>(ar);

  const next = async (snapshotId?: string): Promise<any> => {
    const { done, value } = it.next();

    if (!done) {
      const r1 = await reorderTrack(
        id,
        value.swap[0],
        value.swap[1],
        snapshotId
      );
      const r2 = await reorderTrack(
        id,
        value.swap[1],
        value.swap[0],
        r1.data.snapshot_id
      );

      return next(r2.data.snapshot_id);
    }
  };

  return next();
};

export interface SortByAudioFeatureOptions {
  playlist: SpotifyApi.PlaylistObjectFull;
  key: "tempo" | "danceability";
  order: "ASC" | "DESC";
}

export const sortByAudioFeature = async (
  options: SortByAudioFeatureOptions
) => {
  const { playlist, key, order } = options;
  const ids = playlist.tracks.items.map((item) => item.track.id);
  const { data: tracksData } = await tracksApi.getAudioFeatures(ids);
  const features = tracksData.audio_features;
  const sortedFeatures = features.sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    return order === "ASC" ? av - bv : bv - av;
  });
  const sortedIds = sortedFeatures.map(({ id }) => id);
  const it = sortedIds[Symbol.iterator]();

  const next = async (snapshotId?: string): Promise<any> => {
    const { done, value } = it.next();

    if (!done) {
      const from = ids.findIndex((id) => id === value);
      const to = sortedIds.findIndex((id) => id === value);
      const { data } = await reorderTrack(playlist.id, from, to, snapshotId);

      move.mutate(ids, from, to);

      return next(data.snapshot_id);
    }
  };

  return next();
};
