import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from ".";
import fetch from "../common/fetch";

export interface State {
  me: SpotifyApi.ListOfCurrentUsersPlaylistsResponse;
  focused: SpotifyApi.PlaylistObjectFull;
}

const initialState = {
  me: {},
  focused: {}
};

export const fetchMyPlaylists = createAsyncThunk<
  SpotifyApi.ListOfCurrentUsersPlaylistsResponse
>("me/playlists", async () => {
  const { data } = await fetch({
    url: "me/playlists",
    params: {
      limit: 50
    }
  });

  return data as SpotifyApi.ListOfCurrentUsersPlaylistsResponse;
});

export const fetchPlaylistById = createAsyncThunk<
  SpotifyApi.PlaylistObjectFull,
  string
>("playlists/{playlist_id}", async id => {
  const { data } = await fetch({ url: `playlists/${id}` });
  return data as SpotifyApi.PlaylistObjectFull;
});

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

export const getPlaylists = (
  state: RootState
): SpotifyApi.PlaylistObjectSimplified[] => state.playlists.me?.items || [];

export { actions };
export default reducer;
