import { NextPageContext } from "next";
import fetch from "../common/fetch";

export const getAudioFeatures = (
  ids: string[],
  ctx?: Pick<NextPageContext, "req" | "res">
) =>
  fetch<SpotifyApi.MultipleAudioFeaturesResponse>(
    {
      url: "audio-features",
      params: {
        ids: ids.join(","),
      },
    },
    ctx
  );

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
