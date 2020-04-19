import { NextPageContext } from "next";
import fetch from "../common/fetch";

export type TimeRange = "long_term" | "medium_term" | "short_term";

interface GetTopParams {
  limit?: number;
  time_range: TimeRange;
}

export const getTop = (
  type: "tracks" | "artists",
  params: GetTopParams,
  ctx?: Pick<NextPageContext, "req" | "res">
) =>
  fetch<SpotifyApi.UsersTopTracksResponse>(
    {
      url: `me/top/${type}`,
      params: {
        limit: params.limit,
        time_range: params.time_range,
      },
    },
    ctx
  );
