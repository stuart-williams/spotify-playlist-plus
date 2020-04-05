import { MakeStore } from "next-redux-wrapper";
import { combineReducers, createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import ReduxThunk from "redux-thunk";
import user, { State as UserState } from "./user";
import playlists, { State as PlaylistsState } from "./playlists";

export interface RootState {
  user: UserState;
  playlists: PlaylistsState;
}

const rootReducer = combineReducers({
  user,
  playlists
});

export const makeStore: MakeStore = (
  initialState: ReturnType<typeof rootReducer>
) => {
  const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(ReduxThunk))
  );

  return store;
};
