import { NextPageContext } from "next";
import { parseCookies } from "nookies";
import redirect from "./redirect";
import * as userApi from "../api/user";
import * as playlistsApi from "../api/playlists";
import { actions as userActions } from "../redux/user";
import { actions as playlistsActions } from "../redux/playlists";

export const authCheck = async (ctx: NextPageContext) => {
  const { [process.env.TOKEN_COOKIE]: token } = parseCookies(ctx);

  if (!token) {
    redirect("/", ctx);
  }
};

export const commonUpstream = async (ctx: NextPageContext) => {
  const fetchUser = () =>
    userApi.getUser(ctx).then((user) => {
      ctx.store.dispatch(userActions.setUser(user.data));
    });

  const fetchListOfPlaylists = () =>
    playlistsApi.getListOfPlaylists(ctx).then((list) => {
      ctx.store.dispatch(playlistsActions.setListOfPlaylists(list.data));
    });

  return Promise.all([ctx.req && fetchUser(), fetchListOfPlaylists()]);
};
