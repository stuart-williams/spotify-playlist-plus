import React, { ReactNode } from "react";
import { NextSeo } from "next-seo";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../redux";
import { selectUser } from "../../redux/user";
import {
  Alignment,
  Navbar,
  NavbarGroup,
  NavbarHeading,
  Button,
  Menu,
  MenuItem,
  Popover,
} from "@blueprintjs/core";
import Navigation from "../Navigation";
import SEO from "../../common/seo";

const mapState = (state: RootState) => ({
  user: selectUser(state),
});

const connector = connect(mapState);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  user: SpotifyApi.CurrentUsersProfileResponse;
  title?: string;
  primaryPanel: ReactNode;
};

const Layout = ({ user, title, primaryPanel }: Props) => {
  const accountMenu = (
    <Menu>
      <MenuItem text="Logout" icon="log-out" href="/logout" />
    </Menu>
  );

  const accountIcon = !!user.id && (
    <Popover content={accountMenu} autoFocus={false}>
      <Button icon="user" minimal={true} />
    </Popover>
  );

  return (
    <>
      <NextSeo title={title ? `${title} | ${SEO.title}` : undefined} />
      <div className="Layout">
        <Navbar>
          <NavbarGroup align={Alignment.LEFT}>
            <NavbarHeading>{SEO.title}</NavbarHeading>
          </NavbarGroup>
          <NavbarGroup align={Alignment.RIGHT}>{accountIcon}</NavbarGroup>
        </Navbar>
        <div className="Layout__body">
          <Navigation />
          <div className="Layout__primary-panel">{primaryPanel}</div>
        </div>
      </div>
    </>
  );
};

export default connector(Layout);
