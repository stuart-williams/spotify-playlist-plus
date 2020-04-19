import "../styles/main.scss";

import React from "react";
import Head from "next/head";
import { AppContext, AppProps } from "next/app";
import dynamic from "next/dynamic";
import { DefaultSeo } from "next-seo";
import { Provider } from "react-redux";
import withRedux, { ReduxWrapperAppProps } from "next-redux-wrapper";
import { makeStore } from "../redux";
import SEO from "../common/seo";
import { actions as userActions } from "../redux/user";
import * as userApi from "../api/user";

const GA = dynamic(() => import("../components/GA"), { ssr: false });

const App = ({
  Component,
  pageProps,
  store,
}: AppProps & ReduxWrapperAppProps) => (
  <>
    <Head>
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="preconnect" href="https://api.spotify.com" />
    </Head>
    <DefaultSeo {...SEO} />
    <GA />
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  </>
);

App.getInitialProps = async ({ Component, ctx }: AppContext) => {
  if (ctx.req) {
    const user = await userApi.getUser(ctx);
    ctx.store.dispatch(userActions.setUser(user.data));
  }

  return {
    pageProps: {
      ...(Component.getInitialProps
        ? await Component.getInitialProps(ctx)
        : {}),
    },
  };
};

export default withRedux(makeStore, {
  debug: process.env.REDUX_DEBUG === "true",
})(App);
