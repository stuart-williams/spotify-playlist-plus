import React from "react";
import { NextPage, NextPageContext } from "next";
import { parseCookies } from "nookies";
import redirect from "../../common/redirect";
import { actions as playlistActions } from "../../redux/playlists";
import * as playlistApi from "../../api/playlists";
import Layout from "../../components/Layout";
import Playlist from "../../components/Playlist";

interface Props {
  title?: string;
}

const Page: NextPage<Props> = ({ title }) => (
  <Layout title={title} primaryPanel={<Playlist />} />
);

Page.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
  const { [process.env.TOKEN_COOKIE]: token } = parseCookies(ctx);

  if (!token) {
    redirect("/", ctx);
  } else {
    const [list, playlist] = await Promise.all([
      playlistApi.getListOfPlaylists(ctx),
      playlistApi.getPlaylistById(String(ctx.query.id), ctx),
    ]);

    ctx.store.dispatch(playlistActions.setListOfPlaylists(list.data));
    ctx.store.dispatch(playlistActions.setPlaylist(playlist.data));

    return {
      title: playlist.data.name,
    };
  }

  return {};
};

export default Page;
