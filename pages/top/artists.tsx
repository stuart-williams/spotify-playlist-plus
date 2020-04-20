import React from "react";
import { NextPageContext } from "next";
import { authCheck, commonUpstream } from "../../common/gip";
import { actions as topActions } from "../../redux/top";
import * as topApi from "../../api/top";
import Layout from "../../components/Layout";
import TopArtists from "../../components/TopArtists";
import Constants from "../../common/constants";

const Page = () => <Layout title="Top Artists" primaryPanel={<TopArtists />} />;

Page.getInitialProps = async (ctx: NextPageContext) => {
  authCheck(ctx);

  const [top] = await Promise.all([
    topApi.getTopArtistsTopTopTracks(Constants.DEFAULT_TOP_ARTISTS_PARAMS, ctx),
    commonUpstream(ctx),
  ]);

  ctx.store.dispatch(topActions.setTopArtists(top));

  return {};
};

export default Page;
