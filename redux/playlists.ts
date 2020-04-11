import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import * as playlistApi from "../api/playlists";

// State
export interface State {
  list: SpotifyApi.ListOfCurrentUsersPlaylistsResponse;
  focused: SpotifyApi.PlaylistObjectFull;
  randomise: {
    state: "idle" | "pending";
  };
}

const initialState = {
  list: {},
  focused: {},
  randomise: {
    state: "idle",
  },
};

// Actions Creators
export const fetchPlaylistById = createAsyncThunk<
  SpotifyApi.PlaylistObjectFull,
  string
>("playlists/fetchPlaylistById", async (id) => {
  const { data } = await playlistApi.fetchById(id);
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
    await playlistApi.randomise(playlist);
  } catch (error) {
    return rejectWithValue(error.response.data.error as SpotifyApi.ErrorObject);
  }
});

// Reducer
const { reducer, actions } = createSlice({
  name: "playlists",
  initialState: initialState as State,
  reducers: {
    setListOfPlaylists: (
      state,
      action: PayloadAction<SpotifyApi.ListOfCurrentUsersPlaylistsResponse>
    ) => {
      state.list = action.payload;
    },
    setFocusedPlaylist: (
      state,
      action: PayloadAction<SpotifyApi.PlaylistObjectFull>
    ) => {
      state.focused = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Focussed
    builder.addCase(fetchPlaylistById.fulfilled, (state, action) => {
      state.focused = action.payload;
    });

    // Randomise
    builder.addCase(randomisePlaylist.pending, (state) => {
      state.randomise.state = "pending";
    });

    builder.addCase(randomisePlaylist.fulfilled, (state) => {
      state.randomise.state = "idle";
    });

    builder.addCase(randomisePlaylist.rejected, (state) => {
      state.randomise.state = "idle";
    });
  },
});

export { actions };
export default reducer;

// Selectors
export const getListOfPlaylists = (
  state: RootState
): SpotifyApi.PlaylistObjectSimplified[] => state.playlists.list?.items || [];

export const getFocusedPlaylist = (
  state: RootState
): SpotifyApi.PlaylistObjectFull => state.playlists.focused;

export const getRandomiseState = (state: RootState) =>
  state.playlists.randomise.state;
