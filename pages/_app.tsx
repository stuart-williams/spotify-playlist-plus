import React from "react";
import { AppProps } from "next/app";
import { NextSeo } from "next-seo";
import { Provider } from "react-redux";
import withRedux, { ReduxWrapperAppProps } from "next-redux-wrapper";
import { makeStore } from "../redux";
import normalize from "../styles/global/normalize";

const App = ({
  Component,
  pageProps,
  store
}: AppProps & ReduxWrapperAppProps) => (
  <>
    <NextSeo
      title="Spotify Playlist+"
      description="Advanced Spotify playlist management"
    />
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
    <style jsx global>
      {normalize}
    </style>
  </>
);

export default withRedux(makeStore, {
  debug: process.env.NODE_ENV === "development"
})(App);
