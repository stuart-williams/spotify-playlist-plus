import "../styles/main.scss";

import React from "react";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import redirect from "../common/redirect";
import Navigation from "../components/Navigation";
import Playlist from "../components/Playlist";

export const getServerSideProps: GetServerSideProps = async ctx => {
  const { [process.env.TOKEN_COOKIE]: token } = parseCookies(ctx);

  if (!token) {
    redirect("/login", ctx);
  }

  return {
    props: {}
  };
};

export default () => (
  <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
    <div>
      <Navigation />
    </div>
    <div style={{ flex: 1 }}>
      <Playlist />
    </div>
  </div>
);
