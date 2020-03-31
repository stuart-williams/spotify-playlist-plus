import { MakeStore } from "next-redux-wrapper";
import { createStore } from "redux";
import reducer, { State as PlaylistsState } from "../modules/playlists/redux";

export const makeStore: MakeStore = (initialState: PlaylistsState) =>
  createStore(reducer, initialState);
