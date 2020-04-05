import "../styles/main.scss";

import React from "react";
import { NextPageContext } from "next";
import { parseCookies } from "nookies";
import fetch from "../common/fetch";
import redirect from "../common/redirect";
import { actions } from "../redux/user";
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
    const { data: user } = await fetch<SpotifyApi.CurrentUsersProfileResponse>(
      {
        url: "me"
      },
      ctx
    );

    ctx.store.dispatch(actions.setUser(user));
  }

  return {};
};

export default Page;
