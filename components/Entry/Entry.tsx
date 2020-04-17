import React from "react";
import spotifyIcon from "simple-icons/icons/spotify";
import { NonIdealState, AnchorButton } from "@blueprintjs/core";
import SimpleIcon from "../SimpleIcon";

export default () => {
  const action = (
    <AnchorButton
      icon={<SimpleIcon path={spotifyIcon.path} />}
      href={process.env.AUTHORIZE_URL}
    >
      Connect with Spotify
    </AnchorButton>
  );

  return (
    <div className="Entry">
      <NonIdealState
        icon="user"
        title="Let's get started!"
        description="Connect with Spotify to see your playlists."
        action={action}
      />
    </div>
  );
};
