import React from "react";
import { NextPageContext } from "next";
import { parseCookies } from "nookies";
import redirect from "../../common/redirect";
import { actions as playlistActions } from "../../redux/playlists";
import { actions as topActions } from "../../redux/top";
import * as playlistApi from "../../api/playlists";
import * as topApi from "../../api/top";
import Layout from "../../components/Layout";
import TopTracks from "../../components/TopTracks";

const Page = () => <Layout title="Top Tracks" primaryPanel={<TopTracks />} />;

Page.getInitialProps = async (ctx: NextPageContext) => {
  const { [process.env.TOKEN_COOKIE]: token } = parseCookies(ctx);

  if (!token) {
    redirect("/", ctx);
  } else {
    const [list, top] = await Promise.all([
      playlistApi.getListOfPlaylists(ctx),
      topApi.getTopTracks("long_term", ctx),
    ]);

    ctx.store.dispatch(playlistActions.setListOfPlaylists(list.data));
    ctx.store.dispatch(topActions.setTopTracks(top.data));
  }

  return {};
};

export default Page;
