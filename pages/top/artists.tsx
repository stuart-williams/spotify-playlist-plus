import React from "react";
import { NextPageContext } from "next";
import { authCheck, commonUpstream } from "../../common/gip";
import { actions as topActions } from "../../redux/top";
import * as topApi from "../../api/top";
import Layout from "../../components/Layout";
import TopArtists from "../../components/TopArtists";

const Page = () => <Layout title="Top Artists" primaryPanel={<TopArtists />} />;

Page.getInitialProps = async (ctx: NextPageContext) => {
  authCheck(ctx);

  const [top] = await Promise.all([
    topApi.getTopArtistsTopTopTracks(
      {
        limit: 5,
        time_range: "long_term",
      },
      ctx
    ),
    commonUpstream(ctx),
  ]);

  ctx.store.dispatch(topActions.setTopArtists(top));

  return {};
};

export default Page;
