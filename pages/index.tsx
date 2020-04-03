import "../styles/main.scss";

import React from "react";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import redirect from "../common/redirect";
import Navigation from "../components/Navigation";

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
  <div
    style={{
      width: 300,
      display: "flex",
      height: "100vh",
      overflow: "hidden"
    }}
  >
    <Navigation />
  </div>
);
