import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import * as playlistApi from "../api/playlists";

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
export const getPlaylistById = createAsyncThunk(
  "playlists/getPlaylistById",
  async (id: string) => {
    const { data } = await playlistApi.getPlaylistById(id);
    return data;
  }
);

export const randomise = createAsyncThunk<
  void,
  SpotifyApi.PlaylistObjectFull,
  {
    rejectValue: SpotifyApi.ErrorObject;
  }
>("playlists/randomise", async (playlist, thunkApi) => {
  try {
    await playlistApi.randomise(playlist);
  } catch (error) {
    return thunkApi.rejectWithValue(
      error.response.data.error as SpotifyApi.ErrorObject
    );
  }
});

export const sortByAudioFeature = createAsyncThunk<
  void,
  playlistApi.SortByAudioFeatureOptions,
  {
    rejectValue: SpotifyApi.ErrorObject;
  }
>("playlists/sortByAudioFeature", async (options, thunkApi) => {
  try {
    await playlistApi.sortByAudioFeature(options);
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
export const getListOfPlaylists = (
  state: RootState
): SpotifyApi.PlaylistObjectSimplified[] => state.playlists.list?.items || [];

export const getPlaylist = (state: RootState): SpotifyApi.PlaylistObjectFull =>
  state.playlists.playlist;

export const getSortState = (state: RootState) => state.playlists.sortState;
