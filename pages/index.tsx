import React from "react";
import { NextPageContext } from "next";
import { parseCookies } from "nookies";
import redirect from "../common/redirect";
import { actions as userActions } from "../redux/user";
import { actions as playlistActions } from "../redux/playlists";
import * as userApi from "../api/user";
import * as playlistApi from "../api/playlists";
import Layout from "../components/Layout";
import { NonIdealState } from "@blueprintjs/core";

const Page = () => (
  <Layout primaryPanel={<NonIdealState title="No search results" />} />
);

Page.getInitialProps = async (ctx: NextPageContext) => {
  const { [process.env.TOKEN_COOKIE]: token } = parseCookies(ctx);

  if (!token) {
    redirect("/login", ctx);
  } else if (ctx.req) {
    const [user, myPlaylists] = await Promise.all([
      userApi.getCurrentUser(ctx),
      playlistApi.fetchMyPlaylists(ctx)
    ]);

    ctx.store.dispatch(userActions.setUser(user.data));
    ctx.store.dispatch(playlistActions.setListOfPlaylists(myPlaylists.data));
  }

  return {};
};

export default Page;
