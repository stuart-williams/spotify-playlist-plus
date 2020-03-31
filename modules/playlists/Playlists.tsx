import React from "react";
import { connect } from "react-redux";
import { State } from "./redux";

interface Props {
  test: string;
}

const Playlists = (props: Props) => <h1>Playlists {props.test}</h1>;

const mapStateToProps = (state: State): Props => ({
  test: state.playlists
});

export default connect(mapStateToProps)(Playlists);
