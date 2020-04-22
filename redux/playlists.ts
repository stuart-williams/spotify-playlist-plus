import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import { selectUser } from "./user";
import * as playlistsApi from "../api/playlists";

// State
export interface State {
  list: SpotifyApi.ListOfCurrentUsersPlaylistsResponse;
  playlist: SpotifyApi.PlaylistObjectFull;
  sortState: "idle" | "pending";
}

const initialState = {
  list: {},
  playlist: {},
  sortState: "idle",
};

// Actions Creators
export const getListOfPlaylists = createAsyncThunk<
  SpotifyApi.ListOfCurrentUsersPlaylistsResponse
>("playlists/getListOfPlaylists", async () => {
  const { data } = await playlistsApi.getListOfPlaylists();
  return data;
});

export const getPlaylistById = createAsyncThunk<
  SpotifyApi.PlaylistObjectFull,
  string,
  {
    rejectValue: SpotifyApi.ErrorObject;
  }
>("playlists/getPlaylistById", async (id, thunkApi) => {
  try {
    const { data } = await playlistsApi.getPlaylistById(id);
    return data;
  } catch (error) {
    return thunkApi.rejectWithValue(
      error.response.data.error as SpotifyApi.ErrorObject
    );
  }
});

export const randomise = createAsyncThunk<
  void,
  SpotifyApi.PlaylistObjectFull,
  {
    rejectValue: SpotifyApi.ErrorObject;
  }
>("playlists/randomise", async (playlist, thunkApi) => {
  try {
    await playlistsApi.randomise(playlist);
  } catch (error) {
    return thunkApi.rejectWithValue(
      error.response.data.error as SpotifyApi.ErrorObject
    );
  }
});

export const sortByAudioFeature = createAsyncThunk<
  void,
  playlistsApi.SortByAudioFeatureOptions,
  {
    rejectValue: SpotifyApi.ErrorObject;
  }
>("playlists/sortByAudioFeature", async (options, thunkApi) => {
  try {
    await playlistsApi.sortByAudioFeature(options);
  } catch (error) {
    return thunkApi.rejectWithValue(
      error.response.data.error as SpotifyApi.ErrorObject
    );
  }
});

export const renamePlaylist = createAsyncThunk<
  void,
  {
    id: string;
    name: string;
  },
  {
    rejectValue: SpotifyApi.ErrorObject;
  }
>("tracks/renamePlaylist", async ({ id, name }, thunkApi) => {
  try {
    await playlistsApi.rename(id, name);
  } catch (error) {
    return thunkApi.rejectWithValue(
      error.response.data.error as SpotifyApi.ErrorObject
    );
  }
});

export const createPlaylist = createAsyncThunk<
  SpotifyApi.PlaylistObjectFull,
  {
    name: string;
    tracks: SpotifyApi.TrackObjectFull[];
  },
  {
    rejectValue: SpotifyApi.ErrorObject;
  }
>("tracks/createPlaylist", async ({ name, tracks }, thunkApi) => {
  try {
    const state = thunkApi.getState() as RootState;
    const user = selectUser(state);
    const { data: playlist } = await playlistsApi.create(user.id, name);
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
  name: "playlists",
  initialState: initialState as State,
  reducers: {
    setListOfPlaylists: (
      state,
      action: PayloadAction<SpotifyApi.ListOfCurrentUsersPlaylistsResponse>
    ) => {
      state.list = action.payload;
    },
    setPlaylist: (
      state,
      action: PayloadAction<SpotifyApi.PlaylistObjectFull>
    ) => {
      state.playlist = action.payload;
    },
  },
  extraReducers: (builder) => {
    // List of Playlists
    builder.addCase(getListOfPlaylists.fulfilled, (state, action) => {
      state.list = action.payload;
    });

    // Focussed
    builder.addCase(getPlaylistById.fulfilled, (state, action) => {
      state.playlist = action.payload;
    });

    // Randomise
    builder.addCase(randomise.pending, (state) => {
      state.sortState = "pending";
    });

    builder.addCase(randomise.fulfilled, (state) => {
      state.sortState = "idle";
    });

    builder.addCase(randomise.rejected, (state) => {
      state.sortState = "idle";
    });

    // Sort by audio feature
    builder.addCase(sortByAudioFeature.pending, (state) => {
      state.sortState = "pending";
    });

    builder.addCase(sortByAudioFeature.fulfilled, (state) => {
      state.sortState = "idle";
    });

    builder.addCase(sortByAudioFeature.rejected, (state) => {
      state.sortState = "idle";
    });
  },
});

export { actions };
export default reducer;

// Selectors
export const selectListOfPlaylists = (
  state: RootState
): SpotifyApi.PlaylistObjectSimplified[] => state.playlists.list?.items || [];

export const selectPlaylist = (
  state: RootState
): SpotifyApi.PlaylistObjectFull => state.playlists.playlist;

export const selectSortState = (state: RootState) => state.playlists.sortState;
