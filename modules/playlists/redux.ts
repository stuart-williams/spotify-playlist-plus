import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../redux";
import fetch from "../../common/fetch";

type Playlists = SpotifyApi.ListOfCurrentUsersPlaylistsResponse;

export interface State {
  playlists: Playlists;
}

const initialState = {
  playlists: {}
};

export const fetchPlaylists = createAsyncThunk<Playlists>(
  "me/playlists",
  async () => {
    const { data } = await fetch({ url: "me/playlists" });
    return data as Playlists;
  }
);

const { reducer, actions } = createSlice({
  name: "playlists",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchPlaylists.fulfilled, (state, action) => {
      state.playlists = action.payload;
    });
  }
});

export const getPlaylistsCount = (state: RootState): number =>
  state.playlists.playlists?.items?.length || 0;

export { actions };
export default reducer;
