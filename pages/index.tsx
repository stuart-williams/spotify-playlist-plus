import React from "react";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import redirect from "../common/redirect";

export const getServerSideProps: GetServerSideProps = async ctx => {
  const { [process.env.TOKEN_COOKIE]: token } = parseCookies(ctx);

  if (!token) {
    redirect("/login", ctx);
  }

  return {
    props: {}
  };
};

export default () => <h1>Hello World</h1>;
