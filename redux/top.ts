import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import * as tracksApi from "../api/tracks";

// State
export interface State {
  tracks: SpotifyApi.UsersTopTracksResponse;
}

const initialState = {
  tracks: {},
};

// Actions Creators
export const getTopTracks = createAsyncThunk<
  SpotifyApi.UsersTopTracksResponse,
  tracksApi.TimeRange
>("tracks/getTopTracks", async (timeRange) => {
  const { data } = await tracksApi.getTopTracks(timeRange);
  return data;
});

// Reducer
const { reducer, actions } = createSlice({
  name: "top",
  initialState,
  reducers: {
    setTopTracks: (
      state,
      action: PayloadAction<SpotifyApi.UsersTopTracksResponse>
    ) => {
      state.tracks = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTopTracks.fulfilled, (state, action) => {
      state.tracks = action.payload;
    });
  },
});

export { actions };
export default reducer;

// Selectors
export const selectTopTracks = (
  state: RootState
): SpotifyApi.UsersTopTracksResponse => state.top.tracks;
