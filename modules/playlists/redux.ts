import { AnyAction } from "redux";
import { RootState } from "../../redux";

export interface State {
  test: string;
}

const initialState = {
  test: "Hello World"
};

const reducer = (state: State = initialState, action: AnyAction): State => {
  return state;
};

export default reducer;

export const getTest = (state: RootState) => state.playlists.test;
