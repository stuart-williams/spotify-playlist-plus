import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";

// State
export type State = SpotifyApi.CurrentUsersProfileResponse;

// Reducer
const { reducer, actions } = createSlice({
  name: "user",
  initialState: {} as State,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<SpotifyApi.CurrentUsersProfileResponse>
    ) => action.payload,
  },
});

export { actions };
export default reducer;

// Selectors
export const selectUser = (
  state: RootState
): SpotifyApi.CurrentUsersProfileResponse => state.user;
