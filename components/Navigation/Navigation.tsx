import React from "react";
import classNames from "classnames";
import Link from "next/link";
import PlaylistsMenu from "../PlaylistsMenu";
import { Classes } from "@blueprintjs/core";

const Navigation = () => (
  <nav className="Navigation" role="navigation" aria-label="Main">
    <Link href="/top/tracks">
      <a className={Classes.MENU_ITEM}>
        <span
          className={classNames(Classes.TEXT_OVERFLOW_ELLIPSIS, Classes.FILL)}
        >
          Top Tracks
        </span>
      </a>
    </Link>
    <PlaylistsMenu />
  </nav>
);

export default Navigation;
