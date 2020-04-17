declare namespace NodeJS {
  export interface ProcessEnv {
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    REDIRECT_URI: string;
    AUTHORIZE_URL: string;
    TOKEN_COOKIE: string;
    API_URL: string;
    ACCOUNTS_API_URL: string;
    GA_TRACKING_ID: string;
    GA_DEBUG: string;
    REDUX_DEBUG: string;
  }
}
