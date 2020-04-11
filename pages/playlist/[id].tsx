import React from "react";
import { NextPageContext } from "next";
import { parseCookies } from "nookies";
import redirect from "../../common/redirect";
import { actions as userActions } from "../../redux/user";
import { actions as playlistActions } from "../../redux/playlists";
import * as userApi from "../../api/user";
import * as playlistApi from "../../api/playlists";
import Layout from "../../components/Layout";
import Playlist from "../../components/Playlist";

const Page = () => <Layout primaryPanel={<Playlist />} />;

Page.getInitialProps = async (ctx: NextPageContext) => {
  const { [process.env.TOKEN_COOKIE]: token } = parseCookies(ctx);

  if (!token) {
    redirect("/login", ctx);
  } else {
    const ssrRequests = () =>
      Promise.all([
        userApi.getCurrentUser(ctx),
        playlistApi.fetchMyPlaylists(ctx),
      ]);

    const [playlist, ssrResponses] = await Promise.all([
      playlistApi.fetchById(String(ctx.query.id), ctx),
      ctx.req && ssrRequests(),
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
