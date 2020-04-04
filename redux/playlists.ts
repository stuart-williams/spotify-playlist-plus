import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from ".";
import * as playlistApi from "../api/playlists";

// State
export interface State {
  me: SpotifyApi.ListOfCurrentUsersPlaylistsResponse;
  focused: SpotifyApi.PlaylistObjectFull;
}

const initialState = {
  me: {},
  focused: {}
};

// Actions Creators
export const fetchMyPlaylists = createAsyncThunk(
  "playlists/fetchMyPlaylists",
  async () => {
    const { data } = await playlistApi.fetchMyPlaylists();
    return data;
  }
);

export const fetchPlaylistById = createAsyncThunk<
  SpotifyApi.PlaylistObjectFull,
  string
>("playlists/fetchPlaylistById", async id => {
  const { data } = await playlistApi.fetchPlaylistById(id);
  return data;
});

export const randomisePlaylist = createAsyncThunk<
  void,
  SpotifyApi.PlaylistObjectFull,
  {
    rejectValue: SpotifyApi.ErrorObject;
  }
>("playlists/randomisePlaylist", async (playlist, { rejectWithValue }) => {
  try {
    await playlistApi.randomisePlaylist(playlist);
  } catch (error) {
    return rejectWithValue(error.response.data.error as SpotifyApi.ErrorObject);
  }
});

// Reducer
const { reducer, actions } = createSlice({
  name: "playlists",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchMyPlaylists.fulfilled, (state, action) => {
      state.me = action.payload;
    });

    builder.addCase(fetchPlaylistById.fulfilled, (state, action) => {
      state.focused = action.payload;
    });
  }
});

export { actions };
export default reducer;

// Selectors
export const getPlaylists = (
  state: RootState
): SpotifyApi.PlaylistObjectSimplified[] => state.playlists.me?.items || [];

export const getFocusedPlaylist = (
  state: RootState
): SpotifyApi.PlaylistObjectFull => state.playlists.focused;
