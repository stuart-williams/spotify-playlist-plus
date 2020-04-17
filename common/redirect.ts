import { NextPageContext } from "next";
import Router from "next/router";

export default (path: string, ctx?: Pick<NextPageContext, "res">) => {
  const res = ctx?.res;

  if (res) {
    res.writeHead(302, { Location: path });
    res.end();
  } else {
    Router.push(path);
  }
};
