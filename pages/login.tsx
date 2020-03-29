import React from "react";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";

export const getServerSideProps: GetServerSideProps = async ctx => {
  const { [process.env.TOKEN_COOKIE]: tokens } = parseCookies(ctx);

  if (tokens) {
    ctx.res.writeHead(302, { Location: "/" });
    ctx.res.end();
  }

  return {
    props: {}
  };
};

export default () => <a href={process.env.AUTHORIZE_URL}>Login</a>;
