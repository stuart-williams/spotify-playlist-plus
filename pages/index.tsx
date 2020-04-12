import { NextPageContext } from "next";
import { parseCookies } from "nookies";
import redirect from "../common/redirect";
import * as playlistApi from "../api/playlists";

const Page = () => null;

Page.getInitialProps = async (ctx: NextPageContext) => {
  const { [process.env.TOKEN_COOKIE]: token } = parseCookies(ctx);

  if (!token) {
    redirect("/login", ctx);
  }

  const list = await playlistApi.getListOfPlaylists(ctx);
  redirect(`/playlist/${list.data.items[0].id}/`, ctx);

  return {};
};

export default Page;
