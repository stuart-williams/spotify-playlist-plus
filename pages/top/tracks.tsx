import React from "react";
import { NextPageContext } from "next";
import { parseCookies } from "nookies";
import redirect from "../../common/redirect";
import { actions as userActions } from "../../redux/user";
import { actions as playlistActions } from "../../redux/playlists";
import { actions as topActions } from "../../redux/top";
import * as userApi from "../../api/user";
import * as playlistApi from "../../api/playlists";
import * as tracksApi from "../../api/tracks";
import Layout from "../../components/Layout";
import TopTracks from "../../components/TopTracks";

const Page = () => <Layout primaryPanel={<TopTracks />} />;

Page.getInitialProps = async (ctx: NextPageContext) => {
  const { [process.env.TOKEN_COOKIE]: token } = parseCookies(ctx);

  if (!token) {
    redirect("/login", ctx);
  } else {
    const [user, list, top] = await Promise.all([
      userApi.getUser(ctx),
      playlistApi.getListOfPlaylists(ctx),
      tracksApi.getTopTracks("long_term", ctx),
    ]);

    ctx.store.dispatch(userActions.setUser(user.data));
    ctx.store.dispatch(playlistActions.setListOfPlaylists(list.data));
    ctx.store.dispatch(topActions.setTopTracks(top.data));
  }

  return {};
};

export default Page;