import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import { selectUser } from "./user";
import * as playlistsApi from "../api/playlists";
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
  topApi.TimeRange,
  {
    rejectValue: SpotifyApi.ErrorObject;
  }
>("tracks/getTopTracks", async (range, thunkApi) => {
  try {
    const { data } = await topApi.getTop("tracks", {
      limit: 50,
      time_range: range,
    });
    return data;
  } catch (error) {
    return thunkApi.rejectWithValue(
      error.response.data.error as SpotifyApi.ErrorObject
    );
  }
});

export const createTopTracksPlaylist = createAsyncThunk<
  SpotifyApi.PlaylistObjectFull,
  {
    name: string;
    tracks: SpotifyApi.TrackObjectFull[];
  },
  {
    rejectValue: SpotifyApi.ErrorObject;
  }
>("tracks/createTopTracksPlaylist", async ({ name, tracks }, thunkApi) => {
  try {
    const state = thunkApi.getState() as RootState;
    const user = selectUser(state);
    const { data: playlist } = await playlistsApi.createPlaylist(user.id, name);
    await playlistsApi.addTracksToPlaylist(playlist.id, tracks);

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
