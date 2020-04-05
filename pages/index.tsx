import "../styles/main.scss";

import React from "react";
import { NextPageContext } from "next";
import { parseCookies } from "nookies";
import fetch from "../common/fetch";
import redirect from "../common/redirect";
import { actions as userActions } from "../redux/user";
import { actions as playlistActions } from "../redux/playlists";
import * as playlistApi from "../api/playlists";
import Navigation from "../components/Navigation";
import Playlist from "../components/Playlist";

const styles = {
  display: "flex",
  height: "100vh",
  overflow: "hidden"
};

const Page = () => (
  <div style={styles}>
    <div>
      <Navigation />
    </div>
    <div style={{ flex: 1 }}>
      <Playlist />
    </div>
  </div>
);

Page.getInitialProps = async (ctx: NextPageContext) => {
  const { [process.env.TOKEN_COOKIE]: token } = parseCookies(ctx);

  if (!token) {
    redirect("/login", ctx);
  } else {
    const [user, myPlaylists] = await Promise.all([
      fetch<SpotifyApi.CurrentUsersProfileResponse>({ url: "me" }, ctx),
      playlistApi.fetchMyPlaylists(ctx)
    ]);

    ctx.store.dispatch(userActions.setUser(user.data));
    ctx.store.dispatch(playlistActions.setListOfPlaylists(myPlaylists.data));
  }

  return {};
};

export default Page;
