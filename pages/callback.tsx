import React from "react";
import { GetServerSideProps } from "next";
import axios from "axios";
import { stringify } from "querystring";
import { setCookie } from "nookies";

export const getServerSideProps: GetServerSideProps = async ctx => {
  const { error, code } = ctx.query;

  try {
    if (error) {
      throw new Error(String(error));
    }

    const { status, statusText, data } = await axios({
      method: "post",
      url: process.env.TOKEN_URL,
      data: stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.REDIRECT_URI
      }),
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      },
      auth: {
        username: process.env.CLIENT_ID,
        password: process.env.CLIENT_SECRET
      }
    });

    if (status !== 200) {
      throw new Error(statusText);
    }

    setCookie(
      ctx,
      process.env.TOKEN_COOKIE,
      JSON.stringify({
        access_token: data.access_token,
        refresh_token: data.refresh_token
      }),
      {
        maxAge: data.expires_in
      }
    );

    ctx.res.writeHead(302, { Location: "/" });
    ctx.res.end();
    // tslint:disable-next-line: no-empty
  } catch (error) {
    // TODO: debug
  }

  return {
    props: {}
  };
};

export default () => (
  <>
    <h1>Oops</h1>
    <a href={process.env.AUTHORIZE_URL}>Login</a>
  </>
);
