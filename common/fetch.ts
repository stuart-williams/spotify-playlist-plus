import axios, { AxiosRequestConfig } from "axios";
import { NextPageContext } from "next";
import { parseCookies, destroyCookie } from "nookies";
import { stringify } from "querystring";
import redirect from "./redirect";

const instance = axios.create({
  baseURL: process.env.API_URL
});

export default (config: AxiosRequestConfig, ctx?: NextPageContext) => {
  const { [process.env.TOKEN_COOKIE]: token } = parseCookies(ctx);
  instance.defaults.headers.common.Authorization = `Bearer ${token}`;

  return instance(config).catch(error => {
    switch (error.response.status) {
      case 401:
      case 403:
        destroyCookie(ctx, process.env.TOKEN_COOKIE);
        redirect("/login", ctx);
    }

    throw new Error(error);
  });
};

export const fetchToken = (code: string) =>
  axios({
    method: "post",
    url: "token",
    baseURL: process.env.ACCOUNTS_API_URL,
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
