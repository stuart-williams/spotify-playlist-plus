require("dotenv").config();

const withPlugins = require("next-compose-plugins");
const withSass = require("@zeit/next-sass");
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

module.exports = withPlugins([withSass], {
  env: {
    DOMAIN: "https://spotify-playlist-plus.now.sh",
    REPO_URL: "https://github.com/stuart-williams/spotify-playlist-plus",
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
    OPEN_SPOTIFY_URL: "https://open.spotify.com",
    ACCOUNTS_API_URL: `${ACCOUNTS_URL}/api`,
    GA_TRACKING_ID: "UA-163843172-1",
    GA_DEBUG: process.env.GA_DEBUG,
    REDUX_DEBUG: process.env.REDUX_DEBUG,
  },
});
