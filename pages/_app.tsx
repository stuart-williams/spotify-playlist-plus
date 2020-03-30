import React from "react";
import { AppProps } from "next/app";
import { NextSeo } from "next-seo";
import normalize from "../styles/global/normalize";
import global from "../styles/global";

export default ({ Component, pageProps }: AppProps) => (
  <>
    <NextSeo
      title="Spotify Playlist+"
      description="Advanced Spotify playlist management"
    />
    <Component {...pageProps} />
    <style jsx global>
      {normalize}
    </style>
    <style jsx global>
      {global}
    </style>
  </>
);
