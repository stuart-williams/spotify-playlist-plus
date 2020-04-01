import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../redux";
import { getPlaylistsCount, fetchPlaylists } from "./redux";

const mapState = (state: RootState) => ({
  count: getPlaylistsCount(state)
});

const mapDispatch = {
  getCount: () => fetchPlaylists()
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  count: number;
};

const Playlists = (props: Props) => (
  <>
    <h1>Playlists {props.count}</h1>
    <button onClick={props.getCount}>Click Me</button>
  </>
);

export default connector(Playlists);
