import React from "react";
import Head from "next/head";
import { AppContext, AppProps } from "next/app";
import { NextSeo } from "next-seo";
import { Provider } from "react-redux";
import withRedux, { ReduxWrapperAppProps } from "next-redux-wrapper";
import { makeStore } from "../redux";

const App = ({
  Component,
  pageProps,
  store,
}: AppProps & ReduxWrapperAppProps) => (
  <>
    <Head>
      <link rel="shortcut icon" href="/favicon.ico" />
    </Head>
    <NextSeo
      title="Playlist +"
      description="Advanced playlist management for Spotify"
    />
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  </>
);

App.getInitialProps = async ({ Component, ctx }: AppContext) => ({
  pageProps: {
    ...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {}),
  },
});

export default withRedux(makeStore, {
  debug: process.env.NODE_ENV === "development",
})(App);
