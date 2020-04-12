import React from "react";
import Head from "next/head";

export default () => (
  <>
    <Head>
      <link rel="stylesheet" href="/css/main.min.css" />
    </Head>
    <div className="Entry">
      <h1>Playlist +</h1>
      <h3>Advanced playlist management for Spotify</h3>
      <a className="button" href={process.env.AUTHORIZE_URL}>
        Connect with Spotify
      </a>
    </div>
  </>
);
