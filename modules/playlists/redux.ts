import { AnyAction } from "redux";

export interface State {
  playlists: string;
}

const reducer = (state: State, action: AnyAction): State => {
  return {
    playlists: "some playlists"
  };
};

export default reducer;
