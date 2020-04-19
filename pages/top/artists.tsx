import React from "react";
import { NextPageContext } from "next";
import { authCheck } from "../../common/gip";
import Layout from "../../components/Layout";

const Page = () => <Layout title="Top Artists" primaryPanel={<div />} />;

Page.getInitialProps = async (ctx: NextPageContext) => {
  authCheck(ctx);

  return {};
};

export default Page;
