import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from ".";
import * as playlistApi from "../api/playlists";

// State
export interface State {
  list: {
    loading: "idle" | "pending";
    response: SpotifyApi.ListOfCurrentUsersPlaylistsResponse;
  };
  focused: {
    loading: "idle" | "pending";
    response: SpotifyApi.PlaylistObjectFull;
  };
  randomise: {
    loading: "idle" | "pending";
  };
}

const initialState = {
  list: {
    loading: "idle",
    response: {}
  },
  focused: {
    loading: "idle",
    response: {}
  },
  randomise: {
    loading: "idle"
  }
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
    // List
    builder.addCase(fetchMyPlaylists.pending, state => {
      state.list.loading = "pending";
    });

    builder.addCase(fetchMyPlaylists.fulfilled, (state, action) => {
      state.list.loading = "idle";
      state.list.response = action.payload;
    });

    builder.addCase(fetchMyPlaylists.rejected, state => {
      state.list.loading = "idle";
    });

    // Focussed
    builder.addCase(fetchPlaylistById.pending, state => {
      state.focused.loading = "pending";
    });

    builder.addCase(fetchPlaylistById.fulfilled, (state, action) => {
      state.focused.loading = "idle";
      state.focused.response = action.payload;
    });

    builder.addCase(fetchPlaylistById.rejected, state => {
      state.focused.loading = "idle";
    });

    // Randomise
    builder.addCase(randomisePlaylist.pending, state => {
      state.randomise.loading = "pending";
    });

    builder.addCase(randomisePlaylist.fulfilled, state => {
      state.randomise.loading = "idle";
    });

    builder.addCase(randomisePlaylist.rejected, state => {
      state.randomise.loading = "idle";
    });
  }
});

export { actions };
export default reducer;

// Selectors
export const getListOfPlaylists = (
  state: RootState
): SpotifyApi.PlaylistObjectSimplified[] =>
  state.playlists.list.response?.items || [];

export const getFocusedPlaylist = (
  state: RootState
): SpotifyApi.PlaylistObjectFull => state.playlists.focused.response;

export const getRandomiseLoading = (state: RootState) =>
  state.playlists.randomise.loading;
