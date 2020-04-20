import * as topApi from "../api/top";

export default {
  DIVIDER: " • ",
  TIME_RANGES: {
    long_term: "All time",
    medium_term: "The last 6 months",
    short_term: "The last month",
  },
  DEFAULT_TOP_TRACKS_PARAMS: {
    limit: 50,
    time_range: "long_term" as topApi.TimeRange,
  },
  DEFAULT_TOP_ARTISTS_PARAMS: {
    limit: 10,
    time_range: "long_term" as topApi.TimeRange,
  },
  GA_CATEGORY_USER: "User",
  GA_ACTION_CREATED_TOP_TRACKS_PLAYLIST: "Created top tracks playlist",
};
