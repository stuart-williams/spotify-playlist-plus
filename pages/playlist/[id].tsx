import React from "react";
import { NextPageContext } from "next";
import { parseCookies } from "nookies";
import fetch from "../../common/fetch";
import redirect from "../../common/redirect";
import { actions as userActions } from "../../redux/user";
import { actions as playlistActions } from "../../redux/playlists";
import * as playlistApi from "../../api/playlists";
import IndexPage from "../index";

// TODO: Create Layout component
const Page = () => <IndexPage />;

Page.getInitialProps = async (ctx: NextPageContext) => {
  const { [process.env.TOKEN_COOKIE]: token } = parseCookies(ctx);

  if (!token) {
    redirect("/login", ctx);
  } else {
    const ssrRequests = () =>
      Promise.all([
        fetch<SpotifyApi.CurrentUsersProfileResponse>({ url: "me" }, ctx),
        playlistApi.fetchMyPlaylists(ctx)
      ]);

    const [playlist, ssrResponses] = await Promise.all([
      playlistApi.fetchPlaylistById(String(ctx.query.id), ctx),
      ctx.req && ssrRequests()
    ]);

    ctx.store.dispatch(playlistActions.setFocusedPlaylist(playlist.data));

    if (ssrResponses) {
      const [user, list] = ssrResponses;
      ctx.store.dispatch(userActions.setUser(user.data));
      ctx.store.dispatch(playlistActions.setListOfPlaylists(list.data));
    }
  }

  return {};
};

export default Page;
