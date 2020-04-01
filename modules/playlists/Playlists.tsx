import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../redux";
import { getCount, actions } from "./redux";

const mapState = (state: RootState) => ({
  n: getCount(state)
});

const mapDispatch = {
  inc: () => actions.increment(1)
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  n: number;
};

const Playlists = (props: Props) => (
  <>
    <h1>Playlists {props.n}</h1>
    <button onClick={props.inc}>Click Me</button>
  </>
);

export default connector(Playlists);
