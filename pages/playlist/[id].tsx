import React from "react";
import { NextPage, NextPageContext } from "next";
import { authCheck, commonUpstream } from "../../common/gip";
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
  authCheck(ctx);

  const [playlist] = await Promise.all([
    playlistApi.getPlaylistById(String(ctx.query.id), ctx),
    commonUpstream(ctx),
  ]);

  ctx.store.dispatch(playlistActions.setPlaylist(playlist.data));

  return {
    title: playlist.data.name,
  };
};

export default Page;
