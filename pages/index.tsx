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

const styles = {
  display: "flex",
  height: "100vh",
  overflow: "hidden",
  minWidth: "800px"
};

export default () => (
  <div style={styles}>
    <div>
      <Navigation />
    </div>
    <div style={{ flex: 1 }}>
      <Playlist />
    </div>
  </div>
);
