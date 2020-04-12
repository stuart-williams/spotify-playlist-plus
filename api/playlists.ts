import { NextPageContext } from "next";
import shuffle from "lodash.shuffle";
import arrayMove from "array-move";
import fetch from "../common/fetch";
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

const reorderTrack = (
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

const reorderTracks = async (
  playlistId: string,
  unordered: string[],
  ordered: string[]
) => {
  const tmp = [...unordered];
  const it = ordered[Symbol.iterator]();

  const next = async (snapshotId?: string): Promise<void> => {
    const { done, value } = it.next();

    if (!done) {
      const from = tmp.findIndex((id) => id === value);
      const to = ordered.findIndex((id) => id === value);
      const { data } = await reorderTrack(playlistId, from, to, snapshotId);

      arrayMove.mutate(tmp, from, to);

      return next(data.snapshot_id);
    }
  };

  return next();
};

export const randomise = async (playlist: SpotifyApi.PlaylistObjectFull) => {
  const unordered = playlist.tracks.items.map((item) => item.track.id);
  const ordered = shuffle(unordered);

  return reorderTracks(playlist.id, unordered, ordered);
};

export interface SortByAudioFeatureOptions {
  playlist: SpotifyApi.PlaylistObjectFull;
  key: "tempo" | "danceability" | "valence";
  order: "ASC" | "DESC";
}

export const sortByAudioFeature = async ({
  playlist,
  key,
  order,
}: SortByAudioFeatureOptions) => {
  const unordered = playlist.tracks.items.map((item) => item.track.id);
  const { data } = await tracksApi.getAudioFeatures(unordered);
  const ordered = data.audio_features
    .sort((a, b) => {
      const av = a[key];
      const bv = b[key];
      return order === "ASC" ? av - bv : bv - av;
    })
    .map((item) => item.id);

  return reorderTracks(playlist.id, unordered, ordered);
};
