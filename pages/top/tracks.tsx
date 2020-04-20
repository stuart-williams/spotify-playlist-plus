import React from "react";
import { NextPageContext } from "next";
import { authCheck, commonUpstream } from "../../common/gip";
import { actions as topActions } from "../../redux/top";
import * as topApi from "../../api/top";
import Layout from "../../components/Layout";
import TopTracks from "../../components/TopTracks";
import Constants from "../../common/constants";

const Page = () => <Layout title="Top Tracks" primaryPanel={<TopTracks />} />;

Page.getInitialProps = async (ctx: NextPageContext) => {
  authCheck(ctx);

  const [top] = await Promise.all([
    topApi.getTopTracks(Constants.DEFAULT_TOP_TRACKS_PARAMS, ctx),
    commonUpstream(ctx),
  ]);

  ctx.store.dispatch(topActions.setTopTracks(top.data));

  return {};
};

export default Page;
