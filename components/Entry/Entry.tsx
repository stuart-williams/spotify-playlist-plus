import React from "react";
import Head from "next/head";

export default () => {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="/css/main.css" />
      </Head>
      <div className="Entry">
        <h1>Playlist +</h1>
        <a href={process.env.AUTHORIZE_URL}>Login</a>
      </div>
    </>
  );
};
