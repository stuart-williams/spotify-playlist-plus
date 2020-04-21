import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import * as topApi from "../api/top";
import Constants from "../common/constants";

// State
export interface State {
  tracks: SpotifyApi.UsersTopTracksResponse;
  artists: topApi.TopArtistsTopTopTracksResponse;
}

const initialState = {
  tracks: {},
  artists: {},
};

// Actions Creators
export const getTopTracks = createAsyncThunk<
  SpotifyApi.UsersTopTracksResponse,
  topApi.TimeRange,
  {
    rejectValue: SpotifyApi.ErrorObject;
  }
>("tracks/getTopTracks", async (range, thunkApi) => {
  try {
    const { data } = await topApi.getTopTracks({
      ...Constants.DEFAULT_TOP_TRACKS_PARAMS,
      time_range: range,
    });
    return data;
  } catch (error) {
    return thunkApi.rejectWithValue(
      error.response.data.error as SpotifyApi.ErrorObject
    );
  }
});

export const getTopArtists = createAsyncThunk<
  topApi.TopArtistsTopTopTracksResponse,
  topApi.TimeRange,
  {
    rejectValue: SpotifyApi.ErrorObject;
  }
>("tracks/getTopArtists", async (range, thunkApi) => {
  try {
    const data = await topApi.getTopArtistsTopTopTracks({
      ...Constants.DEFAULT_TOP_ARTISTS_PARAMS,
      time_range: range,
    });
    return data;
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
    setTopArtists: (
      state,
      action: PayloadAction<topApi.TopArtistsTopTopTracksResponse>
    ) => {
      state.artists = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTopTracks.fulfilled, (state, action) => {
      state.tracks = action.payload;
    });

    builder.addCase(getTopArtists.fulfilled, (state, action) => {
      state.artists = action.payload;
    });
  },
});

export { actions };
export default reducer;

// Selectors
export const selectTopTracks = (
  state: RootState
): SpotifyApi.UsersTopTracksResponse => state.top.tracks;

export const selectTopTracksTimeRange = (state: RootState) =>
  (state.top.tracks.href.match(/time_range=(long_term|short_term)/)?.[1] ||
    "medium_term") as topApi.TimeRange;

export const selectTopArtistsTracks = (
  state: RootState
): SpotifyApi.TrackObjectFull[] => state.top.artists?.items;

export const selectTopArtistsTimeRange = (state: RootState) =>
  (state.top.artists.href.match(/time_range=(long_term|short_term)/)?.[1] ||
    "medium_term") as topApi.TimeRange;
