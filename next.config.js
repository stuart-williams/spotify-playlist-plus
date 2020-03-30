require("dotenv").config();

const { stringify } = require("querystring");

const ACCOUNTS_URL = "https://accounts.spotify.com";
const SCOPES = [
  "user-read-private",
  "user-read-email",
  "playlist-read-private",
  "playlist-read-collaborative"
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
      scope: SCOPES.join(" ")
    })}`,
    TOKEN_COOKIE: "spp_token",
    API_URL: "https://api.spotify.com/v1",
    ACCOUNTS_API_URL: `${ACCOUNTS_URL}/api/`
  }
};
