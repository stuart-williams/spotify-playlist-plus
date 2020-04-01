import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../redux";
import { getTest } from "./redux";

const mapState = (state: RootState) => ({
  test: getTest(state)
});

const connector = connect(mapState);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  test: string;
};

const Playlists = (props: Props) => <h1>Playlists {props.test}</h1>;

export default connector(Playlists);
