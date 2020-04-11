import { NextPageContext } from "next";
import fetch from "../common/fetch";

export const getUser = (ctx?: Pick<NextPageContext, "req" | "res">) =>
  fetch<SpotifyApi.CurrentUsersProfileResponse>({ url: "me" }, ctx);
