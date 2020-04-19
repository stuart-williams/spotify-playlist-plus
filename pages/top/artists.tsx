import React from "react";
import { NextPageContext } from "next";
import { authCheck, commonUpstream } from "../../common/gip";
import { actions as topActions } from "../../redux/top";
import * as topApi from "../../api/top";
import Layout from "../../components/Layout";

const Page = () => <Layout title="Top Artists" primaryPanel={<div />} />;

Page.getInitialProps = async (ctx: NextPageContext) => {
  authCheck(ctx);

  const [top] = await Promise.all([
    topApi.getTop(
      "artists",
      {
        limit: 5,
        time_range: "long_term",
      },
      ctx
    ),
    commonUpstream(ctx),
  ]);

  console.log(top);

  // ctx.store.dispatch(topActions.setTopTracks(top.data));

  return {};
};

export default Page;
