import React from "react";
import classNames from "classnames";
import ms from "pretty-ms";
import { Classes } from "@blueprintjs/core";
import Constants from "../../common/constants";
import CoverArtImage from "../CoverArtImage";

interface Props {
  track: SpotifyApi.TrackObjectFull;
}

const Track = (props: Props) => {
  const { track } = props;
  const duration = ms(track.duration_ms, {
    colonNotation: true,
    secondsDecimalDigits: 0,
  });

  // const addedBy = isNaN(+added_by.id) && (
  //   <>
  //     <a
  //       href={added_by.external_urls.spotify}
  //       target="_blank"
  //       rel="noopener noreferrer"
  //     >
  //       {added_by.id}
  //     </a>
  //     {Constants.DIVIDER}
  //   </>
  // );

  const artists = track.artists.map(({ id, name, external_urls }, i, arr) => (
    <span key={id}>
      <a href={external_urls.spotify} target="_blank" rel="noopener noreferrer">
        {name}
      </a>
      {arr[i + 1] ? ", " : ""}
    </span>
  ));

  return (
    <div className={classNames("Track", Classes.RUNNING_TEXT)}>
      <CoverArtImage
        className="Track__cover-art-image"
        src={track.album.images?.[0]?.url}
        alt={track.name}
      />
      <div className="Track__body">
        <a
          className={Classes.TEXT_LARGE}
          href={track.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
        >
          {track.name}
        </a>
        <div className={classNames(Classes.TEXT_MUTED, Classes.TEXT_SMALL)}>
          {/* {addedBy} */}
          {artists}
          {Constants.DIVIDER}
          <a
            href={track.album.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
          >
            {track.album.name}
          </a>
        </div>
      </div>
      {duration}
    </div>
  );
};

export default Track;
