import { NextPageContext } from "next";

export default (path: string, ctx?: Pick<NextPageContext, "res">) => {
  if (ctx) {
    ctx.res.writeHead(302, { Location: path });
    ctx.res.end();
  } else {
    window.location.assign(path);
  }
};
