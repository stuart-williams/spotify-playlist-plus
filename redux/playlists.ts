import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from ".";
import fetch from "../common/fetch";

type PlaylistsResponse = SpotifyApi.ListOfCurrentUsersPlaylistsResponse;
type PlaylistObject = SpotifyApi.PlaylistObjectSimplified;

export interface State {
  me: PlaylistsResponse;
}

const initialState = {
  me: {}
};

export const fetchPlaylists = createAsyncThunk<PlaylistsResponse>(
  "me/playlists",
  async () => {
    const { data } = await fetch({
      url: "me/playlists",
      params: {
        limit: 50
      }
    });

    return data as PlaylistsResponse;
  }
);

const { reducer, actions } = createSlice({
  name: "playlists",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchPlaylists.fulfilled, (state, action) => {
      state.me = action.payload;
    });
  }
});

export const getPlaylists = (state: RootState): PlaylistObject[] =>
  state.playlists.me?.items || [];

export { actions };
export default reducer;
