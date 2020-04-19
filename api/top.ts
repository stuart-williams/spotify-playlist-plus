import { NextPageContext } from "next";
import fetch from "../common/fetch";
import { getArtistsTopTracks } from "./artists";

export type TimeRange = "long_term" | "medium_term" | "short_term";

interface GetTopParams {
  limit?: number;
  time_range: TimeRange;
}

export const getTopTracks = (
  params: GetTopParams,
  ctx?: Pick<NextPageContext, "req" | "res">
) =>
  fetch<SpotifyApi.UsersTopTracksResponse>(
    {
      url: "me/top/tracks",
      params: {
        limit: params.limit,
        time_range: params.time_range,
      },
    },
    ctx
  );

export const getTopArtists = (
  params: GetTopParams,
  ctx?: Pick<NextPageContext, "req" | "res">
) =>
  fetch<SpotifyApi.UsersTopArtistsResponse>(
    {
      url: "me/top/artists",
      params: {
        limit: params.limit,
        time_range: params.time_range,
      },
    },
    ctx
  );

export type TopArtistsTopTopTracksResponse = Omit<
  SpotifyApi.UsersTopArtistsResponse,
  "items"
> & {
  items: SpotifyApi.TrackObjectFull[];
};

export const getTopArtistsTopTopTracks = async (
  params: GetTopParams,
  ctx?: Pick<NextPageContext, "req" | "res">
): Promise<TopArtistsTopTopTracksResponse> => {
  const { data: artists } = await getTopArtists(params, ctx);
  const tracks = await Promise.all(
    artists.items.map((item) => getArtistsTopTracks(item.id, ctx))
  );

  return {
    ...artists,
    items: tracks.reduce(
      (accum, { data }) => [...accum, ...data.tracks.slice(0, 3)],
      [] as SpotifyApi.TrackObjectFull[]
    ),
  };
};
