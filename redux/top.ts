import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import * as topApi from "../api/top";

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
  topApi.TopTracksParams,
  {
    rejectValue: SpotifyApi.ErrorObject;
  }
>("tracks/getTopTracks", async (params, thunkApi) => {
  try {
    const { data } = await topApi.getTopTracks("tracks", params);
    return data;
  } catch (error) {
    return thunkApi.rejectWithValue(
      error.response.data.error as SpotifyApi.ErrorObject
    );
  }
});

export const createTopTracksPlaylist = createAsyncThunk<
  SpotifyApi.PlaylistObjectFull,
  topApi.CreateTopTracksPlaylistOptions,
  {
    rejectValue: SpotifyApi.ErrorObject;
  }
>("tracks/createTopTracksPlaylist", async (options, thunkApi) => {
  try {
    const playlist = await topApi.createTopTracksPlaylist(options);
    return playlist;
  } catch (error) {
    return thunkApi.rejectWithValue(
      error.response.data.error as SpotifyApi.ErrorObject
    );
  }
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
