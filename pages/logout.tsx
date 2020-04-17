import { GetServerSideProps, NextPageContext } from "next";
import { destroyCookie } from "nookies";
import redirect from "../common/redirect";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  destroyCookie(ctx as NextPageContext, process.env.TOKEN_COOKIE);
  redirect("/", ctx);

  return {
    props: {},
  };
};

export default () => null;
