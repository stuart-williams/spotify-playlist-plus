import React from "react";
import classNames from "classnames";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../redux";
import { selectTopArtistsTracks } from "../../redux/top";
import Track from "../Track";
import { Classes } from "@blueprintjs/core";

const mapState = (state: RootState) => ({
  tracks: selectTopArtistsTracks(state),
});

const mapDispatch = {};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  tracks: SpotifyApi.TrackObjectFull[];
};

const TopArtists = ({ tracks }: Props) => {
  const renderTrack = (track: SpotifyApi.TrackObjectFull, i: number) => (
    <Track key={i} track={track} />
  );

  return (
    <div className="TopArtists">
      <ul className={classNames("TopArtists__tracks", Classes.LIST_UNSTYLED)}>
        {tracks.map(renderTrack)}
      </ul>
    </div>
  );
};

export default connector(TopArtists);
