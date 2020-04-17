require("dotenv").config();

const { stringify } = require("querystring");

const ACCOUNTS_URL = "https://accounts.spotify.com";
const SCOPES = [
  "user-read-private",
  "user-read-email",
  "user-top-read",
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-private",
  "playlist-modify-public",
];

module.exports = {
  env: {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    REDIRECT_URI: process.env.REDIRECT_URI,
    AUTHORIZE_URL: `${ACCOUNTS_URL}/authorize?${stringify({
      client_id: process.env.CLIENT_ID,
      response_type: "code",
      redirect_uri: process.env.REDIRECT_URI,
      scope: SCOPES.join(" "),
    })}`,
    TOKEN_COOKIE: "spp_token",
    API_URL: "https://api.spotify.com/v1",
    ACCOUNTS_API_URL: `${ACCOUNTS_URL}/api`,
    GA_TRACKING_ID: "UA-163843172-1",
    GA_DEBUG: process.env.GA_DEBUG,
    REDUX_DEBUG: process.env.REDUX_DEBUG,
  },
};
