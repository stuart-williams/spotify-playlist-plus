import { NextPageContext } from "next";
import fetch from "../common/fetch";

export const getArtistsTopTracks = (
  id: string,
  ctx?: Pick<NextPageContext, "req" | "res">
) =>
  fetch<SpotifyApi.ArtistsTopTracksResponse>(
    {
      url: `artists/${id}/top-tracks`,
      params: {
        country: "from_token",
      },
    },
    ctx
  );
