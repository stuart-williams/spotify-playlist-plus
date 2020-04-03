import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from ".";
import fetch from "../common/fetch";
// import shuffle from "../common/shuffle";

// async function run() {
//   const { data } = await fetch({
//     method: "put",
//     url: "playlists/3p2WW9KLnLH61se8GDBoCk/tracks",
//     data: {
//       range_start: 0,
//       insert_before: 4,
//       snapshot_id: undefined
//     }
//   });

//   console.log(data);
// }

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
>("playlists/fetchPlaylistById", async id => {
  const { data } = await fetch({ url: `playlists/${id}` });
  return data as SpotifyApi.PlaylistObjectFull;
});

export const randomisePlaylist = createAsyncThunk<void, string>(
  "playlists/randomisePlaylist",
  async id => {
    console.log(id);
  }
);

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
