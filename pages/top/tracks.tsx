import React from "react";
import { NextPageContext } from "next";
import { authCheck, commonUpstream } from "../../common/gip";
import { actions as topActions } from "../../redux/top";
import * as topApi from "../../api/top";
import Layout from "../../components/Layout";
import TopTracks from "../../components/TopTracks";

const Page = () => <Layout title="Top Tracks" primaryPanel={<TopTracks />} />;

Page.getInitialProps = async (ctx: NextPageContext) => {
  authCheck(ctx);

  const [top] = await Promise.all([
    topApi.getTop(
      "tracks",
      {
        limit: 50,
        time_range: "long_term",
      },
      ctx
    ),
    commonUpstream(ctx),
  ]);

  ctx.store.dispatch(topActions.setTopTracks(top.data));

  return {};
};

export default Page;
