import React from "react";
import { NextPage, NextPageContext } from "next";
import { parseCookies } from "nookies";
import redirect from "../../common/redirect";
import { actions as userActions } from "../../redux/user";
import { actions as playlistActions } from "../../redux/playlists";
import * as userApi from "../../api/user";
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
    const ssrRequests = () =>
      Promise.all([userApi.getUser(ctx), playlistApi.getListOfPlaylists(ctx)]);

    const [playlist, ssrResponses] = await Promise.all([
      playlistApi.getPlaylistById(String(ctx.query.id), ctx),
      ctx.req && ssrRequests(),
    ]);

    ctx.store.dispatch(playlistActions.setPlaylist(playlist.data));

    if (ssrResponses) {
      const [user, list] = ssrResponses;
      ctx.store.dispatch(userActions.setUser(user.data));
      ctx.store.dispatch(playlistActions.setListOfPlaylists(list.data));
    }

    return {
      title: playlist.data.name,
    };
  }

  return {};
};

export default Page;
