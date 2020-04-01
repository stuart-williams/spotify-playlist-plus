import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../redux";
import fetch from "../../common/fetch";

type PlaylistsResponse = SpotifyApi.ListOfCurrentUsersPlaylistsResponse;

export interface State {
  response: PlaylistsResponse;
}

const initialState = {
  response: {}
};

export const fetchPlaylists = createAsyncThunk<PlaylistsResponse>(
  "me/playlists",
  async () => {
    const { data } = await fetch({ url: "me/playlists" });
    return data as PlaylistsResponse;
  }
);

const { reducer, actions } = createSlice({
  name: "playlists",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchPlaylists.fulfilled, (state, action) => {
      state.response = action.payload;
    });
  }
});

export const getPlaylistsCount = (state: RootState): number =>
  state.playlists.response?.items?.length || 0;

export { actions };
export default reducer;
