import React from "react";
import Head from "next/head";
import normalize from "../styles/global/normalize";
import { AppContext, AppProps } from "next/app";
import { NextSeo } from "next-seo";
import { Provider } from "react-redux";
import withRedux, { ReduxWrapperAppProps } from "next-redux-wrapper";
import { makeStore } from "../redux";

const App = ({
  Component,
  pageProps,
  store
}: AppProps & ReduxWrapperAppProps) => (
  <>
    <Head>
      <link rel="shortcut icon" href="/favicon.ico" />
    </Head>
    <NextSeo title="Spotify – Playlist +" />
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
    <style jsx={true} global={true}>
      {normalize}
    </style>
  </>
);

App.getInitialProps = async ({ Component, ctx }: AppContext) => ({
  pageProps: {
    ...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {})
  }
});

export default withRedux(makeStore, {
  debug: process.env.NODE_ENV === "development"
})(App);
