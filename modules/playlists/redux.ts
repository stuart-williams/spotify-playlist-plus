import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../redux";

export interface State {
  n: number;
}

const initialState = {
  n: 1
};

const { reducer, actions } = createSlice({
  name: "playlists",
  initialState,
  reducers: {
    increment: (state: State, action: PayloadAction<number>) => ({
      ...state,
      n: state.n + action.payload
    })
  }
});

export const getCount = (state: RootState) => state.playlists.n;

export { actions };
export default reducer;
