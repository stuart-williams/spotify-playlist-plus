import React from "react";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import redirect from "../common/redirect";
import { Button } from "@blueprintjs/core";

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
  <>
    <Head>
      <link
        href="https://unpkg.com/@blueprintjs/icons@^3.4.0/lib/css/blueprint-icons.css"
        rel="stylesheet"
      />
      <link
        href="https://unpkg.com/@blueprintjs/core@^3.10.0/lib/css/blueprint.css"
        rel="stylesheet"
      />
    </Head>
    <h1>Hello World</h1>
    <Button text="Click Me" />
  </>
);