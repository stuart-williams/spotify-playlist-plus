import { NextPageContext } from "next";
import { parseCookies } from "nookies";
import redirect from "../common/redirect";
import Entry from "../components/Entry";

const Page = () => <Entry />;

Page.getInitialProps = async (ctx: NextPageContext) => {
  const { [process.env.TOKEN_COOKIE]: token } = parseCookies(ctx);

  if (token) {
    redirect("/top/tracks", ctx);
  }

  return {};
};

export default Page;
