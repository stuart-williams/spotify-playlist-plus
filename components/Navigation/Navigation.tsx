import "./Navigation.scss";

import React from "react";
import { Tab, Tabs } from "@blueprintjs/core";
import PlaylistsMenu from "../PlaylistsMenu";

const EmptyPanel = () => null;

const Navigation = () => (
  <nav className="Navigation" role="navigation" aria-label="Main">
    <Tabs id="main-navigation" animate={false} renderActiveTabPanelOnly={true}>
      <Tab id="playlists" title="PlayLists" panel={<PlaylistsMenu />} />
      <Tab id="artists" title="Artists" panel={<EmptyPanel />} />
      <Tab id="albums" title="Albums" panel={<EmptyPanel />} />
    </Tabs>
  </nav>
);

export default Navigation;
