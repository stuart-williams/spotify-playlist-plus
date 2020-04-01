import { MakeStore } from "next-redux-wrapper";
import { combineReducers, createStore } from "redux";
import playlists, { State } from "../modules/playlists/redux";

export interface RootState {
  playlists: State;
}

const rootReducer = combineReducers({
  playlists
});

export const makeStore: MakeStore = (
  initialState: ReturnType<typeof rootReducer>
) => createStore(rootReducer, initialState);
