import { NextPageContext } from "next";

export default (path: string, ctx?: Pick<NextPageContext, "res">) => {
  const res = ctx?.res;

  if (res) {
    res.writeHead(302, { Location: path });
    res.end();
  } else {
    window.location.assign(path);
  }
};
