import React from "react";
import { Tab, Tabs } from "@blueprintjs/core";
import PlaylistsMenu from "../PlaylistsMenu";
import styles from "./styles";

const DummyPanel = () => <p>...</p>;

const Navigation = () => (
  <nav className="Navigation" role="navigation" aria-label="Main">
    <Tabs id="main-navigation" animate={false} renderActiveTabPanelOnly>
      <Tab id="playlists" title="PlayLists" panel={<PlaylistsMenu />} />
      <Tab id="artists" title="Artists" panel={<DummyPanel />} />
      <Tab id="albums" title="Albums" panel={<DummyPanel />} />
    </Tabs>
    <style jsx>{styles}</style>
  </nav>
);

export default Navigation;
