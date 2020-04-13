import { NextPageContext } from "next";
import fetch from "../common/fetch";

export type TimeRange = "long_term" | "medium_term" | "short_term";

export const getTopTracks = (
  timeRange: TimeRange,
  ctx?: Pick<NextPageContext, "req" | "res">
) =>
  fetch<SpotifyApi.UsersTopTracksResponse>(
    {
      url: "me/top/tracks",
      params: {
        limit: 50,
        time_range: timeRange,
      },
    },
    ctx
  );

export interface CreateTopTracksPlaylistOptions {
  userId: string;
  name: string;
  tracks: SpotifyApi.TrackObjectFull[];
}

export const createTopTracksPlaylist = async (
  options: CreateTopTracksPlaylistOptions
): Promise<SpotifyApi.PlaylistObjectFull> => {
  const { data: playlist } = await fetch<SpotifyApi.PlaylistObjectFull>({
    method: "post",
    url: `users/${options.userId}/playlists`,
    data: {
      name: options.name,
    },
  });

  await fetch<SpotifyApi.PlaylistObjectFull>({
    method: "post",
    url: `playlists/${playlist.id}/tracks`,
    data: {
      uris: options.tracks.map((track) => track.uri),
    },
  });

  return playlist;
};
