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

export const rename = (
  id: string,
  name: string,
  ctx?: Pick<NextPageContext, "req" | "res">
) =>
  fetch(
    {
      method: "put",
      url: `playlists/${id}`,
      data: {
        name,
      },
    },
    ctx
  );

export const create = (userId: string, name: string) =>
  fetch<SpotifyApi.PlaylistObjectFull>({
    method: "post",
    url: `users/${userId}/playlists`,
    data: {
      name,
    },
  });

export const addTracksToPlaylist = (
  id: string,
  tracks: SpotifyApi.TrackObjectFull[]
) =>
  fetch<SpotifyApi.PlaylistObjectFull>({
    method: "post",
    url: `playlists/${id}/tracks`,
    data: {
      uris: tracks.map((track) => track.uri),
    },
  });

export const reorderTrack = (
  id: string,
  from: number,
  to: number,
  snapshotId?: string
) =>
  fetch<SpotifyApi.ReorderPlaylistTracksResponse>({
    method: "put",
    url: `playlists/${id}/tracks`,
    data: {
      range_start: from,
      insert_before: to > from ? to + 1 : to,
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

export const sortByAudioFeature = async (
  options: SortByAudioFeatureOptions
) => {
  const { playlist, key, order } = options;
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
