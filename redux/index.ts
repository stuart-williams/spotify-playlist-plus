import { MakeStore } from "next-redux-wrapper";
import { combineReducers, createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import ReduxThunk from "redux-thunk";
import playlists, { State } from "./playlists";

export interface RootState {
  playlists: State;
}

const rootReducer = combineReducers({
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
