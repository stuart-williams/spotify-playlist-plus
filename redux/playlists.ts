import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from ".";
import fetch from "../common/fetch";
import { shufflePlaylist } from "../common/shuffle";

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
export const fetchMyPlaylists = createAsyncThunk<
  SpotifyApi.ListOfCurrentUsersPlaylistsResponse
>("playlists/fetchMyPlaylists", async () => {
  const { data } = await fetch<SpotifyApi.ListOfCurrentUsersPlaylistsResponse>({
    url: "me/playlists",
    params: {
      limit: 50
    }
  });

  return data;
});

export const fetchPlaylistById = createAsyncThunk<
  SpotifyApi.PlaylistObjectFull,
  string
>("playlists/fetchPlaylistById", async id => {
  const { data } = await fetch<SpotifyApi.PlaylistObjectFull>({
    url: `playlists/${id}`
  });

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
    await shufflePlaylist(playlist);
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
