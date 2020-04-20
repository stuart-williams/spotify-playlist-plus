import React from "react";
import classNames from "classnames";
import Link from "next/link";
import PlaylistsMenu from "../PlaylistsMenu";
import { MenuDivider, Classes } from "@blueprintjs/core";

const Navigation = () => (
  <nav className="Navigation" role="navigation" aria-label="Main">
    <MenuDivider title="MOST LOVED" />
    <Link href="/top/tracks">
      <a className={Classes.MENU_ITEM}>
        <span
          className={classNames(Classes.TEXT_OVERFLOW_ELLIPSIS, Classes.FILL)}
        >
          Top Tracks
        </span>
      </a>
    </Link>
    {/* <Link href="/top/artists">
      <a className={Classes.MENU_ITEM}>
        <span
          className={classNames(Classes.TEXT_OVERFLOW_ELLIPSIS, Classes.FILL)}
        >
          Top Artists
        </span>
      </a>
    </Link> */}
    <MenuDivider title="PLAYLISTS" />
    <PlaylistsMenu />
  </nav>
);

export default Navigation;
