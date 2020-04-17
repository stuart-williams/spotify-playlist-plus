import React from "react";
import spotifyIcon from "simple-icons/icons/spotify";
import { NonIdealState, AnchorButton } from "@blueprintjs/core";
import Icon, { notesIcon } from "../Icon";

export default () => {
  const action = (
    <AnchorButton
      icon={<Icon path={spotifyIcon.path} />}
      href={process.env.AUTHORIZE_URL}
    >
      Connect with Spotify
    </AnchorButton>
  );

  return (
    <div className="Entry">
      <NonIdealState
        icon={<Icon {...notesIcon} width={60} height={60} />}
        title="Let's get started!"
        description="Connect with Spotify to see your playlists."
        action={action}
      />
    </div>
  );
};
