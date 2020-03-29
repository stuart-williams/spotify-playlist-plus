require("dotenv").config();

const { stringify } = require("querystring");

module.exports = {
  env: {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    REDIRECT_URI: process.env.REDIRECT_URI,
    AUTHORIZE_URL: `https://accounts.spotify.com/authorize?${stringify({
      client_id: process.env.CLIENT_ID,
      response_type: "code",
      redirect_uri: process.env.REDIRECT_URI,
      scope: "user-read-private user-read-email"
    })}`,
    TOKEN_URL: "https://accounts.spotify.com/api/token",
    TOKEN_COOKIE: "spp_token"
  }
};
