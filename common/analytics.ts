import ReactGA from "react-ga";
import Constants from "../common/constants";

export const trackCreatedTopTracksPlaylist = (label: string) => {
  ReactGA.event({
    category: Constants.GA_CATEGORY_USER,
    action: Constants.GA_ACTION_CREATED_TOP_TRACKS_PLAYLIST,
    label,
  });
};
