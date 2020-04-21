import React from "react";
import { GetServerSideProps } from "next";
import { setCookie } from "nookies";
import { fetchToken } from "../common/fetch";
import redirect from "../common/redirect";
import * as debug from "../common/debug";
import Layout from "../components/Layout";
import Entry from "../components/Entry";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const { error, code } = ctx.query;

    if (error) {
      throw new Error(String(error));
    }

    const { data } = await fetchToken(String(code));

    setCookie(ctx, process.env.TOKEN_COOKIE, data.access_token, {
      maxAge: data.expires_in,
    });

    redirect("/", ctx);
  } catch (error) {
    debug.error(error);
  }

  return {
    props: {},
  };
};

export default () => <Layout primaryComponent={Entry} />;
