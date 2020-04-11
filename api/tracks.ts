import { NextPageContext } from "next";
import fetch from "../common/fetch";

export const fetchAudioFeatures = (
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
