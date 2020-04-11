import "../../styles/main.scss";
import "./Layout.scss";

import React, { ReactNode } from "react";
import { Alignment, Navbar, NavbarGroup } from "@blueprintjs/core";
import Navigation from "../Navigation";

interface Props {
  primaryPanel: ReactNode;
}

export default ({ primaryPanel }: Props) => (
  <div className="Layout">
    <Navbar>
      <NavbarGroup align={Alignment.RIGHT}>
        {/* <NavbarHeading>Playlist +</NavbarHeading>
        <NavbarDivider />
        <Button className={Classes.MINIMAL} icon="home" text="Home" />
        <Button className={Classes.MINIMAL} icon="document" text="Files" /> */}
      </NavbarGroup>
    </Navbar>
    <div className="Layout__body">
      <Navigation />
      <div className="Layout__primary-panel">{primaryPanel}</div>
    </div>
  </div>
);
